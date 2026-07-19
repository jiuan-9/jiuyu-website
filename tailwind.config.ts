/**
 * Tailwind 配置（TypeScript 版）
 *
 * 设计哲学：
 *   - 颜色：单一来源在 src/index.css :root，此处直接用十六进制字面量
 *   - 黑+蓝主题（参考 Nanfu 流畅感，但用黑蓝配色而非红黄）
 *   - 动画：Framer Motion 是主引擎；CSS keyframes 仅作为"静态规则"
 *     Phase 4 会逐步移除大部分 keyframes，业务组件迁移到 framer-motion variants
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // 阶段 D：让所有 hover: 变体只在支持 hover 的设备生效
  // 触摸设备（手机/平板）自动跳过 hover 样式，避免 sticky hover bug
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        /** 品牌主色：蓝（与 tokens.css 对齐） */
        brand: {
          50: "#eefbff",
          100: "#d4f5ff",
          200: "#b2eeff",
          300: "#7de4ff",
          400: "#40d0ff",
          500: "#14b0ff",
          600: "#0090e8",
          700: "#0072bc",
          800: "#066099",
          900: "#0b4f7e",
          950: "#0a324f",
        },
        /** 深色系（背景与文本） */
        dark: {
          50: "#f0f1f6",
          100: "#d6d9e6",
          200: "#b3b8d0",
          300: "#8a91b4",
          400: "#6a6f9d",
          500: "#555884",
          600: "#494670",
          700: "#3e3b5e",
          800: "#35334f",
          900: "#1a1a2e",
          950: "#0a0e1a",
          999: "#000000",
        },
        /** 辅助色 */
        accent: {
          purple: {
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7c3aed",
            800: "#6b21a8",
            900: "#581c87",
          },
          cyan: {
            50: "#ecfeff",
            100: "#cffafe",
            200: "#a5f3fc",
            300: "#67e8f9",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
            800: "#155e75",
            900: "#164e63",
          },
        },
      },
      fontFamily: {
        sans: [
          "PingFang SC",
          "Microsoft YaHei",
          "Noto Sans SC",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          "PingFang SC",
          "Microsoft YaHei",
          "Noto Sans SC",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Cascadia Code",
          "Consolas",
          "Monaco",
          "monospace",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.6" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.5" }],
        "2xl": ["1.5rem", { lineHeight: "1.4" }],
        "3xl": ["1.875rem", { lineHeight: "1.3" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["5.5rem", { lineHeight: "0.95" }],
        "9xl": ["6.5rem", { lineHeight: "0.9" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      transitionDuration: {
        600: "600ms",
        800: "800ms",
        1000: "1000ms",
        1200: "1200ms",
        1500: "1500ms",
        2000: "2000ms",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quad": "var(--ease-out-quad)",
        "out-cubic": "var(--ease-out-cubic)",
        "out-quart": "var(--ease-out-quart)",
        "out-expo": "var(--ease-out-expo)",
        "out-back": "var(--ease-out-back)",
      },
      animation: {
        // ============ 实际在用 ============
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "scale-in-slow": "scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "gradient-shift": "gradient-flow 8s ease infinite",
        "gradient-flow-slow": "gradient-flow 15s ease infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "stagger-1": "fade-in-up 0.6s ease-out 0.1s forwards",
        "stagger-2": "fade-in-up 0.6s ease-out 0.2s forwards",
        "stagger-3": "fade-in-up 0.6s ease-out 0.3s forwards",
        "stagger-4": "fade-in-up 0.6s ease-out 0.4s forwards",
        "stagger-5": "fade-in-up 0.6s ease-out 0.5s forwards",
        "stagger-6": "fade-in-up 0.6s ease-out 0.6s forwards",

        // ============ 兼容旧代码（Phase 4 移除） ============
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in-right": "fade-in-right 0.8s ease-out forwards",
        "fade-in-left": "fade-in-left 0.8s ease-out forwards",
        "scroll-down": "scroll-down 2s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "border-glow": "border-glow 4s ease-in-out infinite",
        "orbit-1": "orbit 20s linear infinite",
        "orbit-2": "orbit 25s linear infinite reverse",
        "orbit-3": "orbit 30s linear infinite",
        "particle-drift": "particle-drift 12s ease-in-out infinite",
        "text-reveal": "text-reveal 1.2s ease-out forwards",
        "text-glow": "text-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "slide-down": "slide-down 0.6s ease-out forwards",
        "slide-left": "slide-left 0.6s ease-out forwards",
        "slide-right": "slide-right 0.6s ease-out forwards",
        "flip-in": "flip-in 0.6s ease-out forwards",
        "bounce-in": "bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "rotate-in": "rotate-in 0.5s ease-out forwards",
        "blur-in": "blur-in 0.8s ease-out forwards",
        "skew-in": "skew-in 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(20, 176, 255, 0.15)" },
          "50%": { boxShadow: "0 0 60px rgba(20, 176, 255, 0.35)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-right": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-left": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "scroll-down": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(8px)", opacity: "0.5" },
        },
        shimmer: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(20, 176, 255, 0.15)" },
          "50%": { borderColor: "rgba(20, 176, 255, 0.35)" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        "particle-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -15px) scale(1.1)" },
          "50%": { transform: "translate(-10px, -25px) scale(0.9)" },
          "75%": { transform: "translate(-20px, -5px) scale(1.05)" },
        },
        "text-reveal": {
          from: {
            opacity: "0",
            transform: "translateY(100%)",
            clipPath: "inset(0 0 100% 0)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
            clipPath: "inset(0 0 0% 0)",
          },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 10px rgba(20, 176, 255, 0.3)" },
          "50%": {
            textShadow:
              "0 0 30px rgba(20, 176, 255, 0.6), 0 0 50px rgba(20, 176, 255, 0.3)",
          },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "flip-in": {
          from: { opacity: "0", transform: "rotateX(-90deg)" },
          to: { opacity: "1", transform: "rotateX(0)" },
        },
        "bounce-in": {
          from: { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "rotate-in": {
          from: { opacity: "0", transform: "rotate(-15deg)" },
          to: { opacity: "1", transform: "rotate(0)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(10px)" },
          to: { opacity: "1", filter: "blur(0)" },
        },
        "skew-in": {
          from: { opacity: "0", transform: "skewX(-10deg)" },
          to: { opacity: "1", transform: "skewX(0)" },
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(20,176,255,0.15), transparent), radial-gradient(ellipse 40% 50% at 80% 80%, rgba(0,114,188,0.1), transparent)",
        "hero-gradient-intense":
          "radial-gradient(ellipse 90% 70% at 50% -30%, rgba(20,176,255,0.2), transparent), radial-gradient(ellipse 50% 60% at 80% 90%, rgba(0,114,188,0.15), transparent), radial-gradient(ellipse 60% 50% at 20% 50%, rgba(168,85,247,0.08), transparent)",
        "card-glow":
          "radial-gradient(circle at 50% 0%, rgba(20,176,255,0.08), transparent 70%)",
        "card-glow-strong":
          "radial-gradient(circle at 50% 0%, rgba(20,176,255,0.12), transparent 70%)",
        "mesh-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "mesh-pattern-dense":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "diagonal-lines":
          "repeating-linear-gradient(45deg, rgba(20,176,255,0.03) 0px, rgba(20,176,255,0.03) 1px, transparent 0px, transparent 50px)",
      },
      boxShadow: {
        "brand-glow": "0 0 40px rgba(20, 176, 255, 0.15)",
        "brand-glow-strong": "0 0 60px rgba(20, 176, 255, 0.25)",
        "card-elevated": "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        "card-hover":
          "0 35px 70px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(20, 176, 255, 0.08)",
      },
      perspective: {
        1000: "1000px",
        1200: "1200px",
        1500: "1500px",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [],
};

export default config;
