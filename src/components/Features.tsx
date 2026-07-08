import { MessageSquare, Users, Palette, Shield, Eye, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: MessageSquare,
    title: "多模型支持",
    desc: "接入 OpenAI、Claude、Gemini 等 30+ 主流模型，一个应用畅享所有 AI 服务，自由切换不设限。",
  },
  {
    icon: Palette,
    title: "AI 人设精调",
    desc: "自定义 AI 的名字、性格、外貌和说话方式，创造专属的 AI 伙伴。精调引擎让你的描述被翻译成 AI 最佳理解的语言。",
  },
  {
    icon: Users,
    title: "多会话管理",
    desc: "无限创建会话，分类管理不同对话场景。置顶、搜索、重命名，让每个话题都井井有条。",
  },
  {
    icon: Shield,
    title: "本地数据安全",
    desc: "所有对话记录和 API 密钥均加密保存在本地，不上传任何服务器。你的隐私，由你掌控。",
  },
  {
    icon: Eye,
    title: "深色模式",
    desc: "精心设计的亮色/暗色双主题，平滑过渡动画。无论白天黑夜，都能享受舒适的视觉体验。",
  },
  {
    icon: Sparkles,
    title: "Markdown 渲染",
    desc: "AI 回复支持完整的 Markdown 语法渲染，代码高亮、表格、列表一应俱全，阅读体验如丝般顺滑。",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Core Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            为什么选择<span className="text-gradient"> 九语</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-base md:text-lg">
            从底层构建的 AI 桌面体验，每一个细节都经过精心打磨
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} threshold={0.1}>
              <div
                className="group relative p-6 rounded-2xl glass glow-border transition-all duration-500 hover:border-brand-500/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 transition-colors duration-500">
                  <feature.icon size={22} className="text-brand-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2.5 group-hover:text-brand-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-400 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
