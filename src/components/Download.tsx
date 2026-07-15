import { Download, Monitor, Smartphone, Globe, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function DownloadSection() {
  return (
    <section id="download" className="py-16 sm:py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,176,255,0.04),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">Download</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            获取<span className="text-gradient"> Quiddity</span>
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base mb-10 sm:mb-14 leading-relaxed px-2">
            桌面端完全免费，无需注册即可使用。内置自动更新检测，随时保持最新版本。
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.2}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-2xl mx-auto">
            {/* Desktop */}
            <a
              href="https://jiuan-9.github.io/quiddity-website/downloads/Quiddity-1.1.0.exe"
              className="group flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl glass glow-border-strong w-full sm:w-auto sm:min-w-[220px] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/25"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors shrink-0">
                <Monitor size={20} className="text-brand-400" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white">Windows 桌面端</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-brand-500/15 text-[9px] font-bold text-brand-400">NEW</span>
                </div>
                <div className="text-xs text-dark-400 mt-0.5">v1.1.0 · 便携版</div>
              </div>
              <Download size={15} className="text-dark-500 group-hover:text-brand-400 transition-colors ml-auto shrink-0" />
            </a>

            {/* Demo */}
            <a
              href="#/demo"
              className="group flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl glass glow-border w-full sm:w-auto sm:min-w-[200px] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/25"
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.02] flex items-center justify-center group-hover:bg-brand-500/10 transition-colors shrink-0">
                <Globe size={20} className="text-brand-400" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-sm font-semibold text-white">在线体验</div>
                <div className="text-xs text-dark-400 mt-0.5">无需下载，浏览器直接聊</div>
              </div>
            </a>

            {/* Mobile */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl glass border border-white/[0.05] w-full sm:w-auto sm:min-w-[200px]">
              <div className="w-9 h-9 rounded-lg bg-white/[0.02] flex items-center justify-center shrink-0">
                <Smartphone size={20} className="text-dark-400" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-sm font-semibold text-dark-300">移动端</div>
                <div className="text-xs text-dark-500 mt-0.5">全新 AI 工具 · 即将推出</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-dark-500 px-2">
            <span>版本 1.1.0</span>
            <span className="w-1 h-1 rounded-full bg-dark-700 hidden sm:inline" />
            <span>Windows 10+</span>
            <span className="w-1 h-1 rounded-full bg-dark-700 hidden sm:inline" />
            <span>完全免费</span>
            <span className="w-1 h-1 rounded-full bg-dark-700 hidden sm:inline" />
            <span>无需注册</span>
            <span className="w-1 h-1 rounded-full bg-dark-700 hidden sm:inline" />
            <span>代码高亮</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
