/**
 * SpotlightCard — 聚光灯卡片
 * 鼠标移动时，卡片表面跟随出现一个柔和的高光圆点
 * 用于强调元素 / 营造高级感
 *
 * 性能保障：transform 驱动，不触发 layout/paint
 * 移动端优化：触摸设备上跳过 motion value / spring 计算，直接渲染静态结构
 */

import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export type SpotlightCardProps = {
  children: ReactNode;
  /** 高光颜色，默认品牌蓝 */
  color?: string;
  /** 高光半径（像素），默认 200 */
  radius?: number;
  /** 高光透明度，0-1 */
  intensity?: number;
  className?: string;
};

export default function SpotlightCard({
  children,
  color = "rgba(20, 176, 255, 0.15)",
  radius = 200,
  intensity = 1,
  className = "",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const mouseX = useMotionValue(-radius * 2);
  const mouseY = useMotionValue(-radius * 2);
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleLeave = () => {
    mouseX.set(-radius * 2);
    mouseY.set(-radius * 2);
  };

  // 触摸设备：鼠标高光无意义，跳过 motion 渲染
  if (isTouch) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ contain: "paint" }}
    >
      {/* 高光层：用 transform 移动一个固定大小的 radial-gradient 方块 */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          x,
          y,
          width: radius * 2,
          height: radius * 2,
          marginLeft: -radius,
          marginTop: -radius,
          opacity: intensity,
          backgroundImage: `radial-gradient(circle, ${color}, transparent 70%)`,
          willChange: "transform",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
