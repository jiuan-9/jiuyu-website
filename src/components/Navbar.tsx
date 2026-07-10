import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "功能", href: "#features", sectionId: "features" },
  { label: "场景", href: "#usecases", sectionId: "usecases" },
  { label: "在线体验", href: "#/demo", sectionId: null },
  { label: "下载", href: "#download", sectionId: "download" },
  { label: "FAQ", href: "#faq", sectionId: "faq" },
  { label: "前瞻", href: "#roadmap", sectionId: "roadmap" },
  { label: "历程", href: "#/timeline", sectionId: null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();

  // 滚动监听：背景变化 + 当前区域高亮
  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => l.sectionId)
      .filter(Boolean) as string[];

    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // 检测当前在哪个区域
      const scrollPos = window.scrollY + 120; // 偏移量，提前触发
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

  const isActive = (sectionId: string | null) => {
    if (!sectionId) return false;
    return activeSection === sectionId;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong border-b border-white/[0.06] shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="#hero" onClick={(e) => handleNav("#hero", e)} className="flex items-center gap-2.5 group">
          <span className="text-2xl font-bold text-white tracking-wide transition-colors group-hover:text-brand-400">
            九语
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(link.href, e)}
              className={`text-sm transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand-500 after:transition-all ${
                isActive(link.sectionId)
                  ? "text-brand-400 after:w-full"
                  : "text-dark-300 hover:text-white after:w-0 hover:after:w-full"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            onClick={(e) => handleNav("#download", e)}
            className="ml-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25"
          >
            下载
            <ArrowRight size={14} />
          </a>
        </div>

        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-white/[0.06]">
          <div className="container mx-auto px-6 py-5 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(link.href, e)}
                className={`text-sm py-2 transition-colors ${
                  isActive(link.sectionId) ? "text-brand-400" : "text-dark-300 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              onClick={(e) => handleNav("#download", e)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all mt-2"
            >
              下载
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
