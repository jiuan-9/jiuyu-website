import type { I18nText } from "./types";

/** 服务商展示区 eyebrow */
export const providerShowcaseBadge: I18nText = {
  zh: "Multi-Provider",
  en: "Multi-Provider",
};

/** 服务商展示区标题 */
export const providerShowcaseSectionTitle: I18nText = {
  zh: "接入 11 家 AI 服务商",
  en: "11 AI Providers, One App",
};

/** 服务商展示区副标题 */
export const providerShowcaseSectionSubtitle: I18nText = {
  zh: "一个应用汇聚主流 AI 平台，无需反复切换，随心选择你喜欢的模型",
  en: "One app brings together mainstream AI platforms. Switch freely without juggling tools.",
};

/** 标题模板（{count} 会被替换为实际数量） */
export const providerShowcaseTitleTemplate: I18nText = {
  zh: "接入 {count} 家 AI 服务商",
  en: "{count} AI Providers, One App",
};

/** 悬停暂停提示 */
export const pauseHint: I18nText = {
  zh: "鼠标悬停暂停滚动",
  en: "Hover to pause scrolling",
};

/** 服务商列表 */
export interface Provider {
  name: I18nText;
  model: I18nText;
}

export const providers: Provider[] = [
  { name: { zh: "深度求索", en: "DeepSeek" }, model: { zh: "DeepSeek", en: "DeepSeek" } },
  { name: { zh: "阿里云", en: "Alibaba Cloud" }, model: { zh: "通义千问", en: "Qwen" } },
  { name: { zh: "硅基流动", en: "SiliconFlow" }, model: { zh: "多模型平台", en: "Multi-Model Platform" } },
  { name: { zh: "智谱", en: "Zhipu" }, model: { zh: "GLM", en: "GLM" } },
  { name: { zh: "月之暗面", en: "Moonshot" }, model: { zh: "Kimi", en: "Kimi" } },
  { name: { zh: "阶跃星辰", en: "StepFun" }, model: { zh: "Step", en: "Step" } },
  { name: { zh: "科大讯飞", en: "iFlytek" }, model: { zh: "星火", en: "Spark" } },
  { name: { zh: "MiniMax", en: "MiniMax" }, model: { zh: "海螺AI", en: "Hailuo AI" } },
  { name: { zh: "腾讯", en: "Tencent" }, model: { zh: "混元", en: "Hunyuan" } },
  { name: { zh: "字节跳动", en: "ByteDance" }, model: { zh: "豆包", en: "Doubao" } },
  { name: { zh: "百度", en: "Baidu" }, model: { zh: "文心一言", en: "Ernie Bot" } },
];