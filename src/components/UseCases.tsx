import { useState, useRef, useEffect } from "react";
import { Code, BookOpen, Palette, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { parseContent, highlightCode } from "@/lib/syntax-highlight";
import { useI18n } from "@/store/i18n";
import type { I18nText } from "@/content";
import {
  useCases,
  useCasesBadge,
  useCasesSectionTitle,
  useCasesSectionSubtitle,
  expandLabel,
  collapseLabel,
  useCasesAvatarLabels,
  codeLabelFallback,
} from "@/content/use-cases";

const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Code,
  BookOpen,
  Palette,
  MessageCircle,
};

type Role = "user" | "ai";

function ChatBubble({ text, role, index }: { text: I18nText; role: Role; index: number }) {
  const { t } = useI18n();
  return (
    <div className={`flex items-start gap-1.5 ${role === "user" ? "justify-end" : ""} animate-slide-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
      {role === "ai" && (
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 shadow-lg shadow-brand-500/30">
          {t(useCasesAvatarLabels.ai)}
        </div>
      )}
      <div className="max-w-[82%] min-w-0">
        {parseContent(t(text)).map((seg, si) =>
          seg.type === "code" ? (
            <div key={si} className="my-2 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0d1117] shadow-lg">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.04] bg-[#161b22]/80">
                <span className="text-[9px] text-dark-500 font-medium">{seg.language || t(codeLabelFallback)}</span>
              </div>
              <pre className="px-3 py-2 text-[10px] leading-relaxed font-mono overflow-x-auto" style={{ fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace" }}>
                <code dangerouslySetInnerHTML={{ __html: highlightCode(seg.content, seg.language || "") }} />
              </pre>
            </div>
          ) : (
            <div key={si} className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 hover:scale-[1.01] ${
              role === "user"
                ? "rounded-tr-sm bg-gradient-to-br from-brand-500/20 to-brand-600/15 border border-brand-500/20 text-dark-200"
                : "rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-dark-300"
            }`}>
              {seg.content}
            </div>
          )
        )}
      </div>
      {role === "user" && (
        <div className="w-6 h-6 rounded-lg bg-dark-700/80 border border-white/[0.08] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
          {t(useCasesAvatarLabels.user)}
        </div>
      )}
    </div>
  );
}

function ExpandableCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof useCases)[number];
  index: number;
  isOpen: boolean;
  onToggle: (idx: number | null) => void;
}) {
  const { t } = useI18n();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const Icon = iconMap[item.icon];

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div
      className={`relative rounded-2xl glass glow-border transition-all duration-500 overflow-hidden ${
        isOpen ? "border-brand-500/30 shadow-xl shadow-brand-500/10" : "hover:border-brand-500/20"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 ${isOpen ? "opacity-30" : ""} transition-opacity duration-500`} />

      <button
        onClick={() => onToggle(isOpen ? null : index)}
        className="w-full text-left p-5 cursor-pointer relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className={`relative`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 ${
              isOpen ? `bg-gradient-to-br ${item.iconBg} scale-110` : `bg-dark-800`
            }`}>
              {Icon && <Icon size={22} className={item.iconColor} />}
            </div>
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.iconBg} blur-lg opacity-0 ${isOpen ? "opacity-50" : ""} transition-opacity duration-500`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">{t(item.title)}</h3>
              <span className="hidden sm:inline text-[11px] text-dark-500">—</span>
              <span className="hidden sm:inline text-xs text-dark-400">{t(item.subtitle)}</span>
            </div>
            <p className="text-[10px] text-dark-500 mt-0.5 sm:hidden">{t(item.subtitle)}</p>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors shrink-0 ${
            isOpen ? "text-brand-400" : "text-dark-500"
          }`}>
            <span>{isOpen ? t(collapseLabel) : t(expandLabel)}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="px-5 pb-5 relative z-10">
          <div className={`h-[1px] mb-4 bg-gradient-to-r ${item.color} from-20% via-50% to-transparent`} />
          <div className="space-y-3">
            {item.messages.map((msg, i) => (
              <ChatBubble key={i} text={msg.text} role={msg.role as Role} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UseCases() {
  const { t } = useI18n();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section id="usecases" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] rounded-full bg-brand-500/[0.02] blur-[150px]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] rounded-full bg-purple-500/[0.02] blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">{t(useCasesBadge)}</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t(useCasesSectionTitle)}
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t(useCasesSectionSubtitle)}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 max-w-5xl mx-auto">
          {useCases.map((item, index) => (
            <ScrollReveal key={item.id} threshold={0.1}>
              <ExpandableCard
                item={item}
                index={index}
                isOpen={activeIdx === index}
                onToggle={setActiveIdx}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}