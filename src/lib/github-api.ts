/**
 * github-api — GitHub 仓库真实数据集成
 *
 * 用途：
 *   - 获取 jiuan-9/jiuyu-website 仓库的真实指标（Stars / Forks / Issues）
 *   - 聚合所有 Release 的 Assets 下载次数（即安装包真实下载量）
 *   - 替代 Stats 区"虚假数据"的核心数据源
 *
 * 注意：
 *   本地项目目录名为 quiddity-website（即将改名），但 GitHub 上的远程仓库实际名为 jiuyu-website。
 *   等用户在 GitHub 上重命名仓库后，把下方 REPO_NAME 改回 "quiddity-website" 即可。
 *
 * Rate Limit 策略：
 *   - 未认证：60 req/hour/IP
 *   - 已认证（token）：5000 req/hour
 *   - 客户端调用：使用 sessionStorage 缓存 5 分钟，避免重复请求
 *
 * 数据来源：GitHub REST API v3
 *   - GET /repos/{owner}/{repo}
 *   - GET /repos/{owner}/{repo}/releases
 */

const REPO_OWNER = "jiuan-9";
const REPO_NAME = "jiuyu-website";
const REPO_FULL = `${REPO_OWNER}/${REPO_NAME}`;
const API_BASE = "https://api.github.com";

/** 缓存 5 分钟，避免触发 rate limit */
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_KEY = "quiddity-github-stats";

/** 可选 token（localStorage，用于提升 GitHub API rate limit） */
const TOKEN_KEY = "quiddity-github-token";

export interface GitHubStats {
  /** 仓库名称 owner/repo */
  repo: string;
  /** Star 数 */
  stars: number;
  /** Fork 数 */
  forks: number;
  /** Watcher 数 */
  watchers: number;
  /** 开放 Issue 数 */
  openIssues: number;
  /** 默认分支 */
  defaultBranch: string;
  /** 仓库创建时间 ISO */
  createdAt: string;
  /** 最近 push 时间 ISO */
  pushedAt: string;
  /** 仓库描述 */
  description: string;
  /** 仓库主页 URL */
  homepage: string;
  /** License（spdx_id） */
  license: string | null;
  /** 仓库语言（primary） */
  language: string | null;
}

export interface ReleaseAsset {
  /** 资源名（如 Quiddity-Setup-1.0.0.exe） */
  name: string;
  /** 下载次数 */
  downloadCount: number;
  /** 文件大小（字节） */
  size: number;
  /** 下载链接 */
  url: string;
  /** 内容类型 */
  contentType: string;
}

export interface ReleaseInfo {
  /** Release ID */
  id: number;
  /** 是否为 prerelease */
  prerelease: boolean;
  /** 是否为 latest（按 created_at 排序后最新非预发布） */
  isLatest: boolean;
  /** Tag 名（如 v1.0.0） */
  tagName: string;
  /** Release 标题 */
  name: string;
  /** 发布时间 ISO */
  publishedAt: string;
  /** Release HTML 链接 */
  htmlUrl: string;
  /** 资源列表 */
  assets: ReleaseAsset[];
  /** 该 Release 下载次数（所有 assets 之和） */
  downloadCount: number;
}

export interface GitHubReleasesStats {
  /** 所有 Release 列表（按发布时间倒序） */
  releases: ReleaseInfo[];
  /** 总下载次数（所有 releases 所有 assets 之和） */
  totalDownloads: number;
  /** 最新非预发布 Release（无则为 null） */
  latest: ReleaseInfo | null;
  /** 最近一次发布时间 ISO（无 release 则 null） */
  lastReleaseAt: string | null;
  /** 最新版本号（如 v1.0.0，无则 null） */
  latestVersion: string | null;
}

export interface GitHubFullStats {
  repo: GitHubStats;
  releases: GitHubReleasesStats;
  /** 总下载次数（releases.totalDownloads 的快捷访问） */
  totalDownloads: number;
  /** 数据获取时间 ISO */
  fetchedAt: string;
  /** 是否命中缓存 */
  fromCache: boolean;
}

/** 读取可选 token */
function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** 设置 GitHub token（用于提升 rate limit） */
export function setToken(token: string): void {
  if (token.trim()) {
    localStorage.setItem(TOKEN_KEY, token.trim());
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/** 读取已设置的 token（脱敏：只返回前 4 位 + 后 4 位） */
export function getMaskedToken(): string | null {
  const t = getToken();
  if (!t) return null;
  if (t.length <= 8) return "*".repeat(t.length);
  return `${t.slice(0, 4)}${"*".repeat(8)}${t.slice(-4)}`;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 读取缓存 */
function readCache(): GitHubFullStats | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GitHubFullStats;
    const age = Date.now() - new Date(parsed.fetchedAt).getTime();
    if (age > CACHE_TTL) return null;
    return { ...parsed, fromCache: true };
  } catch {
    return null;
  }
}

/** 写入缓存 */
function writeCache(stats: GitHubFullStats): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(stats));
  } catch {
    // sessionStorage 满或被禁用：忽略
  }
}

/** 清除缓存（强制下次重新拉取） */
export function invalidateCache(): void {
  sessionStorage.removeItem(CACHE_KEY);
}

/** 处理 GitHub API 错误 */
async function handleGithubError(res: Response): Promise<never> {
  if (res.status === 403 && res.headers.get("X-RateLimit-Remaining") === "0") {
    const reset = res.headers.get("X-RateLimit-Reset");
    const resetTime = reset ? new Date(parseInt(reset, 10) * 1000).toLocaleString() : "未知";
    throw new Error(`GitHub API rate limit 已耗尽，重置时间：${resetTime}`);
  }
  if (res.status === 404) {
    throw new Error(`仓库 ${REPO_FULL} 不存在或无访问权限`);
  }
  const text = await res.text().catch(() => "");
  throw new Error(`GitHub API ${res.status}: ${text || res.statusText}`);
}

/** 获取仓库基础信息 */
async function fetchRepo(): Promise<GitHubStats> {
  const res = await fetch(`${API_BASE}/repos/${REPO_FULL}`, {
    headers: { Accept: "application/vnd.github+json", ...authHeaders() },
  });
  if (!res.ok) await handleGithubError(res);
  const data = await res.json();
  return {
    repo: data.full_name,
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    watchers: data.subscribers_count ?? data.watchers_count ?? 0,
    openIssues: data.open_issues_count ?? 0,
    defaultBranch: data.default_branch ?? "main",
    createdAt: data.created_at ?? "",
    pushedAt: data.pushed_at ?? "",
    description: data.description ?? "",
    homepage: data.homepage ?? "",
    license: data.license?.spdx_id ?? null,
    language: data.language ?? null,
  };
}

/** 获取所有 Release 及下载次数 */
async function fetchReleases(): Promise<GitHubReleasesStats> {
  const res = await fetch(
    `${API_BASE}/repos/${REPO_FULL}/releases?per_page=100`,
    { headers: { Accept: "application/vnd.github+json", ...authHeaders() } },
  );
  if (!res.ok) await handleGithubError(res);
  const data = (await res.json()) as Array<{
    id: number;
    prerelease: boolean;
    draft: boolean;
    tag_name: string;
    name: string;
    published_at: string;
    html_url: string;
    created_at: string;
    assets: Array<{
      name: string;
      download_count: number;
      size: number;
      browser_download_url: string;
      content_type: string;
    }>;
  }>;

  // 过滤掉 draft（草稿对外不可见）
  const publicReleases = data.filter((r) => !r.draft);

  // 找出最新非预发布（按 published_at 倒序后的第一个非 prerelease）
  const sortedByDate = [...publicReleases].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );
  const latestNonPre = sortedByDate.find((r) => !r.prerelease) ?? null;

  const releases: ReleaseInfo[] = publicReleases.map((r) => {
    const assets: ReleaseAsset[] = (r.assets ?? []).map((a) => ({
      name: a.name,
      downloadCount: a.download_count ?? 0,
      size: a.size ?? 0,
      url: a.browser_download_url,
      contentType: a.content_type ?? "application/octet-stream",
    }));
    return {
      id: r.id,
      prerelease: r.prerelease,
      isLatest: latestNonPre?.id === r.id,
      tagName: r.tag_name,
      name: r.name ?? r.tag_name,
      publishedAt: r.published_at,
      htmlUrl: r.html_url,
      assets,
      downloadCount: assets.reduce((sum, a) => sum + a.downloadCount, 0),
    };
  });

  // releases 数组按发布时间倒序
  releases.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const totalDownloads = releases.reduce((sum, r) => sum + r.downloadCount, 0);

  return {
    releases,
    totalDownloads,
    latest: latestNonPre
      ? releases.find((r) => r.id === latestNonPre.id) ?? null
      : null,
    lastReleaseAt: releases[0]?.publishedAt ?? null,
    latestVersion: latestNonPre?.tag_name ?? null,
  };
}

/**
 * 获取完整的 GitHub 统计数据（仓库信息 + Release 下载次数）
 * 自动使用 sessionStorage 缓存（TTL 5 分钟）
 */
export async function fetchGitHubStats(forceRefresh = false): Promise<GitHubFullStats> {
  if (!forceRefresh) {
    const cached = readCache();
    if (cached) return cached;
  }

  const [repo, releases] = await Promise.all([fetchRepo(), fetchReleases()]);

  const result: GitHubFullStats = {
    repo,
    releases,
    totalDownloads: releases.totalDownloads,
    fetchedAt: new Date().toISOString(),
    fromCache: false,
  };

  writeCache(result);
  return result;
}

/** 格式化数字（如 1234 → "1.2k"，1234567 → "1.2M"） */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

/** 格式化文件大小（字节 → KB/MB） */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 格式化日期（YYYY-MM-DD） */
export function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

/** 相对时间（如 "3 天前" / "2 周前"） */
export function formatRelativeTime(iso: string): string {
  if (!iso) return "—";
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (sec < 60) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  if (hour < 24) return `${hour} 小时前`;
  if (day < 7) return `${day} 天前`;
  if (week < 4) return `${week} 周前`;
  if (month < 12) return `${month} 个月前`;
  return `${year} 年前`;
}
