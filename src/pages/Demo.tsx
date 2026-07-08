import { useState, useRef, useEffect } from "react";
import {
  Send, Settings, Key, X, Menu, ArrowLeft, Zap,
  User, Sparkles, FileText, MapPin,
  ToggleLeft, ToggleRight, ChevronDown,
} from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// ─── Providers ───
const PROVIDERS = [
  {
    id: "deepseek", label: "深度求索",
    url: "https://api.deepseek.com/chat/completions",
    models: [{ id: "deepseek-chat", label: "DeepSeek-V3" }, { id: "deepseek-reasoner", label: "DeepSeek-R1" }],
    keyPlaceholder: "sk-...",
  },
  {
    id: "qwen", label: "阿里云（通义千问）",
    url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    models: [{ id: "qwen-turbo", label: "Qwen-Turbo" }, { id: "qwen-plus", label: "Qwen-Plus" }, { id: "qwen-max", label: "Qwen-Max" }],
    keyPlaceholder: "sk-...",
  },
  {
    id: "siliconflow", label: "硅基流动",
    url: "https://api.siliconflow.cn/v1/chat/completions",
    models: [{ id: "deepseek-ai/DeepSeek-V3", label: "DeepSeek-V3" }, { id: "deepseek-ai/DeepSeek-R1", label: "DeepSeek-R1" }, { id: "Qwen/Qwen2.5-7B-Instruct", label: "Qwen2.5-7B" }],
    keyPlaceholder: "sk-...",
  },
];

// ─── Shared styles ───
const inputClass =
  "w-full bg-dark-800/90 border border-white/[0.10] rounded-lg px-3 py-2 text-xs text-dark-100 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 placeholder:text-dark-500 transition-all duration-200";
const selectClass =
  "w-full bg-dark-800/90 border border-white/[0.10] rounded-lg px-3 py-2 text-xs text-dark-100 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 appearance-none cursor-pointer transition-all duration-200";
const labelClass = "text-[10px] text-dark-300 font-medium";
const hintClass = "text-[9px] text-dark-500 mt-0.5";

// ─── Collapsible section card ───
function CollapsibleSection({
  icon, label, defaultOpen = true, children,
}: {
  icon: React.ReactNode;
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open, children]);

  return (
    <div className="bg-dark-800/60 border border-white/[0.08] rounded-xl overflow-hidden transition-colors duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.03] transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[10px] font-semibold uppercase tracking-widest text-dark-300">{label}</span>
        </div>
        <ChevronDown
          size={12}
          className={`text-dark-400 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: height + "px" }}
      >
        <div ref={contentRef} className="px-3.5 pb-3.5 space-y-2.5 text-xs">
          {children}
        </div>
      </div>
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

// ─── System prompt builder ───
function buildSystemPrompt(
  aiName: string, aiPersona: string, aiCharacter: string,
  userName: string, userIdentity: string, scene: string,
): string {
  const parts: string[] = [];
  parts.push(aiPersona.trim() || "你是一个友好、乐于助人的AI助手。");
  if (aiName.trim()) parts.push(`你的名字是"${aiName.trim()}"。`);
  if (aiCharacter.trim()) parts.push(`你的性格特点：${aiCharacter.trim()}。`);
  const up: string[] = [];
  if (userName.trim()) up.push(`名字叫${userName.trim()}`);
  if (userIdentity.trim()) up.push(`身份是${userIdentity.trim()}`);
  if (up.length) parts.push(`正在与你对话的用户：${up.join("，")}。`);
  if (scene.trim()) parts.push(`当前场景：${scene.trim()}。`);
  return parts.join(" ");
}

export default function Demo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "你好！我是九语在线体验版。\n\n请在左侧面板配置 API Key 和参数，然后就可以开始对话了。本页面仅供体验，不代表真实应用的完整功能。" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [providerIdx, setProviderIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [contextLimit, setContextLimit] = useState(10);
  const [aiName, setAiName] = useState("小九");
  const [aiPersona, setAiPersona] = useState("你是一个友好、乐于助人的AI助手。");
  const [aiCharacter, setAiCharacter] = useState("温柔、耐心、善解人意，说话亲切自然。");
  const [compileEnabled, setCompileEnabled] = useState(true);
  const [userName, setUserName] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [scene, setScene] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const provider = PROVIDERS[providerIdx];
  const roundCount = messages.filter((m) => m.role === "user").length;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!apiKey.trim()) { setSidebarOpen(true); return; }
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const systemText = compileEnabled ? buildSystemPrompt(aiName, aiPersona, aiCharacter, userName, userIdentity, scene) : "";
    const apiMessages: { role: string; content: string }[] = [];
    if (systemText) apiMessages.push({ role: "system", content: systemText });
    setMessages((prev) => {
      const recent = prev.slice(-(contextLimit * 2));
      apiMessages.push(...recent.map((m) => ({ role: m.role, content: m.content })));
      return prev;
    });
    try {
      const res = await fetch(provider.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
        body: JSON.stringify({ model: provider.models[modelIdx].id, messages: apiMessages, max_tokens: maxTokens, stream: false }),
      });
      if (!res.ok) { const err = await res.text(); throw new Error(`(${res.status}) ${err.slice(0, 200)}`); }
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.choices?.[0]?.message?.content ?? "（未收到回复）" }]);
    } catch (e: unknown) {
      setMessages((prev) => [...prev, { role: "assistant", content: `出错了：${e instanceof Error ? e.message : "未知错误"}` }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  // ─── Sidebar ───
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Settings size={13} className="text-dark-300" />
          <span className="text-xs font-medium text-dark-200">会话设置</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="w-6 h-6 rounded flex items-center justify-center text-dark-400 hover:text-dark-100 hover:bg-white/[0.06] transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs sidebar-scroll">
        {/* ─── 当前会话 ─── */}
        <CollapsibleSection icon={<FileText size={12} className="text-brand-400" />} label="当前会话">
          <div className="flex gap-3">
            <div className="flex-1 bg-dark-900/60 border border-white/[0.05] rounded-lg px-3 py-2 text-center">
              <div className="text-[10px] text-dark-400">对话轮数</div>
              <div className="text-sm font-bold text-dark-100">{roundCount}</div>
            </div>
            <div className="flex-1 bg-dark-900/60 border border-white/[0.05] rounded-lg px-3 py-2 text-center">
              <div className="text-[10px] text-dark-400">上下文</div>
              <div className="text-sm font-bold text-dark-100">{contextLimit} 条</div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ─── API 设置 ─── */}
        <CollapsibleSection icon={<Key size={12} className="text-brand-400" />} label="API 设置">
          <div className="space-y-1">
            <label className={labelClass}>服务商</label>
            <select value={providerIdx} onChange={(e) => { setProviderIdx(Number(e.target.value)); setModelIdx(0); }} className={selectClass}>
              {PROVIDERS.map((p, i) => (<option key={p.id} value={i}>{p.label}</option>))}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>模型</label>
            <select value={modelIdx} onChange={(e) => setModelIdx(Number(e.target.value))} className={selectClass}>
              {provider.models.map((m, i) => (<option key={m.id} value={i}>{m.label}</option>))}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>API Key</label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={provider.keyPlaceholder} className={inputClass} />
            <p className={hintClass}>仅存浏览器内存，关闭即清除</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className={labelClass}>回复长度上限</label>
              <input type="number" min={64} max={8192} step={64} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} className={inputClass} />
            </div>
            <div className="flex-1 space-y-1">
              <label className={labelClass}>上下文（条）</label>
              <input type="number" min={1} max={50} value={contextLimit} onChange={(e) => setContextLimit(Number(e.target.value))} className={inputClass} />
            </div>
          </div>
        </CollapsibleSection>

        {/* ─── AI 设定 ─── */}
        <CollapsibleSection icon={<Sparkles size={12} className="text-brand-400" />} label="AI 设定">
          <div className="flex items-center justify-between py-0.5">
            <span className="text-[10px] text-dark-300">精调人设</span>
            <button onClick={() => setCompileEnabled(!compileEnabled)} className="transition-all duration-150 hover:scale-110 active:scale-95">
              <span className="transition-all duration-200">
                {compileEnabled ? <ToggleRight size={18} className="text-brand-500" /> : <ToggleLeft size={18} className="text-dark-400" />}
              </span>
            </button>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>AI 名字</label>
            <input type="text" value={aiName} onChange={(e) => setAiName(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>人设（身份背景）</label>
            <textarea rows={2} value={aiPersona} onChange={(e) => setAiPersona(e.target.value)} className={`${inputClass} resize-none`} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>性格（说话方式）</label>
            <input type="text" value={aiCharacter} onChange={(e) => setAiCharacter(e.target.value)} className={inputClass} />
          </div>
        </CollapsibleSection>

        {/* ─── 用户设定 ─── */}
        <CollapsibleSection icon={<User size={12} className="text-brand-400" />} label="用户设定">
          <div className="space-y-1">
            <label className={labelClass}>你的名字</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="选填" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>你的身份</label>
            <input type="text" value={userIdentity} onChange={(e) => setUserIdentity(e.target.value)} placeholder="选填" className={inputClass} />
          </div>
        </CollapsibleSection>

        {/* ─── 场景设定 ─── */}
        <CollapsibleSection icon={<MapPin size={12} className="text-brand-400" />} label="场景设定">
          <div className="space-y-1">
            <label className={labelClass}>当前场景</label>
            <input type="text" value={scene} onChange={(e) => setScene(e.target.value)} placeholder="例如：咖啡厅、办公室、户外…" className={inputClass} />
          </div>
        </CollapsibleSection>
      </div>

      <div className="px-4 py-2.5 border-t border-white/[0.06]">
        <p className="text-[9px] text-dark-500 leading-relaxed">
          以下设置仅对当前会话生效。此页面为在线 Demo，绝不代表真实应用的完整体验。
        </p>
      </div>
    </>
  );

  return (
    <div className="h-screen demo-fullscreen flex flex-col bg-dark-950 text-dark-200 overflow-hidden">
      {/* ─── Title bar ─── */}
      <div className="h-11 flex items-center justify-between px-3 bg-dark-900/90 border-b border-white/[0.06] select-none shrink-0">
        <div className="flex items-center gap-3">
          <a href="#/" className="text-dark-400 hover:text-dark-200 transition-colors" title="返回首页"><ArrowLeft size={16} /></a>
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-brand-400" />
            <span className="text-[11px] font-medium text-dark-200">九语 · 在线体验</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-dark-400 hidden sm:inline">{provider.label} · {provider.models[modelIdx].label}</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-7 h-7 rounded-md flex items-center justify-center text-dark-400 hover:text-dark-200 hover:bg-white/[0.06] transition-colors">
            <Menu size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop sidebar */}
        <div className={`hidden md:flex ${sidebarOpen ? "w-[312px]" : "w-0"} shrink-0 border-r border-white/[0.06] bg-dark-900/60 flex-col transition-[width] duration-300 overflow-hidden`}>
          {sidebarContent}
        </div>

        {/* Mobile sidebar overlay */}
        <div className="md:hidden">
          <div
            className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] z-50 bg-dark-950 flex flex-col border-r border-white/[0.06] transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {sidebarContent}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 bg-dark-950">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 chat-scroll">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 sm:gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">九</div>
                )}
                <div className={`p-3 sm:p-3.5 rounded-2xl text-sm leading-relaxed max-w-[88%] sm:max-w-[85%] whitespace-pre-wrap break-words ${msg.role === "user" ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/15 text-dark-100" : "rounded-tl-sm bg-dark-900/70 border border-white/[0.05] text-dark-200"}`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">你</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">九</div>
                <div className="p-3 sm:p-3.5 rounded-2xl rounded-tl-sm bg-dark-900/70 border border-white/[0.05]">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-3 sm:px-6 py-3 border-t border-white/[0.06] bg-dark-900/50 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 max-w-3xl mx-auto">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-400 hover:text-dark-200 hover:bg-white/[0.06] transition-colors shrink-0" title="会话设置">
                <Settings size={15} />
              </button>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={loading}
                placeholder={apiKey ? "输入消息，Enter 发送…" : "请先在左侧设置 API Key"}
                className="flex-1 bg-transparent text-sm text-dark-100 placeholder-dark-500 outline-none disabled:opacity-40 py-1.5" />
              <button onClick={send} disabled={loading || !input.trim()} className="w-8 h-8 rounded-lg bg-brand-500/25 hover:bg-brand-500/40 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
                <Send size={15} className="text-brand-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
