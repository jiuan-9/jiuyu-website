/**
 * TextSplit — 文字逐字揭示
 * 把文本拆成字符，每个字符依次入场（带模糊 + 旋转 + 上浮）
 *
 * 适用场景：Hero 主标题、章节大标题
 *
 * 性能保障：
 *   - 仅 transform/opacity/filter 动画
 *   - 字符数有上限（移动端默认拆词，避免每字一个 DOM）
 *   - Reduced motion 时静态显示
 *   - 字符位置预计算（useMemo）
 */

import { motion } from "framer-motion";
import { useMemo, type ElementType } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { textSplit as textSplitVariants } from "@/lib/animation";

export type TextSplitProps = {
  /** 待揭示的文本 */
  text: string;
  /** 字符间延迟（秒），默认 0.025 */
  stagger?: number;
  /** 每个字符动画时长（秒），默认 0.5 */
  duration?: number;
  /** 渲染标签，默认 h2 */
  as?: ElementType;
  /** 容器 className */
  className?: string;
  /** 每个字符 className */
  charClassName?: string;
  /** 是否只触发一次，默认 true */
  once?: boolean;
  /**
   * 拆分方式：
   *   - "char"：按字符（CJK 适配，按 grapheme 拆）
   *   - "word"：按空格拆词（适合英文，性能更好）
   *   - "auto"：包含 CJK 时按字，否则按词（默认）
   */
  splitBy?: "char" | "word" | "auto";
};

// 检测是否包含 CJK 字符
const hasCJK = (text: string): boolean =>
  /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text);

export default function TextSplit({
  text,
  stagger = 0.025,
  duration = 0.5,
  as: Tag = "h2",
  className = "",
  charClassName = "",
  once = true,
  splitBy = "auto",
}: TextSplitProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3, once });
  const reduced = useReducedMotion();

  // 决定拆分方式
  const actualSplitBy: "char" | "word" =
    splitBy === "auto" ? (hasCJK(text) ? "char" : "word") : splitBy;

  // 拆分文本
  const segments = useMemo(() => {
    if (actualSplitBy === "word") {
      return text.split(/(\s+)/); // 保留空格
    }
    // 按 grapheme 拆（正确处理 emoji + 组合字符）
    return Array.from(text);
  }, [text, actualSplitBy]);

  // Reduced motion：直接静态展示
  if (reduced) {
    const StaticTag = Tag as ElementType;
    return (
      <StaticTag className={className} ref={ref}>
        {text}
      </StaticTag>
    );
  }

  const MotionTag = motion.create(Tag as ElementType);

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{ display: "inline-block" }}
    >
      {segments.map((seg, i) => {
        // 保留空白字符不动画
        if (/^\s+$/.test(seg)) {
          return (
            <span key={i} aria-hidden="true">
              {seg}
            </span>
          );
        }
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
            }}
            className={charClassName}
          >
            <motion.span
              custom={i}
              variants={textSplitVariants}
              style={{ display: "inline-block" }}
              transition={{ delay: i * stagger, duration }}
            >
              {seg}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
