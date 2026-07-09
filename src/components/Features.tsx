import { MessageSquare, Users, Palette, Shield, Eye, Zap, Sparkles, ShieldCheck, UserCog, Repeat, Code } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: Code,
    title: "代码高亮 & 分框显示",
    desc: "代码块自动识别语言、语法高亮、独立深色背景框。文字和代码清晰分离，一键复制整段代码，阅读体验媲美专业编辑器。",
  },
  {
    icon: Palette,
    title: "AI 人设精调",
    desc: "自定义 AI 的名字、性格、说话方式。精调引擎将你的描述自动编译为最佳 System Prompt，创造专属你的 AI 角色。",
  },
  {
    icon: MessageSquare,
    title: "多模型支持",
    desc: "内置 11 家 AI 服务商，包括阿里云（通义千问）、百度（文心一言）、智谱（GLM）、月之暗面（Kimi）、腾讯（混元）、字节跳动（豆包）、深度求索（DeepSeek）、科大讯飞（星火）、MiniMax（海螺AI）、硅基流动（聚合平台）、阶跃星辰。一键切换引擎，一个应用畅享所有模型。",
  },
  {
    icon: Shield,
    title: "本地数据安全",
    desc: "对话记录和 API 密钥均 AES 加密存储在本地磁盘。数据从未离开你的设备，你的隐私由你掌控。",
  },
  {
    icon: Users,
    title: "多会话管理",
    desc: "无限创建会话，拖拽排序、置顶、搜索、重命名。每个话题井井有条，工作、学习、闲聊互不干扰。",
  },
  {
    icon: Eye,
    title: "Markdown 精美排版",
    desc: "标题、列表、表格、代码块——AI 回复自动排版为精美格式。代码高亮 + 表格对齐 + 文字排版，阅读体验丝滑。",
  },
];

const highlights = [
  { Icon: Sparkles, label: "完全免费", desc: "无需付费，无需注册", color: "text-yellow-400" },
  { Icon: ShieldCheck, label: "加密存储", desc: "AES 本地加密，数据不外传", color: "text-green-400" },
  { Icon: UserCog, label: "精调人设", desc: "随意定制 AI 性格与身份", color: "text-purple-400" },
  { Icon: Repeat, label: "快速切换", desc: "一键在不同模型间切换", color: "text-brand-400" },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            为什么选择<span className="text-gradient"> 九语</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base">
            从底层构建的桌面 AI 体验，每个细节都精心打磨
          </p>
        </ScrollReveal>

        {/* Quick highlights */}
        <ScrollReveal threshold={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-4xl mx-auto mb-12">
            {highlights.map((h) => (
              <div key={h.label} className="glass rounded-xl px-5 py-5 card-interactive group text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <h.Icon size={20} className={h.color} />
                </div>
                <div className="text-sm font-semibold text-white mb-1.5 group-hover:text-brand-300 transition-colors">{h.label}</div>
                <div className="text-[11px] text-dark-400 leading-relaxed">{h.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature) => (
            <ScrollReveal key={feature.title} threshold={0.1}>
              <div className="group relative p-6 rounded-2xl glass glow-border card-tilt transition-all duration-500 hover:border-brand-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-500 shrink-0">
                    <feature.icon size={20} className="text-brand-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-xs text-dark-400 leading-relaxed pl-[52px]">{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
