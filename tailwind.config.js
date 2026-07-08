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
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "gradient-flow": "gradient-flow 8s ease infinite",
        "scroll-down": "scroll-down 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(20, 176, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(20, 176, 255, 0.6)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "scroll-down": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(8px)", opacity: "0.5" },
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(20,176,255,0.15), transparent), radial-gradient(ellipse 40% 50% at 80% 80%, rgba(0,114,188,0.1), transparent)",
        "card-glow":
          "radial-gradient(circle at 50% 0%, rgba(20,176,255,0.08), transparent 70%)",
      },
    },
  },
  plugins: [],
};
