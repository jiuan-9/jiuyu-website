/**
 * EnergyRing - 能量环（Quiddity 品牌标识）
 * 3 个同心圆 SVG，反向旋转 + 描边流动动画
 *
 * 设计意图：纯 SVG + CSS/Framer Motion，无需 Lottie / 设计师资源
 *
 * 适用场景：
 *   - Hero 区块的品牌标识
 *   - 加载状态指示
 *   - Quiddity Agent 区的装饰
 *
 * 性能保障：
 *   - 仅 transform: rotate（GPU 加速）
 *   - SVG 描边动画使用 stroke-dashoffset
 *   - 3 个圆错峰旋转，避免完全同步
 *   - Reduced motion 时静态显示
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { energyRing, energyRingStroke } from "@/lib/animation";

export type EnergyRingProps = {
  /** 整体尺寸（px），默认 120 */
  size?: number;
  /** 描边宽度（px），默认 2 */
  strokeWidth?: number;
  /** 主色，默认品牌蓝 */
  color?: string;
  /** 辅色（外圈），默认紫色 */
  accentColor?: string;
  /** 容器 className */
  className?: string;
  /** 是否启用描边流动动画，默认 true */
  flowStroke?: boolean;
};

type RingConfig = {
  radius: number;
  dashArray: string;
  duration: number;
  delay: number;
  color: string;
};

export default function EnergyRing({
  size = 120,
  strokeWidth = 2,
  color = "var(--color-brand-500)",
  accentColor = "var(--color-accent-purple-500)",
  className = "",
  flowStroke = true,
}: EnergyRingProps) {
  const reduced = useReducedMotion();
  const center = size / 2;

  // 3 个同心圆配置（半径递减）
  const rings: RingConfig[] = [
    {
      radius: center - strokeWidth,
      dashArray: `${(center - strokeWidth) * 0.6} ${(center - strokeWidth) * 0.4}`,
      duration: 20,
      delay: 0,
      color,
    },
    {
      radius: center - strokeWidth * 4,
      dashArray: `${(center - strokeWidth * 4) * 0.4} ${(center - strokeWidth * 4) * 0.6}`,
      duration: 25,
      delay: 0.5,
      color: accentColor,
    },
    {
      radius: center - strokeWidth * 8,
      dashArray: `${(center - strokeWidth * 8) * 0.5} ${(center - strokeWidth * 8) * 0.5}`,
      duration: 18,
      delay: 1,
      color,
    },
  ];

  // Reduced motion：静态显示
  if (reduced) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        aria-hidden="true"
      >
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeWidth={strokeWidth}
            strokeDasharray={ring.dashArray}
            opacity={0.6}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {rings.map((ring, i) => (
        <motion.g
          key={i}
          custom={i}
          variants={energyRing}
          initial="initial"
          animate="animate"
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          <motion.circle
            cx={center}
            cy={center}
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeWidth={strokeWidth}
            strokeDasharray={ring.dashArray}
            strokeLinecap="round"
            variants={flowStroke ? energyRingStroke : undefined}
            initial={flowStroke ? "initial" : false}
            animate={flowStroke ? "animate" : false}
            style={{
              filter: `drop-shadow(0 0 ${strokeWidth * 2}px ${ring.color})`,
            }}
          />
        </motion.g>
      ))}
      {/* 中心点 */}
      <motion.circle
        cx={center}
        cy={center}
        r={strokeWidth * 1.5}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />
    </svg>
  );
}