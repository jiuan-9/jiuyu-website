/**
 * Grid — 响应式网格布局
 * 移动端默认 1 列，可指定 sm / md / lg 列数
 */

import { type ReactNode } from "react";

export type GridProps = {
  children: ReactNode;
  /** 移动端列数（默认 1） */
  cols?: 1 | 2 | 3 | 4;
  /** sm 断点列数 */
  colsSm?: 1 | 2 | 3 | 4;
  /** md 断点列数 */
  colsMd?: 1 | 2 | 3 | 4;
  /** lg 断点列数 */
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 间距 */
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
  as?: "div" | "ul" | "section";
};

const colMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const gapMap: Record<NonNullable<GridProps["gap"]>, string> = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
};

export default function Grid({
  children,
  cols = 1,
  colsSm,
  colsMd,
  colsLg,
  gap = 4,
  className = "",
  as: Tag = "div",
}: GridProps) {
  return (
    <Tag
      className={`grid ${colMap[cols]} ${colsSm ? `sm:${colMap[colsSm]}` : ""} ${
        colsMd ? `md:${colMap[colsMd]}` : ""
      } ${colsLg ? `lg:${colMap[colsLg]}` : ""} ${gapMap[gap]} ${className}`}
    >
      {children}
    </Tag>
  );
}
