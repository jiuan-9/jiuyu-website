/**
 * 性能监控工具库
 * 实现 9 项流畅度保障机制中的「FPS 监控」与「Performance Mark/Measure」
 */

export type FpsSample = {
  fps: number;
  timestamp: number;
  frameTime: number;
};

export type FpsReport = {
  average: number;
  min: number;
  max: number;
  low1: number;
  low01: number;
  samples: number;
  droppedFrames: number;
  droppedRatio: number;
};

type FpsListener = (sample: FpsSample) => void;

class FpsMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private rafId: number | null = null;
  private samples: FpsSample[] = [];
  private listeners = new Set<FpsListener>();
  private maxSamples = 600;
  private running = false;

  start(): void {
    if (this.running || typeof requestAnimationFrame === "undefined") return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }

  subscribe(listener: FpsListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getReport(windowMs: number = 10000): FpsReport {
    const now = performance.now();
    const recent = this.samples.filter((s) => now - s.timestamp < windowMs);
    if (recent.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        low1: 0,
        low01: 0,
        samples: 0,
        droppedFrames: 0,
        droppedRatio: 0,
      };
    }
    const fpsValues = recent.map((s) => s.fps).sort((a, b) => a - b);
    const sum = fpsValues.reduce((a, b) => a + b, 0);
    const average = sum / fpsValues.length;
    const min = fpsValues[0];
    const max = fpsValues[fpsValues.length - 1];
    const low1Count = Math.max(1, Math.floor(fpsValues.length * 0.01));
    const low1Values = fpsValues.slice(0, low1Count);
    const low1 = low1Values.reduce((a, b) => a + b, 0) / low1Values.length;
    const low01Count = Math.max(1, Math.floor(fpsValues.length * 0.001));
    const low01Values = fpsValues.slice(0, low01Count);
    const low01 = low01Values.reduce((a, b) => a + b, 0) / low01Values.length;
    const droppedFrames = recent.filter((s) => s.fps < 50).length;
    return {
      average,
      min,
      max,
      low1,
      low01,
      samples: recent.length,
      droppedFrames,
      droppedRatio: droppedFrames / recent.length,
    };
  }

  reset(): void {
    this.samples = [];
    this.frameCount = 0;
  }

  private tick = (): void => {
    const now = performance.now();
    const frameTime = now - this.lastTime;
    const fps = 1000 / frameTime;
    this.lastTime = now;
    this.frameCount++;

    if (this.frameCount % 3 === 0) {
      const sample: FpsSample = {
        fps: Math.min(fps, 240),
        timestamp: now,
        frameTime,
      };
      this.samples.push(sample);
      if (this.samples.length > this.maxSamples) this.samples.shift();
      for (const listener of this.listeners) {
        try {
          listener(sample);
        } catch {
          // 单个 listener 失败不影响其他
        }
      }
    }
    this.rafId = requestAnimationFrame(this.tick);
  };
}

export const fpsMonitor = new FpsMonitor();

export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startMark = `${name}:start`;
  const endMark = `${name}:end`;
  const measureName = `${name}:measure`;
  performance.mark(startMark);
  try {
    return await fn();
  } finally {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    const entries = performance.getEntriesByName(measureName);
    if (entries.length > 0) {
      const duration = entries[entries.length - 1].duration;
      if (duration > 16) {
        console.warn(`[perf] ${name} 耗时 ${duration.toFixed(2)}ms（可能掉帧）`);
      } else if (duration > 4) {
        console.info(`[perf] ${name} 耗时 ${duration.toFixed(2)}ms`);
      }
    }
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
  }
}

export function measureSync<T>(name: string, fn: () => T): T {
  const startMark = `${name}:start`;
  const endMark = `${name}:end`;
  const measureName = `${name}:measure`;
  performance.mark(startMark);
  try {
    return fn();
  } finally {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
  }
}

export type ResourceLoadStats = {
  url: string;
  type: string;
  duration: number;
  size?: number;
};

export function getResourceStats(): ResourceLoadStats[] {
  if (typeof performance === "undefined" || !performance.getEntriesByType) {
    return [];
  }
  return performance
    .getEntriesByType("resource")
    .map((e) => {
      const entry = e as PerformanceResourceTiming;
      return {
        url: entry.name,
        type: entry.initiatorType,
        duration: entry.duration,
        size: entry.transferSize,
      };
    })
    .filter((r) => r.duration > 50);
}

export type WebVitals = {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
};

export function getWebVitals(): WebVitals {
  const vitals: WebVitals = { fcp: null, lcp: null, fid: null, cls: null };
  if (typeof performance === "undefined" || !performance.getEntriesByType) {
    return vitals;
  }
  for (const entry of performance.getEntriesByType("paint")) {
    if (entry.name === "first-contentful-paint") {
      vitals.fcp = entry.startTime;
    }
  }
  const lcpEntries = performance.getEntriesByType(
    "largest-contentful-paint"
  ) as LargestContentfulPaint[];
  if (lcpEntries.length > 0) {
    vitals.lcp = lcpEntries[lcpEntries.length - 1].startTime;
  }
  return vitals;
}

export function observeLongTasks(
  callback: (duration: number) => void
): () => void {
  if (
    typeof PerformanceObserver === "undefined" ||
    !PerformanceObserver.supportedEntryTypes?.includes("longtask")
  ) {
    return () => {};
  }
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback(entry.duration);
      }
    });
    observer.observe({ entryTypes: ["longtask"] });
    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}

let devAutoStarted = false;

export function enableDevFpsMonitoring(threshold: number = 50): void {
  if (devAutoStarted) return;
  if (import.meta.env?.PROD) return;
  devAutoStarted = true;
  fpsMonitor.start();
  fpsMonitor.subscribe((sample) => {
    if (sample.fps < threshold) {
      console.warn(
        `[fps] 掉帧检测：${sample.fps.toFixed(1)} fps（frame=${sample.frameTime.toFixed(1)}ms）`
      );
    }
  });
}

/* ============================================================
 * v2.1 新增：流畅度强化机制
 * ============================================================ */

/**
 * rAF 批处理器
 * 同一帧内多次调用 schedule(fn) 时，fn 会被合并到下一帧只执行一次
 * 适用于：scroll/resize/mousemove 等高频事件的回调合并
 *
 * 使用方式：
 *   const schedule = createRafBatcher((args) => { ... });
 *   element.addEventListener("scroll", schedule);
 */
export function createRafBatcher<T extends (...args: never[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    lastArgs = args;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (lastArgs) {
        callback(...lastArgs);
        lastArgs = null;
      }
    });
  };
}

/**
 * 帧对齐：等到下一帧再执行回调
 * 用于：触发 layout-heavy 操作前，确保浏览器已合成上一帧
 */
export function nextFrame<T>(fn: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    requestAnimationFrame(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    });
  });
}

/**
 * 双 rAF：用于必须等待两帧后才能测量的场景（如读取动画后的尺寸）
 */
export function doubleRaf(fn: () => void): void {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

/**
 * 防抖 + rAF：滚动事件的最佳实践
 * 在 wait 时间内只触发一次，且对齐到下一帧
 */
export function rafDebounce<T extends (...args: never[]) => void>(
  fn: T,
  wait: number = 16
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      });
    }, wait);
  };
}

/**
 * 节流 + rAF：高频事件的最佳实践
 * 每帧最多执行一次
 */
export function rafThrottle<T extends (...args: never[]) => void>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime = 0;
  const minInterval = 16; // ~60fps

  return (...args: Parameters<T>) => {
    lastArgs = args;
    const now = performance.now();
    if (now - lastCallTime < minInterval) {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        lastCallTime = performance.now();
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      });
      return;
    }
    lastCallTime = now;
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };
}

/**
 * 智能暂停：当页面不可见时自动暂停动画
 * 用于：循环动画组件在用户切换标签页后暂停，节省 CPU
 */
export function observeVisibilityChange(
  callback: (hidden: boolean) => void
): () => void {
  if (typeof document === "undefined") return () => {};

  const handler = () => callback(document.hidden);
  document.addEventListener("visibilitychange", handler);
  callback(document.hidden);
  return () => document.removeEventListener("visibilitychange", handler);
}

/**
 * 内存压力检测：在内存紧张时主动降低动画等级
 * 使用 Performance Memory API（仅 Chromium 支持，其他浏览器静默返回 false）
 */
export function isUnderMemoryPressure(): boolean {
  if (typeof performance === "undefined") return false;
  const memory = (
    performance as unknown as {
      memory?: { jsHeapSizeLimit: number; usedJSHeapSize: number };
    }
  ).memory;
  if (!memory) return false;
  return memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8;
}

/**
 * 综合性能画像：一次性返回当前设备的能力评估
 * 用于动画组件初始化时决定动画强度
 */
export type DevicePerformanceProfile = {
  tier: "high" | "medium" | "low";
  cores: number;
  memoryMb: number | null;
  isMobile: boolean;
  reducedMotion: boolean;
  highRefreshRate: boolean;
  underMemoryPressure: boolean;
  recommendedParticleCount: number;
  recommendedAnimationComplexity: "full" | "reduced" | "minimal";
};

export function getDevicePerformanceProfile(): DevicePerformanceProfile {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      tier: "high",
      cores: 4,
      memoryMb: null,
      isMobile: false,
      reducedMotion: false,
      highRefreshRate: false,
      underMemoryPressure: false,
      recommendedParticleCount: 60,
      recommendedAnimationComplexity: "full",
    };
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const isMobile = window.matchMedia?.("(max-width: 768px)").matches ?? false;
  const highRefreshRate =
    window.matchMedia?.("(min-refresh-rate: 100)").matches ?? false;
  const memory = (
    performance as unknown as { memory?: { jsHeapSizeLimit: number } }
  ).memory;
  const memoryMb = memory
    ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    : null;
  const underPressure = isUnderMemoryPressure();

  let tier: "high" | "medium" | "low" = "high";
  if (reducedMotion) tier = "low";
  else if (cores < 4 || isMobile) tier = "medium";
  if (underPressure) tier = "low";

  const recommendedParticleCount =
    tier === "high" ? 60 : tier === "medium" ? 30 : 8;
  const recommendedAnimationComplexity =
    tier === "high" ? "full" : tier === "medium" ? "reduced" : "minimal";

  return {
    tier,
    cores,
    memoryMb,
    isMobile,
    reducedMotion,
    highRefreshRate,
    underMemoryPressure: underPressure,
    recommendedParticleCount,
    recommendedAnimationComplexity,
  };
}
