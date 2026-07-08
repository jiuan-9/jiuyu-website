import { useEffect, useState, useCallback } from "react";
import { Download, ChevronDown } from "lucide-react";

const typewriterTexts = [
  "你的专属 AI 伙伴",
  "支持 11 家服务商 · 62+ 模型",
  "纯本地加密存储 · 隐私无忧",
  "AI 人设精调 · 创造专属角色",
];

function useTypewriter(texts: string[], typingSpeed = 60, deleteSpeed = 30, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (!isDeleting && charIndex === currentText.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
      },
      isDeleting ? deleteSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deleteSpeed, pauseDuration]);

  useEffect(() => {
    setDisplayText(texts[textIndex].slice(0, charIndex));
  }, [charIndex, textIndex, texts]);

  return displayText;
}

function useParallax(factor = 0.02) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setOffset({
        x: (e.clientX - cx) * factor,
        y: (e.clientY - cy) * factor,
      });
    },
    [factor],
  );

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Skip parallax on mobile

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return offset;
}

export default function Hero() {
  const typewriterText = useTypewriter(typewriterTexts);
  const parallax = useParallax(0.015);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,176,255,0.03),transparent_70%)]" />

      {/* Floating orbs with parallax */}
      <div
        className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-brand-500/5 blur-[80px] sm:blur-[120px] animate-float"
        style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-brand-600/5 blur-[100px] sm:blur-[140px] animate-float"
        style={{
          animationDelay: "-3s",
          transform: `translate(${-parallax.x * 0.5}px, ${-parallax.y * 0.5}px)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10 mx-auto px-6 text-center flex-1 flex flex-col items-center justify-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-dark-300 mb-8 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0ms" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          AI 聊天桌面应用 · v1.0.0
        </div>

        {/* Main heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight animate-fade-in-up opacity-0"
          style={{ animationDelay: "150ms" }}
        >
          九语
        </h1>

        {/* Typewriter */}
        <p
          className="text-base sm:text-xl md:text-2xl text-dark-300 mb-4 max-w-[90vw] sm:max-w-2xl mx-auto animate-fade-in-up opacity-0 min-h-[2rem] sm:h-9 flex items-center justify-center flex-wrap"
          style={{ animationDelay: "300ms" }}
        >
          <span className="break-all sm:break-normal text-center">{typewriterText}</span>
          <span className="inline-block w-[2px] h-4 sm:h-6 ml-1 bg-brand-400 animate-pulse shrink-0" />
        </p>

        {/* Subtitle */}
        <p
          className="text-xs sm:text-base text-dark-400 max-w-xs sm:max-w-xl mx-auto mb-10 animate-fade-in-up opacity-0 leading-relaxed"
          style={{ animationDelay: "450ms" }}
        >
          支持多模型接入 · AI 人设精调 · 多会话管理 · 纯本地存储
          <br className="hidden sm:block" />
          用你喜欢的方式，与 AI 自由对话
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0"
          style={{ animationDelay: "600ms" }}
        >
          <a
            href="#download"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-400 text-white font-semibold text-base transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
          >
            <Download size={18} className="group-hover:translate-y-px transition-transform" />
            立即下载
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full glass text-dark-200 hover:text-white text-base transition-all duration-300 hover:border-brand-500/30 hover:bg-white/5"
          >
            了解更多
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center gap-2.5 text-dark-500 pb-6 shrink-0 mt-4 animate-fade-in-up opacity-0" style={{ animationDelay: "800ms" }}>
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-dark-500 to-transparent" />
        <ChevronDown size={14} className="animate-scroll-down" />
      </div>
    </section>
  );
}
