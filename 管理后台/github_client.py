"""
github_client — GitHub REST API 封装

提供仓库统计、Release 信息、下载量聚合。
不依赖第三方库，使用标准 urllib.request。
"""

from __future__ import annotations

import json
import os
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


GITHUB_API_BASE = "https://api.github.com"
USER_AGENT = "quiddity-admin/1.0"


@dataclass
class AssetInfo:
    name: str
    download_count: int
    size: int
    url: str
    content_type: str


@dataclass
class ReleaseInfo:
    tag_name: str
    name: str
    published_at: str
    html_url: str
    prerelease: bool
    is_latest: bool
    assets: list[AssetInfo] = field(default_factory=list)

    @property
    def download_count(self) -> int:
        return sum(a.download_count for a in self.assets)

    @property
    def published_at_display(self) -> str:
        try:
            return self.published_at[:10]
        except (IndexError, TypeError):
            return "—"


@dataclass
class RepoStats:
    full_name: str
    stars: int
    forks: int
    watchers: int
    open_issues: int
    default_branch: str
    pushed_at: str
    description: str
    homepage: str


@dataclass
class GitHubFullStats:
    repo: RepoStats
    releases: list[ReleaseInfo]
    total_downloads: int
    latest: ReleaseInfo | None
    latest_version: str | None
    last_release_at: str | None
    fetched_at: str
    rate_limit_remaining: int
    rate_limit_limit: int

    @property
    def fetched_at_display(self) -> str:
        try:
            dt = datetime.fromisoformat(self.fetched_at)
            return dt.strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            return self.fetched_at


class GitHubAPIError(Exception):
    """GitHub API 调用失败"""


class RateLimitExceededError(GitHubAPIError):
    def __init__(self, reset_at: str | None):
        self.reset_at = reset_at
        super().__init__(
            "GitHub API 速率限制已耗尽"
            + (f"，重置时间：{reset_at}" if reset_at else "")
        )


class GitHubClient:
    def __init__(
        self,
        repo: str,
        token: str | None = None,
        timeout: int = 15,
    ):
        self.repo = repo
        self.token = (token or os.environ.get("GITHUB_TOKEN") or "").strip()
        self.timeout = timeout
        self._last_rate_remaining: int | None = None
        self._last_rate_limit: int | None = None

    def _headers(self) -> dict[str, str]:
        h = {
            "Accept": "application/vnd.github+json",
            "User-Agent": USER_AGENT,
        }
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
        return h

    def _request(self, path: str, params: dict[str, str] | None = None) -> Any:
        url = f"{GITHUB_API_BASE}{path}"
        if params:
            query = "&".join(f"{k}={v}" for k, v in params.items())
            url = f"{url}?{query}"

        req = urllib.request.Request(url, headers=self._headers())
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                self._last_rate_remaining = _safe_int(resp.headers.get("X-RateLimit-Remaining"))
                self._last_rate_limit = _safe_int(resp.headers.get("X-RateLimit-Limit"))
                body = resp.read().decode("utf-8")
                return json.loads(body)
        except urllib.error.HTTPError as e:
            reset = e.headers.get("X-RateLimit-Reset") if e.headers else None
            reset_iso = (
                datetime.fromtimestamp(int(reset), tz=timezone.utc).isoformat()
                if reset
                else None
            )
            if e.code == 403 and self._is_rate_limited(e):
                raise RateLimitExceededError(reset_iso)
            body = e.read().decode("utf-8", errors="replace")
            raise GitHubAPIError(f"HTTP {e.code} {e.reason}：{body[:200] if body else ''}")
        except urllib.error.URLError as e:
            raise GitHubAPIError(f"网络错误：{e.reason}")

    @staticmethod
    def _is_rate_limited(e: urllib.error.HTTPError) -> bool:
        if not e.headers:
            return False
        return e.headers.get("X-RateLimit-Remaining") == "0"

    def fetch_repo(self) -> RepoStats:
        data = self._request(f"/repos/{self.repo}")
        return RepoStats(
            full_name=data.get("full_name", self.repo),
            stars=_safe_int(data.get("stargazers_count")),
            forks=_safe_int(data.get("forks_count")),
            watchers=_safe_int(data.get("subscribers_count", data.get("watchers_count"))),
            open_issues=_safe_int(data.get("open_issues_count")),
            default_branch=data.get("default_branch", "main"),
            pushed_at=data.get("pushed_at", ""),
            description=data.get("description") or "",
            homepage=data.get("homepage") or "",
        )

    def fetch_releases(self) -> list[ReleaseInfo]:
        data = self._request(f"/repos/{self.repo}/releases", params={"per_page": "100"})
        if not isinstance(data, list):
            return []

        public = [r for r in data if not r.get("draft", False)]
        public.sort(key=lambda r: r.get("published_at", ""), reverse=True)
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
                    is_latest=(latest_non_pre is not None and r.get("id") == latest_non_pre.get("id")),
                    assets=assets,
                )
            )
        return result

    def fetch_full_stats(self) -> GitHubFullStats:
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


def _safe_int(value: Any) -> int:
    try:
        return int(value) if value is not None else 0
    except (TypeError, ValueError):
        return 0


def format_count(n: int) -> str:
    if n < 1000:
        return str(n)
    if n < 1_000_000:
        return f"{n / 1000:.1f}".replace(".0", "") + "k"
    return f"{n / 1_000_000:.1f}".replace(".0", "") + "M"


def format_file_size(bytes_size: int) -> str:
    if bytes_size < 1024:
        return f"{bytes_size} B"
    if bytes_size < 1024 * 1024:
        return f"{bytes_size / 1024:.1f} KB"
    return f"{bytes_size / (1024 * 1024):.1f} MB"


def format_relative_time(iso: str) -> str:
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
