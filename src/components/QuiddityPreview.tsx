/**
 * QuiddityPreview — Quiddity Agent 预告区
 *
 * v2.1 重构：
 *   - 使用 EnergyRing 作为品牌标识视觉核心（3 个同心圆 + 反向旋转）
 *   - 使用 MorphingBlob 作为背景有机形变装饰
 *   - 使用 Tilt3D + SpotlightCard 替代手写 3D 倾斜与高光
 *   - 使用 ScrollReveal + staggerContainer 统一入场
 *   - 使用 GradientText 强调 "Quiddity Agent"
 *   - 使用 MagneticButton 替代普通 CTA
 *   - 中英双语（useI18n + content/quiddity-preview）
 */

import { motion } from "framer-motion";
import {
  Bot,
  UserCheck,
  ShieldCheck,
  Wrench,
  Languages,
  Palette,
  Layers,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import {
  ScrollReveal,
  Tilt3D,
  SpotlightCard,
  EnergyRing,
  MorphingBlob,
  GradientText,
} from "@/components/animation";
import { useI18n } from "@/store/i18n";
import { staggerContainer, staggerItem } from "@/lib/animation";
import {
  quiddityFeatures,
  quidditySectionHighlight,
  quidditySectionSubtitle,
  quidditySlogan,
  quidditySloganSubtitle,
  quiddityCtaTitle,
  quiddityCtaSubtitle,
} from "@/content/quiddity-preview";

/** 图标名 → 组件映射 */
const ICON_MAP: Record<string, LucideIcon> = {
  Bot,
  UserCheck,
  ShieldCheck,
  Wrench,
  Languages,
  Palette,
  Layers,
  HeartHandshake,
};

/** 卡片颜色主题（紫蓝渐变，营造下一代感） */
const CARD_ACCENTS = [
  "from-purple-500/20 to-blue-500/15",
  "from-blue-500/20 to-cyan-500/15",
  "from-cyan-500/20 to-purple-500/15",
  "from-pink-500/20 to-purple-500/15",
] as const;

function FeatureCard({ index }: { index: number }) {
  const { t } = useI18n();
  const feature = quiddityFeatures[index];
  const Icon = ICON_MAP[feature.icon] ?? Bot;
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
    <Tilt3D maxAngle={6} scale={1.04} glare={false} className="h-full">
      <SpotlightCard
        color="rgba(168, 85, 247, 0.18)"
        radius={180}
        className="group relative h-full p-4 sm:p-5 rounded-2xl glass glow-border flex flex-col overflow-hidden hover:border-purple-500/30 transition-colors duration-500"
      >
        {/* 渐变背景（hover） */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* 图标（固定宽高 + 显式居中，与标题同列中心对齐） */}
        <div className="relative w-11 h-11 mb-3 z-10 self-center">
          <div
            className={`w-full h-full rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-gradient-to-br ${accent} transition-all duration-500 group-hover:scale-110`}
          >
            <Icon size={20} className="text-purple-400" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
        </div>

        {/* 标题（与图标同列中心对齐） */}
        <h3 className="text-sm font-semibold text-white mb-1.5 text-center group-hover:text-purple-300 transition-colors relative z-10">
          {t(feature.title)}
        </h3>

        {/* 描述（与图标/标题同列中心对齐） */}
        <p className="text-[11px] text-dark-400 leading-relaxed text-center group-hover:text-dark-300 transition-colors relative z-10 mt-auto">
          {t(feature.desc)}
        </p>

        {/* 底部光线 */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </SpotlightCard>
    </Tilt3D>
  );
}

export default function QuiddityPreview() {
  const { t } = useI18n();

  return (
    <section id="quiddity" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-purple-500/[0.03] blur-[180px] animate-pulse-slow pointer-events-none" />
      <div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[150px] animate-pulse-slow pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      {/* MorphingBlob 背景装饰（左下角，缓慢形变） */}
      <MorphingBlob
        size={320}
        color="rgba(168, 85, 247, 0.08)"
        duration={18}
        className="absolute -bottom-20 -left-20 pointer-events-none"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header: EnergyRing 居中作为品牌标识 */}
        <ScrollReveal className="text-center mb-8 sm:mb-12">
          {/* EnergyRing 居中显示 */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <EnergyRing size={88} strokeWidth={2} />
          </div>

          {/* 标题（已删除"下一代 AI 体验"徽章那一行） */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            <GradientText
              animated={true}
              colors={["#a855f7", "#3b82f6", "#22d3ee"]}
              duration={8}
            >
              {t(quidditySectionHighlight)}
            </GradientText>
          </h2>

          {/* 副标题 */}
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t(quidditySectionSubtitle)}
          </p>
        </ScrollReveal>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto auto-rows-fr"
          variants={staggerContainer(0.1, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {quiddityFeatures.map((_, index) => (
            <motion.div key={quiddityFeatures[index].id} variants={staggerItem} className="h-full">
              <FeatureCard index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Slogan Divider */}
        <ScrollReveal threshold={0.2} className="mt-10 sm:mt-14 md:mt-16">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span className="w-12 sm:w-20 md:w-28 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-purple-500/50" />
            <div className="text-center">
              <p className="text-sm sm:text-base md:text-lg text-dark-300 tracking-[0.3em] font-light whitespace-nowrap">
                {t(quidditySlogan)}
              </p>
              <p className="text-[10px] sm:text-xs text-dark-500 mt-1.5 tracking-wider">
                {t(quidditySloganSubtitle)}
              </p>
            </div>
            <span className="w-12 sm:w-20 md:w-28 h-px bg-gradient-to-l from-transparent via-purple-500/30 to-purple-500/50" />
          </div>
        </ScrollReveal>

        {/* CTA（删除"预约体验"按钮，只保留标题/副标题） */}
        <ScrollReveal threshold={0.2} className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-1 px-5 sm:px-8 py-4 sm:py-5 rounded-2xl glass glow-border w-full sm:w-auto max-w-md mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.02] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-center relative z-10">
              <div className="text-sm font-semibold text-white">{t(quiddityCtaTitle)}</div>
              <div className="text-xs text-dark-400 mt-0.5">{t(quiddityCtaSubtitle)}</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

