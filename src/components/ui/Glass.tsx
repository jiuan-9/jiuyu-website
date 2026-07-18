/**
 * Glass — 毛玻璃面板
 * backdrop-blur + 半透明背景，用于悬浮元素
 *
 * 兼容性：在不支持 backdrop-filter 的浏览器降级为半透明背景
 */

import { type ReactNode } from "react";

export type GlassProps = {
  children: ReactNode;
  /** 模糊强度 */
  blur?: "sm" | "md" | "lg" | "xl";
  /** 背景透明度 */
  opacity?: "low" | "medium" | "high";
  /** 是否带边框光晕 */
  glow?: boolean;
  className?: string;
  as?: "div" | "section" | "aside";
};

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const opacityMap = {
  low: "bg-white/[0.02]",
  medium: "bg-white/[0.04]",
  high: "bg-white/[0.06]",
};

export default function Glass({
  children,
  blur = "md",
  opacity = "medium",
  glow = false,
  className = "",
  as: Tag = "div",
}: GlassProps) {
  return (
    <Tag
      className={`relative ${blurMap[blur]} ${opacityMap[opacity]} border border-white/[0.06] rounded-xl ${
        glow ? "shadow-[0_0_40px_rgba(20,176,255,0.15)]" : ""
      } ${className}`}
      style={{
        // 降级：不支持 backdrop-filter 时显示更不透明的背景
        backgroundColor: "var(--color-bg-overlay)",
      }}
    >
      {children}
    </Tag>
  );
}
