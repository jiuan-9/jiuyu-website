/**
 * announcement-store 单元测试
 * 验证 CRUD、导出/导入、密码验证
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  type AnnouncementsData,
  loadDraft,
  saveDraft,
  clearDraft,
  exportToJson,
  importFromJson,
  verifyPassword,
  changePassword,
  isDefaultPassword,
  todayStr,
  nextId,
  DEFAULT_ADMIN_PASSWORD,
} from "@/lib/announcement-store";

describe("announcement-store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("todayStr", () => {
    it("应返回 YYYY-MM-DD 格式", () => {
      const result = todayStr();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("nextId", () => {
    it("空数组应返回 1", () => {
      expect(nextId([])).toBe(1);
    });

    it("应返回最大 ID + 1", () => {
      const items = [
        { id: 1, title: "a", content: "b", date: "2026-01-01" },
        { id: 5, title: "c", content: "d", date: "2026-01-02" },
        { id: 3, title: "e", content: "f", date: "2026-01-03" },
      ];
      expect(nextId(items)).toBe(6);
    });
  });

  describe("saveDraft / loadDraft", () => {
    it("保存后应能读取", () => {
      const data: AnnouncementsData = {
        important: [{ id: 1, title: "测试", content: "内容", date: "2026-01-01" }],
        latest: [],
      };
      saveDraft(data);
      const loaded = loadDraft();
      expect(loaded).toEqual(data);
    });

    it("未保存时 loadDraft 返回 null", () => {
      expect(loadDraft()).toBeNull();
    });
  });

  describe("clearDraft", () => {
    it("应清除 localStorage 中的草稿", () => {
      const data: AnnouncementsData = { important: [], latest: [] };
      saveDraft(data);
      clearDraft();
      expect(loadDraft()).toBeNull();
    });
  });

  describe("密码管理", () => {
    it("默认密码应验证通过", () => {
      expect(verifyPassword(DEFAULT_ADMIN_PASSWORD)).toBe(true);
    });

    it("错误密码应验证失败", () => {
      expect(verifyPassword("wrong-password")).toBe(false);
    });

    it("修改密码后应使用新密码", () => {
      changePassword("new-secret-123");
      expect(verifyPassword("new-secret-123")).toBe(true);
      expect(verifyPassword(DEFAULT_ADMIN_PASSWORD)).toBe(false);
    });

    it("未修改密码时 isDefaultPassword 返回 true", () => {
      expect(isDefaultPassword()).toBe(true);
    });

    it("修改密码后 isDefaultPassword 返回 false", () => {
      changePassword("custom-pwd");
      expect(isDefaultPassword()).toBe(false);
    });
  });

  describe("exportToJson", () => {
    it("应创建下载链接并触发点击", () => {
      // jsdom 可能未实现 URL.createObjectURL/revokeObjectURL，先 mock
      if (!URL.createObjectURL) {
        URL.createObjectURL = vi.fn(() => "blob:mock");
      }
      if (!URL.revokeObjectURL) {
        URL.revokeObjectURL = vi.fn();
      }

      const createElementSpy = vi.spyOn(document, "createElement");
      const appendChildSpy = vi.spyOn(document.body, "appendChild");
      const removeChildSpy = vi.spyOn(document.body, "removeChild");

      const data: AnnouncementsData = { important: [], latest: [] };
      exportToJson(data);

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });
  });

  describe("importFromJson", () => {
    it("应正确解析合法 JSON 文件", async () => {
      const data: AnnouncementsData = {
        important: [{ id: 1, title: "公告", content: "内容", date: "2026-01-01" }],
        latest: [],
      };
      const file = new File([JSON.stringify(data)], "announcements.json", {
        type: "application/json",
      });
      const result = await importFromJson(file);
      expect(result).toEqual(data);
    });

    it("缺少 important/latest 字段应拒绝", async () => {
      const file = new File([JSON.stringify({ foo: [] })], "bad.json", {
        type: "application/json",
      });
      await expect(importFromJson(file)).rejects.toThrow();
    });
  });
});
