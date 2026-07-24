/**
 * Features — 核心功能区
 *
 * v2.1 重构：
 *   - 使用 Tilt3D 替代手写 3D 倾斜（统一动画库）
 *   - 使用 SpotlightCard 替代手写高光（鼠标聚光灯）
 *   - 使用 ScrollReveal + staggerContainer 统一入场动画
 *   - 使用 GradientText 强调 "Quiddity" 品牌名
 *   - 中英双语（useI18n + content/features）
 *   - 6 项核心功能 + 4 项高亮徽章
 */

import { motion } from "framer-motion";
import {
  Layers,
  ShieldCheck,
  MessageSquare,
  Zap,
  Lock,
  Wrench,
  Gift,
  UserX,
  Github,
  WifiOff,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal, Tilt3D, SpotlightCard, GradientText } from "@/components/animation";
import { useI18n } from "@/store/i18n";
import { staggerContainer, staggerItem } from "@/lib/animation";
import {
  features,
  highlights,
  featuresBadge,
  featuresSectionTitle,
  featuresSectionSubtitle,
} from "@/content/features";

/** 图标名 → 组件映射（content 文件中只存字符串，组件文件统一管理） */
const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  ShieldCheck,
  MessageSquare,
  Zap,
  Lock,
  Wrench,
  Gift,
  UserX,
  Github,
  WifiOff,
};

/** 高亮徽章的颜色主题（按 index 循环） */
const HIGHLIGHT_THEMES = [
  {
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    gradient: "from-yellow-500/20 to-orange-500/10",
    border: "group-hover:border-yellow-500/30",
  },
  {
    text: "text-green-400",
    bg: "bg-green-500/10",
    gradient: "from-green-500/20 to-emerald-500/10",
    border: "group-hover:border-green-500/30",
  },
  {
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500/20 to-pink-500/10",
    border: "group-hover:border-purple-500/30",
  },
  {
    text: "text-brand-400",
    bg: "bg-brand-500/10",
    gradient: "from-brand-500/20 to-blue-500/10",
    border: "group-hover:border-brand-500/30",
  },
] as const;

/** 功能卡片颜色主题（按 index 循环，营造层次感） */
const FEATURE_ACCENTS = [
  "from-brand-500/30 to-brand-600/20",
  "from-purple-500/30 to-purple-600/20",
  "from-cyan-500/30 to-cyan-600/20",
  "from-emerald-500/30 to-emerald-600/20",
  "from-amber-500/30 to-amber-600/20",
  "from-pink-500/30 to-pink-600/20",
] as const;

function FeatureCard({ index }: { index: number }) {
  const { t } = useI18n();
  const feature = features[index];
  const Icon = ICON_MAP[feature.icon] ?? Zap;
  const accent = FEATURE_ACCENTS[index % FEATURE_ACCENTS.length];

  return (
    <Tilt3D
      maxAngle={8}
      scale={1.03}
      glare={true}
      className="h-full"
    >
      <SpotlightCard
        color="rgba(20, 176, 255, 0.18)"
        radius={220}
        className="group relative h-full rounded-2xl glass glow-border overflow-hidden transition-colors duration-500 hover:border-brand-500/30"
      >
        {/* 渐变背景层（hover 时显示） */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* 右上角光晕 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-500/[0.08] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* 右下角模糊光斑 */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-500/[0.05] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full items-center text-center">
          {/* 图标（顶部居中） */}
          <div className="relative mb-3 sm:mb-4">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}
            >
              <Icon size={20} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-brand-500/20 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          </div>

          {/* 标题 */}
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2 group-hover:text-brand-300 transition-colors">
            {t(feature.title)}
          </h3>

          {/* 描述 */}
          <p className="text-xs sm:text-sm text-dark-400 leading-relaxed flex-1 group-hover:text-dark-300 transition-colors duration-300">
            {t(feature.desc)}
          </p>
        </div>

        {/* 底部光线 */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </SpotlightCard>
    </Tilt3D>
  );
}

function HighlightCard({ index }: { index: number }) {
  const { t } = useI18n();
  const h = highlights[index];
  const Icon = ICON_MAP[h.icon] ?? Gift;
  const theme = HIGHLIGHT_THEMES[index % HIGHLIGHT_THEMES.length];

  return (
    <motion.div variants={staggerItem} className="h-full">
      <div
        className={`glass rounded-xl px-3 sm:px-5 py-4 sm:py-5 card-interactive group text-center relative overflow-hidden border border-white/[0.04] ${theme.border} transition-colors duration-500 h-full`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />
        <div
          className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 pointer-events-none`}
        />
        <div
          className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${theme.bg} mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10`}
        >
          <Icon size={18} className={theme.text} />
        </div>
        <div className="text-sm font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors relative z-10">
          {t(h.label)}
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/60 to-transparent" />
      <div className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full bg-brand-500/[0.03] blur-[180px] animate-pulse-slow pointer-events-none" />
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[500px] rounded-full bg-purple-500/[0.02] blur-[160px] animate-pulse-slow pointer-events-none"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/[0.015] blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 标题 */}
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            <Sparkles size={12} className="animate-pulse" />
            {t(featuresBadge)}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            <GradientText animated={true}>{t(featuresSectionTitle)}</GradientText>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-2">
            {t(featuresSectionSubtitle)}
          </p>
        </ScrollReveal>

        {/* 高亮徽章（4 项） */}
        <ScrollReveal threshold={0.1}>
          <motion.div
            className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-5 max-w-4xl mx-auto mb-8 sm:mb-12"
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {highlights.map((_, index) => (
              <HighlightCard key={highlights[index].id} index={index} />
            ))}
          </motion.div>
        </ScrollReveal>

        {/* 功能卡片（6 项） */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-6xl mx-auto"
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map((_, index) => (
            <motion.div key={features[index].id} variants={staggerItem} className="h-full">
              <FeatureCard index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
