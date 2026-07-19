import type { Feature, Highlight, I18nText } from "./types";

/** 功能区 eyebrow */
export const featuresBadge: I18nText = {
  zh: "Features",
  en: "Features",
};

/** 核心功能特性（6 项） */
export const features: Feature[] = [
  {
    id: "multi-model",
    icon: "Layers",
    title: {
      zh: "多模型聚合",
      en: "Multi-Model Aggregation",
    },
    desc: {
      zh: "一个客户端接入 DeepSeek、Kimi、Qwen、豆包等所有主流大模型，无需切换应用。",
      en: "Access DeepSeek, Kimi, Qwen, Doubao and all mainstream LLMs in one client — no app switching.",
    },
  },
  {
    id: "privacy",
    icon: "ShieldCheck",
    title: {
      zh: "本地优先 · 隐私至上",
      en: "Local-First · Privacy-First",
    },
    desc: {
      zh: "对话数据存储在本地，系统级加密保护，密钥永远不离开你的设备。",
      en: "All conversations stored locally with system-level encryption — keys never leave your device.",
    },
  },
  {
    id: "sessions",
    icon: "MessageSquare",
    title: {
      zh: "无限会话 · 永久保留",
      en: "Unlimited Sessions · Forever",
    },
    desc: {
      zh: "无会话数量限制，无消息长度限制。所有对话永久保留，可随时检索回顾。",
      en: "No session limits, no message length limits. All conversations preserved forever, searchable anytime.",
    },
  },
  {
    id: "fluency",
    icon: "Zap",
    title: {
      zh: "流畅至上 · 极致体验",
      en: "Fluency-First · Ultimate UX",
    },
    desc: {
      zh: "60fps 流畅动画、GPU 加速渲染、即时响应交互。每一帧都为体验而生。",
      en: "60fps animations, GPU-accelerated rendering, instant interactions. Every frame crafted for experience.",
    },
  },
  {
    id: "encryption",
    icon: "Lock",
    title: {
      zh: "系统级加密",
      en: "System-Level Encryption",
    },
    desc: {
      zh: "采用操作系统原生密钥链（Windows DPAPI / macOS Keychain）保护 API Key，安全等级拉满。",
      en: "Protects API Keys with native OS keychains (Windows DPAPI / macOS Keychain) — top-tier security.",
    },
  },
  {
    id: "skills",
    icon: "Wrench",
    title: {
      zh: "强大 Skill 库",
      en: "Powerful Skills",
    },
    desc: {
      zh: "内置代码审查、文档生成、Markdown 渲染等专业 Skills，开箱即用、可扩展。",
      en: "Built-in code review, doc generation, Markdown rendering — works out of the box, fully extensible.",
    },
  },
];

/** 高亮徽章（4 项） */
export const highlights: Highlight[] = [
  {
    id: "free",
    icon: "Gift",
    label: { zh: "完全免费", en: "Completely Free" },
  },
  {
    id: "no-login",
    icon: "UserX",
    label: { zh: "无需注册", en: "No Sign-up" },
  },
  {
    id: "open-source",
    icon: "Github",
    label: { zh: "开源透明", en: "Open Source" },
  },
  {
    id: "offline",
    icon: "WifiOff",
    label: { zh: "离线可用", en: "Offline Ready" },
  },
];

/** 功能区标题 */
export const featuresSectionTitle = {
  zh: "为效率而生的 AI 工具",
  en: "An AI Tool Built for Productivity",
};

export const featuresSectionSubtitle = {
  zh: "集多模型、隐私、流畅于一身，重新定义桌面 AI 体验",
  en: "Multi-model, private, and fluid — redefining desktop AI",
};
