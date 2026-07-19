/**
 * AuroraBackground - 极光背景
 * 多个大型柔和光斑缓慢漂移，营造"极光"效果
 *
 * 适用场景：
 *   - Hero 区块的氛围背景
 *   - 大型 section 的装饰
 *   - 公告卡片的背景
 *
 * 性能保障：
 *   - 仅 transform/opacity 动画（GPU 加速）
 *   - filter: blur 提供柔和光晕（高斯模糊 GPU 加速）
 *   - position: absolute + pointer-events: none 不影响交互
 *   - 移动端减少光斑数量
 *   - Reduced motion 时显示静态光斑
 */

import { motion } from "framer-motion";
import { useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getMotionTier } from "@/lib/animation";

export type AuroraBackgroundProps = {
  /** 光斑数量，默认 3（移动端自动减为 2） */
  blobCount?: number;
  /** 光斑颜色组（循环使用） */
  colors?: string[];
  /** 光斑尺寸范围 [min, max] px */
  sizeRange?: [number, number];
  /** 模糊量（px），默认 80 */
  blur?: number;
  /** 透明度，默认 0.4 */
  opacity?: number;
  /** 漂移周期（秒），默认 20 */
  duration?: number;
  /** 容器 className */
  className?: string;
  /** 是否覆盖父容器（absolute inset:0），默认 true */
  fullscreen?: boolean;
};

type Blob = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
};

export default function AuroraBackground({
  blobCount = 3,
  colors = [
    "var(--color-brand-500)",
    "var(--color-accent-purple-500)",
    "var(--color-accent-cyan-500)",
  ],
  sizeRange = [300, 500],
  blur = 80,
  opacity = 0.4,
  duration = 20,
  className = "",
  fullscreen = true,
}: AuroraBackgroundProps) {
  const reduced = useReducedMotion();
  const tier = getMotionTier();

  // 移动端降级
  const actualBlobCount =
    tier === "minimal" ? 1 : tier === "reduced" ? Math.min(blobCount, 2) : blobCount;

  const blobs = useMemo<Blob[]>(() => {
    return Array.from({ length: actualBlobCount }, (_, i) => ({
      id: i,
      x: 20 + (i * 25) + Math.random() * 10,
      y: 20 + (i * 20) + Math.random() * 15,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      color: colors[i % colors.length],
      duration: duration + i * 4,
    }));
  }, [actualBlobCount, sizeRange, colors, duration]);

  const containerStyle: CSSProperties = {
    position: fullscreen ? "absolute" : "relative",
    inset: fullscreen ? 0 : "auto",
    pointerEvents: "none",
    overflow: "hidden",
    contain: "layout paint",
  };

  // Reduced motion：静态光斑
  if (reduced) {
    return (
      <div style={containerStyle} className={className} aria-hidden="true">
        {blobs.map((blob) => (
          <div
            key={blob.id}
            style={{
              position: "absolute",
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              width: blob.size,
              height: blob.size,
              borderRadius: "50%",
              background: blob.color,
              filter: `blur(${blur}px)`,
              opacity: opacity * 0.7,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className} aria-hidden="true">
      {blobs.map((blob, i) => (
        <motion.div
          key={blob.id}
          style={{
            position: "absolute",
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            background: blob.color,
            filter: `blur(${blur}px)`,
            opacity,
            willChange: "transform, opacity",
          }}
          custom={i}
          animate={{
            x: [
              `${-10 + i * 5}%`,
              `${10 - i * 5}%`,
              `${-5 + i * 3}%`,
              `${-10 + i * 5}%`,
            ],
            y: [
              `${-5 + i * 3}%`,
              `${5 - i * 3}%`,
              `${-3 + i * 2}%`,
              `${-5 + i * 3}%`,
            ],
            scale: [1, 1.1, 0.95, 1],
            opacity: [opacity * 0.7, opacity, opacity * 0.85, opacity * 0.7],
          }}
          transition={{
            duration: blob.duration,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}