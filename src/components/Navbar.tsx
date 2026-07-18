/**
 * Navbar — 顶部导航
 *
 * v2.1 重构：
 *   - 使用 nav-links content 文件（双语）
 *   - 使用 ScrollProgress 组件（顶部滚动进度条）
 *   - 使用 MagneticButton 组件（CTA 磁吸效果）
 *   - 使用 Framer Motion 入场动画 + 移动端 AnimatePresence
 *   - 使用 useI18n 双语切换
 *   - 滚动感知：背景模糊 + 阴影渐变
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/store/i18n";
import { MagneticButton } from "@/components/animation";
import { navLinks as navLinksContent, navCta } from "@/content/nav-links";
import { easing, duration } from "@/lib/animation";

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

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

  const handleNav = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (href.startsWith("#/")) {
      navigate(href.slice(1));
    } else {
      scrollToSection(href.slice(1));
    }
  };

  const isActive = (link: (typeof navLinksContent)[number]) => {
    if (link.href.startsWith("#/")) return false;
    return activeSection === link.id;
  };

  return (
    <>
      {/* 注意：ScrollProgress 已在 Home.tsx 全局渲染，此处不再重复 */}

      <motion.nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "glass-strong border-b border-white/[0.06] shadow-lg shadow-black/30 backdrop-blur-xl"
            : "bg-transparent"
        }`}
        initial={{ y: "-100%", opacity: 0 }}
        animate={
          isLoaded
            ? { y: "0%", opacity: 1 }
            : { y: "-100%", opacity: 0 }
        }
        transition={{
          duration: duration.slow,
          ease: easing.outQuart,
        }}
      >
        <div className="container mx-auto flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNav("#hero", e)}
            className="flex items-center gap-2.5 group relative"
          >
            <span className="relative">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-brand-400">
                Quiddity
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-500/0 via-brand-500 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </span>
          </a>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center gap-6 sm:gap-8">
            {navLinksContent.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(link.href, e)}
                className={`relative text-sm font-medium transition-colors duration-300 group ${
                  isActive(link)
                    ? "text-brand-400"
                    : "text-dark-300 hover:text-white"
                }`}
                whileHover={{ y: -1 }}
                transition={{ duration: duration.fast, ease: easing.outQuart }}
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
              </motion.a>
            ))}

            {/* CTA：磁吸按钮 */}
            <MagneticButton
              strength={14}
              onClick={(e) => handleNav(navCta.href, e)}
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

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-white p-1 sm:p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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

        {/* 移动端展开菜单：AnimatePresence 滑入 */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden glass-strong border-t border-white/[0.06] overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: duration.normal,
                ease: easing.inOutQuart,
              }}
            >
              <motion.div
                className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2 sm:gap-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                  },
                }}
              >
                {navLinksContent.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNav(link.href, e)}
                    className={`text-sm sm:text-base py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors duration-200 ${
                      isActive(link)
                        ? "text-brand-400 bg-brand-500/10"
                        : "text-dark-300 hover:text-white hover:bg-white/[0.03]"
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
                  </motion.a>
                ))}
                <motion.a
                  href={navCta.href}
                  onClick={(e) => handleNav(navCta.href, e)}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm sm:text-base font-medium transition-all mt-2"
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
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
