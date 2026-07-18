/**
 * Container — 页面级最大宽度容器
 * 居中、左右 padding 自适应
 */

import { type ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
  /** 最大宽度档位，默认 2xl（1440px） */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  /** 是否去除左右 padding（用于内嵌场景） */
  flush?: boolean;
  as?: keyof JSX.IntrinsicElements;
};

const widthMap: Record<NonNullable<ContainerProps["maxWidth"]>, string> = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1024px]",
  xl: "max-w-[1280px]",
  "2xl": "max-w-[1440px]",
  full: "max-w-full",
};

export default function Container({
  children,
  maxWidth = "2xl",
  className = "",
  flush = false,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${widthMap[maxWidth]} ${
        flush ? "" : "px-4 sm:px-6 lg:px-8"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
