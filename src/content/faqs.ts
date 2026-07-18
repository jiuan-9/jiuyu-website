import type { Faq } from "./types";

/**
 * 常见问题（5 项）
 * 注意：
 * 1. 版本号不再硬编码，统一从 public/version.json 通过 useVersion hook 读取
 * 2. "AES 加密" 已修正为 "系统级加密"（Windows DPAPI / macOS Keychain）
 */
export const faqs: Faq[] = [
  {
    id: "what-is-quiddity",
    question: {
      zh: "Quiddity 是什么？",
      en: "What is Quiddity?",
    },
    answer: {
      zh: "Quiddity 是一款多模型 AI 桌面应用，聚合 DeepSeek、Kimi、Qwen、豆包等主流大模型。本地优先、隐私至上，所有对话数据存储在本地，无需注册、完全免费。",
      en: "Quiddity is a multi-model AI desktop app aggregating mainstream LLMs like DeepSeek, Kimi, Qwen, and Doubao. Local-first, privacy-first — all conversations stored locally, no sign-up, completely free.",
    },
  },
  {
    id: "privacy",
    question: {
      zh: "我的对话数据会被上传吗？",
      en: "Will my conversations be uploaded?",
    },
    answer: {
      zh: "不会。Quiddity 采用本地优先架构，所有对话数据存储在你的设备本地。API Key 通过系统级加密（Windows DPAPI / macOS Keychain）保护，密钥永不离开设备。消息仅在调用模型时发送给对应 API，且不会被我们存储。",
      en: "No. Quiddity uses a local-first architecture — all conversations stay on your device. API Keys are protected by system-level encryption (Windows DPAPI / macOS Keychain) and never leave the device. Messages are only sent to the LLM API when invoked, and never stored by us.",
    },
  },
  {
    id: "free",
    question: {
      zh: "Quiddity 真的完全免费吗？",
      en: "Is Quiddity really free?",
    },
    answer: {
      zh: "是的，Quiddity 完全免费，没有任何付费功能或订阅。我们不作商业变现，目标是做出好用的 AI 工具。调用大模型 API 产生的费用由对应服务商收取，与 Quiddity 无关。",
      en: "Yes, Quiddity is completely free with no paid features or subscriptions. We don't monetize — our goal is to build a great AI tool. LLM API usage fees are charged by the respective providers, unrelated to Quiddity.",
    },
  },
  {
    id: "version",
    question: {
      zh: "现在是什么版本？",
      en: "What's the current version?",
    },
    answer: {
      zh: "Quiddity 当前版本通过 public/version.json 动态读取，确保网站显示的版本号与 GitHub Release 始终一致。具体版本号请查看首页或下载页。",
      en: "The current Quiddity version is read dynamically from public/version.json, ensuring the website always matches the GitHub Release. Check the homepage or download page for the exact version.",
    },
  },
  {
    id: "platforms",
    question: {
      zh: "支持哪些平台？",
      en: "Which platforms are supported?",
    },
    answer: {
      zh: "目前提供 Windows 便携版（.exe），可直接运行无需安装。macOS 与 Linux 版本正在规划中，敬请期待。下载地址会随 GitHub Release 同步更新。",
      en: "Currently we provide a Windows portable (.exe) that runs without installation. macOS and Linux versions are in planning. Download URLs sync automatically with GitHub Releases.",
    },
  },
];

/** FAQ 区标题 */
export const faqSectionTitle = {
  zh: "常见问题",
  en: "FAQ",
};

export const faqSectionSubtitle = {
  zh: "还有疑问？这里或许有答案",
  en: "Have questions? Find answers here",
};
