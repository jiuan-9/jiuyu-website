/**
 * useInView — 元素是否进入视口
 * 基于 IntersectionObserver，比 useScrollReveal 更通用
 *
 * 用途：
 *   - 触发滚动入场动画
 *   - 懒加载图片 / 组件
 *   - 触发 CountUp / Typewriter
 */

import { useEffect, useRef, useState, type RefObject } from "react";

export type UseInViewOptions = {
  /** 元素可见比例阈值（0-1） */
  threshold?: number | number[];
  /** 根元素，默认视口 */
  root?: Element | null;
  /** 根元素边距 */
  rootMargin?: string;
  /** 只触发一次（进入后停止观察） */
  once?: boolean;
  /** 默认是否可见（SSR 时为 true 避免 hydration mismatch） */
  initialInView?: boolean;
};

export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {}
): { ref: RefObject<T>; inView: boolean; wasInView: boolean } {
  const {
    threshold = 0.15,
    root = null,
    rootMargin = "0px",
    once = true,
    initialInView = false,
  } = options;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(initialInView);
  const [wasInView, setWasInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 降级：不支持 IntersectionObserver 时直接显示
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      setWasInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const isIntersecting = entry.isIntersecting;
          setInView(isIntersecting);
          if (isIntersecting) setWasInView(true);
          if (isIntersecting && once) {
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, once]);

  return { ref, inView, wasInView };
}

export default useInView;
