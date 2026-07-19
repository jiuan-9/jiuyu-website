import type { I18nText } from "./types";

/** Demo 页面标题 */
export const demoPageTitle: I18nText = {
  zh: "Quiddity桌面端 · 在线体验",
  en: "Quiddity Desktop · Online Demo",
};

/** 返回首页 tooltip / aria-label */
export const demoBackHomeLabel: I18nText = {
  zh: "返回首页",
  en: "Back to Home",
};

/** 会话设置 */
export const demoSessionSettingsLabel: I18nText = {
  zh: "会话设置",
  en: "Session Settings",
};

/** 折叠面板标签 */
export const demoCollapsibleLabels = {
  currentSession: { zh: "当前会话", en: "Current Session" } as I18nText,
  apiSettings: { zh: "API 设置", en: "API Settings" } as I18nText,
  aiSettings: { zh: "AI 设定", en: "AI Settings" } as I18nText,
  userSettings: { zh: "用户设定", en: "User Settings" } as I18nText,
  sceneSettings: { zh: "场景设定", en: "Scene Settings" } as I18nText,
};

/** 当前会话卡片 */
export const demoRoundCountLabel: I18nText = {
  zh: "对话轮数",
  en: "Rounds",
};

export const demoContextLimitLabel: I18nText = {
  zh: "上下文",
  en: "Context",
};

export const demoContextUnit: I18nText = {
  zh: "条",
  en: "messages",
};

/** API 设置标签 */
export const demoProviderLabel: I18nText = {
  zh: "服务商",
  en: "Provider",
};

export const demoModelLabel: I18nText = {
  zh: "模型",
  en: "Model",
};

export const demoApiKeyLabel: I18nText = {
  zh: "API Key",
  en: "API Key",
};

export const demoApiKeyHint: I18nText = {
  zh: "仅存浏览器内存，关闭即清除",
  en: "Stored only in browser memory, cleared on close",
};

export const demoMaxTokensLabel: I18nText = {
  zh: "回复长度上限",
  en: "Max Tokens",
};

export const demoContextInputLabel: I18nText = {
  zh: "上下文（条）",
  en: "Context (messages)",
};

/** AI 设定标签 */
export const demoCharacterTuningLabel: I18nText = {
  zh: "精调人设",
  en: "Character Tuning",
};

export const demoAiNameLabel: I18nText = {
  zh: "AI 名字",
  en: "AI Name",
};

export const demoAiPersonaLabel: I18nText = {
  zh: "人设（身份背景）",
  en: "Persona (Identity Background)",
};

export const demoAiCharacterLabel: I18nText = {
  zh: "性格（说话方式）",
  en: "Character (Way of Speaking)",
};

/** 用户设定标签 */
export const demoUserNameLabel: I18nText = {
  zh: "你的名字",
  en: "Your Name",
};

export const demoUserIdentityLabel: I18nText = {
  zh: "你的身份",
  en: "Your Identity",
};

export const demoOptionalPlaceholder: I18nText = {
  zh: "选填",
  en: "Optional",
};

/** 场景设定标签 */
export const demoSceneLabel: I18nText = {
  zh: "当前场景",
  en: "Current Scene",
};

export const demoScenePlaceholder: I18nText = {
  zh: "例如：咖啡厅、办公室、户外…",
  en: "e.g. coffee shop, office, outdoors…",
};

/** 版本信息区 */
export const demoVersionLabel: I18nText = {
  zh: "版本",
  en: "Version",
};

export const demoCheckUpdateButton: I18nText = {
  zh: "检查更新",
  en: "Check for Updates",
};

export const demoLatestVersionAlert: I18nText = {
  zh: "已是最新版 v",
  en: "Already on the latest version v",
};

export const demoCheckUpdateFailedAlert: I18nText = {
  zh: "无法检查更新，请前往Quiddity官网查看",
  en: "Unable to check for updates. Please visit the Quiddity website.",
};

export const demoFooterNote = (version: string): I18nText => ({
  zh: `Quiddity桌面端 v${version} 在线体验。此页面仅展示基础对话功能，完整功能请下载桌面端。`,
  en: `Quiddity Desktop v${version} online demo. This page only shows basic chat features; download the desktop app for the full experience.`,
});

/** 输入区占位符 */
export const demoInputPlaceholder = {
  withKey: { zh: "输入消息，Enter 发送…", en: "Type a message, Enter to send…" } as I18nText,
  noKey: { zh: "请先在左侧设置 API Key", en: "Please set your API Key in the sidebar first" } as I18nText,
};

/** 会话设置按钮 tooltip */
export const demoSessionSettingsTooltip: I18nText = {
  zh: "会话设置",
  en: "Session Settings",
};

/** 欢迎消息（含版本号变量） */
export const demoWelcomeMessage = (version: string): I18nText => ({
  zh: `你好！这是Quiddity (v${version}) 的在线体验版。\n\n请在左侧配置 API Key 和参数后开始对话。\n\n**新功能：** 代码块自动高亮、独立分框、一键复制！\n\n本页面仅展示基础聊天功能。实际桌面端还支持多会话管理、AI 人设精调等更完整的功能。`,
  en: `Hello! This is the Quiddity (v${version}) online demo.\n\nPlease configure your API Key and parameters in the sidebar to start chatting.\n\n**New features:** automatic code highlighting, standalone code blocks, one-click copy!\n\nThis page only demonstrates basic chat features. The desktop app offers more complete features like multi-session management and AI persona tuning.`,
});

/** 更新通知 */
export const updateNotificationTitle: I18nText = {
  zh: "新版本可用",
  en: "New Version Available",
};

export const updateNotificationDesc = (version: string): I18nText => ({
  zh: `Quiddity v${version} 已发布，建议更新以获取最新功能。`,
  en: `Quiddity v${version} has been released. Update to get the latest features.`,
});

export const updateNotificationButton: I18nText = {
  zh: "前往下载",
  en: "Go to Download",
};

/** 头像文字 */
export const demoAvatarLabels = {
  ai: { zh: "九", en: "Q" } as I18nText,
  user: { zh: "你", en: "U" } as I18nText,
};

/** 错误提示 */
export const demoErrorPrefix: I18nText = {
  zh: "出错了：",
  en: "Error: ",
};

export const demoUnknownError: I18nText = {
  zh: "未知错误",
  en: "Unknown error",
};

export const demoEmptyReply: I18nText = {
  zh: "（未收到回复）",
  en: "(No reply received)",
};

/** AI 默认人设占位 */
export const demoSystemPromptDefaults = {
  aiName: { zh: "小九", en: "Xiao Jiu" } as I18nText,
  aiPersona: {
    zh: "你是一个友好、乐于助人的AI助手。",
    en: "You are a friendly and helpful AI assistant.",
  } as I18nText,
  aiCharacter: {
    zh: "温柔、耐心、善解人意，说话亲切自然。",
    en: "Gentle, patient, understanding, and speaks in a friendly and natural way.",
  } as I18nText,
  userNamePlaceholder: { zh: "你的名字", en: "Your Name" } as I18nText,
  scenePlaceholder: { zh: "例如：咖啡厅、办公室、户外…", en: "e.g. coffee shop, office, outdoors…" } as I18nText,
};

/** 代码块默认语言标签 */
export const demoCodeFallbackLabel: I18nText = {
  zh: "代码",
  en: "Code",
};

/** 复制代码 tooltip */
export const demoCopyCodeTooltip: I18nText = {
  zh: "复制代码",
  en: "Copy Code",
};

/** 已复制提示 */
export const demoCopiedText: I18nText = {
  zh: "已复制",
  en: "Copied",
};

/** 复制按钮标签 */
export const demoCopyButtonLabel: I18nText = {
  zh: "复制",
  en: "Copy",
};

/** AI 服务商配置（label 使用 I18nText） */
export interface DemoProviderConfig {
  id: string;
  label: I18nText;
  url: string;
  models: { id: string; label: I18nText }[];
  keyPlaceholder: string;
}

export const demoProviders: DemoProviderConfig[] = [
  {
    id: "deepseek",
    label: { zh: "深度求索", en: "DeepSeek" },
    url: "https://api.deepseek.com/chat/completions",
    models: [
      { id: "deepseek-v4-flash", label: { zh: "DeepSeek-V4-Flash", en: "DeepSeek-V4-Flash" } },
      { id: "deepseek-v4-pro", label: { zh: "DeepSeek-V4-Pro", en: "DeepSeek-V4-Pro" } },
    ],
    keyPlaceholder: "sk-...",
  },
  {
    id: "qwen",
    label: { zh: "阿里云（通义千问）", en: "Alibaba Cloud (Qwen)" },
    url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    models: [
      { id: "qwen3.6-flash", label: { zh: "Qwen3.6-Flash", en: "Qwen3.6-Flash" } },
      { id: "qwen3.7-plus", label: { zh: "Qwen3.7-Plus", en: "Qwen3.7-Plus" } },
      { id: "qwen3.7-max", label: { zh: "Qwen3.7-Max", en: "Qwen3.7-Max" } },
    ],
    keyPlaceholder: "sk-...",
  },
  {
    id: "siliconflow",
    label: { zh: "硅基流动", en: "SiliconFlow" },
    url: "https://api.siliconflow.cn/v1/chat/completions",
    models: [
      { id: "deepseek-ai/DeepSeek-V3.2", label: { zh: "DeepSeek-V3.2", en: "DeepSeek-V3.2" } },
      { id: "deepseek-ai/DeepSeek-V4-Flash", label: { zh: "DeepSeek-V4-Flash", en: "DeepSeek-V4-Flash" } },
      { id: "Qwen/Qwen3-8B", label: { zh: "Qwen3-8B", en: "Qwen3-8B" } },
    ],
    keyPlaceholder: "sk-...",
  },
];
