/**
 * 脚本共享工具库
 * 跨平台兼容（Windows / macOS / Linux / CI）
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

/** 当前脚本所在目录（ESM 兼容：用 import.meta.url 替代 __dirname） */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 项目根目录（脚本位于 scripts/ 下，根目录上一级） */
export const PROJECT_ROOT = path.resolve(__dirname, "..");

/** public 目录 */
export const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");

/** Quiddity 桌面应用源码目录（脚本同步元数据的来源） */
export const QUIDDITY_APP_DIR =
  process.env.QUIDDITY_APP_DIR ?? path.resolve(PROJECT_ROOT, "..", "Quiddity");

/** GitHub 仓库（用于 Releases API）
 * 真实仓库是 jiuyu-website（不是 quiddity-website，那是历史遗留名） */
export const GITHUB_REPO = process.env.GITHUB_REPO ?? "jiuan-9/jiuyu-website";

/** GitHub API Token（可选，避免速率限制；CI 中通过 GITHUB_TOKEN 注入） */
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? "";

/** version.json 路径 */
export const VERSION_JSON_PATH = path.join(PUBLIC_DIR, "version.json");

/** downloads.json 路径 */
export const DOWNLOADS_JSON_PATH = path.join(PUBLIC_DIR, "downloads.json");

/** Quiddity 桌面应用 package.json 路径 */
export const QUIDDITY_PKG_PATH = path.join(QUIDDITY_APP_DIR, "package.json");

/** version.json 结构 */
export type VersionInfo = {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  releaseNotes: string;
};

/** downloads.json 结构 */
export type DownloadsInfo = {
  version: string;
  releaseDate: string;
  releaseNotes: string;
  assets: Array<{
    platform: "windows" | "macos" | "linux";
    arch: "x64" | "arm64";
    label: string;
    url: string;
    size: number; // bytes
    contentType: string;
  }>;
  fallbackUrl: string; // 下载失效时的兜底（GitHub Releases 列表页）
  lastSyncedAt: string; // ISO 时间戳
};

/** 读取并解析 JSON 文件（自动剥离 UTF-8 BOM） */
export async function readJson<T>(filePath: string): Promise<T> {
  let raw = await fs.readFile(filePath, "utf-8");
  // 兼容带 BOM 的文件（部分 Windows 编辑器默认带 BOM）
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  return JSON.parse(raw) as T;
}

/** 写入 JSON 文件（带格式化与 trailing newline） */
export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/** 调用 GitHub Releases API */
export async function fetchLatestRelease(repo: string): Promise<{
  tagName: string;
  name: string;
  body: string;
  publishedAt: string;
  assets: Array<{
    name: string;
    browserDownloadUrl: string;
    size: number;
    contentType: string;
  }>;
}> {
  const url = `https://api.github.com/repos/${repo}/releases/latest`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "quiddity-website-sync",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const resp = await fetch(url, { headers });
  if (resp.status === 404) {
    throw new Error(
      `GitHub Release 未找到（仓库 ${repo} 还没有任何 Release）。请先创建一个 Release。`
    );
  }
  if (!resp.ok) {
    throw new Error(`GitHub API 错误 ${resp.status}: ${await resp.text()}`);
  }
  const data = (await resp.json()) as {
    tag_name: string;
    name: string;
    body: string;
    published_at: string;
    assets: Array<{
      name: string;
      browser_download_url: string;
      size: number;
      content_type: string;
    }>;
  };
  return {
    tagName: data.tag_name,
    name: data.name,
    body: data.body ?? "",
    publishedAt: data.published_at,
    assets: (data.assets ?? []).map((a) => ({
      name: a.name,
      browserDownloadUrl: a.browser_download_url,
      size: a.size,
      contentType: a.content_type,
    })),
  };
}

/** 根据资产名推断平台与架构 */
export function inferPlatform(
  name: string
): { platform: "windows" | "macos" | "linux"; arch: "x64" | "arm64" } | null {
  const lower = name.toLowerCase();
  let platform: "windows" | "macos" | "linux";
  if (lower.endsWith(".exe") || lower.includes("win")) {
    platform = "windows";
  } else if (lower.endsWith(".dmg") || lower.includes("mac") || lower.includes("darwin")) {
    platform = "macos";
  } else if (
    lower.endsWith(".deb") ||
    lower.endsWith(".appimage") ||
    lower.endsWith(".rpm") ||
    lower.includes("linux")
  ) {
    platform = "linux";
  } else {
    return null;
  }
  let arch: "x64" | "arm64" = "x64";
  if (lower.includes("arm64") || lower.includes("aarch64") || lower.includes("arm")) {
    arch = "arm64";
  }
  return { platform, arch };
}

/** 控制台彩色输出（Windows 与 CI 兼容） */
export const log = {
  info: (msg: string) => console.log(`\x1b[36m[i]\x1b[0m ${msg}`),
  ok: (msg: string) => console.log(`\x1b[32m[✓]\x1b[0m ${msg}`),
  warn: (msg: string) => console.log(`\x1b[33m[!]\x1b[0m ${msg}`),
  err: (msg: string) => console.error(`\x1b[31m[✗]\x1b[0m ${msg}`),
  step: (msg: string) => console.log(`\x1b[35m→\x1b[0m ${msg}`),
};

/** 解析 tag（如 v1.1.0 → 1.1.0） */
export function normalizeVersion(tag: string): string {
  return tag.replace(/^v/i, "").trim();
}

/** 当前 ISO 时间戳 */
export function nowIso(): string {
  return new Date().toISOString();
}
