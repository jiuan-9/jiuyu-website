/**
 * Card — 通用卡片容器
 * 提供统一的圆角、边框、阴影、悬停效果
 */

import { type ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  /** 悬停效果 */
  hover?: "none" | "lift" | "glow" | "lift-glow";
  /** 内边距 */
  padding?: "none" | "sm" | "md" | "lg";
  /** 是否带边框 */
  bordered?: boolean;
  className?: string;
  as?: "div" | "article" | "li";
  onClick?: () => void;
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const hoverMap = {
  none: "",
  lift: "transition-transform duration-300 hover:-translate-y-1",
  glow: "transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(20,176,255,0.20)]",
  "lift-glow":
    "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(20,176,255,0.20)]",
};

export default function Card({
  children,
  hover = "none",
  padding = "md",
  bordered = true,
  className = "",
  as: Tag = "div",
  onClick,
}: CardProps) {
  return (
    <Tag
      onClick={onClick}
      className={`relative rounded-xl ${paddingMap[padding]} ${
        bordered ? "border border-white/[0.06]" : ""
      } bg-[var(--color-bg-elevated)] ${hoverMap[hover]} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
