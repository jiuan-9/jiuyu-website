/**
 * Hero — 首屏主视觉（v2.2 极简版）
 *
 * 用户反馈："开始页内容太杂，v1.1.0 写了两遍，名字和分割线又是两行"
 * v2.2 精简策略：仅保留 名字 + 口号 + CTA + 滚动提示
 *   - 移除版本徽章（v1.1.0 重复 bug：heroBadge 硬编码 v1.1.0 + formatVersion(version) 再拼一次）
 *   - 移除副标题"你的专属 AI 伙伴"（与名字/Slogan 重复）
 *   - 移除 Slogan 前后分割线（视觉冗余）
 *   - 移除打字机循环（信息密度过高）
 *   - 保留 ShaderGradient/AuroraBackground 背景 + 网格
 */

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";
import { useI18n } from "@/store/i18n";
import {
  AuroraBackground,
  TextSplit,
  MagneticButton,
  ShaderGradient,
} from "@/components/animation";
import { getDevicePerformanceProfile } from "@/lib/perf";
import { heroCtaPrimary, heroCtaSecondary, scrollHint } from "@/content/hero";
import { brand } from "@/content";

export default function Hero() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [deviceTier, setDeviceTier] = useState<"high" | "medium" | "low">(
    "high"
  );

  // 移动端检测 + 设备性能画像（决定是否启用 WebGL shader）
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setDeviceTier(getDevicePerformanceProfile().tier);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-dark-999 via-dark-950 to-dark-950"
    >
      {/* ============ 背景层（阶段 C 升级："做实"质感） ============ */}
      {deviceTier === "high" ? (
        <ShaderGradient
          primaryColor={[0.08, 0.69, 1.0]}
          secondaryColor={[0.66, 0.33, 0.97]}
          backgroundColor={[0.02, 0.03, 0.06]}
          opacity={0.18}
          speed={0.04}
          noiseStrength={0.5}
          className="absolute inset-0"
        />
      ) : (
        <AuroraBackground
          blobCount={isMobile ? 1 : 2}
          opacity={isMobile ? 0.12 : 0.18}
          blur={isMobile ? 100 : 160}
          duration={isMobile ? 45 : 35}
          className="absolute inset-0"
        />
      )}
      {/* 网格背景：最"实"的几何元素 */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ============ 内容层（v2.2 极简：名字 + 口号 + CTA，取消整块入场动画） ============ */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center flex-1 flex flex-col items-center justify-center pt-16 sm:pt-20">
        {/* 名字（直接显示，无入场） */}
        <div className="mb-6 sm:mb-8">
          <TextSplit
            text="Quiddity"
            as="h1"
            stagger={0.08}
            duration={0.8}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight"
            charClassName="inline-block"
          />
        </div>

        {/* 口号（直接显示，无入场） */}
        <div className="mb-10 sm:mb-12">
          <TextSplit
            text={t(brand.slogan)}
            as="h2"
            stagger={0.05}
            duration={0.6}
            className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-[0.3em]"
          />
        </div>

        {/* CTA 按钮组（核心转化元素，必须保留） */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none">
          <MagneticButton
            strength={18}
            onClick={() => scrollToSection("download")}
            className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-dark-950 font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-white/20 btn-press w-full sm:w-auto relative overflow-hidden cursor-pointer"
          >
            <span className="relative z-10">{t(heroCtaPrimary)}</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform relative z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400/0 via-brand-400/10 to-brand-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </MagneticButton>

          <button
            type="button"
            onClick={() => navigate("/demo")}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full glass text-dark-200 hover:text-white text-sm transition-all duration-500 hover:border-brand-500/30 hover:bg-white/5 w-full sm:w-auto gradient-border border-0 cursor-pointer"
          >
            {t(heroCtaSecondary)}
          </button>
        </div>
      </div>

      {/* 滚动提示（直接显示，无 fade-in） */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-dark-500 pb-6 sm:pb-8 shrink-0">
        {isMobile ? (
          <span className="text-[10px] tracking-wide text-center px-6 leading-relaxed text-dark-500">
            {t(scrollHint)}
          </span>
        ) : (
          <div className="scroll-indicator">
            <ChevronDown size={20} className="text-brand-400/60" />
          </div>
        )}
      </div>
    </section>
  );
}
