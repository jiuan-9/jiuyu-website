import { Brain, Bot, Sparkles, Clock } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const nextVersion = "v1.2.0";
const releaseETA = "2027年前上线";

const features = [
  {
    icon: Brain,
    title: "深度思考模式",
    desc: "AI 展示完整推理过程，让每一步都清晰可循，答案更严谨、更可信。",
  },
  {
    icon: Bot,
    title: "Agent 能力铺垫",
    desc: "为 AI Agent 自主执行任务打好底层架构基础，迈向真正的智能助手。",
  },
  {
    icon: Sparkles,
    title: "体验全面升级",
    desc: "交互细节精心打磨，更流畅、更直觉的操作感受，用得舒服才是好产品。",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Roadmap
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            版本<span className="text-gradient">前瞻</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base">
            下一个版本，更强大的九语
          </p>
        </ScrollReveal>

        {/* Version badge */}
        <ScrollReveal threshold={0.1}>
          <div className="flex flex-col items-center gap-4 mb-14">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass glow-border-strong">
              <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                {nextVersion}
              </span>
              <span className="w-px h-6 bg-white/[0.1]" />
              <span className="flex items-center gap-1.5 text-sm text-dark-400">
                <Clock size={14} className="text-brand-400" />
                {releaseETA}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((f) => (
            <ScrollReveal key={f.title} threshold={0.1} className="h-full">
              <div className="group relative p-6 rounded-2xl glass glow-border card-tilt h-full flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-500">
                  <f.icon size={24} className="text-brand-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-dark-400 leading-relaxed">{f.desc}</p>

                {/* Status badge */}
                <span className="mt-4 inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  即将上线
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
