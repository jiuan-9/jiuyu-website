import type { I18nText } from "./types";

/** 下载区 eyebrow */
export const downloadBadge: I18nText = {
  zh: "Download",
  en: "Download",
};

/** 下载区标题 */
export const downloadSectionTitle: I18nText = {
  zh: "获取 Quiddity",
  en: "Get Quiddity",
};

/** 下载区副标题 */
export const downloadSectionSubtitle: I18nText = {
  zh: "桌面端完全免费，无需注册即可使用。内置自动更新检测，随时保持最新版本。",
  en: "The desktop app is completely free and requires no sign-up. Built-in update checks keep you on the latest version.",
};

/** Windows 桌面端 */
export const desktopTitle: I18nText = {
  zh: "Windows 桌面端",
  en: "Windows Desktop",
};

export const desktopVersion: I18nText = {
  zh: "v1.1.0 · 便携版",
  en: "v1.1.0 · Portable",
};

export const desktopBadge: I18nText = {
  zh: "NEW",
  en: "NEW",
};

/** 在线体验 */
export const demoTitle: I18nText = {
  zh: "在线体验",
  en: "Try Online",
};

export const demoDesc: I18nText = {
  zh: "无需下载，浏览器直接聊",
  en: "No download, chat right in your browser",
};

/** 移动端 */
export const mobileTitle: I18nText = {
  zh: "移动端",
  en: "Mobile",
};

export const mobileDesc: I18nText = {
  zh: "全新 AI 工具 · 即将推出",
  en: "New AI tool · Coming soon",
};

/** 底部 meta tags */
export const downloadMetaTags: { icon: string; label: I18nText }[] = [
  { icon: "Sparkles", label: { zh: "版本 1.1.0", en: "Version 1.1.0" } },
  { icon: "Dot", label: { zh: "Windows 10+", en: "Windows 10+" } },
  { icon: "Dot", label: { zh: "完全免费", en: "Completely Free" } },
  { icon: "Dot", label: { zh: "无需注册", en: "No Sign-up" } },
  { icon: "Dot", label: { zh: "代码高亮", en: "Code Highlighting" } },
];
