/**
 * useReducedMotion — 检测用户是否开启了"减少动画"
 *
 * 与 prefers-reduced-motion: reduce 媒体查询同步
 * 用户在系统设置中开启时返回 true，自动降级所有动画
 */

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    // 现代浏览器使用 addEventListener，Safari < 14 使用 addListener
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else if ((mq as MediaQueryList).addListener) {
      (mq as MediaQueryList).addListener(handler);
      return () => (mq as MediaQueryList).removeListener(handler);
    }
  }, []);

  return reduced;
}

export default useReducedMotion;
