import { useState } from "react";
import { MessageSquare, Users, Palette, Shield, Eye, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: MessageSquare,
    title: "多模型支持",
    desc: "内置 DeepSeek、通义千问、Kimi、GLM 等主流 AI 服务商，一键切换引擎，一个应用畅享所有模型。",
  },
  {
    icon: Palette,
    title: "AI 人设精调",
    desc: "自定义 AI 的名字、性格、说话方式。精调引擎将你的描述自动编译为最佳 System Prompt。",
  },
  {
    icon: Users,
    title: "多会话管理",
    desc: "无限创建会话，拖拽排序、置顶、搜索、重命名。每个话题都井井有条。",
  },
  {
    icon: Shield,
    title: "本地数据安全",
    desc: "对话记录和 API 密钥均 AES 加密存储在本地磁盘。数据从未离开你的设备。",
  },
  {
    icon: Eye,
    title: "Markdown 渲染",
    desc: "代码高亮、表格、公式、流程图——AI 回复以精美排版呈现，阅读体验丝滑。",
  },
  {
    icon: Zap,
    title: "精调编译器",
    desc: "独有的自然语言编译引擎。输入口语化描述，自动翻译为高质量 System Prompt。",
  },
];

const highlights = [
  { emoji: "🆓", label: "完全免费", desc: "无需付费，无需注册" },
  { emoji: "🔒", label: "加密存储", desc: "AES 本地加密，数据不外传" },
  { emoji: "🎛️", label: "精调人设", desc: "随意定制 AI 性格与身份" },
  { emoji: "⚡", label: "快速切换", desc: "一键在不同模型间切换" },
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
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base">
            从底层构建的桌面 AI 体验，每个细节都精心打磨
          </p>
        </ScrollReveal>

        {/* ─── Quick highlights ─── */}
        <ScrollReveal threshold={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-12">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="glass rounded-xl px-4 py-4 text-center hover:border-brand-500/20 transition-all duration-300 group"
              >
                <div className="text-xl mb-2">{h.emoji}</div>
                <div className="text-sm font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors">
                  {h.label}
                </div>
                <div className="text-[11px] text-dark-400">{h.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ─── Interactive Tab Selector (desktop) ─── */}
        <div className="hidden lg:flex max-w-4xl mx-auto mb-6 gap-2 justify-center flex-wrap">
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

        {/* ─── Active Feature Detail (desktop) ─── */}
        <div className="hidden lg:block max-w-3xl mx-auto mb-10">
          <div className="glass glow-border rounded-2xl px-8 py-7 flex items-center gap-6 transition-all duration-500">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-brand-500/10 flex items-center justify-center">
              {(() => {
                const Icon = features[activeTab].icon;
                return <Icon size={28} className="text-brand-400" />;
              })()}
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-lg font-bold text-white mb-1.5">{features[activeTab].title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{features[activeTab].desc}</p>
            </div>
          </div>
        </div>

        {/* ─── Full Feature Grid (all screen sizes) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} threshold={0.1}>
              <div
                className="group relative p-6 rounded-2xl glass glow-border card-tilt transition-all duration-500 hover:border-brand-500/20"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-500 shrink-0">
                    <feature.icon size={20} className="text-brand-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-xs text-dark-400 leading-relaxed pl-[52px]">{feature.desc}</p>
                <div className="absolute inset-0 rounded-2xl bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
