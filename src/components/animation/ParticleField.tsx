/**
 * ParticleField — 粒子场（背景氛围）
 * 纯 Framer Motion div 实现，无需 Canvas，自动降级
 *
 * 性能保障：
 *   - 仅 transform/opacity 动画（GPU 加速）
 *   - 一次性生成粒子位置（useMemo）
 *   - 移动端自动减少粒子数量
 *   - 用户开启"减少动画"时显示静态星点
 *   - 父容器 CSS Containment 隔离重排
 */

import { motion } from "framer-motion";
import { useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getMotionTier } from "@/lib/animation";

export type ParticleFieldProps = {
  /** 粒子数量（移动端会自动减半） */
  count?: number;
  /** 粒子颜色，默认 brand 蓝 */
  color?: string;
  /** 粒子大小范围 [min, max] px */
  sizeRange?: [number, number];
  /** 是否启用紫色点缀（默认 10% 概率） */
  mixPurple?: boolean;
  /** 容器 className */
  className?: string;
  /** 是否覆盖整个父容器（默认 true） */
  fullscreen?: boolean;
};

type Particle = {
  id: number;
  x: number; // 百分比 0-100
  y: number; // 百分比 0-100
  size: number;
  duration: number;
  delay: number;
  isPurple: boolean;
};

export default function ParticleField({
  count = 60,
  color = "var(--particle-color-primary)",
  sizeRange = [1, 3],
  mixPurple = true,
  className = "",
  fullscreen = true,
}: ParticleFieldProps) {
  const reduced = useReducedMotion();
  const tier = getMotionTier();

  // 根据性能等级调整粒子数
  const adjustedCount = useMemo(() => {
    if (tier === "minimal") return Math.min(count, 8);
    if (tier === "reduced") return Math.floor(count / 2);
    return count;
  }, [count, tier]);

  // 一次性生成粒子位置
  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < adjustedCount; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 4,
        isPurple: mixPurple && Math.random() < 0.1,
      });
    }
    return arr;
  }, [adjustedCount, sizeRange, mixPurple]);

  const containerStyle: CSSProperties = {
    position: fullscreen ? "absolute" : "relative",
    inset: fullscreen ? 0 : "auto",
    pointerEvents: "none",
    overflow: "hidden",
    contain: "layout paint",
    willChange: "transform",
  };

  // Reduced motion：显示静态星点（不动画）
  if (reduced) {
    return (
      <div style={containerStyle} className={className} aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.isPurple
                ? "var(--color-accent-purple-500)"
                : color,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className} aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.isPurple ? "var(--color-accent-purple-500)" : color,
            boxShadow: `0 0 ${p.size * 2}px ${
              p.isPurple
                ? "var(--color-accent-purple-500)"
                : "var(--particle-color-primary)"
            }`,
            transform: "translateZ(0)",
          }}
          animate={{
            opacity: [0, 0.8, 0.4, 0.7, 0],
            scale: [0.5, 1, 0.7, 1, 0.5],
            y: [0, -20, -10, -30, 0],
            x: [0, 8, -6, 4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
