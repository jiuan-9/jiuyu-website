/**
 * TextGlitch — 文字故障特效
 * 鼠标悬停时触发 RGB 通道偏移 + 抖动
 *
 * 适用场景：
 *   - 强调标题（如产品名 "Quiddity"）
 *   - 数字 / 版本号揭示
 *   - 重要公告标识
 *
 * 性能保障：
 *   - 仅 transform + textShadow 动画
 *   - 触发式动画（非循环，仅 hover/visible 时）
 *   - Reduced motion 时静态显示
 */

import { motion } from "framer-motion";
import { type ReactNode, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type TextGlitchProps = {
  children: ReactNode;
  /** 触发方式，默认 hover */
  trigger?: "hover" | "always" | "never";
  /** 故障强度（像素偏移），默认 2 */
  intensity?: number;
  /** 容器 className */
  className?: string;
  /** 文字颜色（基础色） */
  color?: string;
};

export default function TextGlitch({
  children,
  trigger = "hover",
  intensity = 2,
  className = "",
  color,
}: TextGlitchProps) {
  const reduced = useReducedMotion();

  // Reduced motion 或 trigger=never：静态展示
  if (reduced || trigger === "never") {
    return (
      <span className={className} style={{ color }}>
        {children}
      </span>
    );
  }

  const style: CSSProperties = {
    display: "inline-block",
    color,
    willChange: "transform, text-shadow",
  };

  // 始终触发：循环动画
  if (trigger === "always") {
    return (
      <motion.span
        className={className}
        style={style}
        animate={{
          x: [0, -intensity, intensity, -intensity / 2, intensity / 2, 0],
          textShadow: [
            "none",
            `${intensity}px 0 var(--color-brand-500), -${intensity}px 0 var(--color-accent-purple-500)`,
            `-${intensity}px 0 var(--color-brand-500), ${intensity}px 0 var(--color-accent-purple-500)`,
            `${intensity / 2}px 0 var(--color-brand-300), -${intensity / 2}px 0 var(--color-accent-cyan-400)`,
            "none",
          ],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2,
          times: [0, 0.05, 0.1, 0.15, 0.2],
        }}
      >
        {children}
      </motion.span>
    );
  }

  // hover 触发
  return (
    <motion.span
      className={className}
      style={style}
      initial="rest"
      whileHover="glitch"
      variants={{
        rest: {
          x: 0,
          textShadow: "none",
          transition: { duration: 0.3, ease: "easeOut" },
        },
        glitch: {
          x: [0, -intensity, intensity, -intensity / 2, intensity / 2, 0],
          textShadow: [
            "none",
            `${intensity}px 0 var(--color-brand-500), -${intensity}px 0 var(--color-accent-purple-500)`,
            `-${intensity}px 0 var(--color-brand-500), ${intensity}px 0 var(--color-accent-purple-500)`,
            `${intensity / 2}px 0 var(--color-brand-300), -${intensity / 2}px 0 var(--color-accent-cyan-400)`,
            "none",
          ],
          transition: {
            duration: 0.5,
            ease: "easeOut",
            times: [0, 0.2, 0.4, 0.6, 1],
          },
        },
      }}
    >
      {children}
    </motion.span>
  );
}
