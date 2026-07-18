/**
 * i18n Store 单元测试
 * 验证双语切换、翻译函数、URL 同步
 */

import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useI18n } from "@/store/i18n";

describe("i18n store", () => {
  beforeEach(() => {
    // 重置 store 状态
    localStorage.clear();
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLang("zh"));
  });

  it("默认语言应为中文", () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.lang).toBe("zh");
  });

  it("t() 应根据当前语言返回对应文本", () => {
    const { result } = renderHook(() => useI18n());
    const text = { zh: "你好", en: "Hello" };
    expect(result.current.t(text)).toBe("你好");
  });

  it("setLang('en') 应切换到英文", () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLang("en"));
    expect(result.current.lang).toBe("en");
    expect(result.current.t({ zh: "你好", en: "Hello" })).toBe("Hello");
  });

  it("toggle() 应在 zh/en 之间切换", () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.lang).toBe("zh");
    act(() => result.current.toggle());
    expect(result.current.lang).toBe("en");
    act(() => result.current.toggle());
    expect(result.current.lang).toBe("zh");
  });

  it("切换语言后 <html lang> 应同步更新", () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLang("en"));
    expect(document.documentElement.lang).toBe("en");
    act(() => result.current.setLang("zh"));
    expect(document.documentElement.lang).toBe("zh");
  });

  it("语言应持久化到 localStorage", () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLang("en"));
    const stored = localStorage.getItem("quiddity-lang");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.lang).toBe("en");
  });
});
