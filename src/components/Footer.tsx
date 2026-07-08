import { Mail, Heart } from "lucide-react";

const footerLinks = {
  产品: [
    { label: "功能特色", href: "#features" },
    { label: "应用场景", href: "#usecases" },
    { label: "在线体验", href: "#demo" },
    { label: "下载应用", href: "#download" },
  ],
  支持: [
    { label: "常见问题", href: "#faq" },
  ],
  关于: [
    { label: "关于九语", href: "#hero" },
    { label: "邮箱联系", href: "mailto:jiu0919@agent.qq.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="py-16 border-t border-white/[0.04] relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#hero" className="inline-block text-2xl font-bold text-white mb-3 hover:text-brand-400 transition-colors">
              九语
            </a>
            <p className="text-xs text-dark-500 leading-relaxed mb-5 max-w-52">
              你的专属 AI 伙伴 — 支持多模型接入的桌面聊天应用，让 AI 真正为你所用。
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:jiu0919@agent.qq.com"
                className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-dark-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-dark-200 mb-4">
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-dark-500 hover:text-dark-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-dark-600">
            &copy; 2026 九语. All rights reserved.
          </span>
          <span className="flex items-center gap-1 text-xs text-dark-600">
            Made with <Heart size={11} className="text-red-400" /> by 九语团队
          </span>
        </div>
      </div>
    </footer>
  );
}
