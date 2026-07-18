import type { I18nText } from "./types";

/**
 * Hero 区域内容
 * typewriterTexts 用于打字机动画
 * 注意：版本号统一从 public/version.json 读取，不在内容里硬编码
 */
export const heroBadge: I18nText = {
  zh: "全新 v1.1.0 · 已发布",
  en: "New v1.1.0 · Released",
};

export const heroTitle: I18nText = {
  zh: "你的专属 AI 伙伴",
  en: "Your Personal AI Companion",
};

export const heroSubtitle: I18nText = {
  zh: "多模型 AI 桌面应用，让 AI 真正融入你的日常",
  en: "Multi-model AI desktop app — bringing AI into your daily flow",
};

export const heroDescription: I18nText = {
  zh: "一个客户端，聚合所有主流大模型。本地优先、隐私至上、流畅至上。",
  en: "One client, all mainstream LLMs. Local-first, privacy-first, fluency-first.",
};

/** 打字机循环文本 */
export const typewriterTexts: I18nText[] = [
  { zh: "本地优先 · 隐私至上", en: "Local-first · Privacy-first" },
  { zh: "多模型聚合 · 一键切换", en: "Multi-model · One-click switch" },
  { zh: "无限会话 · 永久保留", en: "Unlimited sessions · Forever retained" },
  { zh: "系统级加密 · 安全可靠", en: "System-level encryption · Secure" },
  { zh: "流畅至上 · 极致体验", en: "Fluency-first · Ultimate experience" },
];

export const heroCtaPrimary: I18nText = {
  zh: "立即下载",
  en: "Download Now",
};

export const heroCtaSecondary: I18nText = {
  zh: "在线体验",
  en: "Try Online",
};

export const heroStatsLabel: I18nText = {
  zh: "已服务用户",
  en: "Users served",
};

/** 滚动提示 */
export const scrollHint: I18nText = {
  zh: "向下滚动",
  en: "Scroll down",
};
