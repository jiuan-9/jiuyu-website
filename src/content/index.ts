/**
 * 内容统一导出
 * 业务组件从此处导入，避免直接依赖具体文件
 * 切换语言时只需切换 i18n store，所有内容自动跟着切换
 */

export * from "./types";
export * from "./hero";
export * from "./nav-links";
export * from "./features";
export * from "./faqs";
export * from "./stats";
export * from "./footer-links";
export * from "./quiddity-preview";
export * from "./demo-chats";
export * from "./announcements";
export * from "./app-preview";
export * from "./use-cases";
export * from "./how-it-works";
export * from "./provider-showcase";
export * from "./download";
export * from "./demo";
export * from "./timeline";
export * from "./not-found";
export * from "./legal-page";
export * from "./global";

/** 全局品牌信息 */
export const brand = {
  name: "Quiddity",
  slogan: {
    zh: "知所不尽，往复不止",
    en: "Know no bounds, repeat no end",
  },
  tagline: {
    zh: "你的专属 AI 伙伴",
    en: "Your personal AI companion",
  },
  email: "qu9190agent@163.com",
  github: "https://github.com/jiuan-9/jiuyu-website",
  // 通过 useVersion hook 动态读取，不在此硬编码
  versionSource: "/version.json",
  downloadsSource: "/downloads.json",
} as const;

/** 当前语言 */
export type Language = "zh" | "en";

/** 语言显示名 */
export const languageLabels: Record<Language, { zh: string; en: string }> = {
  zh: { zh: "中文", en: "Chinese" },
  en: { zh: "英文", en: "English" },
};

/** 语言切换标签 */
export const languageSwitchLabel = {
  zh: "切换到英文",
  en: "Switch to Chinese",
};
