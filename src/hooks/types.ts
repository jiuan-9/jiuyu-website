// ── Demo 页面共享类型 ──

import type { I18nText } from "@/content";

/** 聊天消息 */
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/** AI 服务商配置（允许携带 id/label 供 UI 使用） */
export interface ProviderConfig {
  id?: string;
  label?: I18nText;
  url: string;
  models: { id: string; label: I18nText }[];
  keyPlaceholder: string;
}
