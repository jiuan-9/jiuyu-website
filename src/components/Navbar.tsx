/**
 * Navbar — 顶部导航（v3.0 完全重写）
 *
 * 用户反馈（v2.x 失败）：
 *   "除了在线体验外，常见问题、功能特色、应用场景等等，都没用，点了也不划到对应的地方"
 *
 * 根因分析（v2.x 失败的真正原因）：
 *   HashRouter 下 `<a href="#features">` 即使调用 e.preventDefault()，
 *   React Router 内部 listener 仍可能响应 hash 变化 → 路由切换到 /features
 *   → 目标 section 在 Home 页才存在 → scrollToSection 在 /features 路由下找不到元素 → 静默失败
 *
 * v3.0 终极方案：
 *   - 用 `<button>` 替代 `<a>`，没有 href 属性
 *   - 浏览器和 HashRouter 都不会响应（button 无 hash 概念）
 *   - onClick 直接调用 scrollToSection 或 navigate
 *   - 子路由下点击锚点：navigate("/") 后用 setTimeout 多次重试等到 section 挂载
 *
 * 兼容保留：
 *   - framer-motion 入场动画 + whileHover 微动效
 *   - activeSection 高亮（基于 scroll 监听）
 *   - 滚动感知背景（scrolled state）
 *   - 移动端 AnimatePresence 滑入菜单
 *   - MagneticButton CTA
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { navigateToSection } from "@/lib/scroll";
import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/store/i18n";
import { MagneticButton } from "@/components/animation";
import { navLinks as navLinksContent, navCta } from "@/content/nav-links";
import { easing, duration } from "@/lib/animation";

export default function Navbar() {
  const { t, lang, toggle } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 入场触发
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 滚动监听：背景感知 + 当前 section 高亮
  useEffect(() => {
    const sectionIds = navLinksContent
      .filter((l) => !l.href.startsWith("#/"))
      .map((l) => l.id);

    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const scrollPos = window.scrollY + 120;
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection(null);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * 导航核心处理函数（v3.0 终极版）
   *
   * 关键设计：
   *   - 用 button 触发，无 href 属性
   *   - 跨路由锚点 / 同页锚点 / 路由跳转 统一委托给 navigateToSection
   *   - 重试逻辑（50ms / 100ms / 200ms / 400ms / 800ms）封装在 scroll.ts，便于复用
   */
  const handleNav = useCallback(
    (href: string) => {
      setMobileOpen(false);
      navigateToSection(href, navigate, location.pathname);
    },
    [location.pathname, navigate]
  );

  const isActive = (link: (typeof navLinksContent)[number]) => {
    if (link.href.startsWith("#/")) return false;
    return activeSection === link.id;
  };

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "glass-strong border-b border-white/[0.06] shadow-lg shadow-black/30 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      initial={{ y: "-100%", opacity: 0 }}
      animate={isLoaded ? { y: "0%", opacity: 1 } : { y: "-100%", opacity: 0 }}
      transition={{
        duration: duration.slow,
        ease: easing.outQuart,
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6">
        {/* Logo —— 用 button 代替 a，避免 href="#hero" 触发 hash 变化 */}
        <button
          type="button"
          onClick={() => handleNav("#hero")}
          className="flex items-center gap-2.5 group relative bg-transparent border-0 cursor-pointer p-0"
          aria-label="回到顶部"
        >
          <span className="relative">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-brand-400">
              Quiddity
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-500/0 via-brand-500 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </span>
        </button>

        {/* 桌面端导航 —— 全部用 button，无 href */}
        <div className="hidden md:flex items-center gap-6 sm:gap-8">
          {navLinksContent.map((link) => (
            <motion.button
              key={link.href}
              type="button"
              onClick={() => handleNav(link.href)}
              whileHover={{ y: -1 }}
              transition={{ duration: duration.fast, ease: easing.outQuart }}
              className={`relative text-sm font-medium transition-colors duration-300 group bg-transparent border-0 cursor-pointer p-0 ${
                isActive(link)
                  ? "text-brand-400"
                  : "text-dark-300 hover:text-white"
              }`}
              aria-current={isActive(link) ? "true" : undefined}
            >
              <span className="relative z-10">{t(link.label)}</span>
              <motion.span
                className="absolute bottom-[-4px] left-0 h-[2px] bg-gradient-to-r from-brand-500 to-brand-400"
                initial={false}
                animate={
                  isActive(link)
                    ? { width: "100%", opacity: 1 }
                    : { width: "0%", opacity: 0 }
                }
                transition={{
                  duration: duration.normal,
                  ease: easing.outQuart,
                }}
              />
            </motion.button>
          ))}

          {/* 语言切换：单字符紧凑设计，符合单色几何风格 */}
          <button
            type="button"
            onClick={toggle}
            aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
            title={lang === "zh" ? "Switch to English" : "切换到中文"}
            className="text-xs font-medium text-dark-400 hover:text-white transition-colors bg-transparent border border-white/[0.06] hover:border-white/[0.12] cursor-pointer px-2.5 py-1 rounded-md hover:bg-white/[0.04] ml-1 tracking-wider"
          >
            {lang === "zh" ? "EN" : "中"}
          </button>

          {/* CTA：磁吸按钮（已经是 button，无需修改） */}
          <MagneticButton
            strength={14}
            onClick={() => handleNav(navCta.href)}
            className="ml-2 sm:ml-4 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25 btn-press relative overflow-hidden group cursor-pointer"
          >
            <span className="relative z-10">{t(navCta.label)}</span>
            <ArrowRight
              size={14}
              className="relative z-10 group-hover:translate-x-0.5 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400/0 via-white/20 to-brand-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </MagneticButton>
        </div>

        {/* 移动端：语言切换 + 菜单按钮 */}
        <div className="md:hidden flex items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
            title={lang === "zh" ? "Switch to English" : "切换到中文"}
            className="text-xs font-medium text-dark-400 hover:text-white active:text-white active:scale-95 transition-all bg-transparent border border-white/[0.06] hover:border-white/[0.12] cursor-pointer px-3 py-2 rounded-md hover:bg-white/[0.04] tracking-wider min-h-[44px]"
          >
            {lang === "zh" ? "EN" : "中"}
          </button>
          <button
            type="button"
            className="text-white p-2.5 -mr-2 rounded-lg hover:bg-white/[0.05] active:bg-white/[0.08] active:scale-95 transition-all bg-transparent border-0 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: duration.fast }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: duration.fast }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
          </button>
        </div>
      </div>

      {/* 移动端展开菜单：AnimatePresence 滑入，全部 button
       * 性能优化：用 transform: translateY 替代 height: auto 动画
       * height 动画会触发 layout/paint，transform 仅合成层处理（GPU 加速） */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden glass-strong border-t border-white/[0.06] overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: duration.fast,
              ease: easing.outQuart,
            }}
            style={{ willChange: "transform, opacity" }}
          >
            <motion.div
              className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2 sm:gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.03, delayChildren: 0.04 },
                },
              }}
            >
              {navLinksContent.map((link) => (
                <motion.button
                  key={link.href}
                  type="button"
                  onClick={() => handleNav(link.href)}
                  className={`text-left text-sm sm:text-base py-3.5 sm:py-3 px-4 sm:px-4 rounded-lg transition-colors duration-200 bg-transparent border-0 cursor-pointer active:scale-[0.98] min-h-[48px] ${
                    isActive(link)
                      ? "text-brand-400 bg-brand-500/10"
                      : "text-dark-300 hover:text-white hover:bg-white/[0.03] active:bg-white/[0.05]"
                  }`}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: duration.normal,
                        ease: easing.outQuart,
                      },
                    },
                  }}
                >
                  {t(link.label)}
                </motion.button>
              ))}
              <motion.button
                type="button"
                onClick={() => handleNav(navCta.href)}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 sm:py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm sm:text-base font-medium transition-all mt-2 border-0 cursor-pointer active:scale-[0.98] min-h-[48px]"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: duration.normal,
                      ease: easing.outQuart,
                    },
                  },
                }}
              >
                {t(navCta.label)}
                <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
