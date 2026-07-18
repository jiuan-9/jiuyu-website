import CountUp from "./CountUp";
import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: 11, suffix: "", label: "服务商接入", sublabel: "主流 AI 平台一站集成", gradient: "from-blue-500 to-cyan-500" },
  { value: "∞", suffix: "", label: "无限会话", sublabel: "随心创建，无数量限制", gradient: "from-purple-500 to-pink-500" },
  { value: 100, suffix: "%", label: "本地加密", sublabel: "数据完全由你掌控", gradient: "from-green-500 to-emerald-500" },
  { value: 6, suffix: "", label: "核心功能", sublabel: "代码高亮、人设精调、多模型切换等", gradient: "from-orange-500 to-yellow-500" },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/50 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/[0.02] blur-[200px]" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-500/[0.08] to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">Platform</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            平台<span className="text-gradient"> 能力</span>
          </h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} threshold={0.3}>
              <div className="text-center group" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="relative inline-block mb-2 sm:mb-3">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  <div className="relative text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                </div>
                <div className="text-base sm:text-lg font-semibold text-dark-200 mb-1 group-hover:text-white transition-colors">{stat.label}</div>
                <div className="text-xs sm:text-sm text-dark-400 leading-relaxed px-1 group-hover:text-dark-300 transition-colors">{stat.sublabel}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
