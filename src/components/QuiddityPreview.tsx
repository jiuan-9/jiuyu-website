import { Sparkles, Rocket, Eye, Shield, Code, Users, MessageSquare, Palette } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const quiddityFeatures = [
  { icon: Rocket, label: "移动端开发" },
  { icon: Eye, label: "图片理解增强" },
  { icon: Shield, label: "数据导出优化" },
  { icon: Code, label: "插件系统" },
];

export default function QuiddityPreview() {
  return (
    <section id="quiddity" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-purple-500/[0.03] blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/[0.02] blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[10px] font-semibold text-purple-400 tracking-wider">ROADMAP</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            后续规划
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Quiddity</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base">
            基于当前版本的反馈，我们正在规划下一阶段的功能迭代。
            这些功能目前处于设计和开发阶段，具体发布时间待定。
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.2}>
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-dark-900/60 via-dark-950/80 to-dark-900/40 backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-[60px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-[50px]" />

              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-sm font-semibold text-white mb-2">2026 · Q3-Q4</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Quiddity 阶段规划
                    </h3>
                    <p className="text-xs text-dark-400 leading-relaxed max-w-md">
                      持续优化现有功能体验，同时探索移动端和插件系统等新方向。
                      所有功能将根据开发进度和用户反馈逐步推出。
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                      了解更多
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-8 pt-6 border-t border-white/[0.04]">
                  {quiddityFeatures.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] text-[11px] text-dark-300"
                    >
                      <feature.icon size={12} className="text-purple-400" />
                      {feature.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal threshold={0.2} className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-xl glass">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">移动端</div>
              <div className="text-[11px] text-dark-400">iOS / Android 适配</div>
            </div>
            <div className="text-center p-4 rounded-xl glass">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">插件系统</div>
              <div className="text-[11px] text-dark-400">自定义功能扩展</div>
            </div>
            <div className="text-center p-4 rounded-xl glass">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">AI 增强</div>
              <div className="text-[11px] text-dark-400">多模态理解升级</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}