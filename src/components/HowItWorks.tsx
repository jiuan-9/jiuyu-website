import { useState, useRef } from "react";
import { Download, Settings, MessageSquare, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/store/i18n";
import {
  howItWorksSteps,
  howItWorksBadge,
  howItWorksSectionTitle,
  howItWorksSectionSubtitle,
} from "@/content/how-it-works";

const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Download,
  Settings,
  MessageSquare,
  Zap,
};

function StepCard({ step, index }: { step: (typeof howItWorksSteps)[number]; index: number }) {
  const { t } = useI18n();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[step.icon];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      className="relative group"
    >
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-[10px] font-bold text-brand-400 shadow-lg shadow-brand-500/20">
        {index + 1}
      </div>
      <div
        className="p-4 sm:p-6 rounded-2xl glass glow-border transition-all duration-500 overflow-hidden"
        style={{
          transform: isHovered ? `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg) scale(1.02)` : "perspective(1000px) rotateY(0) rotateX(0) scale(1)",
          transition: "transform 0.3s ease-out, border-color 0.5s ease",
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

        <div className="relative z-10">
          <div className="relative">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-brand-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gradient-to-br ${step.gradient} transition-all duration-500`}>
              {Icon && (
                <>
                  <Icon size={22} className="sm:hidden text-brand-400" />
                  <Icon size={26} className="hidden sm:block text-brand-400" />
                </>
              )}
            </div>
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.gradient} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2 group-hover:text-brand-300 transition-colors">{t(step.title)}</h3>
          <p className="text-xs sm:text-sm text-dark-400 leading-relaxed group-hover:text-dark-300 transition-colors">{t(step.description)}</p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-500/[0.03] blur-[150px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            {t(howItWorksBadge)}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t(howItWorksSectionTitle)}
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {t(howItWorksSectionSubtitle)}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <ScrollReveal key={step.icon} threshold={0.2}>
              <StepCard step={step} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
