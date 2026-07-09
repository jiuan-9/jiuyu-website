import { Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function HowItWorks() {
  return (
    <section id="quiddity" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/[0.03] blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/10 bg-brand-500/[0.03] text-xs text-brand-400 mb-6">
            <Sparkles size={12} />
            即将到来
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            <span className="text-gradient">Quiddity</span>
          </h2>
          <p className="text-lg text-dark-300 mb-3 font-medium">
            下一代 Agent AI 智能体
          </p>
          <p className="text-sm text-dark-500 max-w-lg mx-auto mb-10 leading-relaxed">
            Quiddity 是九语正在开发的全新 Agent AI 工具。它不再停留于问答，而是能自主规划、
            调用工具、执行复杂任务——真正帮你"做事"的 AI。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-xl mx-auto">
            {["自主任务规划", "工具链调用", "流程自动化", "多模型调度"].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full glass text-xs text-dark-400 border border-white/[0.05] hover:border-brand-500/20 hover:text-dark-300 transition-all duration-300"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="text-xs text-dark-500">
            预计 2027 年前正式上线，敬请关注。
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
