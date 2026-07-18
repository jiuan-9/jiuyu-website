/**
 * Divider — 分隔线
 * 支持水平/垂直方向，可加文字标签
 */

import { type ReactNode } from "react";

export type DividerProps = {
  /** 方向 */
  orientation?: "horizontal" | "vertical";
  /** 是否带渐变效果 */
  variant?: "solid" | "gradient" | "dashed";
  /** 中间显示的文字/元素（仅水平方向有效） */
  children?: ReactNode;
  className?: string;
};

const variantMap = {
  solid: "bg-white/[0.06]",
  gradient: "bg-gradient-to-r from-transparent via-white/[0.10] to-transparent",
  dashed: "border-t border-dashed border-white/[0.10]",
};

export default function Divider({
  orientation = "horizontal",
  variant = "gradient",
  children,
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px h-full ${variantMap[variant]} ${className}`}
      />
    );
  }

  if (children) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center gap-4 ${className}`}
      >
        <div className={`flex-1 h-px ${variantMap[variant]}`} />
        <div className="text-xs text-[var(--color-text-tertiary)] tracking-wider">
          {children}
        </div>
        <div className={`flex-1 h-px ${variantMap[variant]}`} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`w-full h-px ${variantMap[variant]} ${className}`}
    />
  );
}
