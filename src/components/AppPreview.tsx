import { Monitor, Settings, Search, MoreVertical, Sun, Image, Zap, Layers, Shield, Palette } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { parseContent, highlightCode } from "@/lib/syntax-highlight";
import { scrollToSection } from "@/lib/scroll";
import { useI18n } from "@/store/i18n";
import {
  appPreviewBadge,
  appPreviewSectionTitle,
  appPreviewSectionSubtitle,
  appPreviewHint,
  appPreviewChatSessions,
  appPreviewInputPlaceholder,
  appPreviewSenderLabels,
  appPreviewMobileHighlights,
  appPreviewFeatureTags,
  appPreviewMobileCta,
} from "@/content/app-preview";

// 动态图标映射
const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Monitor,
  Settings,
  Sun,
  Zap,
  Layers,
  Shield,
  Palette,
};

function AppMockup() {
  const { t } = useI18n();
  const [activeChat, setActiveChat] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const current = appPreviewChatSessions[activeChat];

  const handleChatChange = (index: number) => {
    if (activeChat === index) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveChat(index);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="relative w-full max-w-[900px] mx-auto">
      <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-brand-500/30 via-purple-500/20 to-brand-500/30 blur-xl opacity-40 animate-gradient-shift" />
      <div className="w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden border border-white/[0.08] bg-dark-900/80 shadow-2xl shadow-black/60 animate-scale-in-slow relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.02] via-transparent to-purple-500/[0.02]" />
        
        <div className="h-[40px] flex items-center px-2 bg-dark-900/95 border-b border-white/[0.05] backdrop-blur-sm relative">
          <div className="flex items-center gap-0 shrink-0">
            <button className="w-[36px] h-[36px] rounded-md flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-dark-200 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <button className="w-[36px] h-[36px] rounded-md flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-brand-400 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[13px] font-medium text-dark-300 tracking-[0.5px]">Quiddity</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button className="w-[32px] h-[32px] rounded-sm flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-dark-200 transition-colors text-[11px] font-[Segoe_MDL2_Assets]">&#xE921;</button>
            <button className="w-[32px] h-[32px] rounded-sm flex items-center justify-center text-dark-400 hover:bg-white/[0.03] hover:text-dark-200 transition-colors text-[11px] font-[Segoe_MDL2_Assets]">&#xE922;</button>
            <button className="w-[32px] h-[32px] rounded-sm flex items-center justify-center text-dark-400 hover:bg-[#e81123] hover:text-white transition-colors text-[11px] font-[Segoe_MDL2_Assets]">&#xE8BB;</button>
          </div>
        </div>

        <div className="flex h-[440px]">
          <div className="w-[220px] shrink-0 border-r border-white/[0.04] bg-dark-900/60 flex flex-col">
            <div className="flex items-center gap-2 p-[10px_12px] border-b border-white/[0.04]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 px-2 py-1 rounded-sm bg-white/[0.03] text-[12px] text-dark-400">
                  <Search size={11} />
                  <span className="truncate">{t(appPreviewInputPlaceholder)}</span>
                </div>
              </div>
              <button className="w-[26px] h-[26px] rounded-sm border border-white/[0.08] flex items-center justify-center text-dark-500 hover:bg-white/[0.03] hover:text-dark-300 transition-colors text-[14px]">⚙</button>
              <button className="w-[26px] h-[26px] rounded-sm border border-white/[0.08] flex items-center justify-center text-dark-300 hover:bg-white/[0.03] hover:text-dark-100 transition-colors text-[16px] leading-none">+</button>
              <button className="w-[26px] h-[26px] rounded-sm flex items-center justify-center text-dark-500 hover:bg-white/[0.03] hover:text-dark-300 transition-colors text-[14px]">&laquo;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-[6px] space-y-[2px]">
              {appPreviewChatSessions.map((chat, i) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatChange(i)}
                  className={`w-full flex items-center justify-between px-[12px] py-[10px] rounded-md text-[13px] text-left transition-all duration-300 group relative overflow-hidden ${
                    activeChat === i
                      ? "bg-brand-500/10 text-brand-400 font-medium"
                      : "text-dark-300 hover:bg-white/[0.03]"
                  }`}
                >
                  {activeChat === i && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent" />
                  )}
                  <span className="truncate flex-1 relative z-10">{t(chat.name)}</span>
                  <MoreVertical size={12} className="opacity-40 group-hover:opacity-60 shrink-0 relative z-10" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-dark-950/40 min-w-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.01] via-transparent to-purple-500/[0.01]" />
            <div className="h-[36px] flex items-center px-[16px] border-b border-white/[0.04] shrink-0 relative z-10">
              <span className="text-[13px] text-dark-200 font-medium truncate">{t(current.name)}</span>
              <span className="ml-auto text-[11px] text-dark-500 shrink-0 ml-2">{current.model}</span>
            </div>

            <div className={`flex-1 overflow-y-auto px-[16px] py-[20px] relative z-10 transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
              <div className="max-w-[640px] mx-auto space-y-[8px]">
                {current.messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <span className="text-[12px] font-medium text-dark-500 mb-[4px] px-[4px]">
                      {msg.role === "user" ? t(appPreviewSenderLabels.user) : t(appPreviewSenderLabels.ai)}
                    </span>
                    <div className={`max-w-[85%] min-w-0 ${msg.role === "user" ? "" : ""}`}>
                      {parseContent(t(msg.text)).map((seg, si) =>
                        seg.type === "code" ? (
                          <div key={si} className="my-3 rounded-[12px] overflow-hidden border border-[#3a3a3e]/30 bg-[#161b22]" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)" }}>
                            <div className="flex items-center justify-between px-[16px] py-[7px] border-b border-white/[0.04]">
                              <span className="text-[11px] text-dark-400 font-medium uppercase tracking-wide">
                                {seg.language || "text"}
                              </span>
                            </div>
                            <pre className="overflow-x-auto">
                              <code
                                className="block text-[13px] leading-[1.65] py-[14px] px-[18px] max-h-[500px] whitespace-pre"
                                style={{ fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace", width: "max-content" }}
                                dangerouslySetInnerHTML={{ __html: highlightCode(seg.content, seg.language || "") }}
                              />
                            </pre>
                          </div>
                        ) : (
                          <div key={si} className={`px-[15px] py-[10px] text-[14px] leading-[1.6] whitespace-pre-wrap break-words transition-all duration-300 hover:scale-[1.01] ${
                            msg.role === "user"
                              ? "rounded-[18px] rounded-br-[8px] bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20"
                              : "rounded-[18px] rounded-bl-[8px] bg-[#242428] text-[#f0f0f2] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                          }`}>
                            {seg.content}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-[16px] py-[10px_14px] border-t border-white/[0.04] shrink-0 relative z-10">
              <div className="flex items-center gap-[8px]">
                <button className="w-[30px] h-[30px] rounded-full border border-white/[0.1] flex items-center justify-center text-dark-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300 text-[13px] font-bold">?</button>
                <button className="w-[30px] h-[30px] rounded-full border border-white/[0.1] flex items-center justify-center text-dark-500 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all duration-300">
                  <Image size={14} />
                </button>
                <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-[14px] py-[9px] text-[14px] text-dark-500 min-h-[38px] flex items-center">
                  {t(appPreviewInputPlaceholder)}
                </div>
                <button className="w-[38px] h-[38px] rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center text-white hover:from-brand-400 hover:to-brand-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-500/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppPreview() {
  const { t } = useI18n();

  return (
    <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/70 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-500/[0.025] blur-[150px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            <Monitor size={12} className="animate-pulse" />
            {t(appPreviewBadge)}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t(appPreviewSectionTitle)}
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {t(appPreviewSectionSubtitle)}
          </p>
          <p className="text-[11px] sm:text-xs text-dark-500 mt-2 sm:mt-3 hidden sm:block">
            {t(appPreviewHint)}
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1} className="hidden sm:block">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-brand-500/20 rounded-3xl blur-xl opacity-30" />
            <AppMockup />
          </div>
        </ScrollReveal>

        <ScrollReveal threshold={0.1} className="sm:hidden">
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
            {appPreviewMobileHighlights.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={item.id} className="glass rounded-xl p-4 text-center card-interactive">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-2.5">
                    {Icon && <Icon size={20} className="text-brand-400" />}
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">{t(item.title)}</div>
                  <div className="text-[11px] text-dark-400 leading-relaxed">{t(item.desc)}</div>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <a
              href="#download"
              onClick={(e) => { e.preventDefault(); scrollToSection("download"); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-dark-950 font-semibold text-sm btn-press"
            >
              {t(appPreviewMobileCta)}
              <Monitor size={16} />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal threshold={0.2} className="hidden sm:block">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-10 text-[10px] sm:text-[11px] text-dark-400">
            {appPreviewFeatureTags.map((tag) => {
              const Icon = iconMap[tag.icon];
              return (
                <span key={tag.icon} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full glass">
                  {Icon && <Icon size={12} className="text-brand-400" />} {t(tag.label)}
                </span>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
