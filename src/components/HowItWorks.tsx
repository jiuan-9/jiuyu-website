import { Download, Settings, MessageSquare, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    icon: Download,
    title: "下载安装",
    description: "下载Quiddity桌面客户端，无需安装，解压即可运行",
  },
  {
    icon: Settings,
    title: "配置 API",
    description: "在设置中添加你的 AI API Key，支持 11+ 家服务商",
  },
  {
    icon: MessageSquare,
    title: "开始对话",
    description: "选择模型和人设，开始与 AI 进行智能对话",
  },
  {
    icon: Zap,
    title: "享受体验",
    description: "支持图片上传、代码高亮、多会话管理等高级功能",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/[0.03] blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            快速上手
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            简单易用，无需复杂配置，上手只需几分钟
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ScrollReveal key={step.title} threshold={0.2}>
              <div className="relative group">
                <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-[10px] font-bold text-brand-400">
                  {index + 1}
                </div>
                <div className="p-4 sm:p-6 rounded-2xl glass border border-white/[0.05] hover:border-brand-500/20 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-brand-500/20 transition-colors">
                    <step.icon size={20} className="sm:hidden text-brand-400" />
                    <step.icon size={24} className="hidden sm:block text-brand-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{step.title}</h3>
                  <p className="text-xs text-dark-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}