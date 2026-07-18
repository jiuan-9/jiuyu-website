/**
 * i18n Store — 双语切换（中文 / 英文）
 * 基于 Zustand，比 react-i18next 节省 ~40KB
 *
 * 用法：
 *   const { lang, setLang, t } = useI18n();
 *   <h1>{t({ zh: "你好", en: "Hello" })}</h1>
 *
 * 持久化到 localStorage，URL hash 同步（#/en 或 #/zh）
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { I18nText, Language } from "@/content";

type I18nState = {
  /** 当前语言 */
  lang: Language;
  /** 切换语言 */
  setLang: (lang: Language) => void;
  /** 在 zh / en 之间切换 */
  toggle: () => void;
  /** 翻译函数：传入双语文本，返回当前语言对应字符串 */
  t: (text: I18nText) => string;
};

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: "zh",
      setLang: (lang) => {
        set({ lang });
        // 同步到 <html lang="..."> 以提升无障碍与 SEO
        if (typeof document !== "undefined") {
          document.documentElement.lang = lang;
        }
      },
      toggle: () => {
        const next = get().lang === "zh" ? "en" : "zh";
        get().setLang(next);
      },
      t: (text) => text[get().lang],
    }),
    {
      name: "quiddity-lang",
      // 仅持久化 lang 字段
      partialize: (state) => ({ lang: state.lang }),
    }
  )
);

/**
 * 静态翻译函数（非 React 场景使用，如脚本或工具函数内）
 */
export function translate(text: I18nText, lang: Language): string {
  return text[lang];
}

/**
 * 初始化：从 URL hash 同步语言（如 #/en 表示英文）
 * 在 main.tsx 中调用 initI18nFromUrl()
 */
export function initI18nFromUrl(): void {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  const match = /#\/(zh|en)/.exec(hash);
  if (match) {
    const lang = match[1] as Language;
    useI18n.getState().setLang(lang);
  }
  // 同步 <html lang>
  const current = useI18n.getState().lang;
  document.documentElement.lang = current;
}

/**
 * 选择当前语言对应文本（用于在组件外读取内容）
 */
export function pick(text: I18nText): string {
  return text[useI18n.getState().lang];
}
