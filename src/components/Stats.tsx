/**
 * Stats — 数据统计区
 *
 * v3.0 重构（"做实"方向）：
 *   - 移除 Tilt3D 卡片倾斜（用户反馈"太晃了"，3D 倾斜破坏稳重感）
 *   - 移除 SpotlightCard 鼠标聚光灯（科技感虚假）
 *   - 移除 hover 渐变光晕（彩色 blur 光晕浮夸）
 *   - 保留 CountUp 数字滚动（入场仪式感，不浮夸）
 *   - 简化为纯色边框卡片：白边 + 静态数字 + 标签
 *   - 4 项核心数据：服务商 / 会话 / 加密 / 功能（用户已确认数据真实）
 */

import { motion } from "framer-motion";
import { CountUp, ScrollReveal } from "@/components/animation";
import { useI18n } from "@/store/i18n";
import { staggerContainer, staggerItem } from "@/lib/animation";

type Stat = {
  id: string;
  /** 数字值；若为 null 则渲染 displayValue 字符串 */
  value: number | null;
  /** 非数字时的显示值（如 "∞"） */
  displayValue?: string;
  suffix?: string;
  label: { zh: string; en: string };
  sublabel: { zh: string; en: string };
};

const STATS: Stat[] = [
  {
    id: "providers",
    value: 11,
    suffix: "",
    label: { zh: "服务商接入", en: "AI Providers" },
    sublabel: {
      zh: "主流 AI 平台一站集成",
      en: "All mainstream AI platforms in one",
    },
  },
  {
    id: "sessions",
    value: null,
    displayValue: "∞",
    suffix: "",
    label: { zh: "无限会话", en: "Unlimited Sessions" },
    sublabel: {
      zh: "随心创建，无数量限制",
      en: "Create as many as you want",
    },
  },
  {
    id: "encryption",
    value: 100,
    suffix: "%",
    label: { zh: "本地加密", en: "Local Encryption" },
    sublabel: {
      zh: "数据完全由你掌控",
      en: "Your data, your control",
    },
  },
  {
    id: "features",
    value: 6,
    suffix: "",
    label: { zh: "核心功能", en: "Core Features" },
    sublabel: {
      zh: "代码高亮、人设精调、多模型切换等",
      en: "Syntax highlight, persona tuning, multi-model switch, etc.",
    },
  },
];

export default function Stats() {
  const { t } = useI18n();

  return (
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      {/* 背景层（已削弱：移除中心光晕，仅保留渐变背景 + 中线） */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/50 to-dark-950" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-500/[0.06] to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* 标题 */}
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            Platform
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {t({ zh: "平台", en: "Platform" })}{" "}
            <span className="text-gradient">
              {t({ zh: "能力", en: "Capability" })}
            </span>
          </h2>
        </ScrollReveal>

        {/* 统计网格 */}
        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto"
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {STATS.map((stat) => (
            <motion.div key={stat.id} variants={staggerItem}>
              <div className="relative h-full rounded-2xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all duration-300">
                {/* 数字 */}
                <div className="relative mb-2 sm:mb-3">
                  <div className="relative text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center">
                    {stat.value === null ? (
                      // 非数字（如 ∞）直接渲染
                      <span>{stat.displayValue}</span>
                    ) : (
                      <CountUp
                        end={stat.value}
                        suffix={stat.suffix}
                        duration={2}
                        threshold={0.3}
                      />
                    )}
                  </div>
                </div>

                {/* 标签 */}
                <div className="text-base sm:text-lg font-semibold text-dark-200 mb-1 text-center transition-colors">
                  {t(stat.label)}
                </div>
                <div className="text-xs sm:text-sm text-dark-400 leading-relaxed px-1 text-center transition-colors">
                  {t(stat.sublabel)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
