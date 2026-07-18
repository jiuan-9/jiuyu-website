/**
 * useScrollProgress — 跟踪页面滚动进度（0 到 1）
 * 用于顶部进度条、滚动驱动动画
 *
 * 流畅度保障：
 *   - requestAnimationFrame 节流
 *   - 被动事件监听（passive: true）
 */

import { useEffect, useState } from "react";

export type ScrollProgress = {
  /** 全局滚动进度（0-1） */
  progress: number;
  /** 当前滚动 Y 坐标 */
  scrollY: number;
};

export function useScrollProgress(): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const scrollY = window.scrollY ?? 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(scrollY / max, 1) : 0;
      setState({ progress, scrollY });
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    // 初始化
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return state;
}

export default useScrollProgress;
