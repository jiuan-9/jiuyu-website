import { useEffect } from "react";
import { ArrowLeft, Globe, Zap, Shield, Code, Palette, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const milestones = [
  {
    version: "v1.0.0",
    date: "2026.07.08",
    label: "正式启航",
    description:
      "九语 1.0.0 官网正式部署上线，同步开放安装包下载。首版即带来 AI 人设精调引擎，支持十一家国内主流 AI 服务商、62 款大语言模型。",
    highlights: [
      { icon: Globe, text: "官网上线 & 开放下载" },
      { icon: Palette, text: "AI 人设精调引擎" },
      { icon: Layers, text: "11 家 AI 服务商" },
    ],
    color: "blue" as const,
  },
  {
    version: "v1.1.0",
    date: "2026.07.09",
    label: "能力跃升",
    description:
      "新增代码高亮显示、Agent 能力接口预留、自动更新检测，大幅提升开发体验与产品可持续性。",
    highlights: [
      { icon: Code, text: "代码高亮显示" },
      { icon: Zap, text: "Agent 能力预留" },
      { icon: Shield, text: "自动更新检测" },
    ],
    color: "purple" as const,
  },
];

const colorMap = {
  blue:   { dot: "bg-blue-500",   badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  purple: { dot: "bg-purple-500", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
} as const;

export default function Timeline() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/50 to-dark-950" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-500/[0.02] blur-[180px]" />

        <div className="container relative z-10 mx-auto px-6 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-16">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-dark-400 hover:text-brand-400 hover:bg-white/[0.05] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">版本历程</h1>
              <p className="text-xs text-dark-500">记录九语从诞生到进化的每一步</p>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-500/20 via-brand-500/10 to-transparent" />

            <div className="flex flex-col gap-8">
              {milestones.map((m) => {
                const c = colorMap[m.color];
                return (
                  <ScrollReveal key={m.version} threshold={0.1}>
                    <div className="relative pl-12">
                      {/* Dot on the line */}
                      <div className={`absolute left-[11px] top-2 w-[9px] h-[9px] rounded-full ${c.dot} ring-4 ring-dark-950`} />

                      {/* Date */}
                      <div className="text-[11px] text-dark-500 mb-2 tracking-wide">{m.date}</div>

                      {/* Card */}
                      <div className="glass glow-border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl font-bold text-white tracking-wide">{m.version}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${c.badge}`}>
                            {m.label}
                          </span>
                        </div>

                        <p className="text-xs text-dark-400 leading-relaxed mb-4">{m.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {m.highlights.map((h) => (
                            <span
                              key={h.text}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-dark-300"
                            >
                              <h.icon size={11} className="text-dark-500" />
                              {h.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: milestones.length.toString(), label: "版本发布" },
                { value: "6 项", label: "核心功能" },
                { value: "11 家", label: "AI 服务商" },
                { value: "62 款", label: "大语言模型" },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-5 px-3 rounded-2xl glass">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[11px] text-dark-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
