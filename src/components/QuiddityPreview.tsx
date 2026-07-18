import { useState, useRef } from "react";
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
    desc: "延续Quiddity上一代的无限会话、多模型切换等经典功能，体验不打折。",
  },
  {
    icon: HeartHandshake,
    title: "完全免费",
    desc: "Quiddity Agent 不作商业变现，完全免费开放。我们的目标始终是做出好用的 AI 工具。",
  },
];

function FeatureCard({ feature }: { feature: (typeof quiddityFeatures)[number] }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      className="group p-4 sm:p-5 rounded-2xl glass glow-border flex flex-col items-center text-center overflow-hidden"
      style={{
        transform: isHovered ? `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg) scale(1.03)` : "perspective(1000px) rotateY(0) rotateX(0) scale(1)",
        transition: "transform 0.3s ease-out, border-color 0.5s ease",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative mb-2 sm:mb-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-gradient-to-br from-purple-500/20 to-blue-500/15 transition-all duration-500">
          <feature.icon size={18} className="sm:hidden text-purple-400" />
          <feature.icon size={20} className="hidden sm:block text-purple-400" />
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
      </div>
      
      <h3 className="text-sm font-semibold text-white mb-1 sm:mb-1.5 group-hover:text-purple-300 transition-colors relative z-10">{feature.title}</h3>
      <p className="text-[11px] text-dark-400 leading-relaxed group-hover:text-dark-300 transition-colors relative z-10">{feature.desc}</p>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function QuiddityPreview() {
  return (
    <section id="quiddity" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-purple-500/[0.03] blur-[180px] animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[150px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <ScrollReveal className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 sm:mb-6 group hover:border-purple-500/30 transition-colors">
            <Sparkles size={12} className="text-purple-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-purple-400 tracking-wider">NEXT GENERATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            下一代 AI 体验
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Quiddity Agent
            </span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Quiddity Agent 是Quiddity正在打造的新一代 Agent AI 工具。
            支持自主任务规划、工具调用与流程自动化，从"对话助手"进化为"能独立干活的 AI 搭档"。
          </p>
        </ScrollReveal>

        {/* Feature Grid */}
        <ScrollReveal threshold={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {quiddityFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </ScrollReveal>

        {/* Brand Slogan Divider */}
        <ScrollReveal threshold={0.2} className="mt-10 sm:mt-14 md:mt-16">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span className="w-12 sm:w-20 md:w-28 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-purple-500/50" />
            <div className="text-center">
              <p className="text-sm sm:text-base md:text-lg text-dark-300 tracking-[0.3em] font-light whitespace-nowrap group-hover:text-white transition-colors">
                知所不尽 · 往复不止
              </p>
              <p className="text-[10px] sm:text-xs text-dark-500 mt-1.5 tracking-wider">
                持续探索 AI 的更多可能
              </p>
            </div>
            <span className="w-12 sm:w-20 md:w-28 h-px bg-gradient-to-l from-transparent via-purple-500/30 to-purple-500/50" />
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal threshold={0.2} className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-5 sm:px-8 py-4 sm:py-5 rounded-2xl glass glow-border w-full sm:w-auto max-w-md mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.02] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-center sm:text-left relative z-10">
              <div className="text-sm font-semibold text-white">Quiddity Agent · 开发中</div>
              <div className="text-xs text-dark-400 mt-0.5">2027年前上线，敬请期待</div>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold hover:from-purple-400 hover:to-blue-400 transition-all duration-300 hover:scale-105 whitespace-nowrap shadow-lg shadow-purple-500/20">
              预约体验
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
