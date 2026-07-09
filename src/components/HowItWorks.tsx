import { Monitor, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/90 to-dark-950" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <ScrollReveal>
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Current Product
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            九语桌面端<span className="text-gradient"> v1.0.0</span>
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm md:text-base mb-10 leading-relaxed">
            Quiddity 的前身——一款多模型 AI 聊天应用，支持 11 家服务商接入，纯本地加密存储。
            这是九语 AI 工具平台的第一步。
          </p>
          <a
            href="#download"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-dark-200 hover:text-white text-sm transition-all duration-300 hover:border-brand-500/30"
          >
            <Monitor size={16} />
            下载桌面端
            <ArrowRight size={14} />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
