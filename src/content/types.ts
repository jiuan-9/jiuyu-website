/**
 * 双语内容类型定义
 * 所有内容均使用 { zh, en } 结构，便于一键切换语言
 * 严禁混合语言：中文模式只显示中文，英文模式只显示英文
 */

/** 双语文本 */
export type I18nText = {
  zh: string;
  en: string;
};

/** 双语数组（每项是一句话） */
export type I18nList = I18nText[];

/** 导航链接 */
export type NavLink = {
  id: string;
  label: I18nText;
  href: string;
};

/** 功能特性 */
export type Feature = {
  id: string;
  icon: string; // lucide icon name
  title: I18nText;
  desc: I18nText;
};

/** 高亮徽章 */
export type Highlight = {
  id: string;
  icon: string;
  label: I18nText;
};

/** 常见问题 */
export type Faq = {
  id: string;
  question: I18nText;
  answer: I18nText;
};

/** 数据统计 */
export type Stat = {
  id: string;
  value: number;
  suffix: I18nText;
  label: I18nText;
};

/** 页脚链接 */
export type FooterLink = {
  label: I18nText;
  href: string;
};

/** 页脚分组 */
export type FooterGroup = {
  category: I18nText;
  links: FooterLink[];
};

/** Quiddity Agent 预告特性 */
export type QuiddityFeature = {
  id: string;
  icon: string;
  title: I18nText;
  desc: I18nText;
};

/** 演示聊天消息 */
export type ChatMessage = {
  role: "user" | "ai";
  text: I18nText;
};

/** 演示聊天会话 */
export type ChatSession = {
  id: string;
  name: I18nText;
  model: string;
  messages: ChatMessage[];
};

/** 移动端亮点 */
export type MobileHighlight = {
  id: string;
  icon: string;
  title: I18nText;
  desc: I18nText;
};

/** 法律链接 */
export type LegalLink = {
  label: I18nText;
  url: string;
};

/** 法律链接分组 */
export type LegalGroup = {
  category: I18nText;
  links: LegalLink[];
};
