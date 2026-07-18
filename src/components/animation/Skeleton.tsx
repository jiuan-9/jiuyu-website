/**
 * Skeleton — 骨架屏
 * 数据加载时的占位，避免内容跳动
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type SkeletonProps = {
  /** 宽度 */
  width?: string | number;
  /** 高度 */
  height?: string | number;
  /** 是否为圆形 */
  circle?: boolean;
  className?: string;
};

export default function Skeleton({
  width = "100%",
  height = "1em",
  circle = false,
  className = "",
}: SkeletonProps) {
  const reduced = useReducedMotion();

  // 用户开启减少动画时，显示静态灰色块
  if (reduced) {
    return (
      <div
        className={`bg-white/[0.06] ${className}`}
        style={{
          width,
          height,
          borderRadius: circle ? "50%" : "var(--radius-md)",
        }}
      />
    );
  }

  return (
    <motion.div
      className={`bg-white/[0.06] ${className}`}
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : "var(--radius-md)",
      }}
      animate={{
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
  );
}

/**
 * 多行文本骨架
 */
export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}
