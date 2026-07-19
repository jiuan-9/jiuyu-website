/**
 * 导航完整性测试 — 用 Playwright 验证所有导航场景
 *
 * 测试矩阵（9 个场景）：
 *   1. Home → 功能特色 (#features)
 *   2. Home → 应用场景 (#usecases)
 *   3. Home → Quiddity Agent (#quiddity)
 *   4. Home → 常见问题 (#faq)
 *   5. Home → 下载应用 (#download)
 *   6. Home → Logo 回顶 (#hero)
 *   7. Home → 在线体验 (路由 #/demo)
 *   8. /demo → 功能特色 (子路由 → Home section)
 *   9. /demo → 应用场景 (子路由 → Home section)
 *
 * 成功条件：
 *   - 按钮被点击
 *   - URL 中 hash 变化（路由）或目标 section 的 top 坐标接近 80px（NAVBAR_HEIGHT）
 */

const { chromium } = require("playwright");

const BASE_URL = "http://127.0.0.1:5174/";
const NAVBAR_HEIGHT = 80;

// 期望按钮文本 → 目标 section id
const HOME_TESTS = [
  { label: "功能特色", sectionId: "features" },
  { label: "应用场景", sectionId: "usecases" },
  { label: "Quiddity Agent", sectionId: "quiddity" },
  { label: "常见问题", sectionId: "faq" },
  { label: "下载应用", sectionId: "download" },
];

/** 等待元素滚动到可见位置
 *  判定逻辑：
 *    - section 的顶部在视口可见区域内（允许 [0, viewport.height/2+200]）
 *    - section 的底部在 Navbar 下方可见（rect.bottom > NAVBAR_HEIGHT + 30）
 *  特殊处理：#hero 在页面顶部，scroll 到顶后 rect.top=0，是合法情况
 */
async function waitForSectionVisible(page, sectionId, timeout = 4000) {
  const viewport = page.viewportSize() || { height: 900 };
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const rect = await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height };
    }, sectionId);
    if (
      rect &&
      rect.top >= -10 &&
      rect.top < viewport.height / 2 + 200 &&
      rect.bottom > NAVBAR_HEIGHT + 30
    ) {
      return rect;
    }
    await page.waitForTimeout(120);
  }
  return null;
}

/** 找到并点击导航按钮 */
async function clickNavButton(page, labelText) {
  // 找按钮：通过文本内容定位
  const btn = await page.locator(`nav button:has-text("${labelText}")`).first();
  const count = await btn.count();
  if (count === 0) {
    throw new Error(`未找到导航按钮："${labelText}"`);
  }
  await btn.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
  await btn.click({ timeout: 3000 });
  return true;
}

async function runTest(name, fn) {
  process.stdout.write(`[TEST] ${name} ... `);
  try {
    const result = await fn();
    if (result === false) {
      console.log("FAIL ❌");
      return { name, pass: false, reason: "返回 false" };
    }
    console.log("PASS ✅");
    return { name, pass: true, detail: result };
  } catch (e) {
    console.log("FAIL ❌");
    console.log(`       原因: ${e.message}`);
    return { name, pass: false, reason: e.message };
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: "msedge",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // 收集 console error
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[console] ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(`[pageerror] ${err.message}`);
  });

  const results = [];

  // ── Phase 1: 加载 Home 页 ──
  console.log("\n========== 加载 Home 页 ==========");
  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
  // 等 Hero 出现
  await page.waitForSelector("#hero", { timeout: 10000 });
  await page.waitForTimeout(800); // 等动画稳定
  console.log("✓ Home 页已加载");

  // ── 测试 1-5: Home → 各 section ──
  console.log("\n========== Phase 1: Home 页内导航 ==========");
  for (const tc of HOME_TESTS) {
    results.push(
      await runTest(`Home → ${tc.label} (#${tc.sectionId})`, async () => {
        await clickNavButton(page, tc.label);
        // 等待滚动完成
        await page.waitForTimeout(900);
        const rect = await waitForSectionVisible(page, tc.sectionId, 3000);
        if (!rect) {
          // 二次检查：可能元素存在但没滚动到位
          const exists = await page.evaluate((id) => {
            const el = document.getElementById(id);
            return el ? { top: el.getBoundingClientRect().top } : null;
          }, tc.sectionId);
          throw new Error(
            `section #${tc.sectionId} 未滚动到可见位置。${
              exists ? `当前 top=${exists.top}` : "元素不存在"
            }`
          );
        }
        return `top=${Math.round(rect.top)}`;
      })
    );
  }

  // ── 测试 6: Home → Logo 回顶 ──
  results.push(
    await runTest("Home → Logo 回顶 (#hero)", async () => {
      // 先滚动到下方
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      // 点击 Logo
      const logoBtn = page.locator('nav button[aria-label="回到顶部"]').first();
      await logoBtn.click({ timeout: 3000 });
      await page.waitForTimeout(900);
      const rect = await waitForSectionVisible(page, "hero", 3000);
      if (!rect) throw new Error("#hero 未回到顶部");
      return `top=${Math.round(rect.top)}`;
    })
  );

  // ── 测试 7: Home → 在线体验 (路由跳转) ──
  results.push(
    await runTest("Home → 在线体验 (#/demo 路由)", async () => {
      await clickNavButton(page, "在线体验");
      // 等待 URL 变化
      await page.waitForURL(/\/demo$/, { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const url = page.url();
      if (!url.includes("/demo")) {
        throw new Error(`URL 没有跳转到 /demo，当前 URL: ${url}`);
      }
      // 验证 Demo 页面已渲染
      const demoExists = await page.locator("text=会话设置").count();
      if (demoExists === 0) {
        throw new Error("URL 跳转了但 Demo 页面未渲染");
      }
      return url;
    })
  );

  // ── 测试 8: Demo 返回按钮 → 回到 Home ──
  console.log("\n========== Phase 2: Demo 子路由返回 ==========");
  results.push(
    await runTest("/demo → 返回按钮 → Home (#hero)", async () => {
      // 确保当前在 /demo
      if (!page.url().includes("/demo")) {
        await page.goto(`${BASE_URL}#/demo`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
      }
      // 点击 Demo 标题栏的返回按钮
      const backBtn = page.locator('a[title="返回首页"]').first();
      const count = await backBtn.count();
      if (count === 0) {
        throw new Error("未找到 Demo 返回按钮 (a[title=返回首页])");
      }
      await backBtn.click({ timeout: 3000 });
      await page.waitForURL(/\/$/, { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const url = page.url();
      if (!url.endsWith("/") && !url.endsWith("/#/")) {
        throw new Error(`URL 没有回到 Home，当前: ${url}`);
      }
      // 验证 Home hero 渲染
      const heroVisible = await page.locator("#hero").count();
      if (heroVisible === 0) {
        throw new Error("已回到 Home URL，但 #hero 未渲染");
      }
      return `url=${url}`;
    })
  );

  // ── 测试 9-11: 返回 Home 后，导航按钮仍能正常工作 ──
  for (const tc of [
    { label: "功能特色", sectionId: "features" },
    { label: "应用场景", sectionId: "usecases" },
    { label: "Quiddity Agent", sectionId: "quiddity" },
  ]) {
    results.push(
      await runTest(`返回 Home 后 → ${tc.label} (#${tc.sectionId})`, async () => {
        // 确保在 Home
        if (!page.url().endsWith("/") && !page.url().endsWith("/#/")) {
          await page.goto(BASE_URL, { waitUntil: "networkidle" });
          await page.waitForTimeout(1000);
        }
        await clickNavButton(page, tc.label);
        await page.waitForTimeout(900);
        const rect = await waitForSectionVisible(page, tc.sectionId, 3000);
        if (!rect) {
          throw new Error(
            `#${tc.sectionId} 未滚动到位 (返回 Home 后导航失效)`
          );
        }
        return `top=${Math.round(rect.top)}`;
      })
    );
  }

  // ── Phase 3: Footer 链接（基线：捕获当前"坏"行为） ──
  console.log("\n========== Phase 3: Footer 链接基线 ==========");

  // 确保在 Home 页
  if (!page.url().endsWith("/") && !page.url().endsWith("/#/")) {
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
  }

  // 测试 12: Footer "功能特色" 锚点链接（当前坏行为：URL 错误变成 /#/features）
  results.push(
    await runTest("Footer → 功能特色 (#features) [基线：当前坏行为]", async () => {
      // 滚动到 Footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      // 点击 Footer 中的 "功能特色" 链接（Footer 用 <a href="#features">，存在 HashRouter bug）
      const footerLink = page.locator('footer a:has-text("功能特色")').first();
      const count = await footerLink.count();
      if (count === 0) {
        throw new Error("未找到 Footer '功能特色' 链接");
      }
      await footerLink.click({ timeout: 3000 });
      await page.waitForTimeout(800);
      const url = page.url();
      // 基线断言：当前坏行为是 URL 变成 /#/features（HashRouter 错误响应）
      // Phase 1 修复后，此测试应改为：URL 仍是 /，且 #features 滚动到可见
      if (url.includes("/features")) {
        return `基线确认坏行为：URL=${url}（Phase 1 后应修复）`;
      }
      // 如果 URL 没变，说明已经修复了（或本就是好的）
      const rect = await waitForSectionVisible(page, "features", 2000);
      return `URL=${url}, rect.top=${rect ? Math.round(rect.top) : "null"}`;
    })
  );

  // 测试 13: Footer "法律信息" 按钮（当前好行为：跳转到 /legal）
  results.push(
    await runTest("Footer → 法律信息 (/legal) [基线：当前好行为]", async () => {
      // 回到 Home
      if (!page.url().endsWith("/") && !page.url().endsWith("/#/")) {
        await page.goto(BASE_URL, { waitUntil: "networkidle" });
        await page.waitForTimeout(800);
      }
      // 滚动到 Footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      // 点击 Footer 法律信息按钮（包含 Scale 图标 + 免责声明文案）
      const legalBtn = page.locator('footer button:has-text("免责声明")').first();
      const count = await legalBtn.count();
      if (count === 0) {
        throw new Error("未找到 Footer '法律信息' 按钮");
      }
      await legalBtn.click({ timeout: 3000 });
      await page.waitForURL(/\/legal$/, { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1000);
      const url = page.url();
      if (!url.includes("/legal")) {
        throw new Error(`URL 没有跳转到 /legal，当前: ${url}`);
      }
      return `url=${url}`;
    })
  );

  // 测试 14: Footer "管理后台" 按钮（当前好行为：跳转到 /admin）
  results.push(
    await runTest("Footer → 管理后台 (/admin) [基线：当前好行为]", async () => {
      // 回到 Home
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      // 滚动到 Footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      // 点击 Footer Admin 按钮（title="管理后台"）
      const adminBtn = page.locator('footer button[title="管理后台"]').first();
      const count = await adminBtn.count();
      if (count === 0) {
        throw new Error("未找到 Footer '管理后台' 按钮");
      }
      await adminBtn.click({ timeout: 3000 });
      await page.waitForURL(/\/admin$/, { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1000);
      const url = page.url();
      if (!url.includes("/admin")) {
        throw new Error(`URL 没有跳转到 /admin，当前: ${url}`);
      }
      return `url=${url}`;
    })
  );

  // ── 汇总 ──
  console.log("\n========== 测试汇总 ==========");
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`总计: ${results.length}，PASS: ${passed}，FAIL: ${failed}`);
  if (consoleErrors.length > 0) {
    console.log("\n--- 浏览器 console 错误（前 10 条）---");
    consoleErrors.slice(0, 10).forEach((e) => console.log(e));
  }
  console.log("");
  results.forEach((r) => {
    console.log(`  ${r.pass ? "✓" : "✗"} ${r.name}${r.detail ? ` (${r.detail})` : ""}`);
  });

  await browser.close();

  // 非零退出码表示有失败
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("测试脚本异常:", e);
  process.exit(2);
});
