/**
 * Parallax — 视差层
 * 滚动时根据深度产生不同程度的位移，营造立体感
 *
 * 使用方式：
 *   <Parallax depth={0.3}>前景内容</Parallax>
 *   <Parallax depth={0.05}>远景背景</Parallax>
 *
 * 性能保障：
 *   - useScroll + useTransform（仅 transform）
 *   - rAF 自动节流（Framer Motion 内置）
 *   - 使用 spring 平滑插值，避免抖动
 *   - 移动端自动降级为 depth=0（无视差）
 */

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { parallaxDepth } from "@/lib/animation";

export type ParallaxProps = {
  children: ReactNode;
  /**
   * 视差深度（移动比例）：
   *   - 0.3 = 近层（移动 30%）
   *   - 0.15 = 中层
   *   - 0.05 = 远层
   * 也支持预设字符串："near" | "mid" | "far"
   */
  depth?: number | "near" | "mid" | "far";
  /** 偏移距离（px），默认 100 */
  offset?: number;
  /** 视差轴向，默认 y（垂直滚动时随垂直位置移动） */
  axis?: "x" | "y";
  /** 容器 className */
  className?: string;
};

export default function Parallax({
  children,
  depth = "mid",
  offset = 100,
  axis = "y",
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // 解析 depth
  const depthValue =
    typeof depth === "number"
      ? depth
      : depth === "near"
      ? parallaxDepth.near
      : depth === "far"
      ? parallaxDepth.far
      : parallaxDepth.mid;

  // useScroll 跟踪元素相对视口的位置
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 根据 scrollProgress 计算位移：0 → -offset, 0.5 → 0, 1 → +offset
  // 乘以 depth 控制视差强度
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [-offset * depthValue, offset * depthValue]
  );

  // 平滑插值，避免抖动
  const smooth = useSpring(transform, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });

  // Reduced motion / depth=0：无视差
  if (reduced || depthValue === 0) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        {
          [axis]: smooth,
          willChange: "transform",
        } as CSSProperties
      }
    >
      {children}
    </motion.div>
  );
}
