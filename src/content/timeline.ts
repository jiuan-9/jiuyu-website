import type { I18nText } from "./types";

/** 页面标题 */
export const timelineTitle: I18nText = {
  zh: "版本历程",
  en: "Changelog",
};

/** 页面副标题 */
export const timelineSubtitle: I18nText = {
  zh: "记录Quiddity从诞生到进化的每一步",
  en: "Every step of Quiddity's journey from birth to evolution",
};

/** 返回首页 aria-label */
export const timelineBackHomeLabel: I18nText = {
  zh: "返回首页",
  en: "Back to Home",
};

/** 单个里程碑亮点 */
export interface TimelineHighlight {
  icon: string;
  text: I18nText;
}

/** 单个里程碑 */
export interface TimelineMilestone {
  version: string;
  date: string;
  label: I18nText;
  description: I18nText;
  highlights: TimelineHighlight[];
  color: "blue" | "purple";
}

export const timelineMilestones: TimelineMilestone[] = [
  {
    version: "v1.0.0",
    date: "2026.07.08",
    label: { zh: "正式启航", en: "Official Launch" },
    description: {
      zh: "Quiddity 1.0.0 官网正式部署上线，同步开放安装包下载。首版即带来 AI 人设精调引擎，支持十一家国内主流 AI 服务商、62 款大语言模型。",
      en: "Quiddity 1.0.0 official website deployed and downloads opened. The first release brings the AI persona tuning engine, supporting 11 mainstream domestic AI providers and 62 large language models.",
    },
    highlights: [
      { icon: "Globe", text: { zh: "官网上线 & 开放下载", en: "Website Live & Downloads Open" } },
      { icon: "Palette", text: { zh: "AI 人设精调引擎", en: "AI Persona Tuning Engine" } },
      { icon: "Layers", text: { zh: "11 家 AI 服务商", en: "11 AI Providers" } },
    ],
    color: "blue",
  },
  {
    version: "v1.1.0",
    date: "2026.07.09",
    label: { zh: "能力跃升", en: "Capability Leap" },
    description: {
      zh: "新增代码高亮显示、Agent 能力接口预留、自动更新检测，大幅提升开发体验与产品可持续性。",
      en: "Added code highlighting, Agent capability interfaces, and automatic update detection, greatly improving developer experience and product sustainability.",
    },
    highlights: [
      { icon: "Code", text: { zh: "代码高亮显示", en: "Code Highlighting" } },
      { icon: "Zap", text: { zh: "Agent 能力预留", en: "Agent Capabilities Reserved" } },
      { icon: "Shield", text: { zh: "自动更新检测", en: "Auto Update Detection" } },
    ],
    color: "purple",
  },
];

/** 统计条 */
export interface TimelineStat {
  value: string;
  label: I18nText;
}

export const timelineStats: TimelineStat[] = [
  { value: "{count}", label: { zh: "版本发布", en: "Releases" } },
  { value: "6", label: { zh: "核心功能", en: "Core Features" } },
  { value: "11", label: { zh: "AI 服务商", en: "AI Providers" } },
  { value: "62", label: { zh: "大语言模型", en: "LLMs" } },
];