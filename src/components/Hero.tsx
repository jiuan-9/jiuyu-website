/**
 * Hero — 首屏主视觉
 *
 * v2.1 重构：使用动画库统一管理动画
 *   - ParticleField：背景粒子（替代原 Canvas 实现，更轻量）
 *   - AuroraBackground：极光氛围（新增，增强深度感）
 *   - EnergyRing：3 个同心圆旋转（替代原 rotating-ring divs）
 *   - GradientText：渐变流动文字（用于"专属 AI 伙伴"）
 *   - TextSplit：逐字揭示（用于主标题与 slogan）
 *   - Typewriter：打字机（替代 inline hook）
 *   - MagneticButton：磁吸按钮（用于主 CTA）
 *   - useVersion：版本号动态读取（替代硬编码）
 *   - useI18n：中英双语
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useI18n } from "@/store/i18n";
import { useVersion, formatVersion } from "@/hooks/useVersion";
import {
  AuroraBackground,
  GradientText,
  TextSplit,
  Typewriter,
  MagneticButton,
  ShaderGradient,
} from "@/components/animation";
import { getDevicePerformanceProfile } from "@/lib/perf";
import {
  heroBadge,
  typewriterTexts,
  heroCtaPrimary,
  heroCtaSecondary,
} from "@/content/hero";
import { staggerContainer, staggerItem } from "@/lib/animation";

// Slogan 是品牌核心，固定双语（不通过 content 文件）
const SLOGAN = {
  zh: "知所不尽，往复不止！",
  en: "Endless Quest, Eternal Loop",
} as const;

// 副标题中需要渐变高亮的关键词
const HIGHLIGHT = {
  zh: "专属 AI 伙伴",
  en: "Personal AI Companion",
} as const;

// CTA 区底部的小特性标签（阶段 D 精简：移除冗余标签，避免内容过多）
// const TAGS 已移除 —— 与打字机内容重复，且占空间

export default function Hero() {
  const { lang, t } = useI18n();
  const { version } = useVersion();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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

  // 入场触发：下一帧激活，避免初始闪烁
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 当前语言的打字机文本
  const typewriterTextsForLang = typewriterTexts.map((text) => t(text));
  // 版本徽章："全新 v1.1.0 · 已发布"
  const badgeText = `${t(heroBadge).split("·")[0].trim()} · ${formatVersion(
    version
  )}`;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-dark-999 via-dark-950 to-dark-950"
    >
      {/* ============ 背景层（阶段 C 升级："做实"质感） ============ */}
      {/* PC 高性能：WebGL shader 流动渐变（fbm 噪声扰动避免"塑料感"，比 CSS radial-gradient 更自然） */}
      {/* 移动端 / 低端设备：降级到 CSS AuroraBackground（2 个柔和光斑） */}
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
          blobCount={2}
          opacity={0.18}
          blur={160}
          duration={35}
          className="absolute inset-0"
        />
      )}
      {/* 网格背景：最"实"的几何元素，保留 */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ============ 内容层 ============ */}
      <motion.div
        className="container relative z-10 mx-auto px-4 sm:px-6 text-center flex-1 flex flex-col items-center justify-center pt-16 sm:pt-20"
        variants={staggerContainer(0.12, 0.1)}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* 版本徽章 */}
        <motion.div
          variants={staggerItem}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass text-[11px] sm:text-xs text-dark-300 mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
          {badgeText}
        </motion.div>

        {/* 主标题：逐字揭示入场（稳重，不浮夸） */}
        <motion.div variants={staggerItem} className="mb-4 sm:mb-6">
          <TextSplit
            text="Quiddity"
            as="h1"
            stagger={0.08}
            duration={0.8}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight"
            charClassName="inline-block"
          />
        </motion.div>

        {/* 副标题：渐变高亮关键词 */}
        <motion.p
          variants={staggerItem}
          className="text-base sm:text-xl md:text-2xl text-dark-300 mb-4 sm:mb-6 max-w-2xl mx-auto"
        >
          {lang === "zh" ? (
            <>
              你的{" "}
              <GradientText
                colors={[
                  "var(--color-brand-300)",
                  "var(--color-brand-500)",
                  "var(--color-accent-purple-400)",
                  "var(--color-brand-300)",
                ]}
                weight={600}
              >
                {t(HIGHLIGHT)}
              </GradientText>
            </>
          ) : (
            <>
              Your{" "}
              <GradientText
                colors={[
                  "var(--color-brand-300)",
                  "var(--color-brand-500)",
                  "var(--color-accent-purple-400)",
                  "var(--color-brand-300)",
                ]}
                weight={600}
              >
                {t(HIGHLIGHT)}
              </GradientText>
            </>
          )}
        </motion.p>

        {/* Slogan：分隔线 + 逐字揭示（阶段 D 精简：移除三个圆点装饰，避免视觉冗余） */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-brand-500/30" />
            <span className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent via-brand-500/50 to-brand-500/30" />
          </div>
          <TextSplit
            text={t(SLOGAN)}
            as="h2"
            stagger={0.05}
            duration={0.6}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-light tracking-[0.3em]"
          />
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-brand-500/30" />
            <span className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent via-brand-500/50 to-brand-500/30" />
          </div>
        </motion.div>

        {/* 打字机：循环展示特性 */}
        <motion.div
          variants={staggerItem}
          className="text-xs sm:text-base text-dark-400 mb-6 sm:mb-8 max-w-xl mx-auto h-6 sm:h-7 flex items-center justify-center px-4"
        >
          <span className="leading-snug">
            <Typewriter
              texts={typewriterTextsForLang}
              typingSpeed={50}
              pauseDuration={2500}
              cursor="|"
            />
          </span>
        </motion.div>

        {/* CTA 按钮组 */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full max-w-sm sm:max-w-none"
        >
          {/* 主 CTA：磁吸按钮 */}
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

          {/* 次要 CTA：在线体验 */}
          <a
            href="#/demo"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full glass text-dark-200 hover:text-white text-sm transition-all duration-500 hover:border-brand-500/30 hover:bg-white/5 w-full sm:w-auto gradient-border"
          >
            {t(heroCtaSecondary)}
          </a>

          {/* 阶段 D 精简：移除"了解更多"按钮（与主 CTA 重复） */}
          {/* 阶段 D 精简：移除底部 4 个特性标签（与打字机内容重复） */}
        </motion.div>
      </motion.div>

      {/* ============ 滚动提示（阶段 D 精简：仅保留箭头 + 上下浮动，移除冗余文字） ============ */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-1 text-dark-500 pb-6 sm:pb-8 shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {isMobile ? (
          <span className="text-[10px] tracking-wide text-center px-6 leading-relaxed text-dark-500">
            {t({
              zh: "建议使用 PC 访问",
              en: "Best on PC",
            })}
          </span>
        ) : (
          <div className="scroll-indicator">
            <ChevronDown size={20} className="text-brand-400/60" />
          </div>
        )}
      </motion.div>
    </section>
  );
}
