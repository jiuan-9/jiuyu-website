"""
github_client — GitHub REST API 封装

提供：
  - 仓库基础统计（Stars / Forks / Issues / Watchers）
  - 所有 Release 的下载量聚合（含每版本明细）
  - 最新 Release 信息（tag / 发布时间 / 资产清单 / 发布说明）
  - 最近 commits 列表（用于显示"最近推送"）

速率限制策略：
  - 未认证：60 req/hour/IP
  - 已认证（token）：5000 req/hour
  - 通过 GITHUB_TOKEN 环境变量或 GUI 输入注入

不依赖任何第三方库，使用标准 urllib.request，避免装包失败。
"""

from __future__ import annotations

import json
import os
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


# ====================================================================
# 数据模型
# ====================================================================

@dataclass
class AssetInfo:
    """单个 Release 资产（如 Quiddity-1.1.0.exe）"""
    name: str
    download_count: int
    size: int  # bytes
    url: str
    content_type: str


@dataclass
class ReleaseInfo:
    """单个 Release 信息"""
    tag_name: str
    name: str
    published_at: str  # ISO
    html_url: str
    prerelease: bool
    is_latest: bool
    assets: list[AssetInfo] = field(default_factory=list)

    @property
    def download_count(self) -> int:
        """该 Release 所有资产的下载次数之和"""
        return sum(a.download_count for a in self.assets)

    @property
    def published_at_display(self) -> str:
        """显示用日期 YYYY-MM-DD"""
        try:
            return self.published_at[:10]
        except (IndexError, TypeError):
            return "—"


@dataclass
class RepoStats:
    """仓库基础统计"""
    full_name: str
    stars: int
    forks: int
    watchers: int
    open_issues: int
    default_branch: str
    pushed_at: str  # ISO
    description: str
    homepage: str


@dataclass
class GitHubFullStats:
    """完整 GitHub 统计：仓库 + Releases + 聚合"""
    repo: RepoStats
    releases: list[ReleaseInfo]
    total_downloads: int
    latest: ReleaseInfo | None
    latest_version: str | None  # 如 "v1.1.0"
    last_release_at: str | None  # ISO
    fetched_at: str  # ISO 本地时间戳
    rate_limit_remaining: int  # 剩余配额
    rate_limit_limit: int  # 总配额

    @property
    def fetched_at_display(self) -> str:
        try:
            dt = datetime.fromisoformat(self.fetched_at)
            return dt.strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            return self.fetched_at


# ====================================================================
# 异常
# ====================================================================

class GitHubAPIError(Exception):
    """GitHub API 调用失败"""


class RateLimitExceededError(GitHubAPIError):
    """GitHub API 速率限制耗尽"""

    def __init__(self, reset_at: str | None):
        self.reset_at = reset_at
        super().__init__(
            f"GitHub API 速率限制已耗尽"
            + (f"，重置时间：{reset_at}" if reset_at else "")
        )


# ====================================================================
# 客户端
# ====================================================================

GITHUB_API_BASE = "https://api.github.com"
DEFAULT_REPO = os.environ.get("GITHUB_REPO", "jiuan-9/quiddity-website")
USER_AGENT = "quiddity-deploy-dashboard/1.0"


class GitHubClient:
    """GitHub REST API 客户端（不依赖第三方库）"""

    def __init__(
        self,
        repo: str = DEFAULT_REPO,
        token: str | None = None,
        timeout: int = 15,
    ):
        self.repo = repo
        # token 来源优先级：构造参数 > 环境变量
        self.token = (
            token
            or os.environ.get("GITHUB_TOKEN")
            or os.environ.get("GH_TOKEN")
            or ""
        ).strip()
        self.timeout = timeout
        self._last_rate_remaining: int | None = None
        self._last_rate_limit: int | None = None

    # ------------------- 内部工具 -------------------

    def _headers(self) -> dict[str, str]:
        h = {
            "Accept": "application/vnd.github+json",
            "User-Agent": USER_AGENT,
        }
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
        return h

    def _request(self, path: str, params: dict[str, str] | None = None) -> Any:
        """发送 GET 请求，返回解析后的 JSON"""
        url = f"{GITHUB_API_BASE}{path}"
        if params:
            query = "&".join(f"{k}={v}" for k, v in params.items())
            url = f"{url}?{query}"

        req = urllib.request.Request(url, headers=self._headers())
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                # 记录速率限制信息
                self._last_rate_remaining = _safe_int(
                    resp.headers.get("X-RateLimit-Remaining")
                )
                self._last_rate_limit = _safe_int(
                    resp.headers.get("X-RateLimit-Limit")
                )
                body = resp.read().decode("utf-8")
                return json.loads(body)
        except urllib.error.HTTPError as e:
            # 提取速率限制重置时间
            reset = e.headers.get("X-RateLimit-Reset") if e.headers else None
            reset_iso = (
                datetime.fromtimestamp(int(reset), tz=timezone.utc).isoformat()
                if reset
                else None
            )
            if e.code == 403 and self._is_rate_limited(e):
                raise RateLimitExceededError(reset_iso)
            body = e.read().decode("utf-8", errors="replace")
            raise GitHubAPIError(
                f"HTTP {e.code} {e.reason}：{body[:200] if body else ''}"
            )
        except urllib.error.URLError as e:
            raise GitHubAPIError(f"网络错误：{e.reason}")

    @staticmethod
    def _is_rate_limited(e: urllib.error.HTTPError) -> bool:
        if not e.headers:
            return False
        return e.headers.get("X-RateLimit-Remaining") == "0"

    # ------------------- 公开 API -------------------

    def fetch_repo(self) -> RepoStats:
        """获取仓库基础信息"""
        data = self._request(f"/repos/{self.repo}")
        return RepoStats(
            full_name=data.get("full_name", self.repo),
            stars=_safe_int(data.get("stargazers_count")),
            forks=_safe_int(data.get("forks_count")),
            watchers=_safe_int(
                data.get("subscribers_count", data.get("watchers_count"))
            ),
            open_issues=_safe_int(data.get("open_issues_count")),
            default_branch=data.get("default_branch", "main"),
            pushed_at=data.get("pushed_at", ""),
            description=data.get("description") or "",
            homepage=data.get("homepage") or "",
        )

    def fetch_releases(self) -> list[ReleaseInfo]:
        """获取所有公开 Release（已过滤 draft）"""
        data = self._request(
            f"/repos/{self.repo}/releases", params={"per_page": "100"}
        )
        if not isinstance(data, list):
            return []

        public = [r for r in data if not r.get("draft", False)]
        # 按 published_at 倒序排序
        public.sort(
            key=lambda r: r.get("published_at", ""),
            reverse=True,
        )
        # 找出最新非预发布
        latest_non_pre = next((r for r in public if not r.get("prerelease")), None)

        result: list[ReleaseInfo] = []
        for r in public:
            assets_data = r.get("assets", []) or []
            assets = [
                AssetInfo(
                    name=a.get("name", ""),
                    download_count=_safe_int(a.get("download_count")),
                    size=_safe_int(a.get("size")),
                    url=a.get("browser_download_url", ""),
                    content_type=a.get("content_type", "application/octet-stream"),
                )
                for a in assets_data
            ]
            result.append(
                ReleaseInfo(
                    tag_name=r.get("tag_name", ""),
                    name=r.get("name") or r.get("tag_name", ""),
                    published_at=r.get("published_at", ""),
                    html_url=r.get("html_url", ""),
                    prerelease=bool(r.get("prerelease")),
                    is_latest=(latest_non_pre is not None
                                and r.get("id") == latest_non_pre.get("id")),
                    assets=assets,
                )
            )
        return result

    def fetch_full_stats(self) -> GitHubFullStats:
        """获取完整统计（仓库 + Releases 聚合）"""
        repo = self.fetch_repo()
        releases = self.fetch_releases()

        latest = next((r for r in releases if r.is_latest), None)
        total = sum(r.download_count for r in releases)

        return GitHubFullStats(
            repo=repo,
            releases=releases,
            total_downloads=total,
            latest=latest,
            latest_version=latest.tag_name if latest else None,
            last_release_at=latest.published_at if latest else None,
            fetched_at=datetime.now().isoformat(),
            rate_limit_remaining=self._last_rate_remaining or 0,
            rate_limit_limit=self._last_rate_limit or 0,
        )


# ====================================================================
# 工具函数
# ====================================================================

def _safe_int(value: Any) -> int:
    """安全转换为 int"""
    try:
        if value is None:
            return 0
        return int(value)
    except (TypeError, ValueError):
        return 0


def format_count(n: int) -> str:
    """格式化数字：1234 → '1.2k'，1234567 → '1.2M'"""
    if n < 1000:
        return str(n)
    if n < 1_000_000:
        return f"{n / 1000:.1f}".replace(".0", "") + "k"
    return f"{n / 1_000_000:.1f}".replace(".0", "") + "M"


def format_file_size(bytes_size: int) -> str:
    """字节 → KB/MB"""
    if bytes_size < 1024:
        return f"{bytes_size} B"
    if bytes_size < 1024 * 1024:
        return f"{bytes_size / 1024:.1f} KB"
    return f"{bytes_size / (1024 * 1024):.1f} MB"


def format_relative_time(iso: str) -> str:
    """ISO 时间 → 相对时间（如 '3 天前'）"""
    if not iso:
        return "—"
    try:
        then = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        diff = now - then
        sec = int(diff.total_seconds())
        if sec < 60:
            return "刚刚"
        if sec < 3600:
            return f"{sec // 60} 分钟前"
        if sec < 86400:
            return f"{sec // 3600} 小时前"
        if sec < 604800:
            return f"{sec // 86400} 天前"
        if sec < 2592000:
            return f"{sec // 604800} 周前"
        if sec < 31536000:
            return f"{sec // 2592000} 个月前"
        return f"{sec // 31536000} 年前"
    except Exception:
        return iso[:10] if len(iso) >= 10 else "—"
