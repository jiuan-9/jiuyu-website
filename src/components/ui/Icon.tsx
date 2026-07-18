/**
 * Icon — 统一的图标容器
 * 包装 lucide-react 图标，提供统一尺寸与颜色 token
 */

import { memo } from "react";

export type IconProps = {
  /** lucide icon 组件 */
  icon: React.ComponentType<{ size?: number | string; className?: string; strokeWidth?: number }>;
  /** 尺寸（像素），默认 20 */
  size?: number | string;
  /** 颜色 token */
  color?: "primary" | "secondary" | "tertiary" | "muted" | "brand" | "purple" | "cyan" | "success" | "warning" | "danger";
  /** 线宽，默认 2 */
  strokeWidth?: number;
  className?: string;
};

const colorMap: Record<NonNullable<IconProps["color"]>, string> = {
  primary: "text-white",
  secondary: "text-dark-300",
  tertiary: "text-dark-400",
  muted: "text-dark-500",
  brand: "text-brand-400",
  purple: "text-purple-400",
  cyan: "text-cyan-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  danger: "text-red-400",
};

function IconInner({
  icon: LucideIcon,
  size = 20,
  color = "secondary",
  strokeWidth = 2,
  className = "",
}: IconProps) {
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={`${colorMap[color]} ${className}`}
      aria-hidden="true"
    />
  );
}

/** memo 防止父组件重渲染时图标跟着重渲染 */
export const Icon = memo(IconInner);
export default Icon;
