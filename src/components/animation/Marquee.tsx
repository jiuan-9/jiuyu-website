/**
 * Marquee — 无缝循环跑马灯
 * 适用于：特性展示条、合作伙伴 logo 滚动、技术栈展示
 *
 * 性能保障：
 *   - 仅 transform 动画（GPU 加速）
 *   - 鼠标悬停可暂停（不重新触发动画）
 *   - 内容复制一份实现无缝循环
 *   - Reduced motion 时显示静态内容
 */

import { motion } from "framer-motion";
import { type ReactNode, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type MarqueeProps = {
  children: ReactNode;
  /** 滚动方向，默认 left（向左滚动） */
  direction?: "left" | "right" | "up" | "down";
  /** 完整循环一次的时长（秒），默认 30 */
  duration?: number;
  /** 鼠标悬停是否暂停，默认 true */
  pauseOnHover?: boolean;
  /** 子项之间的间距 */
  gap?: string;
  /** 容器 className */
  className?: string;
  /** 内容 className */
  itemClassName?: string;
};

export default function Marquee({
  children,
  direction = "left",
  duration = 30,
  pauseOnHover = true,
  gap = "2rem",
  className = "",
  itemClassName = "",
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  // 计算动画属性
  const isHorizontal = direction === "left" || direction === "right";
  const reverse = direction === "right" || direction === "down";

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    gap,
    overflow: "hidden",
    position: "relative",
    width: isHorizontal ? "100%" : "auto",
    height: isHorizontal ? "auto" : "100%",
  };

  // Reduced motion：静态展示
  if (reduced) {
    return (
      <div style={containerStyle} className={className}>
        <div className={itemClassName}>{children}</div>
      </div>
    );
  }

  // 动画起点终点（复制一份实现无缝循环）
  const animAxis = isHorizontal ? "x" : "y";
  const from = reverse ? "-50%" : "0%";
  const to = reverse ? "0%" : "-50%";

  return (
    <div
      style={containerStyle}
      className={className}
      onMouseEnter={pauseOnHover ? () => setHovering(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovering(false) : undefined}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          gap,
          flexShrink: 0,
          willChange: "transform",
        }}
        animate={{ [animAxis]: hovering ? "0%" : [from, to] }}
        transition={
          hovering
            ? { duration: 0.4, ease: "easeOut" }
            : {
                duration,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
      >
        <div className={itemClassName} aria-hidden={false}>
          {children}
        </div>
        {/* 复制一份用于无缝循环 */}
        <div className={itemClassName} aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
