import { useState, useRef, useEffect } from "react";
import {
  Send,
  Settings,
  Key,
  Thermometer,
  Hash,
  X,
  Menu,
  ArrowLeft,
  Globe,
  Zap,
  ChevronDown,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Provider configs ───
const PROVIDERS = [
  {
    id: "deepseek",
    label: "DeepSeek",
    url: "https://api.deepseek.com/chat/completions",
    models: [
      { id: "deepseek-chat", label: "DeepSeek-V3" },
      { id: "deepseek-reasoner", label: "DeepSeek-R1" },
    ],
    keyPlaceholder: "sk-...",
    description: "通用对话 · 高性价比",
  },
  {
    id: "qwen",
    label: "通义千问",
    url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    models: [
      { id: "qwen-turbo", label: "Qwen-Turbo" },
      { id: "qwen-plus", label: "Qwen-Plus" },
      { id: "qwen-max", label: "Qwen-Max" },
    ],
    keyPlaceholder: "sk-...",
    description: "阿里云 · 中文优化",
  },
  {
    id: "siliconflow",
    label: "硅基流动",
    url: "https://api.siliconflow.cn/v1/chat/completions",
    models: [
      { id: "deepseek-ai/DeepSeek-V3", label: "DeepSeek-V3" },
      { id: "deepseek-ai/DeepSeek-R1", label: "DeepSeek-R1" },
      { id: "Qwen/Qwen2.5-7B-Instruct", label: "Qwen2.5-7B" },
    ],
    keyPlaceholder: "sk-...",
    description: "多模型聚合平台",
  },
];

// ─── Loading dots ───
function LoadingDots() {
  return (
    <div className="flex gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "120ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "240ms" }} />
    </div>
  );
}

export default function Demo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "你好！我是九语在线体验版。\n\n请在左侧面板配置 API Key 和参数，然后就可以开始对话了。本页面仅供体验，不代表真实应用的完整功能。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Settings
  const [apiKey, setApiKey] = useState("");
  const [providerIdx, setProviderIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const provider = PROVIDERS[providerIdx];

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!apiKey.trim()) {
      setSidebarOpen(true);
      return;
    }

    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: provider.models[modelIdx].id,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`(${res.status}) ${err.slice(0, 200)}`);
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
    <div className="h-screen flex flex-col bg-dark-950 text-dark-200 overflow-hidden">
      {/* ─── Title bar ─── */}
      <div className="h-11 flex items-center justify-between px-3 bg-dark-900 border-b border-white/[0.04] select-none shrink-0">
        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="text-dark-500 hover:text-dark-300 transition-colors"
            title="返回首页"
          >
            <ArrowLeft size={16} />
          </a>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-brand-400" />
            <span className="text-xs font-medium text-dark-300">九语 · 在线体验</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-dark-600 hidden sm:inline">
            {provider.label} · {provider.models[modelIdx].label}
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-dark-500 hover:text-dark-200 hover:bg-white/[0.04] transition-colors sm:hidden"
          >
            <Menu size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ─── Sidebar ─── */}
        <div
          className={`${
            sidebarOpen ? "w-[260px] sm:w-[280px]" : "w-0"
          } shrink-0 border-r border-white/[0.04] bg-dark-900/50 flex flex-col transition-[width] duration-300 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Settings size={13} className="text-dark-400" />
              <span className="text-xs font-medium text-dark-300">API 设置</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-5 h-5 rounded flex items-center justify-center text-dark-500 hover:text-dark-200 hover:bg-white/[0.04] transition-colors sm:hidden"
            >
              <X size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Provider */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-dark-500">服务商</label>
              <select
                value={providerIdx}
                onChange={(e) => {
                  setProviderIdx(Number(e.target.value));
                  setModelIdx(0);
                }}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 appearance-none cursor-pointer"
              >
                {PROVIDERS.map((p, i) => (
                  <option key={p.id} value={i}>
                    {p.label} — {p.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-dark-500">模型</label>
              <select
                value={modelIdx}
                onChange={(e) => setModelIdx(Number(e.target.value))}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 appearance-none cursor-pointer"
              >
                {provider.models.map((m, i) => (
                  <option key={m.id} value={i}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-dark-500 flex items-center gap-1.5">
                <Key size={10} />
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider.keyPlaceholder}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
              />
              <p className="text-[9px] text-dark-600 leading-relaxed">
                仅存浏览器内存，关闭即清除
              </p>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-dark-500 flex items-center gap-1.5">
                <Thermometer size={10} />
                温度 (Temperature)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="flex-1 accent-brand-500 h-1 cursor-pointer"
                />
                <span className="text-xs text-dark-300 w-8 text-right tabular-nums">{temperature.toFixed(1)}</span>
              </div>
              <p className="text-[9px] text-dark-600">越低越严谨，越高越有创造性</p>
            </div>

            {/* Max tokens */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-dark-500 flex items-center gap-1.5">
                <Hash size={10} />
                最大长度 (Tokens)
              </label>
              <input
                type="number"
                min={64}
                max={8192}
                step={64}
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30"
              />
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="px-4 py-3 border-t border-white/[0.04]">
            <p className="text-[9px] text-dark-600 leading-relaxed">
              * 此页面为在线 Demo，绝不代表真实应用的完整体验。
            </p>
          </div>
        </div>

        {/* ─── Chat area ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-dark-950">
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">
                    九
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap break-words ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-dark-100"
                      : "rounded-tl-sm bg-dark-900/60 border border-white/[0.04] text-dark-200"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">
                    你
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">
                  九
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-sm bg-dark-900/60 border border-white/[0.04]">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div className="px-4 sm:px-6 py-3 border-t border-white/[0.04] bg-dark-900/50 shrink-0">
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-500 hover:text-dark-200 hover:bg-white/[0.04] transition-colors shrink-0 hidden sm:flex"
                title="设置"
              >
                <Settings size={16} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder={apiKey ? "输入消息，Enter 发送…" : "请先在左侧设置 API Key"}
                className="flex-1 bg-transparent text-sm text-dark-200 placeholder-dark-600 outline-none disabled:opacity-40 py-1.5"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={15} className="text-brand-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
