/**
 * FAQ — 常见问题区
 *
 * v2.1 重构：
 *   - 使用 AnimatePresence + faqCollapse variants 替代手写 height 测量
 *   - 使用 ScrollReveal + staggerContainer 统一入场
 *   - 使用 GradientText 强调标题关键词
 *   - 中英双语（useI18n + content/faqs）
 *   - 5 项常见问题（手风琴式展开）
 *   - 平滑的高度过渡动画（Framer Motion 驱动）
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { ScrollReveal, GradientText } from "@/components/animation";
import { useI18n } from "@/store/i18n";
import { staggerContainer, staggerItem, faqCollapse } from "@/lib/animation";
import { faqs, faqSectionTitle, faqSectionSubtitle } from "@/content/faqs";

function FAQAccordion({ index }: { index: number }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const faq = faqs[index];

  return (
    <motion.div
      variants={staggerItem}
      className="border-b border-white/[0.04] last:border-b-0 group"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left active:bg-white/[0.02] transition-colors -mx-2 px-2 rounded-lg min-h-[56px]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isOpen ? "bg-brand-500/20" : "bg-dark-800"
            }`}
          >
            <HelpCircle
              size={16}
              className={isOpen ? "text-brand-400" : "text-dark-500"}
            />
          </div>
          <span
            className={`text-sm sm:text-base font-medium pr-4 transition-colors duration-300 ${
              isOpen ? "text-brand-300" : "text-dark-200 group-hover:text-white"
            }`}
          >
            {t(faq.question)}
          </span>
        </div>
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
            isOpen ? "bg-brand-500/10" : "bg-white/[0.03]"
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown
            size={16}
            className={isOpen ? "text-brand-400" : "text-dark-500"}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            variants={faqCollapse}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <div className="pb-5 pl-11 relative">
              {/* 左侧装饰线 */}
              <div className="absolute left-11 top-0 w-px h-[calc(100%-10px)] bg-gradient-to-b from-brand-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="text-xs sm:text-sm text-dark-400 leading-relaxed">
                {t(faq.answer)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const { t } = useI18n();

  return (
    <section id="faq" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] rounded-full bg-brand-500/[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] rounded-full bg-purple-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* 标题 */}
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            <GradientText animated={true}>{t(faqSectionTitle)}</GradientText>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t(faqSectionSubtitle)}
          </p>
        </ScrollReveal>

        {/* 手风琴 */}
        <ScrollReveal threshold={0.1}>
          <motion.div
            className="max-w-2xl mx-auto glass rounded-2xl glow-border p-4 sm:p-6 md:p-8 relative"
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.02] via-transparent to-purple-500/[0.02] rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              {faqs.map((_, index) => (
                <FAQAccordion key={faqs[index].id} index={index} />
              ))}
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
