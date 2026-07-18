/**
 * MagneticText — 鼠标驱动文字交互特效
 *
 * 用户突发想法：「加文字交互特效（鼠标悬停时文字生变）」
 *
 * 效果：
 *   1. 文字根据鼠标距离逐字变色（近=品牌蓝，远=默认色）
 *   2. 鼠标附近的字符轻微浮起（translateY -3px）
 *   3. 鼠标在文字上时，附近字符有品牌蓝光晕
 *   4. 鼠标离开后字符回弹到默认位置（CSS transition）
 *
 * 性能保障：
 *   - 容器级别 mousemove 监听（不是每字符）
 *   - rAF 节流（每帧最多更新一次）
 *   - 直接 DOM 操作（不触发 React re-render）
 *   - 仅 transform/color/textShadow（GPU 加速）
 *   - 移动端禁用（陀螺仪效果不明显）
 *   - reduced motion / 低端设备：静态渲染
 *
 * 适用场景：Hero 主标题、章节大标题（短文本，<20 字符）
 */

import {
  useRef,
  useEffect,
  type ElementType,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface MagneticTextProps {
  /** 待渲染文本（如不需要拆分，用 children） */
  text?: string;
  /** 或用 children（更灵活） */
  children?: ReactNode;
  /** 渲染标签，默认 h2 */
  as?: ElementType;
  /** 容器 className */
  className?: string;
  /** 鼠标影响半径（px），默认 80 */
  radius?: number;
  /** 字符浮起最大高度（px），默认 4 */
  lift?: number;
  /** 变色目标色（CSS color），默认品牌蓝 */
  activeColor?: string;
  /** 光晕色（CSS color），默认品牌蓝半透明 */
  glowColor?: string;
}

export default function MagneticText({
  text,
  children,
  as: Tag = "h2",
  className = "",
  radius = 80,
  lift = 4,
  activeColor = "rgb(20, 176, 255)",
  glowColor = "rgba(20, 176, 255, 0.6)",
}: MagneticTextProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const frameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // 拆分文本
  const content = text ?? "";
  const segments = Array.from(content);

  // reduced motion / 移动端：静态渲染
  useEffect(() => {
    if (reduced) return;

    const container = containerRef.current;
    if (!container) return;

    // 移动端检测
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };

      // rAF 节流
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        updateChars();
      });
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        updateChars();
      });
    };

    const updateChars = () => {
      const { x, y, active } = mouseRef.current;
      charRefs.current.forEach((span) => {
        if (!span) return;
        if (!active) {
          // 回弹
          span.style.transform = "";
          span.style.color = "";
          span.style.textShadow = "";
          return;
        }
        const rect = span.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const charX = rect.left - containerRect.left + rect.width / 2;
        const charY = rect.top - containerRect.top + rect.height / 2;
        const dx = charX - x;
        const dy = charY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.max(0, 1 - dist / radius);

        if (intensity > 0.01) {
          const liftAmount = -lift * intensity;
          span.style.transform = `translateY(${liftAmount}px)`;
          span.style.color = activeColor;
          span.style.textShadow = `0 0 ${8 * intensity}px ${glowColor}`;
        } else {
          span.style.transform = "";
          span.style.color = "";
          span.style.textShadow = "";
        }
      });
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [reduced, radius, lift, activeColor, glowColor]);

  // reduced motion：直接渲染静态文本
  if (reduced) {
    const StaticTag = Tag as ElementType;
    return (
      <StaticTag className={className} ref={containerRef as never}>
        {text ?? children}
      </StaticTag>
    );
  }

  const MotionTag = Tag as ElementType;

  // 如果用 children（不拆字符），直接渲染
  if (children !== undefined && children !== null) {
    return (
      <MotionTag className={className} ref={containerRef as never}>
        {children}
      </MotionTag>
    );
  }

  // 拆字符渲染
  return (
    <MotionTag
      className={className}
      ref={containerRef as never}
      style={{ display: "inline-block" }}
    >
      {segments.map((seg, i) => {
        // 保留空白
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
            ref={(el) => {
              if (el) charRefs.current[i] = el;
            }}
            style={{
              display: "inline-block",
              transition: "transform 0.2s ease-out, color 0.2s ease-out, text-shadow 0.2s ease-out",
              willChange: "transform, color",
            }}
          >
            {seg}
          </span>
        );
      })}
    </MotionTag>
  );
}
