import { Code, BookOpen, Palette, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const useCases = [
  {
    icon: Code,
    title: "编程助手",
    desc: "无论是调试报错、学习新语言，还是优化算法，九语都能成为你的专属技术顾问。",
    messages: [
      { role: "user", text: "帮我写一个 Python 脚本，自动整理桌面文件" },
      { role: "ai", text: "好的，我帮你写一个按文件类型自动分类整理的脚本，支持自定义规则…" },
    ],
  },
  {
    icon: BookOpen,
    title: "学习伴侣",
    desc: "用通俗的语言解释复杂概念，帮你快速理解新知识，让学习事半功倍。",
    messages: [
      { role: "user", text: "用简单的比喻解释一下什么是量子计算" },
      { role: "ai", text: "可以把传统计算机想象成开关——只能开或关。而量子计算机就像一枚旋转的硬币…" },
    ],
  },
  {
    icon: Palette,
    title: "创作灵感",
    desc: "写文案、想点子、做策划，九语帮你突破创意瓶颈，激发无限灵感。",
    messages: [
      { role: "user", text: "帮我写一段品牌 slogan，面向年轻用户的科技产品" },
      { role: "ai", text: "这里有几个方向供你参考：「不设限，才无限」「你的下一站，更聪明」…" },
    ],
  },
  {
    icon: MessageCircle,
    title: "日常陪伴",
    desc: "聊天倾诉、出谋划策、解闷逗趣，九语随时在你身边，做最懂你的伙伴。",
    messages: [
      { role: "user", text: "推荐几部冷门但好看的科幻电影" },
      { role: "ai", text: "那必须从这几部说起：《月球》《降临》《机械姬》…每一部都值得细品！" },
    ],
  },
];

export default function UseCases() {
  return (
    <section id="usecases" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Use Cases
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            九语<span className="text-gradient"> 能做什么</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-base md:text-lg">
            不止聊天，更是你工作、学习和生活中的得力助手
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {useCases.map((item, index) => (
            <ScrollReveal key={item.title} threshold={0.1}>
              <div
                className="group relative p-6 rounded-2xl glass glow-border transition-all duration-500 hover:border-brand-500/25"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors shrink-0">
                    <item.icon size={18} className="text-brand-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="text-[11px] text-dark-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>

                {/* Chat preview */}
                <div className="space-y-2">
                  {item.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-1.5 ${msg.role === "user" ? "justify-end" : ""}`}
                    >
                      {msg.role === "ai" && (
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">
                          九
                        </div>
                      )}
                      <div
                        className={`p-2 rounded-xl text-[11px] leading-snug max-w-[82%] ${
                          msg.role === "user"
                            ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-dark-200"
                            : "rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-dark-300"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-5 h-5 rounded-md bg-dark-700 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">
                          你
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
