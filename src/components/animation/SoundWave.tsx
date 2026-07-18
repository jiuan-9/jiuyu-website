/**
 * SoundWave — 声波可视化条
 * 装饰用音频波形效果（不真实播放音频，仅动画）
 *
 * 适用场景：
 *   - 录音功能指示
 *   - AI 思考中状态
 *   - 麦克风激活反馈
 *
 * 性能保障：
 *   - 仅 transform: scaleY（GPU 加速）
 *   - transformOrigin: bottom 避免布局变化
 *   - 每条 bar 错峰开始，避免同时动画
 *   - Reduced motion 时显示静态条
 */

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type SoundWaveProps = {
  /** bar 数量，默认 32 */
  barCount?: number;
  /** bar 宽度（px），默认 3 */
  barWidth?: number;
  /** bar 间距（px），默认 2 */
  barGap?: number;
  /** bar 最小高度（px），默认 4 */
  minHeight?: number;
  /** bar 最大高度（px），默认 32 */
  maxHeight?: number;
  /** bar 颜色，默认品牌蓝 */
  color?: string;
  /** 动画时长（秒），默认 1.2 */
  duration?: number;
  /** 是否播放，默认 true */
  playing?: boolean;
  /** 容器 className */
  className?: string;
};

export default function SoundWave({
  barCount = 32,
  barWidth = 3,
  barGap = 2,
  minHeight = 4,
  maxHeight = 32,
  color = "var(--color-brand-500)",
  duration = 1.2,
  playing = true,
  className = "",
}: SoundWaveProps) {
  const reduced = useReducedMotion();

  // 一次性生成每条 bar 的随机相位偏移
  const bars = useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => ({
        id: i,
        phase: (i % 8) * 0.08,
        // 每条 bar 的最大高度有 20% 抖动，避免全部一致
        scaleMax: 0.7 + Math.random() * 0.3,
      })),
    [barCount]
  );

  // Reduced motion：静态条
  if (reduced) {
    return (
      <div
        className={className}
        style={{ display: "flex", alignItems: "flex-end", gap: barGap }}
        aria-hidden="true"
      >
        {bars.map((bar) => (
          <span
            key={bar.id}
            style={{
              width: barWidth,
              height: minHeight,
              background: color,
              borderRadius: 1,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: barGap,
        height: maxHeight,
        contain: "layout paint",
      }}
      aria-hidden="true"
    >
      {bars.map((bar) => (
        <motion.span
          key={bar.id}
          style={{
            width: barWidth,
            height: maxHeight,
            background: color,
            borderRadius: 1,
            transformOrigin: "bottom",
            willChange: "transform",
          }}
          initial={{ scaleY: 0.2, opacity: 0.5 }}
          animate={
            playing
              ? {
                  scaleY: [
                    0.3 * bar.scaleMax,
                    bar.scaleMax,
                    0.5 * bar.scaleMax,
                    0.8 * bar.scaleMax,
                    0.3 * bar.scaleMax,
                  ],
                  opacity: [0.5, 1, 0.7, 0.9, 0.5],
                }
              : { scaleY: 0.3, opacity: 0.5 }
          }
          transition={{
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: bar.phase,
          }}
        />
      ))}
    </div>
  );
}
