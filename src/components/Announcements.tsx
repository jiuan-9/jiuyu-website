import { useState, useEffect } from "react";
import { Megaphone, Sparkles, Clock, Calendar, ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/store/i18n";
import {
  announcementsBadge,
  announcementsSectionTitle,
  announcementsSectionSubtitle,
  tabImportant,
  tabLatest,
  emptyListHint,
  noContentHint,
} from "@/content/announcements";

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

/**
 * Announcements — 公告区（v3.0 并排双栏版）
 *
 * 用户反馈：「把重要和最新分开来，放在一排」
 * v3.0 改造：
 *   - 从 tab 切换改为左右并排两个独立框（重要 | 最新）
 *   - 移动端自动堆叠为上下两栏
 *   - 点击公告卡片展开/折叠完整内容（无需跳转到右侧详情区）
 *   - 简化结构，去除复杂的选中态/切换动画
 */
export default function Announcements() {
  const { t } = useI18n();
  const [data, setData] = useState<AnnouncementsData>({ important: [], latest: [] });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const isValidItem = (item: AnnouncementItem) => {
      if (!item.title || !item.title.trim()) return false;
      if (!item.content || !item.content.trim()) return false;
      const title = item.title.trim();
      if (title.includes("**")) return false;
      if (title.startsWith("- ")) return false;
      if (title.includes("：") && title.length < 10) return false;
      if (title === "---") return false;
      return true;
    };

    fetch(`${import.meta.env.BASE_URL}announcements.json`)
      .then((res) => res.json())
      .then((json: AnnouncementsData) => {
        setData({
          important: (json.important || []).filter(isValidItem),
          latest: (json.latest || []).filter(isValidItem),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) return null;

  const hasAny = data.important.length > 0 || data.latest.length > 0;

  return (
    <section id="announcements" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/60 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">
            <Megaphone size={12} />
            {t(announcementsBadge)}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            {t(announcementsSectionTitle)}
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {t(announcementsSectionSubtitle)}
          </p>
        </ScrollReveal>

        {hasAny ? (
          <ScrollReveal threshold={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {/* 重要公告栏 */}
              <AnnouncementColumn
                title={t(tabImportant)}
                icon="important"
                items={data.important}
                expandedId={expandedId}
                onToggle={toggleExpand}
                emptyHint={t(emptyListHint)}
                noContentHint={t(noContentHint)}
              />

              {/* 最新公告栏 */}
              <AnnouncementColumn
                title={t(tabLatest)}
                icon="latest"
                items={data.latest}
                expandedId={expandedId}
                onToggle={toggleExpand}
                emptyHint={t(emptyListHint)}
                noContentHint={t(noContentHint)}
              />
            </div>
          </ScrollReveal>
        ) : (
          <div className="text-center py-12 text-dark-500 text-sm">
            <Megaphone size={40} className="mx-auto mb-3 opacity-30" />
            {t(emptyListHint)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============ 单列公告栏 ============ */

type AnnouncementColumnProps = {
  title: string;
  icon: "important" | "latest";
  items: AnnouncementItem[];
  expandedId: number | null;
  onToggle: (id: number) => void;
  emptyHint: string;
  noContentHint: string;
};

function AnnouncementColumn({
  title,
  icon,
  items,
  expandedId,
  onToggle,
  emptyHint,
  noContentHint,
}: AnnouncementColumnProps) {
  const isImportant = icon === "important";
  const accentColor = isImportant ? "text-brand-400" : "text-white/70";
  const borderColor = isImportant ? "border-brand-500/20" : "border-white/10";
  const headerBg = isImportant ? "bg-brand-500/[0.04]" : "bg-white/[0.02]";
  const dotColor = isImportant ? "bg-brand-400" : "bg-white/60";

  return (
    <div className={`glass glow-border rounded-2xl overflow-hidden flex flex-col ${borderColor}`}>
      {/* 列标题 */}
      <div className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] ${headerBg}`}>
        <div className="flex items-center gap-2">
          {isImportant ? (
            <Sparkles size={14} className={accentColor} />
          ) : (
            <Clock size={14} className={accentColor} />
          )}
          <h3 className={`text-sm font-bold ${accentColor}`}>{title}</h3>
        </div>
        <span className="text-[11px] text-dark-500 tabular-nums">
          {items.length} 条
        </span>
      </div>

      {/* 公告列表 */}
      <div className="flex-1 p-3 sm:p-4 space-y-2">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-dark-500">{emptyHint}</div>
        ) : (
          items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`group w-full text-left p-3.5 sm:p-4 rounded-xl transition-all duration-300 cursor-pointer border ${
                  isExpanded
                    ? "bg-white/[0.05] border-white/[0.1]"
                    : "hover:bg-white/[0.03] border-transparent"
                }`}
              >
                {/* 标题行 */}
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 transition-all duration-300 ${isExpanded ? dotColor : "bg-dark-600"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-xs sm:text-[13px] font-medium mb-1.5 line-clamp-2 transition-colors duration-300 ${
                        isExpanded ? "text-white" : "text-dark-300 group-hover:text-dark-100"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-dark-600 flex items-center gap-1">
                        <Calendar size={9} />
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`shrink-0 mt-1.5 text-dark-600 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* 展开内容 */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <div className="text-xs sm:text-[13px] text-dark-300 leading-relaxed whitespace-pre-wrap pl-4">
                      {item.content || noContentHint}
                    </div>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
