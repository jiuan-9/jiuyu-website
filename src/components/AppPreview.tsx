import { Monitor, MessageSquare, Settings, Plus, Search, MoreVertical, Sun, Image, HelpCircle } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { parseContent, highlightCode } from "@/lib/syntax-highlight";

type MSG = { role: "user" | "ai"; text: string };

const chatData: { name: string; model: string; messages: MSG[] }[] = [
  {
    name: "编程助手",
    model: "DeepSeek-V4-Flash",
    messages: [
      { role: "user", text: "帮我写一段 Python 爬虫代码" },
      { role: "ai", text: "好的，你需要爬取什么类型的数据？网页、API 还是文件？告诉我具体需求，我帮你写完整的爬虫代码。" },
      { role: "user", text: "想爬一个新闻网站的文章标题和链接" },
      { role: "ai", text: "明白了。这里是一个使用 requests + BeautifulSoup 的示例：\n\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = \"https://example.com/news\"\nresp = requests.get(url)\nsoup = BeautifulSoup(resp.text, \"html.parser\")\n\nfor article in soup.select(\".article-title\"):\n    print(article.text.strip(), article[\"href\"])\n```\n\n需要我针对具体网站调整选择器吗？" },
    ],
  },
  {
    name: "英语学习",
    model: "GLM-4-Flash",
    messages: [
      { role: "user", text: "How do I use 'nevertheless' in a sentence?" },
      { role: "ai", text: "Great question! 'Nevertheless' means 「即便如此」/「不过」.\n\n结构：Sentence 1. Nevertheless, Sentence 2.\n\n例句：\n• It was raining heavily. Nevertheless, we went hiking.\n  → 下着大雨，尽管如此，我们还是去远足了。\n\nWant to try making your own?" },
      { role: "user", text: "I'm tired. Nevertheless, I'll finish this report." },
      { role: "ai", text: "Perfect! 用得很地道。\n\n进阶用法：也可以放在句尾——\n\"The plan had flaws. We succeeded, nevertheless.\"\n\n中文里「尽管如此」放在句尾不自然，但英语可以，这正体现了语言思维差异。" },
    ],
  },
  {
    name: "产品脑暴",
    model: "DeepSeek-V4-Flash",
    messages: [
      { role: "user", text: "我们正在做一个面向设计师的 AI 工具，帮我起几个产品名" },
      { role: "ai", text: "好的，几个方向供你参考：\n\n— 简约风：Aura · 意为「氛围」，暗示 AI 理解设计氛围\n— 专业感：PixelForge · 像素锻造，暗示精准控制\n— 诗意感：墨染 · 国风路线，水墨与 AI 的碰撞\n\n你的目标用户是中国设计师还是全球市场？" },
      { role: "user", text: "国内为主，偏好简洁好记的中文名" },
      { role: "ai", text: "那推荐这几个方向：\n\n灵感 / LingCan — 「灵感」直白，「LingCan」国际化双语\n素记 — 素描的设计术语，简洁大气\n设计力 — 直击「给设计师力量」这个卖点\n\n个人最推荐「灵感/LingCan」，中文有温度，英文可注册商标。你觉得呢？" },
    ],
  },
  {
    name: "日常闲聊",
    model: "通义千问-Flash",
    messages: [
      { role: "user", text: "推荐几部冷门但特别好看的科幻电影吧" },
      { role: "ai", text: "这几部值得一看：\n🎬 《月球》(2009) — 孤独 + 反转，一人撑起整部电影\n🎬 《降临》(2016) — 语言学与外星的哲学碰撞\n🎬 《机械姬》(2014) — 图灵测试演绎到极致\n🎬 《她》(2013) — AI 情感连接，温暖又深刻\n\n看过哪个？我按你口味再推荐" },
      { role: "user", text: "《她》看了两遍，特别喜欢" },
      { role: "ai", text: "那一定也喜欢这几部：\n🎬 《暖暖内含光》(2004) — 如果记忆可以删除…\n🎬 《龙虾》(2015) — 荒诞社会下的情感寓言\n🎬 《美丽心灵的永恒阳光》同导演的《成为约翰·马尔科维奇》也很绝\n\n这三部都不是传统科幻，但都探讨了「人为什么是人」——跟《她》的内核一致。" },
    ],
  },
];

function AppMockup() {
  const [activeChat, setActiveChat] = useState(0);
  const current = chatData[activeChat];

  return (
    <div className="w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] bg-dark-900/80 shadow-2xl shadow-black/60">
      {/* Title bar - 40px height, matches real app */}
      <div className="h-[40px] flex items-center px-2 bg-dark-900 border-b border-white/[0.05]">
        <div className="flex items-center gap-0 shrink-0">
          <button className="w-[36px] h-[36px] rounded-md flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-dark-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button className="w-[36px] h-[36px] rounded-md flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-brand-400 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[13px] font-medium text-dark-300 tracking-[0.5px]">九语</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="w-[32px] h-[32px] rounded-sm flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-dark-200 transition-colors text-[11px] font-[Segoe_MDL2_Assets]">
            &#xE921;
          </button>
          <button className="w-[32px] h-[32px] rounded-sm flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-dark-200 transition-colors text-[11px] font-[Segoe_MDL2_Assets]">
            &#xE922;
          </button>
          <button className="w-[32px] h-[32px] rounded-sm flex items-center justify-center text-dark-400 hover:bg-[#e81123] hover:text-white transition-colors text-[11px] font-[Segoe_MDL2_Assets]">
            &#xE8BB;
          </button>
        </div>
      </div>

      {/* App body */}
      <div className="flex h-[440px]">
        {/* Sidebar - 220px width */}
        <div className="w-[220px] shrink-0 border-r border-white/[0.04] bg-dark-900/60 flex flex-col">
          <div className="flex items-center gap-2 p-[10px_12px] border-b border-white/[0.04]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 px-2 py-1 rounded-sm bg-white/[0.03] text-[12px] text-dark-400">
                <Search size={11} />
                <span className="truncate">搜索会话...</span>
              </div>
            </div>
            <button className="w-[26px] h-[26px] rounded-sm border border-white/[0.08] flex items-center justify-center text-dark-500 hover:bg-white/[0.03] hover:text-dark-300 transition-colors text-[14px]">⚙</button>
            <button className="w-[26px] h-[26px] rounded-sm border border-white/[0.08] flex items-center justify-center text-dark-300 hover:bg-white/[0.03] hover:text-dark-100 transition-colors text-[16px] leading-none">+</button>
            <button className="w-[26px] h-[26px] rounded-sm flex items-center justify-center text-dark-500 hover:bg-white/[0.03] hover:text-dark-300 transition-colors text-[14px]">&laquo;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-[6px] space-y-[2px]">
            {chatData.map((chat, i) => (
              <button
                key={chat.name}
                onClick={() => setActiveChat(i)}
                className={`w-full flex items-center justify-between px-[12px] py-[10px] rounded-md text-[13px] text-left transition-all duration-200 ${
                  activeChat === i
                    ? "bg-brand-500/10 text-brand-400 font-medium"
                    : "text-dark-300 hover:bg-white/[0.03]"
                }`}
              >
                <span className="truncate flex-1">{chat.name}</span>
                <MoreVertical size={12} className="opacity-40 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-dark-950/40 min-w-0">
          {/* Chat header */}
          <div className="h-[36px] flex items-center px-[16px] border-b border-white/[0.04] shrink-0">
            <span className="text-[13px] text-dark-200 font-medium truncate">{current.name}</span>
            <span className="ml-auto text-[11px] text-dark-500 shrink-0 ml-2">{current.model}</span>
          </div>

          {/* Messages - max-width 640px centered */}
          <div className="flex-1 overflow-y-auto px-[16px] py-[20px]">
            <div className="max-w-[640px] mx-auto space-y-[8px]">
              {current.messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <span className="text-[12px] font-medium text-dark-500 mb-1 px-1">
                    {msg.role === "user" ? "你" : "AI"}
                    <span className="font-normal text-[11px] ml-1 opacity-70">{i === 0 ? "" : ""}</span>
                  </span>
                  <div className={`max-w-[85%] min-w-0 ${msg.role === "user" ? "" : ""}`}>
                    {parseContent(msg.text).map((seg, si) =>
                      seg.type === "code" ? (
                        <div key={si} className="my-1 rounded-lg overflow-hidden border border-white/[0.08] bg-[#0d1117]">
                          <div className="flex items-center justify-between px-2.5 py-1 border-b border-white/[0.04] bg-[#161b22]/80">
                            <span className="text-[8px] text-dark-500 font-medium">
                              {seg.language || "代码"}
                            </span>
                          </div>
                          <pre className="px-2.5 py-1.5 text-[9px] leading-relaxed font-mono overflow-x-auto" style={{ fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace" }}>
                            <code dangerouslySetInnerHTML={{ __html: highlightCode(seg.content, seg.language || "") }} />
                          </pre>
                        </div>
                      ) : (
                        <div key={si} className={`px-[15px] py-[10px] rounded-xl text-[14px] leading-[1.6] whitespace-pre-wrap break-words ${
                          msg.role === "user"
                            ? "rounded-br-sm bg-brand-500 text-white"
                            : "rounded-bl-sm bg-dark-800/60 border border-white/[0.04] text-dark-200"
                        }`}>
                          {seg.content}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input bar - matches real app */}
          <div className="px-[16px] py-[10px_14px] border-t border-white/[0.04] shrink-0">
            <div className="flex items-center gap-[8px]">
              <button className="w-[30px] h-[30px] rounded-full border border-white/[0.1] flex items-center justify-center text-dark-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-colors text-[13px] font-bold">?</button>
              <button className="w-[30px] h-[30px] rounded-full border border-white/[0.1] flex items-center justify-center text-dark-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-colors">
                <Image size={14} />
              </button>
              <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-[14px] py-[9px] text-[14px] text-dark-500 min-h-[38px] flex items-center">
                输入消息...（Enter 发送，Shift+Enter 换行）
              </div>
              <button className="w-[38px] h-[38px] rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-brand-400 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppPreview() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/70 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-500/[0.025] blur-[150px]" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Interface
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            看看<span className="text-gradient"> 九语</span>长什么样
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm md:text-base">
            简洁直观的桌面界面——左边会话、右边聊天，上手只需 3 秒
          </p>
          <p className="text-xs text-dark-500 mt-3">
            点击左侧会话切换预览不同场景
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1}>
          <div className="max-w-5xl mx-auto">
            <AppMockup />
          </div>
        </ScrollReveal>

        <ScrollReveal threshold={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 text-[11px] text-dark-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
              <Monitor size={13} className="text-brand-400" /> Windows 原生应用
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
              <Settings size={13} className="text-brand-400" /> 便携版，免安装
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
              <Sun size={13} className="text-brand-400" /> 深色 / 浅色主题
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}