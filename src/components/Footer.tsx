import { Mail, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

const footerLinks = {
  产品: [
    { label: "功能特色", href: "#features" },
    { label: "应用场景", href: "#usecases" },
    { label: "在线体验", href: "#/demo" },
    { label: "下载应用", href: "#download" },
  ],
  支持: [
    { label: "常见问题", href: "#faq" },
    { label: "版本历程", href: "#/timeline" },
  ],
  关于: [
    { label: "关于Quiddity", href: "#hero" },
    { label: "邮箱联系", href: "mailto:jiu0919@agent.qq.com" },
  ],
};

export default function Footer() {
  const navigate = useNavigate();

  const handleLink = (href: string, e: React.MouseEvent) => {
    if (href.startsWith("mailto:")) return; // let native mailto work
    e.preventDefault();
    if (href.startsWith("#/")) {
      navigate(href.slice(1));
    } else {
      scrollToSection(href.slice(1));
    }
  };

  return (
    <footer className="py-12 sm:py-16 border-t border-white/[0.04] relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#hero" onClick={(e) => handleLink("#hero", e)} className="inline-block text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 hover:text-brand-400 transition-colors">
              Quiddity
            </a>
            <p className="text-xs text-dark-500 leading-relaxed mb-4 sm:mb-5 max-w-52">
              多模型 AI 桌面应用——你的专属 AI 伙伴。
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
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-dark-200 mb-3 sm:mb-4">{category}</h4>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} onClick={(e) => handleLink(link.href, e)} className="text-xs text-dark-500 hover:text-dark-300 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* 免责声明 */}
        <div className="border-t border-white/[0.04] py-4 sm:py-6 mb-2">
          <div className="text-[10px] sm:text-[11px] text-dark-500 leading-relaxed max-w-5xl text-center mx-auto opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-dark-400 font-semibold">免责声明：</span>
            Quiddity是一款基于第三方大语言模型 API 的 AI 聊天桌面应用，<span className="text-dark-300 font-semibold">目前尚未进行任何法律备案</span>。
            使用本软件时请遵守相关法律法规，包括但不限于
            <a href="https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《生成式人工智能服务管理暂行办法》</a>
            <a href="https://www.cac.gov.cn/2025-03/14/c_1796715804888045.htm" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《人工智能拟人化互动服务管理暂行办法》</a>
            <a href="https://www.cac.gov.cn/2021-12/31/c_1648887370382482.htm" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《互联网信息服务算法推荐管理规定》</a>
            <a href="https://www.npc.gov.cn/npc/c30834/201611/7c4d7e2c62d042d380b54e19e8b74068.shtml" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《中华人民共和国网络安全法》</a>
            <a href="https://www.npc.gov.cn/npc/c30834/202106/9dfc6cf54f6b421597da6e72e6880880.shtml" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《中华人民共和国数据安全法》</a>
            <a href="https://www.npc.gov.cn/npc/c30834/202108/0d2752b77d534b418f19b509b565ed66.shtml" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《中华人民共和国个人信息保护法》</a>
            <a href="https://www.npc.gov.cn/npc/c30834/202112/f73d7c95c9a448be9a4d58391450187e.shtml" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《中华人民共和国科学技术进步法》</a>
            <a href="https://www.gov.cn/zhengce/content/2023-10/24/content_6912294.htm" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《未成年人网络保护条例》</a>
            <a href="https://www.gov.cn/zhengce/content/2023-02/17/content_5742864.htm" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《互联网信息服务管理办法》</a>
            <a href="https://www.gov.cn/zhengce/content/2023-07/20/content_6899369.htm" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《中华人民共和国电信条例》</a>
            <a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">GitHub 服务条款与可接受使用政策</a>
            <a href="https://www.copyright.gov/legislation/dmca.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《数字千年版权法（DMCA）》</a>
            <a href="https://www.ecfr.gov/current/title-15/chapter-VII/subchapter-C" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《美国出口管制条例（EAR）》</a>
            <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52024PC0016" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《欧盟人工智能法案（EU AI Act）》</a>
            <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《通用数据保护条例（GDPR）》</a>
            <a href="https://www.wipo.int/treaties/en/" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《世界知识产权组织（WIPO）相关条约》</a>及
            <a href="https://www.wipo.int/treaties/en/text.jsp?file_id=283698" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-1">《伯尔尼公约》</a>。
            本软件仅供学习交流使用，用户需自行承担使用风险，开发者不对因使用本软件产生的任何直接或间接损失承担责任。
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <span className="text-[11px] sm:text-xs text-dark-500">&copy; 2026 Quiddity. All rights reserved.</span>
          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-dark-500">
            Made with <Heart size={11} className="text-red-400" /> by Quiddity开发者
          </span>
        </div>
      </div>
    </footer>
  );
}
