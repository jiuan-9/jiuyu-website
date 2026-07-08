import { Monitor } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function Preview() {
  return (
    <section id="preview" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-transparent to-dark-950/50" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Interface Preview
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            简洁优雅<span className="text-gradient"> 交互界面</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-base md:text-lg">
            精心设计的布局，让每一次对话都成为享受
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1}>
          <div className="relative max-w-4xl mx-auto">
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-brand-500/5 blur-[80px] rounded-3xl" />

            {/* Mock window */}
            <div className="relative rounded-2xl overflow-hidden glass glow-border shadow-2xl shadow-black/40">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 text-center text-xs text-dark-500">九语 — AI 聊天助手</div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Sidebar mockup */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Left sidebar */}
                  <div className="hidden md:flex flex-col gap-2 w-48 shrink-0">
                    <div className="px-3 py-2 rounded-lg bg-brand-500/10 text-sm text-brand-300 font-medium">
                      + 新建会话
                    </div>
                    {[
                      "与 AI 讨论创作灵感",
                      "代码问题咨询",
                      "旅行计划助手",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                          i === 0
                            ? "bg-white/5 text-white"
                            : "text-dark-400 hover:text-dark-300"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* AI message */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                        九
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-dark-500 mb-1.5">九语</div>
                        <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-sm text-dark-200 leading-relaxed">
                          你好！我是九语，你的专属 AI 伙伴。有什么我可以帮助你的吗？
                          <br />
                          无论是讨论创意、解决技术问题，还是日常闲聊，我都很乐意和你交流。
                        </div>
                      </div>
                    </div>

                    {/* User message */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="flex-1 max-w-[75%]">
                        <div className="text-xs text-dark-500 mb-1.5 text-right">你</div>
                        <div className="p-3.5 rounded-2xl rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-sm text-dark-100 leading-relaxed">
                          帮我设计一个 Logo / 海报设计的设计提示词模板
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                        U
                      </div>
                    </div>

                    {/* Input mockup */}
                    <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <input
                        disabled
                        className="flex-1 bg-transparent text-sm text-dark-400 placeholder-dark-600 outline-none"
                        placeholder="输入消息...（Enter 发送）"
                      />
                      <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                        <Monitor size={14} className="text-brand-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
