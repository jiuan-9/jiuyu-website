/**
 * Button — 通用按钮
 * 提供变体、尺寸、加载状态、图标支持
 * 替代散落在 Hero / Navbar / Footer 中的内联按钮样式
 */

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 视觉变体 */
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  /** 尺寸 */
  size?: "sm" | "md" | "lg";
  /** 是否撑满父容器宽度 */
  block?: boolean;
  /** 是否带加载状态 */
  loading?: boolean;
  /** 左侧图标 */
  iconLeft?: ReactNode;
  /** 右侧图标 */
  iconRight?: ReactNode;
  /** 子元素 */
  children?: ReactNode;
};

const variantMap: Record<
  NonNullable<ButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500 shadow-lg shadow-brand-500/20",
  secondary:
    "bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/[0.06]",
  ghost: "text-dark-300 hover:text-white hover:bg-white/[0.04]",
  outline:
    "border border-brand-500/30 text-brand-400 hover:border-brand-500/60 hover:bg-brand-500/5",
  danger:
    "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
};

const sizeMap: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    block = false,
    loading = false,
    iconLeft,
    iconRight,
    children,
    className = "",
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out ${
        variantMap[variant]
      } ${sizeMap[size]} ${block ? "w-full" : ""} ${
        disabled || loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)] ${className}`}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {!loading && iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
});

export default Button;
