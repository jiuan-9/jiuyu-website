/**
 * announcement-store — 公告数据管理
 *
 * 由于网站是静态部署（Vite SPA），无后端。
 * 采用 localStorage 暂存 + JSON 导出/导入的工作流：
 *   1. 管理员在 /admin 页面编辑公告 → 存入 localStorage
 *   2. 点击"导出"下载 announcements.json
 *   3. 将文件放入 public/ 目录重新部署
 *
 * 数据结构对齐 public/announcements.json：
 *   { important: AnnouncementItem[], latest: AnnouncementItem[] }
 */

export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  date: string;
  tag?: string;
}

export interface AnnouncementsData {
  important: AnnouncementItem[];
  latest: AnnouncementItem[];
}

export type AnnouncementCategory = "important" | "latest";

const STORAGE_KEY = "quiddity-announcements-draft";
const ADMIN_PASSWORD_KEY = "quiddity-admin-password";

/** 默认管理员密码（首次使用，建议修改） */
export const DEFAULT_ADMIN_PASSWORD = "quiddity-admin";

/** 获取今日日期 YYYY-MM-DD */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 生成下一个 ID */
export function nextId(items: AnnouncementItem[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

/** 从 localStorage 读取草稿 */
export function loadDraft(): AnnouncementsData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnnouncementsData;
  } catch {
    return null;
  }
}

/** 保存草稿到 localStorage */
export function saveDraft(data: AnnouncementsData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** 清除草稿 */
export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** 导出为 JSON 文件下载 */
export function exportToJson(data: AnnouncementsData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "announcements.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 从文件导入 JSON */
export function importFromJson(file: File): Promise<AnnouncementsData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as AnnouncementsData;
        if (!Array.isArray(data.important) || !Array.isArray(data.latest)) {
          reject(new Error("Invalid format: missing important/latest arrays"));
          return;
        }
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/** 验证管理员密码 */
export function verifyPassword(input: string): boolean {
  const stored = localStorage.getItem(ADMIN_PASSWORD_KEY) ?? DEFAULT_ADMIN_PASSWORD;
  return input === stored;
}

/** 修改管理员密码 */
export function changePassword(newPassword: string): void {
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
}

/** 检查是否已修改默认密码 */
export function isDefaultPassword(): boolean {
  return !localStorage.getItem(ADMIN_PASSWORD_KEY);
}
