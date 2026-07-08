import CountUp from "./CountUp";
import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: 60, suffix: "+", label: "内置模型", sublabel: "DeepSeek · Qwen · GLM · Kimi 等 62 款" },
  { value: 11, suffix: "", label: "服务商", sublabel: "阿里云 · 百度 · 腾讯 · 字节跳动等" },
  { value: "∞", suffix: "", label: "无限会话", sublabel: "随心创建，无数量限制" },
  { value: 100, suffix: "%", label: "本地加密", sublabel: "数据完全由你掌控" },
];

export default function Stats() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background gradient line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-500/10 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            By the Numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            用数据说话
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} threshold={0.3}>
              <div
                className="text-center group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-dark-200 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-dark-500">{stat.sublabel}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
