import { useState, useRef, useEffect } from "react";
import {
  Send,
  Settings,
  Key,
  Hash,
  X,
  Menu,
  ArrowLeft,
  Zap,
  User,
  Sparkles,
  FileText,
  MapPin,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// ─── Service provider configuration ───
const PROVIDERS = [
  {
    id: "deepseek",
    label: "深度求索",
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
    label: "阿里云（通义千问）",
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

// ─── Section header ───
function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size: number }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 pt-3 pb-1.5 border-t border-white/[0.04]">
      <Icon size={11} className="text-brand-400/70" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-dark-400">
        {label}
      </span>
    </div>
  );
}

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

// ─── Build system prompt from persona fields ───
function buildSystemPrompt(
  aiName: string,
  aiPersona: string,
  aiCharacter: string,
  userName: string,
  userIdentity: string,
  scene: string,
): string {
  const parts: string[] = [];

  const persona = aiPersona.trim() || "你是一个友好、乐于助人的AI助手。";
  parts.push(persona);

  if (aiName.trim()) {
    parts.push(`你的名字是"${aiName.trim()}"。`);
  }
  if (aiCharacter.trim()) {
    parts.push(`你的性格特点：${aiCharacter.trim()}。`);
  }

  // User info
  const userParts: string[] = [];
  if (userName.trim()) userParts.push(`名字叫${userName.trim()}`);
  if (userIdentity.trim()) userParts.push(`身份是${userIdentity.trim()}`);
  if (userParts.length) {
    parts.push(`正在与你对话的用户：${userParts.join("，")}。`);
  }

  // Scene
  if (scene.trim()) {
    parts.push(`当前场景：${scene.trim()}。`);
  }

  return parts.join(" ");
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

  // ─── API 设置 ───
  const [apiKey, setApiKey] = useState("");
  const [providerIdx, setProviderIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [contextLimit, setContextLimit] = useState(10);

  // ─── AI 设定 ───
  const [aiName, setAiName] = useState("小九");
  const [aiPersona, setAiPersona] = useState("你是一个友好、乐于助人的AI助手。");
  const [aiCharacter, setAiCharacter] = useState("温柔、耐心、善解人意，说话亲切自然。");
  const [compileEnabled, setCompileEnabled] = useState(true);

  // ─── 用户设定 ───
  const [userName, setUserName] = useState("");
  const [userIdentity, setUserIdentity] = useState("");

  // ─── 场景设定 ───
  const [scene, setScene] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const provider = PROVIDERS[providerIdx];

  // Stats
  const roundCount = Math.floor(
    messages.filter((m) => m.role === "user").length,
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!apiKey.trim()) {
      setSidebarOpen(true);
      return;
    }

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Build the full message list with system prompt
    const systemText = compileEnabled
      ? buildSystemPrompt(aiName, aiPersona, aiCharacter, userName, userIdentity, scene)
      : "";
    const apiMessages: { role: string; content: string }[] = [];

    if (systemText) {
      apiMessages.push({ role: "system", content: systemText });
    }

    setMessages((prev) => {
      const recent = prev.slice(-(contextLimit * 2)); // *2 because user+assistant pairs
      apiMessages.push(...recent.map((m) => ({ role: m.role, content: m.content })));
      return prev;
    });

    try {
      const res = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: provider.models[modelIdx].id,
          messages: apiMessages,
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
          <a href="#/" className="text-dark-500 hover:text-dark-300 transition-colors" title="返回首页">
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
        {/* ─── Settings sidebar ─── */}
        <div
          className={`${
            sidebarOpen ? "w-[280px] sm:w-[312px]" : "w-0"
          } shrink-0 border-r border-white/[0.04] bg-dark-900/50 flex flex-col transition-[width] duration-300 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Settings size={13} className="text-dark-400" />
              <span className="text-xs font-medium text-dark-300">会话设置</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-5 h-5 rounded flex items-center justify-center text-dark-500 hover:text-dark-200 hover:bg-white/[0.04] transition-colors sm:hidden"
            >
              <X size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
            {/* ─── 当前会话统计 ─── */}
            <SectionHeader icon={FileText} label="当前会话" />
            <div className="flex gap-4 py-1.5">
              <div className="flex-1 bg-dark-800/60 rounded-lg px-3 py-2 text-center">
                <div className="text-[10px] text-dark-500">对话轮数</div>
                <div className="text-sm font-semibold text-dark-200">{roundCount}</div>
              </div>
              <div className="flex-1 bg-dark-800/60 rounded-lg px-3 py-2 text-center">
                <div className="text-[10px] text-dark-500">上下文长度</div>
                <div className="text-sm font-semibold text-dark-200">
                  {contextLimit} 条
                </div>
              </div>
            </div>

            {/* ─── API 设置 ─── */}
            <SectionHeader icon={Key} label="API 设置" />

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">服务商</label>
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
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">模型</label>
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

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider.keyPlaceholder}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
              />
              <p className="text-[9px] text-dark-600">仅存浏览器内存，关闭即清除</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] text-dark-500 flex items-center gap-1">
                  <Hash size={9} />
                  回复长度上限
                </label>
                <input
                  type="number"
                  min={64}
                  max={8192}
                  step={64}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-2.5 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] text-dark-500">记住上下文（条）</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={contextLimit}
                  onChange={(e) => setContextLimit(Number(e.target.value))}
                  className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-2.5 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30"
                />
              </div>
            </div>

            {/* ─── AI 设定 ─── */}
            <SectionHeader icon={Sparkles} label="AI 设定" />

            <div className="flex items-center justify-between py-1">
              <span className="text-[10px] text-dark-400">精调人设</span>
              <button
                onClick={() => setCompileEnabled(!compileEnabled)}
                className="text-dark-500 hover:text-brand-400 transition-colors"
              >
                {compileEnabled ? <ToggleRight size={18} className="text-brand-500" /> : <ToggleLeft size={18} />}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">AI 名字</label>
              <input
                type="text"
                value={aiName}
                onChange={(e) => setAiName(e.target.value)}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">人设（身份背景）</label>
              <textarea
                rows={2}
                value={aiPersona}
                onChange={(e) => setAiPersona(e.target.value)}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 resize-none placeholder:text-dark-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">性格（说话方式）</label>
              <input
                type="text"
                value={aiCharacter}
                onChange={(e) => setAiCharacter(e.target.value)}
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
              />
            </div>

            {/* ─── 用户设定 ─── */}
            <SectionHeader icon={User} label="用户设定" />

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">你的名字</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="选填"
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">你的身份</label>
              <input
                type="text"
                value={userIdentity}
                onChange={(e) => setUserIdentity(e.target.value)}
                placeholder="选填"
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
              />
            </div>

            {/* ─── 场景设定 ─── */}
            <SectionHeader icon={MapPin} label="场景设定" />

            <div className="space-y-1.5">
              <label className="text-[10px] text-dark-500">当前场景</label>
              <input
                type="text"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
                placeholder="例如：咖啡厅、办公室、户外…"
                className="w-full bg-dark-800 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-dark-200 outline-none focus:border-brand-500/30 placeholder:text-dark-600"
              />
            </div>
          </div>

          <div className="px-4 py-2.5 border-t border-white/[0.04]">
            <p className="text-[9px] text-dark-600 leading-relaxed">
              * 以下设置仅对当前会话生效。此页面为在线 Demo，绝不代表真实应用的完整体验。
            </p>
          </div>
        </div>

        {/* ─── Chat area ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-dark-950">
          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
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
                title="会话设置"
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
