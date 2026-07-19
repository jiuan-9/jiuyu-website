/**
 * sync-version.ts
 * 一键全量同步：
 *   1. 从 D:\Quiddity\package.json 同步版本号
 *   2. 从 GitHub Releases API 同步下载链接与发布说明
 *   3. 校验两边版本号是否一致
 *
 * 推荐在每次桌面应用发版后运行：npm run sync:version
 * CI 中：GITHUB_TOKEN=xxx npm run sync:version
 */

import { existsSync } from "node:fs";
import {
  DOWNLOADS_JSON_PATH,
  GITHUB_REPO,
  QUIDDITY_PKG_PATH,
  VERSION_JSON_PATH,
  fetchLatestRelease,
  log,
  normalizeVersion,
  nowIso,
  readJson,
  writeJson,
  type DownloadsInfo,
  type VersionInfo,
} from "./lib";

async function main() {
  log.info("=== 开始全量同步 ===");

  // 1. 读取本地 Quiddity 桌面应用版本（找不到则跳过，用 GitHub Release 版本）
  log.step("步骤 1/3：读取桌面应用 package.json");
  let localVersion = "";
  let localDescription = "";
  if (existsSync(QUIDDITY_PKG_PATH)) {
    const pkg = await readJson<{ version: string; description?: string }>(QUIDDITY_PKG_PATH);
    localVersion = pkg.version.trim();
    localDescription = pkg.description || "";
    log.ok(`桌面应用版本：v${localVersion}`);
  } else {
    log.warn(`未找到 ${QUIDDITY_PKG_PATH}，跳过本地版本校验（CI/云构建环境属正常现象）`);
  }

  // 2. 拉取 GitHub Release
  log.step("步骤 2/3：拉取 GitHub 最新 Release");
  const release = await fetchLatestRelease(GITHUB_REPO);
  const releaseVersion = normalizeVersion(release.tagName);
  log.ok(`GitHub Release 版本：v${releaseVersion}`);

  // 3. 校验一致性
  log.step("步骤 3/3：校验与写入");
  if (localVersion && localVersion !== releaseVersion) {
    log.warn(
      `版本号不一致！本地 = v${localVersion}，GitHub Release = v${releaseVersion}`
    );
    log.warn(
      "请先在桌面应用中 bump 版本并打 tag 推送，或检查 QUIDDITY_APP_DIR 是否正确。"
    );
    // 不退出，继续写入（以 GitHub Release 为准）
  } else if (localVersion) {
    log.ok("版本号一致 ✓");
  } else {
    log.info("无本地版本可对比，直接使用 GitHub Release 版本");
  }

  // 写入 version.json
  let versionInfo: VersionInfo;
  if (existsSync(VERSION_JSON_PATH)) {
    versionInfo = await readJson<VersionInfo>(VERSION_JSON_PATH);
  } else {
    versionInfo = { version: releaseVersion, releaseDate: "", downloadUrl: "", releaseNotes: "" };
  }
  versionInfo.version = releaseVersion;
  versionInfo.releaseDate = release.publishedAt.slice(0, 10);
  versionInfo.releaseNotes = release.body?.trim() || localDescription || "暂无发布说明";
  versionInfo.downloadUrl = `https://github.com/${GITHUB_REPO}/releases/latest`;
  await writeJson(VERSION_JSON_PATH, versionInfo);
  log.ok("已写入 version.json");

  // 写入 downloads.json（资产为空时也写入占位，便于 check-links 报警）
  const downloads: DownloadsInfo = {
    version: releaseVersion,
    releaseDate: versionInfo.releaseDate,
    releaseNotes: versionInfo.releaseNotes,
    assets: release.assets.map((a) => ({
      platform: "windows",
      arch: "x64" as const,
      label: a.name,
      url: a.browserDownloadUrl,
      size: a.size,
      contentType: a.contentType,
    })),
    fallbackUrl: versionInfo.downloadUrl,
    lastSyncedAt: nowIso(),
  };
  await writeJson(DOWNLOADS_JSON_PATH, downloads);
  log.ok("已写入 downloads.json");

  log.info("=== 同步完成 ===");
  console.log(`  版本：v${releaseVersion}`);
  console.log(`  发布日期：${versionInfo.releaseDate}`);
  console.log(`  资产数：${downloads.assets.length}`);
}

main().catch((err) => {
  log.err(err instanceof Error ? err.message : String(err));
  log.warn(
    "网络同步失败 — 保留 public/version.json + downloads.json 已有数据继续后续步骤（退出码 0）。"
  );
  // 网络失败时降级：不中止构建/推送流程
  process.exit(0);
});
