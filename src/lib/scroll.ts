/**
 * scrollToSection — 平滑滚动到指定 section
 *
 * 修复（阶段 D）：原版用 el.scrollIntoView，依赖 CSS scroll-margin-top 才能避开 fixed Navbar
 * 但实际 dev/prod 环境中 CSS 有时不生效，导致"按钮没反应"的视觉错觉
 *
 * 新版：用 getBoundingClientRect + window.scrollTo 手动计算偏移，不依赖 CSS
 *   - 减去 Navbar 高度（80px），确保 section 标题不被遮挡
 *   - supportsReduceMotion 检测：reduced motion 时直接跳转（无动画）
 */

import type { NavigateFunction } from "react-router-dom";

const NAVBAR_HEIGHT = 80;

export function scrollToSection(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) {
    if (import.meta.env?.DEV) {
      console.warn(`[scrollToSection] element not found: #${id}`);
    }
    return;
  }

  const rect = el.getBoundingClientRect();
  const targetTop = window.scrollY + rect.top - NAVBAR_HEIGHT;

  // 检测 prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    window.scrollTo(0, targetTop);
  } else {
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }
}

/**
 * 跨路由锚点跳转的重试延迟序列（覆盖 lazy chunk 加载耗时）
 * 50ms / 100ms / 200ms / 400ms / 800ms，5 次重试足够覆盖 99% 的网络情况
 */
const RETRY_DELAYS = [50, 100, 200, 400, 800];

/**
 * navigateToSection — 统一导航函数：处理同页锚点 + 跨路由锚点
 *
 * 设计目标：把 Navbar 内联的重试逻辑抽出来，让 Footer / Hero / 其他页面都能复用
 *
 * 行为分支：
 *   - href 以 "#/" 开头：路由跳转（如 "#/demo" → navigate("/demo")）
 *   - href 以 "#" 开头（但不是 "#/"）：同页锚点
 *     - 当前在 Home：直接 scrollToSection
 *     - 当前在子路由：navigate("/") 后多次重试 scrollToSection
 *       （因为 Home 是 lazy import，需要等 chunk 加载和组件 mount 完成）
 *
 * @param href 形如 "#features" 或 "#/demo"
 * @param navigate react-router useNavigate 返回的函数
 * @param currentPathname 当前路径（useLocation().pathname）
 */
export function navigateToSection(
  href: string,
  navigate: NavigateFunction,
  currentPathname: string
): void {
  if (href.startsWith("#/")) {
    navigate(href.slice(1));
    return;
  }

  const sectionId = href.slice(1);

  if (currentPathname === "/") {
    scrollToSection(sectionId);
    return;
  }

  // 子路由 → 先回 Home，等渲染完成后滚动
  navigate("/");
  RETRY_DELAYS.forEach((delay) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        scrollToSection(sectionId);
      }
    }, delay);
  });
}
