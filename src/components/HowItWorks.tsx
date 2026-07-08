import { Download, Key, Cpu, MessageSquare } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    icon: Download,
    title: "下载应用",
    desc: "下载九语桌面客户端，即开即用，无需安装，便携版直接运行。",
  },
  {
    icon: Key,
    title: "配置密钥",
    desc: "在设置中填写你需要的 AI 服务商 API Key，密钥加密存储在本地。",
  },
  {
    icon: Cpu,
    title: "选择模型",
    desc: "从 11 家服务商、62+ 模型中自由选择，一键切换不同 AI 引擎。",
  },
  {
    icon: MessageSquare,
    title: "开始对话",
    desc: "创建会话，自定义 AI 人设，享受流畅的 AI 交流体验。",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            三步上手<span className="text-gradient"> 即刻体验</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-base md:text-lg">
            从下载到畅聊，只需简单几步
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ScrollReveal key={step.title} threshold={0.15}>
              <div
                className="relative text-center group"
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Step number */}
                <div className="w-10 h-10 mx-auto mb-5 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-sm font-bold text-brand-400 group-hover:bg-brand-500/20 transition-colors">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center group-hover:border-brand-500/20 transition-colors">
                  <step.icon size={26} className="text-brand-400" />
                </div>

                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed max-w-52 mx-auto">{step.desc}</p>

                {/* Connector line (hidden on mobile & last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[20px] left-[calc(50%+40px)] w-[calc(100%-80px)] h-px">
                    <div className="h-full bg-gradient-to-r from-brand-500/30 to-transparent" />
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
