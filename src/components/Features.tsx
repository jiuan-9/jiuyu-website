import { Cpu, Zap, Globe, Shield, Layers, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: Cpu,
    title: "自主任务执行",
    desc: "Quiddity 能够自主规划执行路径，调用工具、操作文件、访问网络，完成你交给它的复杂任务。",
  },
  {
    icon: Zap,
    title: "工具链集成",
    desc: "内置代码执行、网页搜索、文件管理等工具链。丰富的扩展接口，让 AI 的能力无限延展。",
  },
  {
    icon: Globe,
    title: "多模型调度",
    desc: "根据任务复杂度智能调度不同模型。简单任务用轻量模型，复杂推理自动切换到最强模型。",
  },
  {
    icon: Shield,
    title: "本地数据安全",
    desc: "所有对话记录和 API 密钥均加密保存在本地设备，不上传任何服务器。你的数据由你掌控。",
  },
  {
    icon: Layers,
    title: "流程自动化",
    desc: "将常用操作编排为自动化流程，一键执行。支持条件判断、循环、错误重试等控制逻辑。",
  },
  {
    icon: Sparkles,
    title: "持续学习进化",
    desc: "Quiddity 从每次交互中学习你的偏好和习惯，越用越懂你，逐步成为最契合你的 AI 助手。",
  },
];

export default function Features() {
  return (
    <section id="quiddity" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Quiddity
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            不只是聊天，是<span className="text-gradient"> 真正的 AI 智能体</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Quiddity 正在开发中。它将颠覆你与 AI 的交互方式——从一问一答，到自主执行。
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} threshold={0.1}>
              <div
                className="group relative p-6 rounded-2xl glass glow-border card-tilt transition-all duration-500 hover:border-brand-500/20"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-500">
                  <feature.icon size={22} className="text-brand-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2.5 group-hover:text-brand-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-400 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
