/**
 * Footer — 页脚
 *
 * v2.1 重构：
 *   - 移除内联 15+ 法律链接段落（UX 灾难），改为指向 /legal 页面的入口
 *   - 使用 content/footer-links 的双语内容
 *   - 使用 useI18n 切换语言
 *   - 动态版权年份
 *   - 保留品牌标识与社交链接
 */

import { Mail, Github, Twitter, Scale, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/store/i18n";
import { scrollToSection } from "@/lib/scroll";
import {
  footerLinks,
  footerSlogan,
  footerDescription,
  footerSocial,
  footerCopyright,
  footerMadeWith,
  footerAdminLink,
  disclaimerTitle,
  disclaimerIntro,
  disclaimerHighlight,
} from "@/content/footer-links";

const LEGAL_LINK_TEXT = {
  zh: "查看完整法律信息",
  en: "View Full Legal Information",
} as const;

export default function Footer() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const handleLink = (href: string, e: React.MouseEvent) => {
    if (href.startsWith("mailto:")) return;
    e.preventDefault();
    if (href.startsWith("#/")) {
      navigate(href.slice(1));
    } else {
      scrollToSection(href.slice(1));
    }
  };

  return (
    <footer className="py-12 sm:py-16 border-t border-white/[0.04] relative overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] rounded-full bg-brand-500/[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[200px] rounded-full bg-purple-500/[0.02] blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* 主网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12">
          {/* 品牌区 */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="#hero"
              onClick={(e) => handleLink("#hero", e)}
              className="inline-block text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 hover:text-brand-400 transition-colors group"
            >
              Quiddity
              <span className="inline-block w-0 h-[2px] bg-gradient-to-r from-brand-500 to-brand-400 group-hover:w-full transition-all duration-300 ml-1" />
            </a>
            <p className="text-xs text-dark-500 leading-relaxed mb-2.5 max-w-52">
              {t(footerDescription)}
            </p>
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="w-6 h-px bg-gradient-to-r from-brand-500/50 via-brand-400/30 to-transparent" />
              <p className="text-xs text-dark-400 tracking-[0.2em] font-light">
                {t(footerSlogan)}
              </p>
            </div>
            {/* 邮箱 */}
            <div className="flex items-center gap-3 mb-4">
              <a
                href={footerSocial.email}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-brand-500/20 transition-all group"
              >
                <Mail size={14} className="text-dark-400 group-hover:text-brand-400 transition-colors" />
                <span className="text-xs text-dark-400 group-hover:text-dark-200 transition-colors">
                  qu9190agent@163.com
                </span>
              </a>
            </div>
            {/* 社交 */}
            <div className="flex items-center gap-2">
              <a
                href={footerSocial.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-brand-500/20 flex items-center justify-center transition-all group"
              >
                <Github size={14} className="text-dark-500 group-hover:text-brand-400 transition-colors" />
              </a>
              <a
                href={footerSocial.twitter}
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-brand-500/20 flex items-center justify-center transition-all group"
              >
                <Twitter size={14} className="text-dark-500 group-hover:text-brand-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* 链接分组 */}
          {footerLinks.map((group) => (
            <div key={group.category.en}>
              <h4 className="text-sm font-semibold text-dark-200 mb-3 sm:mb-4">
                {t(group.category)}
              </h4>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLink(link.href, e)}
                      className="text-xs text-dark-500 hover:text-dark-300 transition-colors group inline-flex items-center gap-1"
                    >
                      {t(link.label)}
                      <span className="w-0 h-[1px] bg-brand-400 group-hover:w-2 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 法律入口（替代原 15+ 链接段落） */}
        <div className="border-t border-white/[0.04] py-4 sm:py-6 mb-2">
          <button
            onClick={() => navigate("/legal")}
            className="group flex items-center gap-3 mx-auto text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
              <Scale size={14} className="text-brand-400" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-dark-200 group-hover:text-brand-300 transition-colors">
                {t(disclaimerTitle)}
              </div>
              <div className="text-[10px] text-dark-500 leading-relaxed max-w-md">
                {t(disclaimerIntro)}
                <span className="text-amber-400/80">{t(disclaimerHighlight)}</span>
                {"..."}
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-dark-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all"
            />
          </button>
          <div className="text-center mt-2">
            <span className="text-[10px] text-brand-400/70 hover:text-brand-400 transition-colors">
              {t(LEGAL_LINK_TEXT)}
            </span>
          </div>
        </div>

        {/* 版权 */}
        <div className="pt-6 sm:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-3">
          <span className="text-[11px] sm:text-xs text-dark-500">
            {typeof footerCopyright.zh === "function"
              ? footerCopyright.zh(year)
              : footerCopyright.zh}
            {" / "}
            {typeof footerCopyright.en === "function"
              ? footerCopyright.en(year)
              : footerCopyright.en}
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-dark-600 hover:text-brand-400 transition-colors group"
              title={t(footerAdminLink)}
            >
              <Shield size={11} className="group-hover:scale-110 transition-transform" />
              {t(footerAdminLink)}
            </button>
            <span className="text-[11px] sm:text-xs text-dark-500">
              {t(footerMadeWith)}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
