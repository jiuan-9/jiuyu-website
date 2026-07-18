/**
 * GradientText - 渐变流动文字
 * 文字背景为流动渐变，营造"活"的感觉
 *
 * 适用场景：
 *   - Hero 主标题
 *   - 关键 CTA 文字
 *   - 强调关键词
 *
 * 性能保障：
 *   - 仅 background-position 动画
 *   - background-clip: text + text-fill-color: transparent
 *   - Reduced motion 时显示静态渐变
 */

import { motion } from "framer-motion";
import { type ReactNode, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type GradientTextProps = {
  children: ReactNode;
  /** 渐变颜色组（CSS 颜色），默认品牌蓝 → 紫 → 青 */
  colors?: string[];
  /** 流动方向，默认 horizontal */
  direction?: "horizontal" | "vertical" | "diagonal";
  /** 流动周期（秒），默认 8 */
  duration?: number;
  /** 是否启用流动动画，默认 true */
  animated?: boolean;
  /** 字体 className */
  className?: string;
  /** 字重，默认 700 */
  weight?: number;
};

export default function GradientText({
  children,
  colors = [
    "var(--color-brand-300)",
    "var(--color-brand-500)",
    "var(--color-accent-purple-400)",
    "var(--color-accent-cyan-400)",
    "var(--color-brand-300)",
  ],
  direction = "horizontal",
  duration = 8,
  animated = true,
  className = "",
  weight = 700,
}: GradientTextProps) {
  const reduced = useReducedMotion();
  const shouldAnimate = animated && !reduced;

  // 渐变方向
  const gradientDirection =
    direction === "horizontal"
      ? "90deg"
      : direction === "vertical"
      ? "0deg"
      : "135deg";

  // 使用 200% 让渐变有空间流动
  const backgroundSize =
    direction === "horizontal"
      ? "200% 100%"
      : direction === "vertical"
      ? "100% 200%"
      : "200% 200%";

  const style: CSSProperties = {
    display: "inline-block",
    fontWeight: weight,
    background: `linear-gradient(${gradientDirection}, ${colors.join(", ")})`,
    backgroundSize,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    willChange: shouldAnimate ? "background-position" : "auto",
  };

  if (!shouldAnimate) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }

  // 流动方向决定 backgroundPosition 动画值
  const positionFrom =
    direction === "horizontal"
      ? "0% 50%"
      : direction === "vertical"
      ? "50% 0%"
      : "0% 0%";
  const positionTo =
    direction === "horizontal"
      ? "200% 50%"
      : direction === "vertical"
      ? "50% 200%"
      : "200% 200%";

  return (
    <motion.span
      className={className}
      style={style}
      animate={{
        backgroundPosition: [positionFrom, positionTo, positionFrom],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  );
}