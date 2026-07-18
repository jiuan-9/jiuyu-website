/**
 * GitHubStatsPanel — GitHub 真实数据展示面板
 *
 * 功能：
 *   1. 实时显示仓库 Stars / Forks / Watchers / 总下载次数
 *   2. Release 列表（每个 release 显示版本号、发布时间、各资源下载次数）
 *   3. 可选 GitHub Token 配置（提升 rate limit）
 *   4. 手动刷新 / 强制刷新缓存
 *
 * 这是为了解决用户痛点："数据呢？就很虚假" —— 用 GitHub REST API 真实数据替代虚假数据。
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Download,
  RefreshCw,
  Tag,
  Calendar,
  ExternalLink,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Package,
  Clock,
  Github,
} from "lucide-react";
import { useI18n } from "@/store/i18n";
import {
  fetchGitHubStats,
  setToken,
  getMaskedToken,
  invalidateCache,
  formatCount,
  formatFileSize,
  formatDate,
  formatRelativeTime,
  type GitHubFullStats,
} from "@/lib/github-api";

const TXT = {
  panelTitle: { zh: "GitHub 真实数据", en: "GitHub Live Stats" },
  panelSubtitle: {
    zh: "从 GitHub API 实时拉取，替代虚假展示",
    en: "Pulled live from GitHub API, replacing fake data",
  },
  stars: { zh: "Stars", en: "Stars" },
  forks: { zh: "Forks", en: "Forks" },
  watchers: { zh: "Watchers", en: "Watchers" },
  totalDownloads: { zh: "总下载次数", en: "Total Downloads" },
  releases: { zh: "版本发布", en: "Releases" },
  latestVersion: { zh: "最新版本", en: "Latest Version" },
  lastRelease: { zh: "最近发布", en: "Last Release" },
  noReleases: { zh: "暂无 Release（首次未发布）", en: "No releases yet" },
  prerelease: { zh: "预发布", en: "pre-release" },
  latest: { zh: "最新", en: "latest" },
  assets: { zh: "资源", en: "Assets" },
  downloadCount: { zh: "下载", en: "downloads" },
  refresh: { zh: "刷新", en: "Refresh" },
  forceRefresh: { zh: "强制刷新", en: "Force Refresh" },
  tokenSettings: { zh: "Token 配置（可选）", en: "Token Settings (optional)" },
  tokenHint: {
    zh: "未认证 60 req/hour，配置 Token 后 5000 req/hour",
    en: "Unauthenticated: 60 req/hour. With token: 5000 req/hour",
  },
  tokenSaved: { zh: "Token 已保存", en: "Token saved" },
  tokenCleared: { zh: "Token 已清除", en: "Token cleared" },
  tokenCurrent: { zh: "当前 Token：", en: "Current token: " },
  tokenNotSet: { zh: "未设置", en: "not set" },
  save: { zh: "保存", en: "Save" },
  clear: { zh: "清除", en: "Clear" },
  loading: { zh: "加载中...", en: "Loading..." },
  error: { zh: "获取失败", en: "Fetch failed" },
  cachedAt: { zh: "数据时间", en: "Data fetched at" },
  fromCache: { zh: "缓存命中", en: "from cache" },
  retry: { zh: "重试", en: "Retry" },
  repoInfo: { zh: "仓库信息", en: "Repository" },
  language: { zh: "主语言", en: "Language" },
  license: { zh: "License", en: "License" },
  created: { zh: "创建于", en: "Created" },
  pushed: { zh: "最近 Push", en: "Last Push" },
  openIssues: { zh: "开放 Issue", en: "Open Issues" },
  viewOnGithub: { zh: "在 GitHub 查看", en: "View on GitHub" },
} as const;

export default function GitHubStatsPanel() {
  const { t } = useI18n();
  const [stats, setStats] = useState<GitHubFullStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedReleases, setExpandedReleases] = useState<Set<number>>(new Set());

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      if (force) invalidateCache();
      const data = await fetchGitHubStats(force);
      setStats(data);
      // 默认展开第一个 release
      if (data.releases.releases[0]) {
        setExpandedReleases(new Set([data.releases.releases[0].id]));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRelease = (id: number) => {
    setExpandedReleases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="glass glow-border rounded-2xl p-5 sm:p-6 space-y-5">
      {/* 标题区 */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Github size={18} className="text-brand-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{t(TXT.panelTitle)}</h3>
            <p className="text-[11px] text-dark-400">{t(TXT.panelSubtitle)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => load(false)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs text-dark-200 hover:text-brand-400 hover:border-brand-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            {t(TXT.refresh)}
          </button>
          <button
            onClick={() => load(true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 hover:bg-brand-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            {t(TXT.forceRefresh)}
          </button>
        </div>
      </div>

      {/* 加载中 */}
      {loading && !stats && (
        <div className="py-12 text-center text-xs text-dark-500 flex items-center justify-center gap-2">
          <RefreshCw size={14} className="animate-spin text-brand-400" />
          {t(TXT.loading)}
        </div>
      )}

      {/* 错误 */}
      {error && (
        <div className="rounded-xl bg-red-500/[0.04] border border-red-500/20 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-red-400 mb-1">{t(TXT.error)}</div>
              <div className="text-[11px] text-dark-400 leading-relaxed break-all">{error}</div>
            </div>
            <button
              onClick={() => load(false)}
              className="text-[11px] text-brand-400 hover:text-brand-300 transition-colors shrink-0"
            >
              {t(TXT.retry)}
            </button>
          </div>
        </div>
      )}

      {/* 数据展示 */}
      {stats && (
        <>
          {/* 核心指标卡 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={<Star size={14} />} label={t(TXT.stars)} value={formatCount(stats.repo.stars)} accent="amber" />
            <StatCard icon={<GitFork size={14} />} label={t(TXT.forks)} value={formatCount(stats.repo.forks)} accent="brand" />
            <StatCard icon={<Eye size={14} />} label={t(TXT.watchers)} value={formatCount(stats.repo.watchers)} accent="purple" />
            <StatCard icon={<Download size={14} />} label={t(TXT.totalDownloads)} value={formatCount(stats.totalDownloads)} accent="green" highlight />
          </div>

          {/* 仓库信息条 */}
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <InfoCell label={t(TXT.language)} value={stats.repo.language ?? "—"} />
            <InfoCell label={t(TXT.license)} value={stats.repo.license ?? "—"} />
            <InfoCell label={t(TXT.created)} value={formatDate(stats.repo.createdAt)} />
            <InfoCell label={t(TXT.pushed)} value={formatRelativeTime(stats.repo.pushedAt)} />
          </div>

          {/* 最新版本横幅 */}
          {stats.releases.latest && (
            <div className="rounded-xl bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent border border-brand-500/20 p-4 flex items-center gap-3 flex-wrap">
              <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
                <Tag size={14} className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-dark-400 uppercase tracking-wider">{t(TXT.latestVersion)}</div>
                <div className="text-sm font-semibold text-white truncate">{stats.releases.latest.tagName}</div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-dark-400">
                <Calendar size={11} />
                {formatDate(stats.releases.latest.publishedAt)}
              </div>
              <a
                href={stats.releases.latest.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 transition-colors"
              >
                <ExternalLink size={11} />
                GitHub
              </a>
            </div>
          )}

          {/* Release 列表 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-dark-200 flex items-center gap-2">
                <Package size={13} className="text-brand-400" />
                {t(TXT.releases)}
                <span className="text-[10px] text-dark-500">({stats.releases.releases.length})</span>
              </h4>
              {stats.releases.lastReleaseAt && (
                <span className="text-[10px] text-dark-500 flex items-center gap-1">
                  <Clock size={10} />
                  {t(TXT.lastRelease)}: {formatRelativeTime(stats.releases.lastReleaseAt)}
                </span>
              )}
            </div>

            {stats.releases.releases.length === 0 ? (
              <div className="py-6 text-center text-[11px] text-dark-500">{t(TXT.noReleases)}</div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {stats.releases.releases.map((rel) => {
                  const expanded = expandedReleases.has(rel.id);
                  return (
                    <div
                      key={rel.id}
                      className="rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                    >
                      <button
                        onClick={() => toggleRelease(rel.id)}
                        className="w-full flex items-center gap-3 p-3 text-left"
                      >
                        <div className="shrink-0">
                          {expanded ? (
                            <ChevronDown size={12} className="text-dark-400" />
                          ) : (
                            <ChevronRight size={12} className="text-dark-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-white">{rel.tagName}</span>
                            {rel.isLatest && (
                              <span className="px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-400 text-[9px] font-semibold uppercase tracking-wide">
                                {t(TXT.latest)}
                              </span>
                            )}
                            {rel.prerelease && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[9px] font-semibold uppercase tracking-wide">
                                {t(TXT.prerelease)}
                              </span>
                            )}
                          </div>
                          {rel.name && rel.name !== rel.tagName && (
                            <div className="text-[10px] text-dark-500 truncate mt-0.5">{rel.name}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-dark-500 shrink-0">
                          <span className="flex items-center gap-1">
                            <Download size={10} />
                            {formatCount(rel.downloadCount)}
                          </span>
                          <span>{formatDate(rel.publishedAt)}</span>
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && rel.assets.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/[0.03]"
                          >
                            <div className="p-3 space-y-1.5">
                              {rel.assets.map((asset) => (
                                <div
                                  key={asset.url}
                                  className="flex items-center gap-3 text-[11px] py-1.5 px-2 rounded hover:bg-white/[0.02] transition-colors"
                                >
                                  <Package size={11} className="text-dark-500 shrink-0" />
                                  <span className="flex-1 truncate text-dark-200">{asset.name}</span>
                                  <span className="text-dark-500 shrink-0">{formatFileSize(asset.size)}</span>
                                  <span className="flex items-center gap-1 text-brand-400 shrink-0">
                                    <Download size={10} />
                                    {formatCount(asset.downloadCount)}
                                  </span>
                                  <a
                                    href={asset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-dark-500 hover:text-brand-400 transition-colors shrink-0"
                                  >
                                    <ExternalLink size={10} />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 数据时间戳 */}
          <div className="flex items-center justify-between text-[10px] text-dark-500 pt-2 border-t border-white/[0.04]">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {t(TXT.cachedAt)}: {formatDate(stats.fetchedAt)} {new Date(stats.fetchedAt).toLocaleTimeString()}
            </span>
            {stats.fromCache && (
              <span className="text-brand-400/70 flex items-center gap-1">
                <CheckCircle size={10} />
                {t(TXT.fromCache)}
              </span>
            )}
          </div>
        </>
      )}

      {/* Token 配置 */}
      <TokenSettings />
    </div>
  );
}

// ==================== 子组件 ====================

function StatCard({
  icon,
  label,
  value,
  accent,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "amber" | "brand" | "purple" | "green";
  highlight?: boolean;
}) {
  const accentMap = {
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    brand: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
  };
  return (
    <div
      className={`rounded-xl p-3 border transition-all ${
        highlight ? "bg-brand-500/[0.04] border-brand-500/15" : "bg-white/[0.02] border-white/[0.04]"
      }`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${accentMap[accent]} mb-2`}>
        {icon}
      </div>
      <div className="text-[10px] text-dark-500 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-lg font-bold text-white tabular-nums">{value}</div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] text-dark-500 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-dark-200 truncate">{value}</div>
    </div>
  );
}

function TokenSettings() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [masked, setMasked] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setMasked(getMaskedToken());
  }, []);

  const handleSave = () => {
    if (!tokenInput.trim()) return;
    setToken(tokenInput.trim());
    setTokenInput("");
    setMasked(getMaskedToken());
    showToast(t(TXT.tokenSaved));
  };

  const handleClear = () => {
    setToken("");
    setMasked(null);
    showToast(t(TXT.tokenCleared));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="rounded-xl bg-white/[0.01] border border-white/[0.03] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 text-left"
      >
        {expanded ? (
          <ChevronDown size={12} className="text-dark-400" />
        ) : (
          <ChevronRight size={12} className="text-dark-400" />
        )}
        <KeyRound size={12} className="text-dark-400" />
        <span className="text-xs text-dark-200 flex-1">{t(TXT.tokenSettings)}</span>
        <span className="text-[10px] text-dark-500">
          {t(TXT.tokenCurrent)}
          {masked ? <span className="text-brand-400 font-mono">{masked}</span> : <span className="text-dark-600">{t(TXT.tokenNotSet)}</span>}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/[0.03]"
          >
            <div className="p-3 space-y-3">
              <p className="text-[10px] text-dark-500 leading-relaxed flex items-start gap-1.5">
                <AlertTriangle size={11} className="text-amber-400/70 mt-0.5 shrink-0" />
                {t(TXT.tokenHint)}
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-dark-900 border border-white/[0.06] text-white text-xs placeholder:text-dark-600 focus:outline-none focus:border-brand-500/40 transition-colors font-mono"
                />
                <button
                  onClick={handleSave}
                  disabled={!tokenInput.trim()}
                  className="px-3 py-1.5 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-semibold hover:bg-brand-500/30 transition-colors disabled:opacity-50"
                >
                  {t(TXT.save)}
                </button>
                {masked && (
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-dark-300 text-xs hover:text-red-400 hover:border-red-500/20 transition-all"
                  >
                    {t(TXT.clear)}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-3 pb-2 text-[10px] text-brand-400 flex items-center gap-1"
          >
            <CheckCircle size={10} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
