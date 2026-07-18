/**
 * sync-from-quiddity.ts
 * 从 D:\Quiddity\package.json 同步版本号到 public/version.json
 *
 * 用途：在 Quiddity 桌面应用发版后，运行此脚本即可让网站版本号保持一致。
 * 用法：npm run sync:from-quiddity
 *      或：QUIDDITY_APP_DIR=/path/to/Quiddity npm run sync:from-quiddity
 */

import { existsSync } from "node:fs";
import {
  QUIDDITY_PKG_PATH,
  VERSION_JSON_PATH,
  log,
  nowIso,
  readJson,
  writeJson,
  type VersionInfo,
} from "./lib";

async function main() {
  log.step(`读取 Quiddity 桌面应用 package.json: ${QUIDDITY_PKG_PATH}`);
  if (!existsSync(QUIDDITY_PKG_PATH)) {
    log.err(`未找到 Quiddity 桌面应用 package.json：${QUIDDITY_PKG_PATH}`);
    log.warn(
      "请确认 Quiddity 项目位于 D:\\Quiddity，或通过环境变量 QUIDDITY_APP_DIR 指定路径。"
    );
    process.exit(1);
  }
  const quiddityPkg = await readJson<{ version: string; description?: string }>(QUIDDITY_PKG_PATH);
  const newVersion = quiddityPkg.version?.trim();
  if (!newVersion) {
    log.err("Quiddity package.json 中未找到 version 字段");
    process.exit(1);
  }
  log.ok(`桌面应用版本：${newVersion}`);

  log.step(`读取网站 version.json: ${VERSION_JSON_PATH}`);
  let current: VersionInfo;
  if (existsSync(VERSION_JSON_PATH)) {
    current = await readJson<VersionInfo>(VERSION_JSON_PATH);
  } else {
    current = {
      version: newVersion,
      releaseDate: nowIso().slice(0, 10),
      downloadUrl: "",
      releaseNotes: "首个正式版本",
    };
  }

  if (current.version === newVersion) {
    log.ok(`版本号一致：${newVersion}（无需更新）`);
    return;
  }

  log.warn(`版本号不一致：网站 ${current.version} → 桌面 ${newVersion}`);
  current.version = newVersion;
  current.releaseDate = nowIso().slice(0, 10);
  if (quiddityPkg.description) {
    // 不覆盖已有的 releaseNotes（由 sync-downloads 从 GitHub Release body 同步）
    // 仅在 releaseNotes 为空时填充
    if (!current.releaseNotes) current.releaseNotes = quiddityPkg.description;
  }
  await writeJson(VERSION_JSON_PATH, current);
  log.ok(`已更新 version.json → v${newVersion}`);
}

main().catch((err) => {
  log.err(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
