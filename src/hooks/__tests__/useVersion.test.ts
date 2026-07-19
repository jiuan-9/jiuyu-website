/**
 * useVersion hook 单元测试
 *
 * 覆盖：
 *   - formatVersion：版本号格式化（纯函数）
 *   - useVersion：fetch 成功 / 404 / 网络错误 / 缓存 / isLoading 状态
 *
 * Mock 策略：
 *   - global.fetch mock 不同响应
 *   - vi.resetModules 重置模块状态（cached / inflight）
 *   - renderHook + waitFor 测试 hook 行为
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const MOCK_VERSION = {
  version: "2.5.3",
  releaseDate: "2026-07-19",
  downloadUrl: "https://example.com/download/v2.5.3",
  releaseNotes: "Bug fixes and performance improvements",
};

describe("formatVersion", () => {
  it("无 v 前缀时添加 v", async () => {
    const { formatVersion } = await import("@/hooks/useVersion");
    expect(formatVersion("1.1.0")).toBe("v1.1.0");
  });

  it("已有 v 前缀时不重复添加", async () => {
    const { formatVersion } = await import("@/hooks/useVersion");
    expect(formatVersion("v1.1.0")).toBe("v1.1.0");
  });

  it("空字符串处理后返回 v", async () => {
    const { formatVersion } = await import("@/hooks/useVersion");
    expect(formatVersion("")).toBe("v");
  });

  it("去除前后空白字符", async () => {
    const { formatVersion } = await import("@/hooks/useVersion");
    expect(formatVersion("  1.2.3  ")).toBe("v1.2.3");
  });
});

describe("useVersion", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    vi.resetModules();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetch 成功返回 version.json 内容", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_VERSION,
    } as Response);

    const { useVersion } = await import("@/hooks/useVersion");
    const { result } = renderHook(() => useVersion());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.version).toBe("2.5.3");
    expect(result.current.releaseDate).toBe("2026-07-19");
    expect(result.current.downloadUrl).toBe(
      "https://example.com/download/v2.5.3"
    );
    expect(result.current.releaseNotes).toBe(
      "Bug fixes and performance improvements"
    );
    expect(result.current.error).toBeNull();

    expect(global.fetch).toHaveBeenCalledWith("/version.json", {
      cache: "no-cache",
    });
  });

  it("fetch 404 返回 DEFAULT_VERSION", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { useVersion } = await import("@/hooks/useVersion");
    const { result } = renderHook(() => useVersion());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.version).toBe("1.1.0");
    expect(result.current.releaseDate).toBe("");
    expect(result.current.downloadUrl).toBe("#download");
    expect(result.current.releaseNotes).toBe("");
    expect(result.current.error).toBeNull();

    warnSpy.mockRestore();
  });

  it("fetch 网络错误返回 DEFAULT_VERSION + console.warn", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { useVersion } = await import("@/hooks/useVersion");
    const { result } = renderHook(() => useVersion());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.version).toBe("1.1.0");
    expect(result.current.error).toBeNull();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[useVersion]"),
      expect.any(Error)
    );

    warnSpy.mockRestore();
  });

  it("第二次调用使用缓存（fetch 只被调用一次）", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_VERSION,
    } as Response);
    global.fetch = fetchMock;

    const { useVersion } = await import("@/hooks/useVersion");

    const { result: r1 } = renderHook(() => useVersion());
    await waitFor(() => expect(r1.current.isLoading).toBe(false));

    const { result: r2 } = renderHook(() => useVersion());
    await waitFor(() => expect(r2.current.isLoading).toBe(false));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(r2.current.version).toBe("2.5.3");
    expect(r2.current.isLoading).toBe(false);
  });

  it("isLoading 初始为 true（首次无缓存）", async () => {
    global.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {})
    );

    const { useVersion } = await import("@/hooks/useVersion");
    const { result } = renderHook(() => useVersion());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.version).toBe("1.1.0");
  });
});
