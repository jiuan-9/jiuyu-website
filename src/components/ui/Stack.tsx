/**
 * Stack — 弹性盒子堆叠（垂直或水平）
 * 替代散落的 flex className，统一节奏
 */

import { type ReactNode } from "react";

export type StackProps = {
  children: ReactNode;
  /** 方向：垂直 / 水平 / 响应式（移动端垂直，桌面端水平） */
  direction?: "vertical" | "horizontal" | "responsive";
  /** 子元素间距 */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  /** 主轴对齐 */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** 交叉轴对齐 */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** 是否换行（仅水平方向生效） */
  wrap?: boolean;
  className?: string;
  as?: "div" | "ul" | "ol" | "nav";
};

const directionMap = {
  vertical: "flex-col",
  horizontal: "flex-row",
  responsive: "flex-col sm:flex-row",
};

const gapMap: Record<NonNullable<StackProps["gap"]>, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export default function Stack({
  children,
  direction = "vertical",
  gap = 4,
  align = "stretch",
  justify = "start",
  wrap = false,
  className = "",
  as: Tag = "div",
}: StackProps) {
  return (
    <Tag
      className={`flex ${directionMap[direction]} ${gapMap[gap]} ${alignMap[align]} ${justifyMap[justify]} ${
        wrap ? "flex-wrap" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
