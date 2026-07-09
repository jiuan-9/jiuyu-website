import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Quiddity", href: "#quiddity" },
  { label: "下载", href: "#download" },
  { label: "在线体验", href: "#/demo" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong border-b border-white/[0.06] shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <span className="text-2xl font-bold text-white tracking-wide transition-colors group-hover:text-brand-400">
            九语
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-dark-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            className="ml-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25"
          >
            下载
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-white/[0.06]">
          <div className="container mx-auto px-6 py-5 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-dark-300 hover:text-white transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              onClick={() => setMobileOpen(false)}
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
