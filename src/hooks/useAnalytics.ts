/**
 * useAnalytics — 轻量级本地访问统计
 *
 * 设计原则：
 *   - 不上报到任何第三方服务器（隐私友好）
 *   - 数据仅存 localStorage（本机可见）
 *   - 管理后台可读取展示（仅限同一台机器的访问数据）
 *   - 如需全站统计，请接入 Cloudflare Web Analytics（见 index.html 注释）
 *
 * 统计维度：
 *   - PV（Page View）：每次访问 +1
 *   - UV（Unique Visitor）：基于 localStorage UUID，首次访问生成
 *   - 首次访问时间、最后访问时间
 *   - 来源页面（document.referrer）
 */

import { useEffect } from "react";

const STORAGE_KEY = "quiddity_analytics_v1";

type AnalyticsData = {
  pv: number;
  uvId: string;
  firstVisit: string;
  lastVisit: string;
  lastReferrer: string;
  deviceType: "mobile" | "tablet" | "desktop";
};

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPod/.test(ua)) return "mobile";
  if (/iPad|Tablet/.test(ua)) return "tablet";
  return "desktop";
}

function generateUvId(): string {
  // 简单 UUID v4（不用 crypto.randomUUID，兼容性更好）
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function loadData(): AnalyticsData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalyticsData;
  } catch {
    return null;
  }
}

function saveData(data: AnalyticsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage 满或被禁用，静默失败
  }
}

/**
 * 记录一次访问。在 App 挂载时调用一次。
 * 仅在客户端执行，SSR 安全。
 */
export function recordVisit(): void {
  if (typeof window === "undefined") return;

  const now = new Date().toISOString();
  const existing = loadData();

  if (existing) {
    existing.pv += 1;
    existing.lastVisit = now;
    existing.lastReferrer = document.referrer || "(直接访问)";
    existing.deviceType = getDeviceType();
    saveData(existing);
  } else {
    const data: AnalyticsData = {
      pv: 1,
      uvId: generateUvId(),
      firstVisit: now,
      lastVisit: now,
      lastReferrer: document.referrer || "(直接访问)",
      deviceType: getDeviceType(),
    };
    saveData(data);
  }
}

/**
 * React Hook：在组件挂载时自动记录一次访问
 */
export function useAnalytics(): void {
  useEffect(() => {
    recordVisit();
  }, []);
}

export default useAnalytics;
