import { Download, Monitor, Apple } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function DownloadSection() {
  return (
    <section id="download" className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,176,255,0.06),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <ScrollReveal>
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Download
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-base md:text-lg mb-12">
            九语完全免费，无需注册即可使用。选择你的平台，开始与 AI 的自由对话。
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            {/* Windows download */}
            <div className="group flex items-center gap-3 px-5 py-4 rounded-xl glass glow-border w-full sm:w-auto sm:min-w-[220px] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors shrink-0">
                <Monitor size={20} className="text-brand-400" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-sm font-semibold text-white">
                  Windows 版
                </div>
                <div className="text-xs text-dark-500 mt-0.5">v1.0.0 · 便携版</div>
              </div>
              <Download size={15} className="text-dark-500 transition-colors ml-auto shrink-0" />
            </div>

            {/* macOS coming soon */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl glass border border-white/[0.03] w-full sm:w-auto sm:min-w-[220px] opacity-60">
              <div className="w-9 h-9 rounded-lg bg-white/[0.02] flex items-center justify-center shrink-0">
                <Apple size={20} className="text-dark-500" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-sm font-semibold text-dark-400">
                  macOS 版
                </div>
                <div className="text-xs text-dark-600 mt-0.5">即将推出</div>
              </div>
            </div>
          </div>

          {/* Version info */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-dark-600">
            <span>版本 1.0.0</span>
            <span className="w-1 h-1 rounded-full bg-dark-700 hidden sm:inline" />
            <span>Windows 10+</span>
            <span className="w-1 h-1 rounded-full bg-dark-700 hidden sm:inline" />
            <span>完全免费</span>
            <span className="w-1 h-1 rounded-full bg-dark-700 hidden sm:inline" />
            <span>无需注册</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
