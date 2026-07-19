// ── 聊天逻辑 Hook ──
// 管理消息列表、发送消息、加载状态
// 从 Demo 页面中抽离出来，职责单一

import { useState, useRef, useCallback, useEffect } from "react";
import { pick } from "@/store/i18n";
import { demoEmptyReply, demoErrorPrefix, demoUnknownError } from "@/content";
import type { Message, ProviderConfig } from "./types";

// ── 类型 ──

export interface ChatConfig {
  apiKey: string;
  provider: ProviderConfig;
  modelId: string;
  maxTokens: number;
  contextLimit: number;
  systemPrompt: string;
}

// ── Hook ──

export function useChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 用 ref 保持对最新消息的同步引用，避免闭包过期问题
  const messagesRef = useRef<Message[]>(initialMessages);

  const updateMessages = useCallback(
    (updater: Message[] | ((prev: Message[]) => Message[])) => {
      setMessages((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (prev: Message[]) => Message[])(prev)
            : updater;
        messagesRef.current = next;
        return next;
      });
    },
    []
  );

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /** 发送消息 */
  const send = useCallback(
    async (text: string, config: ChatConfig) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      if (!config.apiKey.trim()) return;

      const userMsg: Message = { role: "user", content: trimmed };

      // 同步更新消息列表（通过 ref 确保 API 调用时拿到最新数据）
      const updatedMessages = [...messagesRef.current, userMsg];
      updateMessages(updatedMessages);
      setLoading(true);

      // 构建 API 消息列表
      const apiMessages: { role: string; content: string }[] = [];
      if (config.systemPrompt) {
        apiMessages.push({ role: "system", content: config.systemPrompt });
      }
      // 取最近 N 轮对话（每轮 = user + assistant，共 2 条）
      const contextMessages = updatedMessages.slice(
        -(config.contextLimit * 2)
      );
      apiMessages.push(
        ...contextMessages.map((m) => ({ role: m.role, content: m.content }))
      );

      try {
        const res = await fetch(config.provider.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: config.modelId,
            messages: apiMessages,
            max_tokens: config.maxTokens,
            stream: false,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`(${res.status}) ${err.slice(0, 200)}`);
        }

        const data = await res.json();
        const reply =
          data.choices?.[0]?.message?.content ?? pick(demoEmptyReply);

        updateMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply },
        ]);
      } catch (e: unknown) {
        updateMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `${pick(demoErrorPrefix)}${e instanceof Error ? e.message : pick(demoUnknownError)}`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, updateMessages]
  );

  const roundCount = messages.filter((m) => m.role === "user").length;

  return {
    messages,
    setMessages: updateMessages,
    loading,
    send,
    chatEndRef,
    roundCount,
  };
}
