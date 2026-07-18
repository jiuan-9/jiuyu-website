/**
 * Typewriter — 打字机组件
 * 在多段文本间循环：打字 → 暂停 → 删除 → 下一段
 * 配合光标闪烁动画
 */

import { useTypewriter } from "@/hooks/useTypewriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type TypewriterProps = {
  /** 要循环显示的文本数组 */
  texts: string[];
  /** 打字速度（ms），默认 50 */
  typingSpeed?: number;
  /** 删除速度（ms），默认 25 */
  deleteSpeed?: number;
  /** 完整显示后停留时间（ms），默认 2500 */
  pauseDuration?: number;
  /** 是否启动（配合 useInView） */
  active?: boolean;
  /** 自定义光标 */
  cursor?: string;
  className?: string;
};

export default function Typewriter({
  texts,
  typingSpeed = 50,
  deleteSpeed = 25,
  pauseDuration = 2500,
  active = true,
  cursor = "|",
  className = "",
}: TypewriterProps) {
  const reduced = useReducedMotion();
  // 用户开启减少动画时，直接显示第一段文本
  const text = useTypewriter({
    texts: reduced ? [texts[0] ?? ""] : texts,
    typingSpeed: reduced ? 0 : typingSpeed,
    deleteSpeed: reduced ? 0 : deleteSpeed,
    pauseDuration: reduced ? Infinity : pauseDuration,
    active,
  });

  return (
    <span className={className}>
      {text}
      <span
        className="inline-block ml-0.5"
        style={{
          animation: reduced ? "none" : "typewriter-cursor 1s step-end infinite",
        }}
      >
        {cursor}
      </span>
      <style>{`
        @keyframes typewriter-cursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
