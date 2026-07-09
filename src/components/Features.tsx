import { useState } from "react";
import { MessageSquare, Users, Palette, Shield, Eye, Sparkles, Monitor, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: MessageSquare,
    title: "多模型支持",
    desc: "内置 DeepSeek、通义千问、Kimi、GLM 等主流 AI 服务商，一键切换不同 AI 引擎，一个应用畅享所有服务。",
    tag: "桌面端已有",
  },
  {
    icon: Palette,
    title: "AI 人设精调",
    desc: "自定义 AI 的名字、性格、说话方式，精调引擎将你的描述翻译成 AI 最佳理解的语言，创造专属 AI 伙伴。",
    tag: "桌面端已有",
  },
  {
    icon: Users,
    title: "多会话管理",
    desc: "无限创建会话，分类管理不同对话场景。置顶、搜索、重命名，让每个话题井井有条。",
    tag: "桌面端已有",
  },
  {
    icon: Shield,
    title: "本地数据安全",
    desc: "所有对话记录和 API 密钥均加密保存在本地，不上传任何服务器。你的隐私，由你掌控。",
    tag: "桌面端已有",
  },
  {
    icon: Eye,
    title: "Markdown 渲染",
    desc: "AI 回复支持完整的 Markdown 语法，代码高亮、表格、列表一应俱全，阅读体验如丝般顺滑。",
    tag: "桌面端已有",
  },
  {
    icon: Zap,
    title: "AI 人设编译引擎",
    desc: "独有的精调编译器，将你输入的自然语言人设描述，自动编译为结构化的高质量 System Prompt。",
    tag: "桌面端已有",
  },
];

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            为什么选择<span className="text-gradient"> 九语</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            从底层构建的 AI 桌面体验，每一个细节都经过精心打磨
          </p>
        </ScrollReveal>

        {/* ─── Interactive Feature Tabs (desktop) ─── */}
        <div className="hidden lg:flex max-w-4xl mx-auto mb-8 gap-2 justify-center flex-wrap">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                activeTab === i
                  ? "bg-brand-500/15 text-brand-400 border border-brand-500/25"
                  : "text-dark-400 hover:text-dark-300 border border-transparent hover:bg-white/[0.03]"
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>

        {/* ─── Active Feature Highlight (desktop) ─── */}
        <div className="hidden lg:block max-w-3xl mx-auto mb-10">
          <div className="glass glow-border rounded-2xl p-8 text-center transition-all duration-500">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-brand-500/10 flex items-center justify-center">
              {(() => {
                const Icon = features[activeTab].icon;
                return <Icon size={28} className="text-brand-400" />;
              })()}
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-white">{features[activeTab].title}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                {features[activeTab].tag}
              </span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed max-w-md mx-auto">
              {features[activeTab].desc}
            </p>
          </div>
        </div>

        {/* ─── Mobile / Tablet grid ─── */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} threshold={0.1}>
              <div
                className="group relative p-6 rounded-2xl glass glow-border card-tilt transition-all duration-500 hover:border-brand-500/20"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-500 shrink-0">
                    <feature.icon size={20} className="text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {feature.title}
                    </h3>
                    <span className="text-[9px] text-green-400/60">{feature.tag}</span>
                  </div>
                </div>
                <p className="text-xs text-dark-400 leading-relaxed">{feature.desc}</p>
                <div className="absolute inset-0 rounded-2xl bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
