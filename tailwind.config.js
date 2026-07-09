/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
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
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      transitionDuration: {
        800: "800ms",
        1200: "1200ms",
        2000: "2000ms",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "gradient-flow": "gradient-flow 8s ease infinite",
        "gradient-flow-slow": "gradient-flow 15s ease infinite",
        "scroll-down": "scroll-down 2s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "border-glow": "border-glow 4s ease-in-out infinite",
        "orbit-1": "orbit 20s linear infinite",
        "orbit-2": "orbit 25s linear infinite reverse",
        "orbit-3": "orbit 30s linear infinite",
        "particle-drift": "particle-drift 12s ease-in-out infinite",
        "text-reveal": "text-reveal 1.2s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
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
            clipPath: "inset(0 0 100% 0)" 
          },
          to: { 
            opacity: "1", 
            transform: "translateY(0)",
            clipPath: "inset(0 0 0% 0)" 
          },
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(20,176,255,0.12), transparent), radial-gradient(ellipse 40% 50% at 80% 80%, rgba(0,114,188,0.08), transparent)",
        "card-glow":
          "radial-gradient(circle at 50% 0%, rgba(20,176,255,0.06), transparent 70%)",
        "mesh-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
