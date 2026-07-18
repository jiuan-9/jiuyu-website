import type { NavLink } from "./types";

/** 顶部导航链接 */
export const navLinks: NavLink[] = [
  {
    id: "features",
    label: { zh: "功能特色", en: "Features" },
    href: "#features",
  },
  {
    id: "usecases",
    label: { zh: "应用场景", en: "Use Cases" },
    href: "#usecases",
  },
  {
    id: "demo",
    label: { zh: "在线体验", en: "Live Demo" },
    href: "#/demo",
  },
  {
    id: "quiddity",
    label: { zh: "Quiddity Agent", en: "Quiddity Agent" },
    href: "#quiddity",
  },
  {
    id: "faq",
    label: { zh: "常见问题", en: "FAQ" },
    href: "#faq",
  },
  {
    id: "download",
    label: { zh: "下载应用", en: "Download" },
    href: "#download",
  },
];

/** 导航按钮 */
export const navCta: { label: { zh: string; en: string }; href: string } = {
  label: { zh: "立即下载", en: "Download" },
  href: "#download",
};

/** 移动端菜单标题 */
export const mobileMenuTitle: { zh: string; en: string } = {
  zh: "菜单",
  en: "Menu",
};
