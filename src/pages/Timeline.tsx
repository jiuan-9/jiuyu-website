import { useEffect } from "react";
import {
  ArrowLeft, Globe, Zap, Shield, Code, Palette, Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/store/i18n";
import {
  timelineTitle,
  timelineSubtitle,
  timelineBackHomeLabel,
  timelineMilestones,
  timelineStats,
} from "@/content";
import type { TimelineHighlight } from "@/content/timeline";

const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Globe,
  Zap,
  Shield,
  Code,
  Palette,
  Layers,
};

const colorMap = {
  blue:   { dot: "bg-blue-500",   badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  purple: { dot: "bg-purple-500", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
} as const;

function HighlightIcon({ icon }: { icon: TimelineHighlight["icon"] }) {
  const Icon = iconMap[icon];
  if (!Icon) return null;
  return <Icon size={11} className="text-dark-500" />;
}

export default function Timeline() {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = timelineStats.map((stat) => ({
    ...stat,
    value: stat.value.replace("{count}", String(timelineMilestones.length)),
  }));

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/50 to-dark-950" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-500/[0.02] blur-[180px]" />

        <div className="container relative z-10 mx-auto px-6 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-16">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-dark-400 hover:text-brand-400 hover:bg-white/[0.05] transition-colors"
              aria-label={t(timelineBackHomeLabel)}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{t(timelineTitle)}</h1>
              <p className="text-xs text-dark-500">{t(timelineSubtitle)}</p>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-500/20 via-brand-500/10 to-transparent" />

            <div className="flex flex-col gap-8">
              {timelineMilestones.map((m) => {
                const c = colorMap[m.color];
                return (
                  <ScrollReveal key={m.version} threshold={0.1}>
                    <div className="relative pl-12">
                      {/* Dot on the line */}
                      <div className={`absolute left-[11px] top-2 w-[9px] h-[9px] rounded-full ${c.dot} ring-4 ring-dark-950`} />

                      {/* Date */}
                      <div className="text-[11px] text-dark-500 mb-2 tracking-wide">{m.date}</div>

                      {/* Card */}
                      <div className="glass glow-border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl font-bold text-white tracking-wide">{m.version}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${c.badge}`}>
                            {t(m.label)}
                          </span>
                        </div>

                        <p className="text-xs text-dark-400 leading-relaxed mb-4">{t(m.description)}</p>

                        <div className="flex flex-wrap gap-2">
                          {m.highlights.map((h) => (
                            <span
                              key={h.text.zh}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-dark-300"
                            >
                              <HighlightIcon icon={h.icon} />
                              {t(h.text)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div key={stat.label.zh} className="text-center py-5 px-3 rounded-2xl glass">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[11px] text-dark-400">{t(stat.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
