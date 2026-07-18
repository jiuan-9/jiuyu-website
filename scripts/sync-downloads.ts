/**
 * sync-downloads.ts
 * 从 GitHub Releases API 同步下载链接到 public/downloads.json
 * 同时更新 public/version.json 的 downloadUrl 与 releaseNotes
 *
 * 根因修复：旧 version.json 的 downloadUrl 指向已重命名的 jiuyu-website 仓库，
 * 现在直接从 GitHub Releases API 获取最新资产直链，永远不会失效。
 *
 * 用法：npm run sync:downloads
 *      CI 中：GITHUB_TOKEN=xxx npm run sync:downloads
 */

import { existsSync } from "node:fs";
import {
  DOWNLOADS_JSON_PATH,
  GITHUB_REPO,
  VERSION_JSON_PATH,
  fetchLatestRelease,
  inferPlatform,
  log,
  normalizeVersion,
  nowIso,
  readJson,
  writeJson,
  type DownloadsInfo,
  type VersionInfo,
} from "./lib";

async function main() {
  log.step(`查询 GitHub Releases API: ${GITHUB_REPO}`);
  const release = await fetchLatestRelease(GITHUB_REPO);
  const version = normalizeVersion(release.tagName);
  log.ok(`最新 Release：${release.tagName}（v${version}）`);
  log.ok(`资产数量：${release.assets.length}`);

  if (release.assets.length === 0) {
    log.warn("Release 没有附加资产文件。请上传 .exe 等安装包后再运行此脚本。");
  }

  // 构造资产列表
  const assets = release.assets
    .map((a) => {
      const plat = inferPlatform(a.name);
      if (!plat) {
        log.warn(`跳过无法识别平台的资产：${a.name}`);
        return null;
      }
      return {
        platform: plat.platform,
        arch: plat.arch,
        label: a.name,
        url: a.browserDownloadUrl,
        size: a.size,
        contentType: a.contentType,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (assets.length === 0) {
    log.warn("未识别到任何可下载资产。请确认 Release 已上传 .exe/.dmg/.AppImage 文件。");
  }

  const downloads: DownloadsInfo = {
    version,
    releaseDate: release.publishedAt.slice(0, 10),
    releaseNotes: release.body?.trim() || "暂无发布说明",
    assets,
    fallbackUrl: `https://github.com/${GITHUB_REPO}/releases/latest`,
    lastSyncedAt: nowIso(),
  };

  await writeJson(DOWNLOADS_JSON_PATH, downloads);
  log.ok(`已写入 downloads.json（${assets.length} 项资产）`);

  // 同步更新 version.json 的 downloadUrl 与 releaseNotes
  log.step(`同步更新 version.json`);
  let versionInfo: VersionInfo;
  if (existsSync(VERSION_JSON_PATH)) {
    versionInfo = await readJson<VersionInfo>(VERSION_JSON_PATH);
  } else {
    versionInfo = {
      version,
      releaseDate: downloads.releaseDate,
      downloadUrl: "",
      releaseNotes: downloads.releaseNotes,
    };
  }
  versionInfo.version = version;
  versionInfo.releaseDate = downloads.releaseDate;
  versionInfo.releaseNotes = downloads.releaseNotes;
  // downloadUrl 指向最新 Release 的页面（稳定 URL，不会失效）
  versionInfo.downloadUrl = downloads.fallbackUrl;
  await writeJson(VERSION_JSON_PATH, versionInfo);
  log.ok(`已更新 version.json（downloadUrl 指向 releases/latest）`);

  // 打印资产列表
  console.log("");
  log.info("资产清单：");
  for (const a of assets) {
    const sizeMb = (a.size / 1024 / 1024).toFixed(1);
    console.log(`  • [${a.platform}/${a.arch}] ${a.label} (${sizeMb} MB)`);
  }
}

main().catch((err) => {
  log.err(err instanceof Error ? err.message : String(err));
  log.warn(
    "提示：如果遇到 403 Rate Limit，请在 CI 中设置 GITHUB_TOKEN 环境变量后重试。"
  );
  process.exit(1);
});
