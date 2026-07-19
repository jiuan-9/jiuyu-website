#!/usr/bin/env node
/**
 * prebuild — 构建前同步脚本（容错版）
 *
 * 尝试运行 sync:downloads 和 sync:version，
 * 失败时只警告，不中断构建（使用 public/ 下已有默认值）。
 *
 * 为什么不直接在 package.json 里写？
 *   多层转义（JSON → shell → node）在跨平台时容易出问题，
 *   尤其是 Windows PowerShell 和 Linux bash 的引号行为不同。
 */

import { execSync } from "node:child_process";

const isCI =
  process.env.CI ||
  process.env.CF_PAGES ||
  process.env.GITHUB_ACTIONS ||
  process.env.NETLIFY ||
  process.env.VERCEL;

console.log("");
console.log("[prebuild] 开始构建前同步...");
if (isCI) {
  console.log("[prebuild] 检测到 CI/云构建环境，sync 失败将自动跳过");
}
console.log("");

let allOk = true;

function runStep(name, cmd) {
  console.log(`[prebuild] → ${name}`);
  try {
    execSync(cmd, { stdio: "inherit", timeout: 120000 });
    console.log(`[prebuild] ✓ ${name} 完成`);
    return true;
  } catch (err) {
    console.warn(`[prebuild] ⚠ ${name} 失败（可接受）：${err.message}`);
    console.warn("[prebuild]   将使用 public/ 下已有数据继续构建");
    return false;
  }
}

allOk = runStep("同步下载链接", "npm run sync:downloads") && allOk;
console.log("");
allOk = runStep("同步版本信息", "npm run sync:version") && allOk;

console.log("");
if (allOk) {
  console.log("[prebuild] ✓ 全部同步成功");
} else {
  console.log("[prebuild] ⚠ 部分同步失败，使用默认数据继续构建");
}
console.log("");
