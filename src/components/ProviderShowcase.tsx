import { useEffect, useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const providers = [
  { name: "深度求索", model: "DeepSeek" },
  { name: "阿里云", model: "通义千问" },
  { name: "硅基流动", model: "多模型平台" },
  { name: "智谱", model: "GLM" },
  { name: "月之暗面", model: "Kimi" },
  { name: "阶跃星辰", model: "Step" },
  { name: "科大讯飞", model: "星火" },
  { name: "MiniMax", model: "海螺AI" },
  { name: "腾讯", model: "混元" },
  { name: "字节跳动", model: "豆包" },
  { name: "百度", model: "文心一言" },
];

export default function ProviderShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.4;

    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-transparent to-dark-950 z-10 pointer-events-none" />

      <div className="container relative z-20 mx-auto px-6">
        <ScrollReveal className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            Multi-Provider
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            接入<span className="text-gradient"> 11 家</span> AI 服务商
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm md:text-base">
            一个应用汇聚主流 AI 平台，无需反复切换，随心选择你喜欢的模型
          </p>
        </ScrollReveal>

        <div className="relative max-w-3xl mx-auto">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden py-2"
            style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
          >
            {[...providers, ...providers].map((provider, index) => (
              <div
                key={`${provider.name}-${index}`}
                className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl glass border border-white/[0.04] hover:border-brand-500/20 transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-400">
                    {provider.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white whitespace-nowrap">{provider.name}</div>
                  <div className="text-[10px] text-dark-500 whitespace-nowrap">{provider.model}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
