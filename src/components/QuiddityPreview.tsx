import { Sparkles, Bot, UserCheck, HeartHandshake, Layers, ShieldCheck, Wrench, Languages, Palette } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const quiddityFeatures = [
  {
    icon: Bot,
    title: "多 Agent 协作",
    desc: "多个 AI Agent 并行工作，各司其职、协同配合，高效完成复杂任务。",
  },
  {
    icon: UserCheck,
    title: "人设辅佐模式",
    desc: "AI 以特定身份和角色辅佐你完成工作——不只是一个工具，更像一个懂你的搭档。",
  },
  {
    icon: ShieldCheck,
    title: "工作区安全隔离",
    desc: "独立工作区管理，权限可控、风险最小化。每个项目互不干扰，安全稳定。",
  },
  {
    icon: Wrench,
    title: "强大 Skill 库",
    desc: "内置丰富的 Skills，可独立完成多项专业工作。从代码审查到文档生成，开箱即用。",
  },
  {
    icon: Languages,
    title: "智能翻译前置",
    desc: "如你允许，AI 可先将你的消息翻译优化后再处理，让表达更精准，理解更到位。",
  },
  {
    icon: Palette,
    title: "延续经典体验",
    desc: "动画与主题风格沿用上一代设计语言，熟悉的交互，更强大的内核。",
  },
  {
    icon: Layers,
    title: "无限会话保留",
    desc: "延续九语上一代的无限会话、多模型切换等经典功能，体验不打折。",
  },
  {
    icon: HeartHandshake,
    title: "完全免费",
    desc: "Quiddity 不作商业变现，完全免费开放。我们的目标始终是做出好用的 AI 工具。",
  },
];

export default function QuiddityPreview() {
  return (
    <section id="quiddity" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-purple-500/[0.03] blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/[0.02] blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[10px] font-semibold text-purple-400 tracking-wider">NEXT GENERATION</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            下一代 AI 体验
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Quiddity
            </span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base">
            Quiddity 是九语正在打造的新一代 Agent AI 工具。
            支持自主任务规划、工具调用与流程自动化，从"对话助手"进化为"能独立干活的 AI 搭档"。
          </p>
        </ScrollReveal>

        {/* Feature Grid */}
        <ScrollReveal threshold={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quiddityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 rounded-2xl glass glow-border card-interactive flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon size={18} className="text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{feature.title}</h3>
                <p className="text-[11px] text-dark-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal threshold={0.2} className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-5 rounded-2xl glass glow-border">
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Quiddity · 开发中</div>
              <div className="text-xs text-dark-400 mt-0.5">预计 2026 Q4 开放 Alpha 预览，敬请期待</div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
              预约体验
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
