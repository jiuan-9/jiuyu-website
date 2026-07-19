import type { Stat, I18nText } from "./types";

/** Stats 区 eyebrow */
export const statsSectionBadge: I18nText = {
  zh: "Platform",
  en: "Platform",
};

/** Stats 区标题 */
export const statsSectionTitle: I18nText = {
  zh: "平台能力",
  en: "Platform Capability",
};

/** Stats 区高亮词 */
export const statsSectionHighlight: I18nText = {
  zh: "核心数据",
  en: "Key Metrics",
};

/**
 * 数据统计区
 * value 用数字类型，便于 CountUp 动画
 * suffix 用 i18n（如 "K+" / "万+" 中英不同）
 */
export const stats: Stat[] = [
  {
    id: "models",
    value: 12,
    suffix: { zh: "+", en: "+" },
    label: { zh: "聚合大模型", en: "Aggregated LLMs" },
  },
  {
    id: "size",
    value: 0,
    suffix: { zh: " MB", en: " MB" },
    label: { zh: "安装包大小", en: "Installer Size" },
  },
  {
    id: "languages",
    value: 2,
    suffix: { zh: "", en: "" },
    label: { zh: "界面语言", en: "UI Languages" },
  },
  {
    id: "price",
    value: 0,
    suffix: { zh: " 元", en: "$" },
    label: { zh: "完全免费", en: "Completely Free" },
  },
];

/** Stats 区副标题 */
export const statsSectionSubtitle = {
  zh: "数字背后，是持续打磨的诚意",
  en: "Behind the numbers, sincere craftsmanship",
};

/** 用于 CountUp 动画的辅助映射 */
export const statsCountUpConfig = {
  duration: 2.0, // 秒
  once: true, // 只触发一次
};
