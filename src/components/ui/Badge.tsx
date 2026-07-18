/**
 * Badge — 小型徽章/标签
 * 用于"已发布"、"NEW"、"免费"等状态标记
 */

import { type ReactNode } from "react";

export type BadgeProps = {
  children: ReactNode;
  /** 颜色主题 */
  variant?: "brand" | "purple" | "cyan" | "neutral" | "success" | "warning" | "danger";
  /** 大小 */
  size?: "sm" | "md";
  /** 是否带圆点指示器 */
  dot?: boolean;
  /** 圆点是否闪烁 */
  pulse?: boolean;
  className?: string;
};

const variantMap: Record<
  NonNullable<BadgeProps["variant"]>,
  { bg: string; text: string; border: string; dot: string }
> = {
  brand: {
    bg: "bg-brand-500/10",
    text: "text-brand-400",
    border: "border-brand-500/20",
    dot: "bg-brand-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    dot: "bg-purple-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  neutral: {
    bg: "bg-white/[0.04]",
    text: "text-dark-300",
    border: "border-white/[0.06]",
    dot: "bg-dark-400",
  },
  success: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  warning: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  danger: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
};

const sizeMap = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-3 py-1",
};

export default function Badge({
  children,
  variant = "brand",
  size = "md",
  dot = false,
  pulse = false,
  className = "",
}: BadgeProps) {
  const v = variantMap[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${v.bg} ${v.text} ${v.border} ${sizeMap[size]} font-semibold tracking-wider ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${v.dot} ${pulse ? "animate-pulse" : ""}`}
        />
      )}
      {children}
    </span>
  );
}
