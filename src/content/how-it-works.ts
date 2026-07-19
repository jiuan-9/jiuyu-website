import type { I18nText } from "./types";

/** 快速上手区 eyebrow */
export const howItWorksBadge: I18nText = {
  zh: "How It Works",
  en: "How It Works",
};

/** 快速上手区标题 */
export const howItWorksSectionTitle: I18nText = {
  zh: "快速上手",
  en: "Get Started",
};

/** 快速上手区副标题 */
export const howItWorksSectionSubtitle: I18nText = {
  zh: "简单易用，无需复杂配置，上手只需几分钟",
  en: "Simple and easy — no complex setup. Get going in minutes.",
};

/** 步骤 */
export interface Step {
  icon: string;
  title: I18nText;
  description: I18nText;
  gradient: string;
}

export const howItWorksSteps: Step[] = [
  {
    icon: "Download",
    title: { zh: "下载安装", en: "Download" },
    description: {
      zh: "下载 Quiddity 桌面客户端，无需安装，解压即可运行",
      en: "Download the Quiddity desktop client. No installation needed — just extract and run.",
    },
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: "Settings",
    title: { zh: "配置 API", en: "Configure API" },
    description: {
      zh: "在设置中添加你的 AI API Key，支持 11+ 家服务商",
      en: "Add your AI API key in settings. Supports 11+ providers.",
    },
    gradient: "from-purple-500/20 to-pink-500/10",
  },
  {
    icon: "MessageSquare",
    title: { zh: "开始对话", en: "Start Chatting" },
    description: {
      zh: "选择模型和人设，开始与 AI 进行智能对话",
      en: "Choose a model and persona, then start an intelligent conversation.",
    },
    gradient: "from-green-500/20 to-emerald-500/10",
  },
  {
    icon: "Zap",
    title: { zh: "享受体验", en: "Enjoy" },
    description: {
      zh: "支持图片上传、代码高亮、多会话管理等高级功能",
      en: "Enjoy image uploads, code highlighting, multi-session management, and more.",
    },
    gradient: "from-orange-500/20 to-yellow-500/10",
  },
];
