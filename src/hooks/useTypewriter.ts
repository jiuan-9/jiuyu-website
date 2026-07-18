/**
 * useTypewriter — 打字机动画
 * 在多段文本间循环：打字 → 暂停 → 删除 → 下一段
 *
 * 流畅度保障：每次 setState 间隔通过 setTimeout 控制
 * 不会触发 60fps 重渲染（间隔 ≥ 50ms）
 */

import { useEffect, useRef, useState } from "react";

export type UseTypewriterOptions = {
  /** 要循环显示的文本数组 */
  texts: string[];
  /** 打字速度（ms/字符），默认 50 */
  typingSpeed?: number;
  /** 删除速度（ms/字符），默认 25 */
  deleteSpeed?: number;
  /** 完整文本显示后的停留时间（ms），默认 2500 */
  pauseDuration?: number;
  /** 是否启动（配合 useInView） */
  active?: boolean;
};

export function useTypewriter(options: UseTypewriterOptions): string {
  const {
    texts,
    typingSpeed = 50,
    deleteSpeed = 25,
    pauseDuration = 2500,
    active = true,
  } = options;

  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 清除所有定时器
  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!active || texts.length === 0) {
      clearAllTimers();
      setDisplayText("");
      return;
    }

    const currentText = texts[textIndex] ?? "";

    // 删除阶段
    if (isDeleting) {
      if (displayText === "") {
        // 删完，切换到下一段
        const nextIndex = (textIndex + 1) % texts.length;
        const t = setTimeout(() => {
          setTextIndex(nextIndex);
          setIsDeleting(false);
        }, 200);
        timersRef.current.push(t);
      } else {
        const t = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        }, deleteSpeed);
        timersRef.current.push(t);
      }
    } else {
      // 打字阶段
      if (displayText === currentText) {
        // 打完，停留后开始删除（如果是最后一段且不循环，可停下）
        const t = setTimeout(() => setIsDeleting(true), pauseDuration);
        timersRef.current.push(t);
      } else {
        const t = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typingSpeed);
        timersRef.current.push(t);
      }
    }

    return clearAllTimers;
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deleteSpeed, pauseDuration, active]);

  return displayText;
}

export default useTypewriter;
