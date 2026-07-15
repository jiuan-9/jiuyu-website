import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const count = 50;
    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(20, 176, 255, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(64, 208, 255, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function useParallax(factor = 0.01) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setOffset({ x: (e.clientX - cx) * factor, y: (e.clientY - cy) * factor });
    },
    [factor],
  );
  useEffect(() => {
    if (window.innerWidth < 768) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);
  return offset;
}

const typewriterTexts = [
  "支持阿里云、百度、智谱、Kimi 等 11 家 AI 服务商",
  "AI 人设精调 · 自动编译为最佳 System Prompt",
  "支持图片上传 · 图文混聊更精彩",
  "AES 加密本地存储 · 数据安全由你掌控",
];

function useTypewriter(texts: string[], typingSpeed = 50, deleteSpeed = 25, pauseDuration = 2500) {
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
      () => setCharIndex((prev) => prev + (isDeleting ? -1 : 1)),
      isDeleting ? deleteSpeed : typingSpeed,
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deleteSpeed, pauseDuration]);
  useEffect(() => {
    setDisplayText(texts[textIndex].slice(0, charIndex));
  }, [charIndex, textIndex, texts]);
  return displayText;
}

export default function Hero() {
  const typewriterText = useTypewriter(typewriterTexts);
  const parallax = useParallax(0.008);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark-950"
    >
      <ParticleField />
      <div
        className="absolute top-1/4 left-1/4 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full bg-brand-500/[0.04] blur-[100px] sm:blur-[160px] animate-float-slow"
        style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-72 sm:w-[400px] h-72 sm:h-[400px] rounded-full bg-purple-500/[0.03] blur-[100px] sm:blur-[140px] animate-float"
        style={{ animationDelay: "-5s", transform: `translate(${-parallax.x * 0.6}px, ${-parallax.y * 0.6}px)` }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center flex-1 flex flex-col items-center justify-center pt-16 sm:pt-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass text-[11px] sm:text-xs text-dark-300 mb-6 sm:mb-8 animate-fade-in opacity-0"
          style={{ animationDelay: "0ms" }}
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
          v1.1.0 · 已发布
        </div>

        {/* Main title */}
        <h1
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 sm:mb-6 tracking-tight animate-fade-in-up opacity-0 leading-[1.05]"
          style={{ animationDelay: "200ms" }}
        >
          Quiddity
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-xl md:text-2xl text-dark-300 mb-2 max-w-2xl mx-auto animate-fade-in-up opacity-0"
          style={{ animationDelay: "350ms" }}
        >
          你的<span className="text-gradient font-semibold"> 专属 AI 伙伴</span>
        </p>

        {/* Typewriter */}
        <div
          className="text-xs sm:text-base text-dark-400 mb-6 sm:mb-8 max-w-xl mx-auto h-6 sm:h-7 flex items-center justify-center animate-fade-in-up opacity-0 px-4"
          style={{ animationDelay: "500ms" }}
        >
          <span className="leading-snug">{typewriterText}</span>
          <span className="inline-block w-[2px] h-3 sm:h-4 ml-1 bg-brand-400 animate-pulse" />
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 animate-fade-in-up opacity-0 w-full max-w-sm sm:max-w-none"
          style={{ animationDelay: "800ms" }}
        >
          <a
            href="#download"
            onClick={(e) => { e.preventDefault(); scrollToSection("download"); }}
            className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-dark-950 font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 btn-press w-full sm:w-auto"
          >
            下载 Windows 版
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#/demo"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full glass text-dark-200 hover:text-white text-sm transition-all duration-500 hover:border-brand-500/30 hover:bg-white/5 w-full sm:w-auto"
          >
            在线体验
          </a>
          <a
            href="#features"
            onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full glass text-dark-300 hover:text-dark-200 text-sm transition-all duration-500 hover:border-brand-500/20 w-full sm:w-auto"
          >
            了解更多
          </a>
        </div>

        {/* Key selling points */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-dark-500 animate-fade-in opacity-0 px-2"
          style={{ animationDelay: "900ms" }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            11 家服务商
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            图片上传
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            加密存储
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            完全免费
          </span>
        </div>

      </div>

      <div
        className="relative z-10 flex flex-col items-center gap-2 text-dark-500 pb-6 sm:pb-8 shrink-0 animate-fade-in opacity-0"
        style={{ animationDelay: "1200ms" }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase sm:block hidden">向下探索</span>
        <span className="text-xs sm:text-sm tracking-wide sm:hidden block text-center px-6 leading-relaxed text-dark-400">建议使用PC来访问九语，以获得更好的体验</span>
        <ChevronDown size={14} className="sm:block hidden animate-scroll-down" />
      </div>
    </section>
  );
}
