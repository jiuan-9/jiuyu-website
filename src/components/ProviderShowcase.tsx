/**
 * ProviderShowcase — 11 家 AI 服务商滚动展示
 *
 * v3.0 重构（阶段 D 修复"鼠标悬停滚动有点问题"）：
 *   - 移除 JS rAF 滚动逻辑（有闭包 bug + 悬停突兀）
 *   - 改用 CSS @keyframes marquee 无限滚动
 *   - :hover 时 animation-play-state: paused（平滑暂停，无突兀停止）
 *   - 移动端：触摸滑动（CSS scroll-snap）
 *   - prefers-reduced-motion：禁用动画，显示静态网格
 *
 * 视觉保留：玻璃卡片 + 首字母 logo + hover 高亮
 */

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
  // 复制一份用于无缝循环（marquee 效果需要重复内容）
  const loopProviders = [...providers, ...providers];

  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/[0.02] blur-[150px]" />

      <div className="container relative z-20 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            Multi-Provider
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
            接入<span className="text-gradient"> 11 家</span> AI 服务商
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            一个应用汇聚主流 AI 平台，无需反复切换，随心选择你喜欢的模型
          </p>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto">
          {/* 左右渐变遮罩（让边缘卡片淡出） */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-dark-950 to-transparent z-10 pointer-events-none" />

          {/* 滚动轨道：CSS 动画 + hover 暂停 */}
          <div className="provider-marquee-track">
            <div className="provider-marquee-content">
              {loopProviders.map((provider, index) => (
                <div
                  key={`${provider.name}-${index}`}
                  className="flex-shrink-0 flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl glass border border-white/[0.04] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                      <span className="text-xs font-bold text-brand-400">
                        {provider.name.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-brand-500/20 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white whitespace-nowrap group-hover:text-brand-300 transition-colors">
                      {provider.name}
                    </div>
                    <div className="text-[10px] text-dark-500 whitespace-nowrap">
                      {provider.model}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <span className="text-[10px] text-dark-500 flex items-center justify-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
              鼠标悬停暂停滚动
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l-6-6 6-6"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}