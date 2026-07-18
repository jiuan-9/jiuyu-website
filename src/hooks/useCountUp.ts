/**
 * useCountUp — 数字递增动画
 * 基于 requestAnimationFrame，确保 60fps
 *
 * 用法：
 *   const display = useCountUp({ end: 100, duration: 2, start: inView })
 *   return <span>{display}</span>
 *
 * 与 CountUp 组件配合使用
 */

import { useEffect, useRef, useState } from "react";

export type UseCountUpOptions = {
  /** 目标值 */
  end: number;
  /** 起始值，默认 0 */
  start?: number;
  /** 动画时长（秒） */
  duration?: number;
  /** 小数位数，默认 0 */
  decimals?: number;
  /** 是否启动（通常配合 useInView） */
  active?: boolean;
  /** 缓动函数，默认 ease-out-cubic */
  ease?: (t: number) => number;
};

/** ease-out-cubic：开始快结束慢，符合自然感知 */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export function useCountUp(options: UseCountUpOptions): number {
  const {
    end,
    start = 0,
    duration = 2,
    decimals = 0,
    active = true,
    ease = easeOutCubic,
  } = options;

  const [value, setValue] = useState(start);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(start);
      return;
    }
    if (typeof requestAnimationFrame === "undefined") {
      setValue(end);
      return;
    }

    // 起止相同，无需动画
    if (start === end) {
      setValue(end);
      return;
    }

    startTimeRef.current = null;
    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = ease(progress);
      const current = start + (end - start) * eased;
      setValue(parseFloat(current.toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [end, start, duration, decimals, active, ease]);

  return value;
}

export default useCountUp;
