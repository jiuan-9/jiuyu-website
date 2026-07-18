import { describe, it, expect } from 'vitest';

// Smoke test to verify vitest infrastructure is correctly configured
describe('vitest infrastructure', () => {
  it('should run basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('quiddity').toMatch(/^q/);
  });

  it('should have jsdom environment', () => {
    expect(typeof document).toBe('object');
    expect(document.createElement('div')).toBeInstanceOf(HTMLElement);
  });

  it('should have matchMedia mocked', () => {
    expect(window.matchMedia('(min-width: 768px)')).toBeDefined();
    expect(window.matchMedia('(min-width: 768px)').matches).toBe(false);
  });

  it('should have IntersectionObserver mocked', () => {
    expect(window.IntersectionObserver).toBeDefined();
    const obs = new IntersectionObserver(() => {});
    expect(obs.observe).toBeInstanceOf(Function);
  });

  it('should support async tests', async () => {
    const result = await Promise.resolve('quiddity');
    expect(result).toBe('quiddity');
  });
});
