/**
 * useIsTouchDevice — 一次性检测当前设备是否为触摸设备
 *
 * 用于让鼠标驱动的动画组件（Tilt3D / SpotlightCard / MagneticButton）
 * 在触摸设备上跳过 motion value / spring 计算，直接渲染静态结构。
 *
 * 实现要点：
 *   - 仅在客户端执行（SSR 安全）
 *   - 用 matchMedia('(hover: none) and (pointer: coarse)') 判定
 *   - 不监听 resize（设备类型不会从触摸变成鼠标），节省一个 listener
 *   - 但允许在必要时手动刷新（用于模拟器切换）
 */

import { useEffect, useState } from "react";

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return (
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      "ontouchstart" in window
    );
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia("(hover: none) and (pointer: coarse)");
    const onChange = () => setIsTouch(mql.matches);
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari < 14 fallback
    if (mql.addListener) {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, []);

  return isTouch;
}

export default useIsTouchDevice;
