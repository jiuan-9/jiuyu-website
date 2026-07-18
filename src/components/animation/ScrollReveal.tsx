/**
 * ScrollReveal — 滚动入场动画（重构版）
 * 基于 Framer Motion + useInView，替代旧版纯 CSS 实现
 *
 * 性能保障：
 *   - 一次性触发（once=true），触发后停止观察
 *   - 仅 transform/opacity 动画（GPU 加速）
 *   - 自动检测 prefers-reduced-motion
 */

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scrollReveal as defaultVariants, duration } from "@/lib/animation";

export type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  threshold?: number;
  delay?: number;
  once?: boolean;
  as?: "div" | "section" | "article" | "li" | "span";
};

export default function ScrollReveal({
  children,
  className = "",
  variants = defaultVariants,
  threshold = 0.15,
  delay = 0,
  once = true,
  as = "div",
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold, once });
  const reduced = useReducedMotion();

  // 降级：用户开启减少动画时，直接显示
  if (reduced) {
    const Tag = as as "div";
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        ...variants,
        visible: {
          ...(variants.visible as Record<string, unknown>),
          transition: {
            duration: duration.slower,
            ease: [0.165, 0.84, 0.44, 1],
            delay,
          },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
