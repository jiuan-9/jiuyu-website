/**
 * CursorGlow — 全局背景光晕跟随
 *
 * 阶段 B 核心：背景光晕跟随鼠标位置
 *   - fixed 全屏 div，radial-gradient 跟随鼠标
 *   - 品牌蓝 + 紫色双光晕（与黑蓝主题一致）
 *   - 大小：600px 直径
 *   - opacity 较低（0.06-0.10），不抢戏
 *   - framer-motion useSpring 让光晕有惯性跟随
 *   - 移动端：跟随陀螺仪（更微弱）
 *   - reduced motion / 低端设备：禁用
 *
 * 视觉效果：鼠标移动时，背景有一个柔和的蓝紫光晕跟随，
 * 营造"舞台聚光灯"的厚重真实感。
 */

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useFocus } from "@/lib/focus-context";

export interface CursorGlowProps {
  /** 光晕大小（px），默认 600 */
  size?: number;
  /** 主光晕颜色（CSS color），默认品牌蓝 */
  color?: string;
  /** 次光晕颜色（CSS color），默认紫色 */
  secondaryColor?: string;
  /** 最大不透明度（0-1），默认 0.08 */
  maxOpacity?: number;
  /** z-index，默认 0（在内容下方） */
  zIndex?: number;
}

export default function CursorGlow({
  size = 600,
  color = "rgba(20, 176, 255, 0.08)",
  secondaryColor = "rgba(168, 85, 247, 0.06)",
  maxOpacity = 0.08,
  zIndex = 0,
}: CursorGlowProps) {
  const { mouseX, mouseY, isActive, isTouch, tier } = useFocus();

  // 用 useSpring 实现惯性跟随（鼠标停下后光晕继续滑动到位置）
  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const x = useMotionValue(mouseX);
  const y = useMotionValue(mouseY);
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // 鼠标移动时同步 motion value
  useEffect(() => {
    x.set(mouseX);
    y.set(mouseY);
  }, [mouseX, mouseY, x, y]);

  // 移动端：光晕更小更弱
  const actualSize = isTouch ? size * 0.6 : size;
  const actualHalf = actualSize / 2;
  const secondarySize = actualSize * 0.7;
  const secondaryHalf = secondarySize / 2;

  // 计算光晕位置（中心对齐鼠标）
  const mainX = useTransform(xSpring, (v) => `${v - actualHalf}px`);
  const mainY = useTransform(ySpring, (v) => `${v - actualHalf}px`);
  const secondaryX = useTransform(xSpring, (v) => `${v - secondaryHalf + 30}px`);
  const secondaryY = useTransform(ySpring, (v) => `${v - secondaryHalf - 20}px`);

  // 低端设备 / reduced motion / 未激活：不渲染
  if (!isActive || tier === "low") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex }}
    >
      {/* 主光晕：品牌蓝 */}
      <motion.div
        style={{
          position: "absolute",
          width: actualSize,
          height: actualSize,
          x: mainX,
          y: mainY,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          opacity: maxOpacity,
          willChange: "transform",
        }}
      />
      {/* 次光晕：紫色（偏移一点，营造双色叠加） */}
      <motion.div
        style={{
          position: "absolute",
          width: secondarySize,
          height: secondarySize,
          x: secondaryX,
          y: secondaryY,
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 60%)`,
          opacity: maxOpacity * 0.8,
          willChange: "transform",
        }}
      />
      {/* 已移除：鼠标处焦点白圈（用户反馈"有什么用吗"，纯视觉噪音） */}
    </div>
  );
}
