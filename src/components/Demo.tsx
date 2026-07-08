import { useState, useRef, useEffect } from "react";
import { Send, Globe, Key, X, ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_OPTIONS = [
  {
    label: "DeepSeek (推荐)",
    url: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
    placeholder: "sk-...",
  },
  {
    label: "阿里云 · 通义千问",
    url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    model: "qwen-plus",
    placeholder: "sk-...",
  },
  {
    label: "硅基流动",
    url: "https://api.siliconflow.cn/v1/chat/completions",
    model: "deepseek-ai/DeepSeek-V3",
    placeholder: "sk-...",
  },
];

export default function Demo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "你好！我是九语在线体验版。输入你的 API Key，选一个模型，就可以开始聊天了。" },
  ]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiIndex, setApiIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!apiKey.trim()) {
      setShowConfig(true);
      return;
    }

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const api = API_OPTIONS[apiIndex];

    try {
      const res = await fetch(api.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: api.model,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          stream: false,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`API 返回错误 (${res.status}): ${err.slice(0, 200)}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "（未收到回复）";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "未知错误";
      setMessages((prev) => [...prev, { role: "assistant", content: `出错了：${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section id="demo" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Try Online
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            在线<span className="text-gradient"> 体验</span>
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm md:text-base">
            填写 API Key 即可在浏览器中体验九语的对话能力
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1}>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden glass glow-border shadow-2xl shadow-black/40">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black/20 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-brand-400" />
                  <span className="text-xs text-dark-400">九语 · 在线体验</span>
                </div>
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="flex items-center gap-1 text-[10px] text-dark-500 hover:text-dark-300 transition-colors"
                >
                  <Key size={12} />
                  API 设置
                  <ChevronDown size={10} className={`transition-transform ${showConfig ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Config panel */}
              {showConfig && (
                <div className="px-4 py-3 bg-black/10 border-b border-white/[0.03] space-y-2.5">
                  <div className="flex gap-2">
                    <select
                      value={apiIndex}
                      onChange={(e) => setApiIndex(Number(e.target.value))}
                      className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 appearance-none cursor-pointer"
                    >
                      {API_OPTIONS.map((opt, i) => (
                        <option key={i} value={i} className="bg-dark-900 text-dark-200">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={API_OPTIONS[apiIndex].placeholder}
                      className="flex-[2] bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
                    />
                  </div>
                  <p className="text-[10px] text-dark-600">
                    Key 仅保存在浏览器内存中，不会被上传或存储。关闭页面即清除。
                  </p>
                </div>
              )}

              {/* Messages */}
              <div className="h-[320px] sm:h-[400px] overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                        九
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap break-words ${
                        msg.role === "user"
                          ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-dark-100"
                          : "rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-dark-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                        你
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                      九
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.04]">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/[0.04] bg-black/10">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder="输入消息，Enter 发送…"
                    className="flex-1 bg-transparent text-sm text-dark-200 placeholder-dark-600 outline-none disabled:opacity-40"
                  />
                  <button
                    onClick={send}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={14} className="text-brand-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
