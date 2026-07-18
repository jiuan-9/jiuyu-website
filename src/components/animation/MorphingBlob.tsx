/**
 * MorphingBlob — 形变 Blob
 * 有机形状的缓慢形变动画，用于背景装饰、Hero 区块氛围
 *
 * 适用场景：
 *   - Hero 区块的背景光斑
 *   - 公告卡片的氛围装饰
 *   - Quiddity Agent 区的紫色 blob
 *
 * 性能保障：
 *   - 仅 borderRadius + transform 动画（GPU 加速）
 *   - position: absolute + 负 z-index 不影响布局
 *   - filter: blur 提供柔和光晕
 *   - Reduced motion 时静态显示
 */

import { motion } from "framer-motion";
import { type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type MorphingBlobProps = {
  /** blob 尺寸（px），默认 400 */
  size?: number;
  /** blob 颜色，默认品牌蓝 */
  color?: string;
  /** 模糊量（px），默认 60 */
  blur?: number;
  /** 透明度，默认 0.3 */
  opacity?: number;
  /** 形变周期（秒），默认 12 */
  duration?: number;
  /** 容器 className */
  className?: string;
  /** 内联 style 覆盖 */
  style?: CSSProperties;
};

export default function MorphingBlob({
  size = 400,
  color = "var(--color-brand-500)",
  blur = 60,
  opacity = 0.3,
  duration = 12,
  className = "",
  style,
}: MorphingBlobProps) {
  const reduced = useReducedMotion();

  const baseStyle: CSSProperties = {
    width: size,
    height: size,
    background: color,
    filter: `blur(${blur}px)`,
    opacity,
    pointerEvents: "none",
    willChange: "transform, border-radius",
    ...style,
  };

  if (reduced) {
    return (
      <div
        className={className}
        style={{
          ...baseStyle,
          borderRadius: "42% 58% 70% 30% / 45% 45% 55% 55%",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      className={className}
      style={baseStyle}
      aria-hidden="true"
      animate={{
        borderRadius: [
          "42% 58% 70% 30% / 45% 45% 55% 55%",
          "70% 30% 46% 54% / 30% 60% 40% 70%",
          "30% 70% 70% 30% / 60% 30% 70% 40%",
          "42% 58% 70% 30% / 45% 45% 55% 55%",
        ],
        rotate: [0, 120, 240, 360],
        scale: [1, 1.05, 0.95, 1],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        times: [0, 0.33, 0.66, 1],
      }}
    />
  );
}
