/**
 * Legal — 法律信息页
 *
 * 包含：
 *   - 免责声明（突出显示）
 *   - 中国法规链接（10 项）
 *   - 国际法规链接（7 项）
 *   - 返回首页按钮
 *
 * v2.1: 使用动画库 + 双语 + 黑蓝主题
 */

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Scale, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollReveal, EnergyRing, GradientText } from "@/components/animation";
import { useI18n } from "@/store/i18n";
import { staggerContainer, staggerItem } from "@/lib/animation";
import {
  legalGroups,
  disclaimerTitle,
  disclaimerIntro,
  disclaimerHighlight,
  disclaimerOutro,
} from "@/content/footer-links";
import {
  legalPageTitle,
  legalPageSubtitle,
  legalBackHome,
  legalBadge,
} from "@/content/legal-page";

export default function Legal() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950 to-black" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-brand-500/[0.03] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[160px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-4xl">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-brand-400 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t(legalBackHome)}
        </button>

        {/* Header */}
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <div className="flex justify-center mb-4 sm:mb-6">
            <EnergyRing size={72} strokeWidth={2} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <Scale size={12} className="text-brand-400" />
            <span className="text-[10px] font-semibold text-brand-400 tracking-wider">{t(legalBadge)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            <GradientText animated={true}>{t(legalPageTitle)}</GradientText>
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(legalPageSubtitle)}
          </p>
        </ScrollReveal>

        {/* 免责声明 */}
        <ScrollReveal threshold={0.1} className="mb-10 sm:mb-14">
          <div className="relative rounded-2xl glass glow-border p-5 sm:p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <ShieldAlert size={20} className="text-amber-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {t(disclaimerTitle)}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-dark-300 leading-relaxed">
                {t(disclaimerIntro)}
                <span className="text-amber-400 font-semibold">
                  {t(disclaimerHighlight)}
                </span>
                {t(disclaimerOutro)}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 法规链接分组 */}
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-8 sm:space-y-10"
        >
          {legalGroups.map((group) => (
            <motion.div key={group.category.en} variants={staggerItem}>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-purple-400 rounded-full" />
                {t(group.category)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {group.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl glass border border-white/[0.04] hover:border-brand-500/30 hover:bg-brand-500/[0.02] transition-all duration-300"
                  >
                    <span className="text-xs sm:text-sm text-dark-200 group-hover:text-white transition-colors leading-snug">
                      {t(link.label)}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-dark-500 group-hover:text-brand-400 transition-colors shrink-0"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
