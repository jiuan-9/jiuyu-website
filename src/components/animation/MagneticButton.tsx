/**
 * MagneticButton — 磁吸按钮
 * 鼠标靠近时按钮被"吸引"产生微小位移
 * 用于强调元素（CTA / 主按钮）
 *
 * 性能保障：transform 驱动，rAF 节流
 * 移动端优化：触摸设备跳过磁吸效果，仅保留 whileTap 缩放反馈
 */

import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export type MagneticButtonProps = {
  children: ReactNode;
  /** 磁吸强度（像素），默认 20 */
  strength?: number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function MagneticButton({
  children,
  strength = 20,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isTouch = useIsTouchDevice();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // 弹性插值，让位移有"软"感
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // 归一化到 [-1, 1] 再乘以 strength
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 触摸设备：保留 whileTap 缩放反馈，但跳过磁吸 motion value 计算
  if (isTouch) {
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
