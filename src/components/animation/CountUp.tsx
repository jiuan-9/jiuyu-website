/**
 * CountUp — 数字递增动画组件
 * 进入视口时从 0 递增到目标值
 */

import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type CountUpProps = {
  /** 目标值 */
  end: number;
  /** 起始值 */
  start?: number;
  /** 动画时长（秒） */
  duration?: number;
  /** 小数位数 */
  decimals?: number;
  /** 后缀（如 "+" / "%"） */
  suffix?: string;
  /** 前缀（如 "$"） */
  prefix?: string;
  /** 千分位分隔符 */
  separator?: string;
  /** 触发阈值 */
  threshold?: number;
  className?: string;
};

export default function CountUp({
  end,
  start = 0,
  duration = 2,
  decimals = 0,
  suffix = "",
  prefix = "",
  separator = "",
  threshold = 0.3,
  className = "",
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold, once: true });
  const reduced = useReducedMotion();

  const value = useCountUp({
    end,
    start,
    duration: reduced ? 0 : duration,
    decimals,
    active: inView,
  });

  // 格式化数字
  const formatted = separator
    ? value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
