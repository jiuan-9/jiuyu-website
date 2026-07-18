import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver (not available in jsdom)
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    // Simulate immediate intersection
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: performance.now(),
        },
      ],
      this,
    );
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Mock ResizeObserver
class MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// Mock scrollTo
window.scrollTo = vi.fn((options?: number | ScrollToOptions) => {
  if (typeof options === 'number') {
    window.scrollY = options;
  } else if (options) {
    window.scrollY = options.top ?? 0;
  }
}) as typeof window.scrollTo;

// Mock performance.now for deterministic animation testing
if (!('performance' in window) || !window.performance) {
  Object.defineProperty(window, 'performance', {
    value: {
      now: () => Date.now(),
    },
  });
}

// Install mocks globally
globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock requestAnimationFrame for animation testing
let rafId = 0;
const rafQueue = new Map<number, FrameRequestCallback>();
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  const id = ++rafId;
  rafQueue.set(id, callback);
  // Auto-execute synchronously for testing
  Promise.resolve().then(() => {
    const cb = rafQueue.get(id);
    if (cb) {
      rafQueue.delete(id);
      cb(performance.now());
    }
  });
  return id;
};
globalThis.cancelAnimationFrame = (id: number) => {
  rafQueue.delete(id);
};

// Mock URL.createObjectURL (for blob/file tests)
if (!('createObjectURL' in URL)) {
  Object.defineProperty(URL, 'createObjectURL', {
    value: () => 'blob:mock',
  });
  Object.defineProperty(URL, 'revokeObjectURL', { value: () => {} });
}
