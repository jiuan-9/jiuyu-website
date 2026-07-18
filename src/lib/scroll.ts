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
