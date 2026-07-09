import { Code, FileSearch, CalendarDays, LineChart } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const useCases = [
  {
    icon: Code,
    title: "自动化开发",
    desc: "告诉 Quiddity 你的需求，它自主规划、编写代码、运行测试、修复错误，完成端到端开发任务。",
    badge: "开发中",
    messages: [
      { role: "user", text: "帮我搭建一个带用户认证的 Web 应用" },
      { role: "ai", text: "好的，我来规划：1. 初始化项目 2. 创建数据库模型 3. 实现认证逻辑 4. 编写前端页面…" },
    ],
  },
  {
    icon: FileSearch,
    title: "信息调研",
    desc: "指定一个研究主题，Quiddity 自动搜索、阅读、整理信息，生成结构化的调研报告。",
    badge: "开发中",
    messages: [
      { role: "user", text: "调研 2026 年 AI Agent 领域的主要技术趋势" },
      { role: "ai", text: "我开始搜索最新论文和行业报告，将整理出一份涵盖关键技术方向的综述…" },
    ],
  },
  {
    icon: CalendarDays,
    title: "智能日程",
    desc: "让 Quiddity 帮你规划日程、协调时间、发送提醒，像私人助理一样管理你的时间。",
    badge: "规划中",
    messages: [
      { role: "user", text: "安排下周的产品评审会议，避开已有日程" },
      { role: "ai", text: "我查看了你的日历，周二下午和周四上午空闲，建议周四 10:00…" },
    ],
  },
  {
    icon: LineChart,
    title: "数据分析",
    desc: "上传数据文件，Quiddity 自动分析、可视化、生成洞察报告，让数据说话。",
    badge: "规划中",
    messages: [
      { role: "user", text: "分析这份销售数据，找出增长趋势和问题区域" },
      { role: "ai", text: "我来处理这份数据，做描述性统计和趋势分析，然后生成可视化图表…" },
    ],
  },
];

export default function UseCases() {
  return (
    <section id="usecases" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/90 to-dark-950" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Use Cases
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Quiddity<span className="text-gradient"> 能为你做什么</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            以下是 Quiddity 正在构建的核心应用场景
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {useCases.map((item, index) => (
            <ScrollReveal key={item.title} threshold={0.1}>
              <div
                className="group relative p-6 rounded-2xl glass glow-border card-tilt transition-all duration-500 hover:border-brand-500/20"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors shrink-0">
                    <item.icon size={18} className="text-brand-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        item.badge === "开发中" 
                          ? "bg-brand-500/15 text-brand-400" 
                          : "bg-dark-700/50 text-dark-400"
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-dark-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {item.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-1.5 ${msg.role === "user" ? "justify-end" : ""}`}
                    >
                      {msg.role === "ai" && (
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">
                          Q
                        </div>
                      )}
                      <div
                        className={`p-2 rounded-xl text-[11px] leading-snug max-w-[82%] ${
                          msg.role === "user"
                            ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-dark-200"
                            : "rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-dark-300"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-5 h-5 rounded-md bg-dark-700 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">
                          你
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 rounded-2xl bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
