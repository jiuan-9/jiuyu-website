/**
 * scroll.ts 单元测试
 *
 * 覆盖：
 *   - scrollToSection：元素查找 + scrollTo 调用 + reduced-motion 分支
 *   - navigateToSection：路由跳转 / 同页锚点 / 跨路由锚点 + 重试调度
 *
 * Mock 策略：
 *   - window.scrollTo 已在 tests/setup.ts 中 mock 为 vi.fn
 *   - window.matchMedia 已在 setup.ts mock（默认 matches:false）
 *   - 用 vi.useFakeTimers 控制 setTimeout 重试调度
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { scrollToSection, navigateToSection } from "@/lib/scroll";

describe("scrollToSection", () => {
  beforeEach(() => {
    vi.mocked(window.scrollTo).mockClear();
    document.body.innerHTML = "";
  });

  it("元素不存在时静默返回（DEV 模式打印警告，不调用 scrollTo）", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    scrollToSection("nonexistent");
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("element not found: #nonexistent")
    );
    warnSpy.mockRestore();
  });

  it("元素存在时调用 window.scrollTo（smooth behavior）", () => {
    const el = document.createElement("div");
    el.id = "test-section";
    document.body.appendChild(el);

    scrollToSection("test-section");

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" })
    );
  });

  it("prefers-reduced-motion 启用时用 instant 跳转（数字参数）", () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as typeof window.matchMedia;

    const el = document.createElement("div");
    el.id = "rm-section";
    document.body.appendChild(el);

    scrollToSection("rm-section");

    expect(window.scrollTo).toHaveBeenCalledWith(0, expect.any(Number));

    window.matchMedia = original;
  });

  it("滚动目标位置应减去 Navbar 高度（80px）", () => {
    const el = document.createElement("div");
    el.id = "offset-section";
    // jsdom 不做布局，需直接 mock getBoundingClientRect
    el.getBoundingClientRect = () => {
      const rect: DOMRect = {
        top: 1000,
        bottom: 1100,
        left: 0,
        right: 0,
        width: 0,
        height: 100,
        x: 0,
        y: 1000,
        toJSON: () => ({}),
      };
      return rect;
    };
    document.body.appendChild(el);

    scrollToSection("offset-section");

    const call = vi.mocked(window.scrollTo).mock.calls[0]?.[0];
    if (typeof call === "object" && call !== null && "top" in call) {
      // top = scrollY(0) + rect.top(1000) - NAVBAR_HEIGHT(80) = 920
      expect((call as ScrollToOptions).top).toBe(920);
    } else {
      throw new Error("scrollTo 未以 ScrollToOptions 形式调用");
    }
  });
});

describe("navigateToSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(window.scrollTo).mockClear();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("href '#/demo' 触发路由跳转：navigate('/demo')", () => {
    const navigate = vi.fn();
    navigateToSection("#/demo", navigate, "/");

    expect(navigate).toHaveBeenCalledWith("/demo");
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("href '#/timeline' 前缀 '#/' 正确剥离", () => {
    const navigate = vi.fn();
    navigateToSection("#/timeline", navigate, "/");

    expect(navigate).toHaveBeenCalledWith("/timeline");
  });

  it("同页锚点：当前在 '/' 直接 scrollToSection", () => {
    const el = document.createElement("div");
    el.id = "features";
    document.body.appendChild(el);

    const navigate = vi.fn();
    navigateToSection("#features", navigate, "/");

    expect(navigate).not.toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("跨路由锚点：当前在 '/demo' 先 navigate('/') 再 5 次重试 scrollToSection", () => {
    const el = document.createElement("div");
    el.id = "features";
    document.body.appendChild(el);

    const navigate = vi.fn();
    navigateToSection("#features", navigate, "/demo");

    expect(navigate).toHaveBeenCalledWith("/");
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).not.toHaveBeenCalled();

    vi.runAllTimers();

    // 5 次重试都找到元素 → scrollTo 调用 5 次
    expect(window.scrollTo).toHaveBeenCalledTimes(5);
  });

  it("跨路由锚点：元素始终不存在时不调用 scrollTo", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const navigate = vi.fn();

    navigateToSection("#missing-section", navigate, "/demo");

    vi.runAllTimers();

    expect(navigate).toHaveBeenCalledWith("/");
    expect(window.scrollTo).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
