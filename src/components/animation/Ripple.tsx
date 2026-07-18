/**
 * Ripple — 涟漪点击反馈
 * 点击时从点击位置向外扩散一个圆形涟漪
 * 用于按钮 / 卡片等可点击元素
 */

import { useState, useCallback, type ReactNode } from "react";

type RippleItem = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export type RippleProps = {
  children: ReactNode;
  className?: string;
  /** 涟漪颜色，默认白色半透明 */
  color?: string;
  /** 涟漪持续时间（ms），默认 600 */
  duration?: number;
};

let rippleId = 0;

export default function Ripple({
  children,
  className = "",
  color = "rgba(255, 255, 255, 0.4)",
  duration = 600,
}: RippleProps) {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 0.6;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = rippleId++;
      setRipples((prev) => [...prev, { id, x, y, size }]);
      // 动画结束后移除
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, duration + 50);
    },
    [duration]
  );

  return (
    <div onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            borderRadius: "50%",
            backgroundColor: color,
            pointerEvents: "none",
            animation: `ripple-expand ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
          }}
        />
      ))}
      {children}
      <style>{`
        @keyframes ripple-expand {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
