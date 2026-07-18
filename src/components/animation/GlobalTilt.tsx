/**
 * GlobalTilt — 全局 3D 透视倾斜 Wrapper
 *
 * 阶段 B 核心：包裹主内容，根据鼠标位置做轻微 3D 倾斜
 *   - 倾斜角度很小（1-2 度），营造"整页玻璃面板"质感
 *   - 桌面：鼠标驱动（maxAngle 1.5 度，几乎不可见但能感知）
 *   - 移动端：陀螺仪驱动（maxAngle 2.5 度，更明显）
 *   - useSpring 让倾斜有惯性回弹
 *   - reduced motion / 低端设备：禁用，直接渲染 children
 *
 * 架构注意：
 *   - GlobalTilt 会创建 transform containing block，导致内部 position:fixed 失效
 *   - 因此 Navbar / BackToTop / Footer 等固定元素应放在 GlobalTilt 外部
 *   - 仅包裹 Hero → DownloadSection 之间的"内容流"
 */

import { type ReactNode, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { useFocus } from "@/lib/focus-context";

export interface GlobalTiltProps {
  children: ReactNode;
  /** 最大倾斜角度（度），桌面默认 1.5 */
  maxAngle?: number;
  /** 透视距离（px），默认 2000（越大越平，越小越夸张） */
  perspective?: number;
  /** 是否启用，默认 true */
  enabled?: boolean;
  /** className */
  className?: string;
}

export default function GlobalTilt({
  children,
  maxAngle = 1.5,
  perspective = 2000,
  enabled = true,
  className = "",
}: GlobalTiltProps) {
  const { nx, ny, isActive, isTouch, tier } = useFocus();

  // 移动端倾斜更明显
  const actualMaxAngle = isTouch ? maxAngle * 1.5 : maxAngle;

  // 用 spring 让倾斜有惯性
  const rotateX = useSpring(0, { damping: 25, stiffness: 150, mass: 1 });
  const rotateY = useSpring(0, { damping: 25, stiffness: 150, mass: 1 });

  useEffect(() => {
    if (!isActive) {
      rotateX.set(0);
      rotateY.set(0);
      return;
    }
    // rotateX: 鼠标在上方时向后倾，在下方时向前倾
    rotateX.set(-ny * actualMaxAngle);
    // rotateY: 鼠标在右方时向右倾
    rotateY.set(nx * actualMaxAngle);
  }, [nx, ny, isActive, actualMaxAngle, rotateX, rotateY]);

  // 禁用条件：用户禁用 / 低端设备 / reduced motion
  if (!enabled || tier === "low") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{
        perspective,
        perspectiveOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
