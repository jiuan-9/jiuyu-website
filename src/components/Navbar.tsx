import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight, Github, Twitter } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "功能", href: "#features", sectionId: "features" },
  { label: "场景", href: "#usecases", sectionId: "usecases" },
  { label: "在线体验", href: "#/demo", sectionId: null },
  { label: "下载", href: "#download", sectionId: "download" },
  { label: "FAQ", href: "#faq", sectionId: "faq" },
  { label: "历程", href: "#/timeline", sectionId: null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => l.sectionId)
      .filter(Boolean) as string[];

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

  const isActive = (sectionId: string | null) => {
    if (!sectionId) return false;
    return activeSection === sectionId;
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong border-b border-white/[0.06] shadow-lg shadow-black/30 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      style={{
        transition: isLoaded
          ? "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          : "none",
        transform: isLoaded ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6">
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

        <div className="hidden md:flex items-center gap-6 sm:gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(link.href, e)}
              className={`relative text-sm font-medium transition-all duration-300 group ${
                isActive(link.sectionId)
                  ? "text-brand-400"
                  : "text-dark-300 hover:text-white"
              }`}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <span className="relative z-10">{link.label}</span>
              <span
                className={`absolute bottom-[-4px] left-0 h-[2px] bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-300 ${
                  isActive(link.sectionId) ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                }`}
              />
            </a>
          ))}
          <a
            href="#download"
            onClick={(e) => handleNav("#download", e)}
            className="ml-2 sm:ml-4 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 btn-press relative overflow-hidden group"
          >
            <span className="relative z-10">下载</span>
            <ArrowRight size={14} className="relative z-10 group-hover:translate-x-0.5 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400/0 via-white/20 to-brand-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </a>
        </div>

        <button
          className="md:hidden text-white p-1 sm:p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden glass-strong border-t border-white/[0.06] animate-fade-in"
          style={{ animationDuration: "300ms" }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2 sm:gap-3">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(link.href, e)}
                className={`text-sm sm:text-base py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-200 ${
                  isActive(link.sectionId)
                    ? "text-brand-400 bg-brand-500/10"
                    : "text-dark-300 hover:text-white hover:bg-white/[0.03]"
                }`}
                style={{
                  animation: `fade-in-up 0.4s ease-out ${index * 50}ms forwards`,
                  opacity: 0,
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              onClick={(e) => handleNav("#download", e)}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm sm:text-base font-medium transition-all mt-2"
              style={{
                animation: `fade-in-up 0.4s ease-out ${navLinks.length * 50}ms forwards`,
                opacity: 0,
              }}
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
