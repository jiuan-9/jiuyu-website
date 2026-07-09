import { Monitor, MessageSquare, Settings, Plus, Search, MoreVertical, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";

function AppMockup() {
  const [activeChat, setActiveChat] = useState(0);

  const chats = [
    { name: "编程助手", active: true },
    { name: "英语学习", active: false },
    { name: "产品脑暴", active: false },
    { name: "日常闲聊", active: false },
  ];

  const messages = [
    { role: "user", text: "帮我写一段 Python 爬虫代码" },
    { role: "ai", text: "好的，你需要爬取什么类型的数据？网页、API 还是文件？告诉我具体需求，我帮你写完整的爬虫代码。" },
    { role: "user", text: "想爬一个新闻网站的文章标题和链接" },
    { role: "ai", text: "明白了。这里是一个使用 requests + BeautifulSoup 的示例：\n\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = \"https://example.com/news\"\nresp = requests.get(url)\nsoup = BeautifulSoup(resp.text, 'html.parser')\n\nfor article in soup.select('.article-title'):\n    print(article.text.strip())\n```\n\n需要我针对具体网站调整选择器吗？" },
  ];

  return (
    <div className="w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] bg-dark-900/70 shadow-2xl shadow-black/50">
      {/* Title bar */}
      <div className="h-10 bg-dark-900 flex items-center px-4 gap-2 border-b border-white/[0.05]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] text-dark-400 ml-3">九语 v1.0.0</span>
      </div>

      {/* App body */}
      <div className="flex h-[420px]">
        {/* Sidebar */}
        <div className="w-[180px] shrink-0 border-r border-white/[0.04] bg-dark-950/60 flex flex-col">
          <div className="p-2.5 border-b border-white/[0.04]">
            <button className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-brand-500/10 text-brand-400 text-[10px] font-medium">
              <Plus size={12} /> 新建会话
            </button>
          </div>
          <div className="p-1.5 border-b border-white/[0.04]">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.03] text-[10px] text-dark-400">
              <Search size={11} />
              搜索会话...
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {chats.map((chat, i) => (
              <button
                key={chat.name}
                onClick={() => setActiveChat(i)}
                className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] text-left transition-colors ${
                  activeChat === i
                    ? "bg-white/[0.06] text-dark-100"
                    : "text-dark-400 hover:bg-white/[0.03]"
                }`}
              >
                <MessageSquare size={11} />
                <span className="truncate flex-1">{chat.name}</span>
                <MoreVertical size={10} className="opacity-40" />
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-white/[0.04] flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[8px] font-bold">九</div>
            <span className="text-[10px] text-dark-300">用户</span>
            <div className="ml-auto flex gap-1">
              <Sun size={11} className="text-dark-500" />
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-dark-950/40">
          {/* Chat header */}
          <div className="h-9 flex items-center px-3 border-b border-white/[0.04]">
            <span className="text-[10px] text-dark-300 font-medium">{chats[activeChat].name}</span>
            <span className="ml-auto text-[9px] text-dark-500">DeepSeek-V4-Flash</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-0.5">九</div>
                )}
                <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed max-w-[85%] ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-dark-200"
                    : "rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-dark-300"
                }`}>
                  <pre className="font-sans whitespace-pre-wrap break-words">{msg.text}</pre>
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-md bg-dark-700 flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-0.5">你</div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2.5 border-t border-white/[0.04]">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-dark-500">
                输入消息...
              </div>
              <button className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center">
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
      {/* Glow */}
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
            简洁直观的桌面界面，左边会话列表、右边聊天区域——上手只需 3 秒
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1}>
          <div className="max-w-5xl mx-auto">
            <AppMockup />
          </div>
        </ScrollReveal>

        {/* Callout pills */}
        <ScrollReveal threshold={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 text-[11px] text-dark-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
              <Monitor size={13} className="text-brand-400" /> Windows 原生应用
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
              <Settings size={13} className="text-brand-400" /> 便携版，无需安装
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
