/**
 * focus-context — 全局焦点跟踪 Context
 *
 * 这是阶段 B（全局焦点跟踪系统）的核心：
 *   - 桌面端：跟踪 window mousemove，归一化到 [-1, 1]
 *   - 移动端：用 deviceorientation（陀螺仪）替代，gamma/beta 转 normalized
 *   - 自动降级：prefers-reduced-motion / 触摸设备 / 低端设备
 *   - 性能：rAF 节流（每帧最多更新一次），transform/opacity only
 *
 * 使用方式：
 *   <FocusProvider>
 *     <App />
 *   </FocusProvider>
 *
 *   const { nx, ny, mouseX, mouseY, velocity, isTouch, isActive } = useFocus();
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  useMemo,
} from "react";
import { rafThrottle } from "@/lib/perf";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface FocusState {
  /** 鼠标 X 坐标（px，相对 viewport 左上角） */
  mouseX: number;
  /** 鼠标 Y 坐标（px） */
  mouseY: number;
  /** 归一化 X：-1（左）到 1（右），中心 0 */
  nx: number;
  /** 归一化 Y：-1（上）到 1（下），中心 0 */
  ny: number;
  /** 鼠标移动速度（px/帧，0-1 归一化） */
  velocity: number;
  /** 是否触摸设备（移动端用陀螺仪替代） */
  isTouch: boolean;
  /** 焦点跟踪是否激活（桌面鼠标 / 移动端陀螺仪可用时为 true） */
  isActive: boolean;
  /** 设备性能分级（决定后续动画强度） */
  tier: "high" | "medium" | "low";
}

const defaultState: FocusState = {
  mouseX: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
  mouseY: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  nx: 0,
  ny: 0,
  velocity: 0,
  isTouch: false,
  isActive: false,
  tier: "high",
};

const FocusContext = createContext<FocusState>(defaultState);

export function useFocus(): FocusState {
  return useContext(FocusContext);
}

interface FocusProviderProps {
  children: ReactNode;
}

/**
 * 检测触摸设备
 * 触摸设备不监听 mousemove（避免触屏 + 鼠标同时触发的抖动）
 */
function detectTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * 检测设备性能分级（简化版，避免重复实现 perf.ts 的逻辑）
 */
function detectTier(reducedMotion: boolean): "high" | "medium" | "low" {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "high";
  if (reducedMotion) return "low";
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = window.matchMedia?.("(max-width: 768px)").matches ?? false;
  if (cores < 4 || isMobile) return "medium";
  return "high";
}

export function FocusProvider({ children }: FocusProviderProps) {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<FocusState>(defaultState);

  // 用 ref 存上一帧位置，计算 velocity
  const lastPosRef = useRef<{ x: number; y: number; t: number }>({
    x: defaultState.mouseX,
    y: defaultState.mouseY,
    t: 0,
  });

  useEffect(() => {
    if (reducedMotion) {
      setState((s) => ({ ...s, isActive: false, tier: "low" }));
      return;
    }

    const isTouch = detectTouchDevice();
    const tier = detectTier(reducedMotion);

    // 触摸设备：尝试用陀螺仪
    if (isTouch) {
      setState((s) => ({ ...s, isTouch: true, tier }));

      // 检查是否支持 deviceorientation
      if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
        return;
      }

      // iOS 13+ 需要请求权限
      const requestPermission = (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<"granted" | "denied">;
        }
      ).requestPermission;
      if (typeof requestPermission === "function") {
        // iOS：等待用户首次交互后才能请求权限
        const requestOnInteraction = async () => {
          try {
            const result = await requestPermission();
            if (result === "granted") {
              attachDeviceOrientation();
            }
          } catch {
            // 用户拒绝：静默降级（不激活焦点跟踪）
          }
          window.removeEventListener("touchstart", requestOnInteraction);
          window.removeEventListener("click", requestOnInteraction);
        };
        window.addEventListener("touchstart", requestOnInteraction, { once: true });
        window.addEventListener("click", requestOnInteraction, { once: true });
        return () => {
          window.removeEventListener("touchstart", requestOnInteraction);
          window.removeEventListener("click", requestOnInteraction);
          window.removeEventListener("deviceorientation", handleOrientation);
        };
      }

      // 非 iOS：直接监听
      attachDeviceOrientation();
      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }

    // 桌面：mousemove + rAF 节流
    const updateMouse = rafThrottle((e: MouseEvent) => {
      const now = performance.now();
      const last = lastPosRef.current;
      const dt = Math.max(1, now - last.t);
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      // velocity 归一化到 0-1（500px/ms 视为最大）
      const velocity = Math.min(1, speed / 0.5);

      lastPosRef.current = { x: e.clientX, y: e.clientY, t: now };

      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;

      setState({
        mouseX: e.clientX,
        mouseY: e.clientY,
        nx,
        ny,
        velocity,
        isTouch: false,
        isActive: true,
        tier,
      });
    });

    window.addEventListener("mousemove", updateMouse, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMouse);
    };

    function attachDeviceOrientation() {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    function handleOrientation(e: DeviceOrientationEvent) {
      // gamma: 左右倾斜 (-90 到 90)
      // beta: 前后倾斜 (-180 到 180)
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      // 归一化到 -1 到 1（gamma ±30 度视为边界，beta ±30 度视为边界）
      const nx = Math.max(-1, Math.min(1, gamma / 30));
      const ny = Math.max(-1, Math.min(1, (beta - 45) / 30)); // 假设手机平持时 beta≈45

      const now = performance.now();
      const last = lastPosRef.current;
      const dt = Math.max(1, now - last.t);
      const dx = (gamma - last.x) / 30;
      const dy = (beta - last.y) / 30;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      const velocity = Math.min(1, speed / 0.5);

      lastPosRef.current = { x: gamma, y: beta, t: now };

      // 触摸设备没有 mouseX/Y，用归一化值反推
      const mouseX = ((nx + 1) / 2) * window.innerWidth;
      const mouseY = ((ny + 1) / 2) * window.innerHeight;

      setState({
        mouseX,
        mouseY,
        nx,
        ny,
        velocity,
        isTouch: true,
        isActive: true,
        tier,
      });
    }
  }, [reducedMotion]);

  const value = useMemo(() => state, [state]);

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

/**
 * 工具函数：根据归一化鼠标位置计算 3D 旋转角度
 * @param nx 归一化 X (-1 到 1)
 * @param ny 归一化 Y (-1 到 1)
 * @param maxAngle 最大旋转角度（度，默认 8）
 * @returns { rotateX, rotateY }
 */
export function calculateTilt(
  nx: number,
  ny: number,
  maxAngle: number = 8,
): { rotateX: number; rotateY: number } {
  return {
    rotateX: -ny * maxAngle,
    rotateY: nx * maxAngle,
  };
}

/**
 * 工具函数：根据归一化鼠标位置计算 translate 偏移
 * 用于视差效果
 * @param nx 归一化 X
 * @param ny 归一化 Y
 * @param maxOffset 最大偏移（px）
 */
export function calculateParallax(
  nx: number,
  ny: number,
  maxOffset: number = 20,
): { x: number; y: number } {
  return {
    x: nx * maxOffset,
    y: ny * maxOffset,
  };
}
