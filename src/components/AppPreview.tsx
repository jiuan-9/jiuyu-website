import { Monitor, MessageSquare, Settings, Plus, Search, MoreVertical, Sun, Image, HelpCircle } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { parseContent, highlightCode } from "@/lib/syntax-highlight";

type MSG = { role: "user" | "ai"; text: string };

const chatData: { name: string; model: string; messages: MSG[] }[] = [
  {
    name: "编程助手",
    model: "DeepSeek V4 Pro",
    messages: [
      { role: "user", text: "帮我写一段 Python 爬虫代码" },
      { role: "ai", text: "好的呀～你需要爬取什么类型的数据呢？网页、API 还是文件？告诉我具体需求，我帮你写完整的爬虫代码 😊" },
      { role: "user", text: "想爬一个新闻网站的文章标题和链接" },
      { role: "ai", text: "明白了！给你写一个用 requests + BeautifulSoup 的实现：\n\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = \"https://example.com/news\"\nresp = requests.get(url)\nsoup = BeautifulSoup(resp.text, \"html.parser\")\n\nfor article in soup.select(\".article-title\"):\n    print(article.text.strip(), article[\"href\"])\n```\n\n先用这个试试，如果网站结构不一样，告诉我具体网址，我帮你调选择器～" },
    ],
  },
  {
    name: "英语学习",
    model: "Kimi K2.6",
    messages: [
      { role: "user", text: "How do I use 'nevertheless' in a sentence?" },
      { role: "ai", text: "好问题！'Nevertheless' 意思是「尽管如此」/「不过」，用来表示转折。\n\n结构是：Sentence 1. Nevertheless, Sentence 2.\n\n来看两个例句：\n• It was raining heavily. Nevertheless, we went hiking.\n  虽然下着大雨，但我们还是去远足了。\n\n• The exam was difficult. Nevertheless, she passed with flying colors.\n  考试很难，但她依然高分通过。\n\n要不要自己造个句子试试？我帮你检查～" },
      { role: "user", text: "I'm tired. Nevertheless, I'll finish this report." },
      { role: "ai", text: "完全正确，而且用得很自然！👏\n\n再教你一个进阶用法：'Nevertheless' 也可以放句尾——\n「The plan had flaws. We succeeded, nevertheless.」\n\n中文习惯把「尽管如此」放前面，英语放句尾也很常见，这是两种语言思维上的一个小差异，注意到了就会让你的表达更地道。" },
    ],
  },
  {
    name: "产品脑暴",
    model: "Qwen 3.7 Max",
    messages: [
      { role: "user", text: "我们正在做一个面向设计师的 AI 工具，帮我起几个产品名" },
      { role: "ai", text: "有意思！帮你从几个不同角度想想：\n\n— 灵感向：灵犀 — 取自「心有灵犀」，暗示 AI 能秒懂设计师的想法\n— 专业向：像素笔记 — 精准、细节，设计师的日常\n— 诗意向：墨迹 — 简洁有中国味，水墨与 AI 的碰撞\n\n你的目标用户是国内设计师还是面向全球呢？这个会影响命名方向～" },
      { role: "user", text: "国内为主，偏好简洁好记的中文名" },
      { role: "ai", text: "那推荐这几个方向，都控制在两三个字：\n\n灵感 — 直白有力，用户一看就懂\n素记 — 「素」是素描的素，简洁大气\n设计力 — 直接传达「给设计师赋能」这个卖点\n\n我个人最推荐「灵感」，中文有温度，拼音 LingGan 也能注册域名。你觉得哪个方向比较对味？" },
    ],
  },
  {
    name: "日常闲聊",
    model: "豆包 Seed 2.1 Pro",
    messages: [
      { role: "user", text: "推荐几部冷门但特别好看的科幻电影吧" },
      { role: "ai", text: "这个我擅长！给你挑几部口碑好但不算热门的：\n\n🎬 《月球》(2009) — 一个人在月球基地的孤独与反转，山姆·洛克威尔演技封神\n🎬 《降临》(2016) — 语言学家与外星文明的哲学碰撞，看完会想很久\n🎬 《机械姬》(2014) — 图灵测试演绎到极致，氛围感拉满\n🎬 《她》(2013) — 人与 AI 的情感连接，温暖又让人深思\n\n看过哪部？按你的口味我再精准推荐～" },
      { role: "user", text: "《她》看了两遍，特别喜欢" },
      { role: "ai", text: "那你的品味我们很合拍！《她》的内核是「孤独与连接」，顺着这个方向推荐：\n\n🎬 《暖暖内含光》(2004) — 如果记忆可以删除，你还会爱上同一个人吗？\n🎬 《龙虾》(2015) — 荒诞设定下的情感寓言，冷幽默里藏着深深的孤独\n🎬 《成为约翰·马尔科维奇》(1999) — 同一导演的脑洞神作，关于身份与意识\n\n这三部都不是传统科幻，但都在探讨「人为什么是人」——跟《她》一脉相承。看完来找我聊感受～" },
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
          <span className="text-[13px] font-medium text-dark-300 tracking-[0.5px]">Quiddity</span>
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
                  <span className="text-[12px] font-medium text-dark-500 mb-[4px] px-[4px]">
                    {msg.role === "user" ? "你" : "小九"}
                  </span>
                  <div className={`max-w-[85%] min-w-0 ${msg.role === "user" ? "" : ""}`}>
                    {parseContent(msg.text).map((seg, si) =>
                      seg.type === "code" ? (
                        <div key={si} className="my-3 rounded-[12px] overflow-hidden border border-[#3a3a3e]/30 bg-[#161b22]" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)" }}>
                          <div className="flex items-center justify-between px-[16px] py-[7px] border-b border-white/[0.04]">
                            <span className="text-[11px] text-dark-400 font-medium uppercase tracking-wide">
                              {seg.language || "text"}
                            </span>
                          </div>
                          <pre className="overflow-x-auto">
                            <code
                              className="block text-[13px] leading-[1.65] py-[14px] px-[18px] max-h-[500px] whitespace-pre"
                              style={{ fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace", width: "max-content" }}
                              dangerouslySetInnerHTML={{ __html: highlightCode(seg.content, seg.language || "") }}
                            />
                          </pre>
                        </div>
                      ) : (
                        <div key={si} className={`px-[15px] py-[10px] text-[14px] leading-[1.6] whitespace-pre-wrap break-words ${
                          msg.role === "user"
                            ? "rounded-[18px] rounded-br-[8px] bg-[#6366f1] text-white"
                            : "rounded-[18px] rounded-bl-[8px] bg-[#242428] text-[#f0f0f2] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
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
            看看<span className="text-gradient"> Quiddity</span>长什么样
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