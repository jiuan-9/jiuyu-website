/**
 * Section — 语义化的页面分区
 * 提供统一的垂直 padding 节奏，与 Hero / Features 等业务组件配合
 */

import { type ReactNode } from "react";

export type SectionProps = {
  children: ReactNode;
  /** 垂直间距档位 */
  spacing?: "sm" | "md" | "lg" | "xl" | "none";
  /** HTML id（用于 hash 锚点跳转） */
  id?: string;
  className?: string;
  as?: "section" | "div" | "main" | "article" | "aside";
  /** 背景层（绝对定位的元素，需放在 Section 内部最前） */
  background?: ReactNode;
};

const spacingMap: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 md:py-20",
  lg: "py-16 sm:py-24 md:py-32",
  xl: "py-24 sm:py-32 md:py-40",
};

export default function Section({
  children,
  spacing = "lg",
  id,
  className = "",
  as: Tag = "section",
  background,
}: SectionProps) {
  return (
    <Tag id={id} className={`relative ${spacingMap[spacing]} ${className}`}>
      {background && <div className="absolute inset-0 -z-10">{background}</div>}
      {children}
    </Tag>
  );
}
