import { useState, useRef } from "react";
import { MessageSquare, Users, Palette, Shield, Eye, Zap, Sparkles, ShieldCheck, UserCog, Repeat, Code } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: Code,
    title: "代码高亮 & 分框显示",
    desc: "代码块智能识别语言、语法高亮、独立深色背景框。文字与代码清晰分离，一键复制，媲美专业编辑器。",
  },
  {
    icon: Palette,
    title: "AI 人设精调",
    desc: "定义 AI 的名字、性格与说话风格。精调引擎自动编译为最佳 System Prompt，打造专属你的 AI 角色。",
  },
  {
    icon: MessageSquare,
    title: "多模型一键切换",
    desc: "内置 11 家国内主流 AI 服务商、62 款大模型。通义千问、Kimi、DeepSeek 等随时切换，一个应用全搞定。",
  },
  {
    icon: Shield,
    title: "本地数据安全",
    desc: "对话记录与 API 密钥 AES 加密存储在本地，数据从不上传任何服务器。你的隐私，完全由你掌控。",
  },
  {
    icon: Users,
    title: "多会话管理",
    desc: "无限创建会话，支持置顶、搜索、重命名。工作、学习、生活分门别类，每个话题井井有条互不干扰。",
  },
  {
    icon: Eye,
    title: "Markdown 精美排版",
    desc: "AI 回复自动渲染为精美格式——标题、列表、表格、代码块一目了然，阅读体验流畅自然。",
  },
];

const highlights = [
  { Icon: Sparkles, label: "完全免费", desc: "无需付费，无需注册", color: "text-yellow-400", bgColor: "bg-yellow-500/10", gradient: "from-yellow-500/20 to-orange-500/10" },
  { Icon: ShieldCheck, label: "加密存储", desc: "AES 本地加密，数据不外传", color: "text-green-400", bgColor: "bg-green-500/10", gradient: "from-green-500/20 to-emerald-500/10" },
  { Icon: UserCog, label: "精调人设", desc: "随意定制 AI 性格与身份", color: "text-purple-400", bgColor: "bg-purple-500/10", gradient: "from-purple-500/20 to-pink-500/10" },
  { Icon: Repeat, label: "快速切换", desc: "一键在不同模型间切换", color: "text-brand-400", bgColor: "bg-brand-500/10", gradient: "from-brand-500/20 to-blue-500/10" },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
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
      className="group relative p-4 sm:p-6 rounded-2xl glass glow-border transition-all duration-500 h-full flex flex-col overflow-hidden"
      style={{
        animationDelay: `${index * 80}ms`,
        transform: isHovered ? `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg) scale(1.02)` : "perspective(1000px) rotateY(0) rotateX(0) scale(1)",
        transition: "transform 0.3s ease-out, border-color 0.5s ease",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-500/[0.08] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-500/[0.05] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-all duration-700" />

      <div className="flex items-center gap-3 mb-3 sm:mb-4 relative z-10">
        <div className="relative">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${isHovered ? "bg-gradient-to-br from-brand-500/30 to-brand-600/20" : "bg-brand-500/10"} flex items-center justify-center transition-all duration-500`}>
            <feature.icon size={20} className="text-brand-400" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-brand-500/20 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
          {feature.title}
        </h3>
      </div>
      
      <p className="text-xs sm:text-sm text-dark-400 leading-relaxed pl-0 sm:pl-[52px] flex-1 relative z-10 group-hover:text-dark-300 transition-colors duration-300">
        {feature.desc}
      </p>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/60 to-transparent" />
      <div className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full bg-brand-500/[0.03] blur-[180px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] rounded-full bg-purple-500/[0.02] blur-[160px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/[0.015] blur-[200px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            <Zap size={12} className="animate-pulse" />
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            为什么选择<span className="text-gradient"> Quiddity</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-2">
            从底层构建的桌面 AI 体验，每个细节都精心打磨
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1}>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-5 max-w-4xl mx-auto mb-8 sm:mb-12">
            {highlights.map((h, index) => (
              <div
                key={h.label}
                className="glass rounded-xl px-3 sm:px-5 py-4 sm:py-5 card-interactive group text-center relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${h.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r ${h.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${h.bgColor} mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <h.Icon size={18} className={h.color} />
                </div>
                <div className="text-sm font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors relative z-10">{h.label}</div>
                <div className="text-[10px] sm:text-[11px] text-dark-400 leading-relaxed relative z-10">{h.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} threshold={0.1} className="h-full">
              <FeatureCard feature={feature} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
