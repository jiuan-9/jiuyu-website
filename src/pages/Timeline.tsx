import { useState } from "react";
import { ArrowLeft, Sparkles, Zap, Shield, Code, Users, Eye, Palette, Globe, Monitor, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const milestones = [
  {
    version: "v1.0.0",
    date: "2026.07.08",
    label: "正式启航",
    description:
      "九语 1.0.0 官网正式部署上线，同步开放安装包下载。首版即带来 AI 人设精调引擎，支持十一家国内主流 AI 服务商、数十款大语言模型，打造真正属于你的桌面 AI 助手。",
    highlights: [
      { icon: Globe, text: "官网正式上线 & 开放下载" },
      { icon: Palette, text: "AI 人设精调引擎" },
      { icon: Users, text: "11 家国内 AI 服务商" },
      { icon: Layers, text: "数十款大语言模型" },
    ],
    color: "blue",
  },
  {
    version: "v1.0.5",
    date: "2026.07.09",
    label: "走向 Agent",
    description:
      "九语正式踏上 Agent 之路——率先实现代码块独立分框与语法高亮、文本块独立分框等普通 AI 聊天软件不具备的能力。同时新增多家服务商支持，一键切换引擎更灵活。",
    highlights: [
      { icon: Code, text: "代码块独立分框 & 高亮" },
      { icon: Monitor, text: "文本块独立分框" },
      { icon: Zap, text: "新增 AI 服务商接入" },
      { icon: Sparkles, text: "Agent 能力初步探索" },
    ],
    color: "purple",
  },
  {
    version: "v1.1.0",
    date: "2026.07",
    label: "精调进化",
    description:
      "人设精调引擎全面升级，用户描述自动编译为最优 System Prompt。新增 AES 本地加密存储与图片上传支持，安全性与会话体验双双跃升。",
    highlights: [
      { icon: Palette, text: "System Prompt 自动优化" },
      { icon: Shield, text: "AES 本地加密存储" },
      { icon: Eye, text: "图片上传支持" },
      { icon: Code, text: "代码高亮持续打磨" },
    ],
    color: "brand",
  },
];

const colorConfig = {
  brand: {
    bg: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
    dot: "bg-blue-500",
    bar: "from-blue-500 via-cyan-400 to-blue-500",
  },
  purple: {
    bg: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
    dot: "bg-purple-500",
    bar: "from-purple-500 via-violet-400 to-purple-500",
  },
  blue: {
    bg: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    dot: "bg-cyan-500",
    bar: "from-cyan-500 via-blue-400 to-cyan-500",
  },
};

export default function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = milestones[activeIndex];
  const colors = colorConfig[active.color as keyof typeof colorConfig];

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/50 to-dark-950" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-500/[0.02] blur-[180px]" />

        <div className="container relative z-10 mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-12">
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

          {/* Progress Bar */}
          <div className="relative mb-16">
            {/* Background track */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-white/[0.04] rounded-full" />

            {/* Active progress */}
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-gradient-to-r rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((activeIndex) / (milestones.length - 1)) * 100}%` }}
            />

            {/* Dots navigation */}
            <div className="relative flex items-center justify-between">
              {milestones.map((m, i) => (
                <button
                  key={m.version}
                  onClick={() => setActiveIndex(i)}
                  className="group relative flex flex-col items-center gap-3"
                >
                  {/* Dot */}
                  <div
                    className={`relative w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      i <= activeIndex
                        ? `${colorConfig[m.color as keyof typeof colorConfig].dot} border-transparent shadow-lg ${colorConfig[m.color as keyof typeof colorConfig].glow}`
                        : "bg-dark-800 border-white/[0.08]"
                    } ${i === activeIndex ? "scale-125" : "hover:scale-110"}`}
                  >
                    {i === activeIndex && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-30" />
                    )}
                  </div>

                  {/* Label below dot */}
                  <span
                    className={`absolute top-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold whitespace-nowrap transition-all duration-300 ${
                      i === activeIndex ? "text-white" : "text-dark-500"
                    }`}
                  >
                    {m.version}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Focal Milestone Card */}
          <div className="relative max-w-2xl mx-auto">
            <div
              className={`relative rounded-3xl overflow-hidden border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-xl p-8 md:p-10 shadow-2xl ${colors.glow} transition-all duration-700`}
            >
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent blur-[40px]" />
              <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-gradient-to-tr from-white/[0.02] to-transparent blur-[30px]" />

              <div className="relative">
                {/* Date + Version */}
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-5xl md:text-7xl font-black text-white tracking-tight`}>
                    {active.version}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${colors.bg} ${colors.border} text-[11px] font-semibold ${colors.text}`}>
                      <Sparkles size={10} />
                      {active.label}
                    </span>
                    <span className="text-xs text-dark-500">{active.date}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-dark-300 leading-relaxed mb-8 max-w-lg">
                  {active.description}
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  {active.highlights.map((h) => (
                    <div
                      key={h.text}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                    >
                      <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} flex items-center justify-center shrink-0`}>
                        <h.icon size={14} className={colors.text} />
                      </div>
                      <span className="text-xs text-dark-200 font-medium">{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "3", label: "版本发布" },
                { value: "2 个月", label: "持续迭代" },
                { value: "10+", label: "核心功能" },
                { value: "11 家", label: "AI 服务商" },
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
