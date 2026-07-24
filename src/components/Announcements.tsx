import { useState, useEffect } from "react";
import { Megaphone, Sparkles, Clock, Calendar, ChevronDown } from "lucide-react";
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
 * Announcements — 公告区（稳定版）
 *
 * 设计目标：可靠、方便、反馈强。
 * 不追求花哨动效，重点放在：
 *   - 清晰的加载/错误/空态提示
 *   - 一目了然的展开/折叠反馈
 *   - 左右双栏结构，移动端自动堆叠
 */
export default function Announcements() {
  const { t } = useI18n();
  const [data, setData] = useState<AnnouncementsData>({ important: [], latest: [] });
  // 后台静默加载：不再显示"加载中..."提示，fetch 失败时静默回落空态
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const isValidItem = (item: AnnouncementItem) => {
      // 只过滤掉真正无效的数据，不过度拦截格式
      if (!item.title || !item.title.trim()) return false;
      if (!item.content || !item.content.trim()) return false;
      return true;
    };

    fetch(`${import.meta.env.BASE_URL}announcements.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: AnnouncementsData) => {
        setData({
          important: (json.important || []).filter(isValidItem),
          latest: (json.latest || []).filter(isValidItem),
        });
      })
      .catch(() => {
        // 静默失败：data 保持空数组，自动落入空态分支
      });
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="announcements" className="py-16 sm:py-20 md:py-24 bg-dark-950">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-brand-400 mb-3">
            <Megaphone size={12} />
            {t(announcementsBadge)}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            {t(announcementsSectionTitle)}
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto text-sm sm:text-base">
            {t(announcementsSectionSubtitle)}
          </p>
        </div>

        {data.important.length === 0 && data.latest.length === 0 ? (
          <div className="text-center py-12 text-dark-500 text-sm">
            <Megaphone size={40} className="mx-auto mb-3 opacity-30" />
            {t(emptyListHint)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <AnnouncementColumn
              title={t(tabImportant)}
              icon="important"
              items={data.important}
              expandedId={expandedId}
              onToggle={toggleExpand}
              emptyHint={t(emptyListHint)}
              noContentHint={t(noContentHint)}
            />

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
  const accentColor = isImportant ? "text-brand-400" : "text-dark-300";
  const borderColor = isImportant ? "border-brand-500/30" : "border-white/10";
  const headerBg = isImportant ? "bg-brand-500/[0.06]" : "bg-white/[0.03]";
  const dotColor = isImportant ? "bg-brand-400" : "bg-dark-500";

  return (
    <div className={`rounded-xl border ${borderColor} bg-dark-900/50 flex flex-col`}>
      {/* 列标题 */}
      <div className={`flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/[0.06] ${headerBg}`}>
        <div className="flex items-center gap-2">
          {isImportant ? (
            <Sparkles size={14} className={accentColor} />
          ) : (
            <Clock size={14} className={accentColor} />
          )}
          <h3 className={`text-sm font-bold ${accentColor}`}>{title}</h3>
        </div>
        <span className="text-xs text-dark-500 tabular-nums">{items.length} 条</span>
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
                aria-expanded={isExpanded}
                className={`group w-full text-left p-3.5 sm:p-4 rounded-lg border ${
                  isExpanded
                    ? "bg-dark-800 border-brand-500/40 border-l-4 border-l-brand-400"
                    : "bg-transparent border-transparent hover:border-white/10 hover:bg-white/[0.02]"
                }`}
              >
                {/* 标题行 */}
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                      isExpanded ? dotColor : "bg-dark-600"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-xs sm:text-[13px] font-medium mb-1 line-clamp-2 ${
                        isExpanded ? "text-white" : "text-dark-300"
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
                    className={`shrink-0 mt-1.5 text-dark-500 ${isExpanded ? "rotate-180" : ""}`}
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
