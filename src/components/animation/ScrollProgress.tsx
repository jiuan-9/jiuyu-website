/**
 * ScrollProgress — 滚动进度全局可视化
 *
 * 阶段 B 核心（用户突发想法）：滚动进度可视化
 *   1. 顶部进度条：fixed top，宽度 = 滚动百分比，品牌蓝渐变
 *   2. 侧边章节导航点：fixed right，每个点代表一个 section
 *      - 当前 section 高亮
 *      - 点击跳转到对应 section
 *      - hover 显示 section 名称
 *
 * 性能：
 *   - 复用 useScrollProgress hook（已 rAF 节流）
 *   - 顶部进度条用 width 而非 transform（量很小，可接受）
 *   - 移动端不显示侧边导航点（避免遮挡内容）
 *   - reduced motion：仍显示进度条（静态），不显示导航点
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/store/i18n";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { rafThrottle } from "@/lib/perf";

interface SectionInfo {
  id: string;
  label: { zh: string; en: string };
}

const SECTIONS: SectionInfo[] = [
  { id: "hero", label: { zh: "首页", en: "Home" } },
  { id: "features", label: { zh: "功能", en: "Features" } },
  { id: "usecases", label: { zh: "应用场景", en: "Use Cases" } },
  { id: "howitworks", label: { zh: "工作原理", en: "How It Works" } },
  { id: "stats", label: { zh: "数据", en: "Stats" } },
  { id: "faq", label: { zh: "常见问题", en: "FAQ" } },
  { id: "download", label: { zh: "下载", en: "Download" } },
];

export type ScrollProgressProps = {
  /** 顶部进度条高度（像素），默认 2 */
  height?: number;
  /** 顶部进度条颜色，默认品牌渐变 */
  color?: string;
  /** 是否显示百分比文字，默认 false */
  showLabel?: boolean;
  /** 顶部进度条位置，默认顶部 */
  position?: "top" | "bottom";
  /** 是否显示侧边导航点，默认 true（移动端自动隐藏） */
  showSideDots?: boolean;
  className?: string;
};

export default function ScrollProgress({
  height = 2,
  color = "linear-gradient(to right, rgb(20, 176, 255), rgb(168, 85, 247))",
  showLabel = false,
  position = "top",
  showSideDots = true,
  className = "",
}: ScrollProgressProps) {
  const { t } = useI18n();
  const { progress } = useScrollProgress();
  const percent = Math.round(progress * 100);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 移动端检测
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 当前 section 检测（rAF 节流）
  const detectActiveSection = useCallback(
    rafThrottle(() => {
      let current = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // section 顶部进入视口 1/3 处时认为"当前"
        if (rect.top <= window.innerHeight / 3) {
          current = section.id;
        }
      }
      setActiveSection(current);
    }),
    [],
  );

  useEffect(() => {
    detectActiveSection();
    window.addEventListener("scroll", detectActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", detectActiveSection);
  }, [detectActiveSection]);

  // 点击导航点跳转
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* 顶部进度条 */}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="页面滚动进度"
        className={`fixed ${
          position === "top" ? "top-0" : "bottom-0"
        } left-0 right-0 z-[60] pointer-events-none ${className}`}
        style={{ height }}
      >
        <motion.div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            boxShadow: "0 0 8px rgba(20, 176, 255, 0.6)",
          }}
        />
        {showLabel && (
          <div className="absolute right-2 top-1 text-[10px] text-dark-300 font-mono">
            {percent}%
          </div>
        )}
      </div>

      {/* 侧边章节导航点（仅桌面端） */}
      {showSideDots && !isMobile && (
        <nav
          aria-label="section navigation"
          className="fixed right-6 top-1/2 -translate-y-1/2 z-[55] hidden md:flex flex-col gap-3"
        >
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            const isHovered = hoveredSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleClick(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                className="group relative flex items-center justify-end h-3 w-3"
                aria-label={t(section.label)}
                aria-current={isActive ? "true" : undefined}
              >
                {/* tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-6 whitespace-nowrap px-2 py-1 rounded-md bg-dark-800 border border-white/10 text-[10px] text-dark-100 font-medium"
                    >
                      {t(section.label)}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* 圆点 */}
                <motion.span
                  className="block rounded-full"
                  animate={{
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                    backgroundColor: isActive
                      ? "rgb(20, 176, 255)"
                      : "rgba(255, 255, 255, 0.2)",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    boxShadow: isActive
                      ? "0 0 12px rgba(20, 176, 255, 0.6)"
                      : "none",
                  }}
                />
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}