import { useState, useEffect } from "react";
import { Megaphone, Sparkles, Clock, ChevronRight, X, Calendar, Tag } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  date: string;
  tag?: string;
}

interface AnnouncementsData {
  important: AnnouncementItem[];
  latest: AnnouncementItem[];
}

interface DetailModalProps {
  item: AnnouncementItem | null;
  isImportant?: boolean;
  onClose: () => void;
}

function DetailModal({ item, isImportant, onClose }: DetailModalProps) {
  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* 弹窗内容 */}
      <div
        className="relative w-full max-w-lg glass-strong glow-border-strong rounded-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部装饰 */}
        <div
          className={`h-1.5 w-full ${
            isImportant
              ? "bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500"
              : "bg-gradient-to-r from-dark-600 via-dark-400 to-dark-600"
          }`}
        />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-dark-400 hover:text-white transition-all z-10"
          aria-label="关闭"
        >
          <X size={16} />
        </button>

        <div className="p-5 sm:p-6 md:p-7">
          {/* 标签和日期 */}
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
            {item.tag && isImportant && (
              <span className="px-2.5 py-0.5 rounded-md bg-brand-500/15 text-[10px] font-bold text-brand-400 tracking-wider">
                {item.tag}
              </span>
            )}
            {isImportant && !item.tag && (
              <span className="px-2.5 py-0.5 rounded-md bg-brand-500/15 text-[10px] font-bold text-brand-400 tracking-wider">
                重要公告
              </span>
            )}
            {!isImportant && (
              <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-medium text-dark-400 tracking-wider">
                最新公告
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-dark-500">
              <Calendar size={11} />
              {item.date}
            </span>
          </div>

          {/* 标题 */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 leading-snug">
            {item.title}
          </h3>

          {/* 分隔线 */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4 sm:mb-5" />

          {/* 内容 */}
          <div className="text-sm text-dark-300 leading-relaxed whitespace-pre-wrap max-h-[40vh] overflow-y-auto pr-2 chat-scroll">
            {item.content || "暂无详细内容"}
          </div>
        </div>

        {/* 底部 */}
        <div className="px-5 sm:px-6 md:px-7 pb-5 sm:pb-6 md:pb-7">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-dark-300 hover:text-white text-sm font-medium transition-all border border-white/[0.06] hover:border-white/[0.12]"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Announcements() {
  const [data, setData] = useState<AnnouncementsData>({ important: [], latest: [] });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AnnouncementItem | null>(null);
  const [selectedIsImportant, setSelectedIsImportant] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}announcements.json`)
      .then((res) => res.json())
      .then((json: AnnouncementsData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openDetail = (item: AnnouncementItem, isImportant: boolean) => {
    setSelectedItem(item);
    setSelectedIsImportant(isImportant);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  if (loading) return null;
  if (data.important.length === 0 && data.latest.length === 0) return null;

  return (
    <section id="announcements" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/60 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            <Megaphone size={12} />
            Announcements
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            公告<span className="text-gradient"> 中心</span>
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            了解 Quiddity 最新动态与重要通知
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {/* 重要公告 */}
          <div className="lg:col-span-2">
            <ScrollReveal threshold={0.1}>
              <div className="glass glow-border rounded-2xl p-5 sm:p-6 h-full relative overflow-hidden group hover:border-brand-500/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-500/10 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
                    <Sparkles size={16} className="text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">重要公告</h3>
                    <p className="text-[11px] text-dark-500">Important Notices</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {data.important.slice(0, 3).map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => openDetail(item, true)}
                      className="group/item w-full text-left p-3.5 sm:p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-brand-500/15 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
                          <span className="px-2 py-0.5 rounded-md bg-brand-500/15 text-[9px] font-bold text-brand-400 tracking-wider">
                            {item.tag || "重要"}
                          </span>
                          <span className="text-[10px] text-dark-600">{item.date}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-dark-100 mb-1 group-hover/item:text-white transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-dark-400 leading-relaxed line-clamp-2">
                            {item.content}
                          </p>
                        </div>
                        <ChevronRight
                          size={14}
                          className="text-dark-600 group-hover/item:text-brand-400 group-hover/item:translate-x-0.5 transition-all shrink-0 mt-1 opacity-0 group-hover/item:opacity-100"
                        />
                      </div>
                    </button>
                  ))}
                  {data.important.length === 0 && (
                    <div className="py-8 text-center text-xs text-dark-500">暂无重要公告</div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* 最新公告 */}
          <div className="lg:col-span-1">
            <ScrollReveal threshold={0.1}>
              <div className="glass rounded-2xl p-5 sm:p-6 h-full border border-white/[0.05] hover:border-white/[0.08] transition-all duration-500">
                <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <Clock size={16} className="text-dark-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">最新公告</h3>
                    <p className="text-[11px] text-dark-500">Latest Updates</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {data.latest.slice(0, 5).map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => openDetail(item, false)}
                      className="group/item w-full text-left p-3 rounded-lg hover:bg-white/[0.03] transition-all duration-300"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-1 h-1 rounded-full bg-dark-600 group-hover/item:bg-brand-400 transition-colors mt-2 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-medium text-dark-300 group-hover/item:text-white transition-colors line-clamp-2 mb-1">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-dark-600">{item.date}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {data.latest.length === 0 && (
                    <div className="py-6 text-center text-xs text-dark-500">暂无最新公告</div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      <DetailModal
        item={selectedItem}
        isImportant={selectedIsImportant}
        onClose={closeDetail}
      />
    </section>
  );
}
