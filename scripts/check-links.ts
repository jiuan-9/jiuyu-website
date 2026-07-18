/**
 * check-links.ts
 * 校验 public/downloads.json 与 public/version.json 中的所有链接是否有效。
 * 失效时退出码非 0，用于 CI 拦截部署。
 *
 * 用法：npm run check:links
 *      CI 中：GITHUB_TOKEN=xxx npm run check:links
 */

import { existsSync } from "node:fs";
import {
  DOWNLOADS_JSON_PATH,
  GITHUB_REPO,
  GITHUB_TOKEN,
  VERSION_JSON_PATH,
  log,
  readJson,
  type DownloadsInfo,
  type VersionInfo,
} from "./lib";

type CheckResult = {
  url: string;
  ok: boolean;
  status: number;
  reason?: string;
};

async function checkUrl(url: string, label: string): Promise<CheckResult> {
  log.step(`校验：${label} → ${url}`);
  try {
    const headers: Record<string, string> = {
      "User-Agent": "quiddity-website-link-checker",
    };
    if (GITHUB_TOKEN && url.includes("github.com")) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }
    // GitHub Releases 资产会 302 跳转到 CDN，使用 redirect: "follow"
    const resp = await fetch(url, {
      method: "GET",
      headers,
      redirect: "follow",
    });
    // HEAD 可能不被某些 CDN 支持，统一用 GET 但只读响应头
    if (resp.ok) {
      log.ok(`HTTP ${resp.status} OK`);
      return { url, ok: true, status: resp.status };
    }
    if (resp.status === 404) {
      log.err(`HTTP 404 资源不存在`);
      return { url, ok: false, status: 404, reason: "Not Found" };
    }
    log.warn(`HTTP ${resp.status}`);
    return { url, ok: resp.status < 400, status: resp.status };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log.err(`请求失败：${msg}`);
    return { url, ok: false, status: 0, reason: msg };
  }
}

async function main() {
  log.info("=== 开始链接校验 ===");
  const results: CheckResult[] = [];

  // 1. version.json
  if (existsSync(VERSION_JSON_PATH)) {
    log.step(`读取 ${VERSION_JSON_PATH}`);
    const v = await readJson<VersionInfo>(VERSION_JSON_PATH);
    if (v.downloadUrl) results.push(await checkUrl(v.downloadUrl, "version.json#downloadUrl"));
  } else {
    log.warn(`version.json 不存在：${VERSION_JSON_PATH}`);
  }

  // 2. downloads.json
  if (existsSync(DOWNLOADS_JSON_PATH)) {
    log.step(`读取 ${DOWNLOADS_JSON_PATH}`);
    const d = await readJson<DownloadsInfo>(DOWNLOADS_JSON_PATH);
    if (d.fallbackUrl) results.push(await checkUrl(d.fallbackUrl, "downloads.json#fallbackUrl"));
    for (const a of d.assets) {
      results.push(await checkUrl(a.url, `downloads.json#assets[${a.label}]`));
    }
    if (d.assets.length === 0) {
      log.warn("downloads.json 没有任何资产 — 请先运行 npm run sync:downloads");
    }
  } else {
    log.warn(`downloads.json 不存在：${DOWNLOADS_JSON_PATH}`);
    log.info(`提示：运行 npm run sync:downloads 生成该文件`);
  }

  // 3. GitHub Release 页面兜底校验
  const releasePage = `https://github.com/${GITHUB_REPO}/releases/latest`;
  results.push(await checkUrl(releasePage, "GitHub Releases 页面"));

  // 汇总
  console.log("");
  log.info("=== 校验汇总 ===");
  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  console.log(`  通过：${ok}/${results.length}`);
  console.log(`  失败：${fail}/${results.length}`);

  if (fail > 0) {
    log.err(`存在 ${fail} 个失效链接：`);
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  ✗ ${r.url}  (HTTP ${r.status}${r.reason ? " - " + r.reason : ""})`);
    }
    process.exit(1);
  }
  log.ok("所有链接校验通过 ✓");
}

main().catch((err) => {
  log.err(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
