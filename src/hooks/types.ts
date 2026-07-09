// ── Demo 页面共享类型 ──

/** 聊天消息 */
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/** AI 服务商配置 */
export interface ProviderConfig {
  id: string;
  label: string;
  url: string;
  models: { id: string; label: string }[];
  keyPlaceholder: string;
}
