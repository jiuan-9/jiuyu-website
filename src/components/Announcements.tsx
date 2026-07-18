import { useState, useEffect } from "react";
import { Megaphone, Sparkles, Clock, Calendar, Tag } from "lucide-react";
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

type CategoryType = "important" | "latest";

export default function Announcements() {
  const [data, setData] = useState<AnnouncementsData>({ important: [], latest: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("important");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}announcements.json`)
      .then((res) => res.json())
      .then((json: AnnouncementsData) => {
        setData(json);
        setLoading(false);
        if (json.important.length > 0) {
          setSelectedId(json.important[0].id);
        } else if (json.latest.length > 0) {
          setSelectedId(json.latest[0].id);
          setActiveCategory("latest");
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const currentList = activeCategory === "important" ? data.important : data.latest;
  const selectedItem = currentList.find((item) => item.id === selectedId) || null;

  const handleSelect = (item: AnnouncementItem, category: CategoryType) => {
    if (activeCategory !== category) {
      setActiveCategory(category);
    }
    if (selectedId !== item.id) {
      setIsSwitching(true);
      setTimeout(() => {
        setSelectedId(item.id);
        setIsSwitching(false);
      }, 150);
    }
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

        <ScrollReveal threshold={0.1}>
          <div className="glass glow-border rounded-2xl overflow-hidden max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row min-h-[480px]">
              {/* 左侧目录区 */}
              <div className="w-full md:w-[32%] lg:w-[28%] border-b md:border-b-0 md:border-r border-white/[0.06] flex flex-col">
                {/* 分类标题 */}
                <div className="flex border-b border-white/[0.06]">
                  <button
                    onClick={() => {
                      if (data.important.length > 0) {
                        handleSelect(data.important[0], "important");
                      }
                    }}
                    className={`flex-1 py-3.5 sm:py-4 text-xs font-medium transition-all duration-300 relative ${
                      activeCategory === "important"
                        ? "text-brand-400 bg-brand-500/[0.04]"
                        : "text-dark-400 hover:text-dark-200 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Sparkles size={13} />
                      重要公告
                    </span>
                    {activeCategory === "important" && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
                    )}
                  </button>
                  <div className="w-px bg-white/[0.06]" />
                  <button
                    onClick={() => {
                      if (data.latest.length > 0) {
                        handleSelect(data.latest[0], "latest");
                      }
                    }}
                    className={`flex-1 py-3.5 sm:py-4 text-xs font-medium transition-all duration-300 relative ${
                      activeCategory === "latest"
                        ? "text-white bg-white/[0.03]"
                        : "text-dark-400 hover:text-dark-200 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Clock size={13} />
                      最新公告
                    </span>
                    {activeCategory === "latest" && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    )}
                  </button>
                </div>

                {/* 公告列表 */}
                <div className="flex-1 overflow-y-auto chat-scroll p-2 sm:p-3 max-h-[300px] md:max-h-none">
                  <div className="space-y-1">
                    {currentList.map((item, index) => (
                      <button
                        key={`${activeCategory}-${item.id}`}
                        onClick={() => handleSelect(item, activeCategory)}
                        className={`group w-full text-left p-3 sm:p-3.5 rounded-xl transition-all duration-300 ${
                          selectedId === item.id && activeCategory === activeCategory
                            ? "bg-white/[0.05] border border-white/[0.08]"
                            : "hover:bg-white/[0.03] border border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* 选中指示器 */}
                          <div className="flex flex-col items-center pt-1.5 shrink-0">
                            <span
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                selectedId === item.id
                                  ? activeCategory === "important"
                                    ? "bg-brand-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    : "bg-white/70"
                                  : "bg-dark-600"
                              }`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4
                              className={`text-xs sm:text-[13px] font-medium mb-1 line-clamp-2 transition-colors duration-300 ${
                                selectedId === item.id
                                  ? "text-white"
                                  : "text-dark-300 group-hover:text-dark-100"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {activeCategory === "important" && item.tag && (
                                <span className="px-1.5 py-px rounded bg-brand-500/15 text-[9px] font-bold text-brand-400 tracking-wider">
                                  {item.tag}
                                </span>
                              )}
                              <span className="text-[10px] text-dark-600 flex items-center gap-1">
                                <Calendar size={9} />
                                {item.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {currentList.length === 0 && (
                      <div className="py-8 text-center text-xs text-dark-500">暂无公告</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 右侧内容区 */}
              <div className="flex-1 flex flex-col relative">
                {/* 内容区装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500/[0.06] to-transparent rounded-bl-full pointer-events-none opacity-60" />

                <div
                  className={`flex-1 p-5 sm:p-7 md:p-8 transition-all duration-300 ${
                    isSwitching ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                  }`}
                >
                  {selectedItem ? (
                    <>
                      {/* 标签和分类 */}
                      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
                        {activeCategory === "important" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 text-[11px] font-bold text-brand-400 tracking-wide">
                            <Tag size={11} />
                            {selectedItem.tag || "重要公告"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] text-[11px] font-medium text-dark-300 tracking-wide">
                            <Clock size={11} />
                            最新公告
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-dark-500">
                          <Calendar size={11} />
                          {selectedItem.date}
                        </span>
                      </div>

                      {/* 标题 */}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 leading-snug">
                        {selectedItem.title}
                      </h3>

                      {/* 分隔线 */}
                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4 sm:mb-6" />

                      {/* 内容 */}
                      <div className="text-sm sm:text-[15px] text-dark-300 leading-relaxed whitespace-pre-wrap max-h-[320px] overflow-y-auto chat-scroll pr-2">
                        {selectedItem.content || "暂无详细内容"}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-dark-500 text-sm">
                      请从左侧选择一条公告查看详情
                    </div>
                  )}
                </div>

                {/* 底部装饰线 */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-5 sm:mx-7 md:mx-8" />
                <div className="px-5 sm:px-7 md:px-8 py-3 sm:py-4">
                  <div className="flex items-center justify-between text-[11px] text-dark-600">
                    <span>共 {currentList.length} 条公告</span>
                    <span>当前第 {currentList.findIndex((i) => i.id === selectedId) + 1 || 0} 条</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
