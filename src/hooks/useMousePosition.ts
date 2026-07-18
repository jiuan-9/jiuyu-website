/**
 * useMousePosition — 跟踪鼠标在元素内的位置
 * 用于 MagneticButton / SpotlightCard 等鼠标驱动效果
 *
 * 流畅度保障：
 *   - 通过 requestAnimationFrame 节流
 *   - 限制触发频率到 ~60fps
 *   - 使用 transform 而非 top/left（GPU 加速）
 */

import { useEffect, useRef, useState, type RefObject } from "react";

export type MousePosition = {
  /** 鼠标相对元素中心的 X 偏移（-1 到 1） */
  x: number;
  /** 鼠标相对元素中心的 Y 偏移（-1 到 1） */
  y: number;
  /** 鼠标是否在元素内 */
  isInside: boolean;
};

export function useMousePosition<T extends HTMLElement = HTMLDivElement>(
  options: { throttle?: boolean } = {}
): { ref: RefObject<T>; position: MousePosition } {
  const { throttle = true } = options;
  const ref = useRef<T>(null);
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    isInside: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;
    let pendingEvent: MouseEvent | null = null;

    const updatePosition = () => {
      rafId = null;
      if (!pendingEvent || !el) return;
      const rect = el.getBoundingClientRect();
      const x = ((pendingEvent.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((pendingEvent.clientY - rect.top) / rect.height) * 2 - 1;
      setPosition({ x, y, isInside: true });
      pendingEvent = null;
    };

    const handleMove = (e: MouseEvent) => {
      pendingEvent = e;
      if (throttle) {
        if (rafId === null) {
          rafId = requestAnimationFrame(updatePosition);
        }
      } else {
        updatePosition();
      }
    };

    const handleLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pendingEvent = null;
      setPosition({ x: 0, y: 0, isInside: false });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [throttle]);

  return { ref, position };
}

export default useMousePosition;
