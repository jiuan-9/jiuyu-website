import { Monitor, MessageSquare, Settings, Plus, Search, MoreVertical, Sun } from "lucide-react";
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
      {/* Title bar */}
      <div className="h-10 bg-dark-900 flex items-center px-4 gap-2 border-b border-white/[0.05]">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] text-dark-400 ml-3 truncate">九语 v1.0.0</span>
        <span className="ml-auto text-[9px] text-dark-500 hidden sm:block">便携版 · 无需安装</span>
      </div>

      {/* App body */}
      <div className="flex h-[440px]">
        {/* Sidebar */}
        <div className="w-[180px] shrink-0 border-r border-white/[0.04] bg-dark-950/60 flex flex-col">
          <div className="p-2.5 border-b border-white/[0.04]">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-brand-500/10 text-brand-400 text-[10px] font-medium">
              <Plus size={12} /> 新建会话
            </div>
          </div>
          <div className="p-1.5 border-b border-white/[0.04]">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.03] text-[10px] text-dark-400">
              <Search size={11} />
              搜索会话...
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {chatData.map((chat, i) => (
              <button
                key={chat.name}
                onClick={() => setActiveChat(i)}
                className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] text-left transition-all duration-200 ${
                  activeChat === i
                    ? "bg-white/[0.06] text-dark-100 ring-1 ring-brand-500/10"
                    : "text-dark-400 hover:bg-white/[0.03] hover:text-dark-300"
                }`}
              >
                <MessageSquare size={11} className="shrink-0" />
                <span className="truncate flex-1">{chat.name}</span>
                <MoreVertical size={10} className="opacity-40 shrink-0" />
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-white/[0.04] flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[8px] font-bold shrink-0">九</div>
            <span className="text-[10px] text-dark-300 truncate">用户</span>
            <div className="ml-auto">
              <Sun size={11} className="text-dark-500" />
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-dark-950/40 min-w-0">
          {/* Chat header */}
          <div className="h-9 flex items-center px-3 border-b border-white/[0.04] shrink-0">
            <span className="text-[10px] text-dark-200 font-medium truncate">{current.name}</span>
            <span className="ml-auto text-[9px] text-dark-500 shrink-0 ml-2">{current.model}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {current.messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-0.5">九</div>
                )}
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
                      <div key={si} className={`p-2.5 rounded-xl text-[10px] leading-relaxed whitespace-pre-wrap break-words ${
                        msg.role === "user"
                          ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-dark-200"
                          : "rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-dark-300"
                      }`}>
                        {seg.content}
                      </div>
                    )
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-md bg-dark-700 flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-0.5">你</div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2.5 border-t border-white/[0.04] shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-dark-500">
                输入消息...
              </div>
              <button className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center hover:bg-brand-500/30 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#40d0ff" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"/></svg>
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
