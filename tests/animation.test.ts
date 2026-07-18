/**
 * animation library 单元测试
 * 验证 variants 结构、easing、transitions 完整性
 */

import { describe, it, expect } from "vitest";
import {
  easing,
  transitions,
  duration,
  scrollReveal,
  heroEntrance,
  staggerContainer,
  staggerItem,
  faqCollapse,
  energyRing,
  energyRingStroke,
  parallaxDepth,
} from "@/lib/animation";

describe("animation library", () => {
  describe("easing", () => {
    it("应包含基础缓动函数", () => {
      expect(easing.inOutQuad).toEqual([0.455, 0.03, 0.515, 0.955]);
      expect(easing.outQuad).toEqual([0.25, 0.46, 0.45, 0.94]);
      expect(easing.inOutQuart).toEqual([0.76, 0, 0.24, 1]);
    });

    it("应包含 v2.1 新增缓动函数", () => {
      expect(easing.sharp).toBeDefined();
      expect(easing.smooth).toBeDefined();
      expect(easing.dramatic).toBeDefined();
      expect(easing.bouncy).toBeDefined();
      expect(easing.elasticOut).toBeDefined();
      expect(easing.silk).toBeDefined();
      expect(easing.cinematic).toBeDefined();
    });

    it("每条缓动应为 4 元素数组", () => {
      const easings = Object.values(easing);
      easings.forEach((e) => {
        expect(Array.isArray(e)).toBe(true);
        expect(e).toHaveLength(4);
        e.forEach((n) => expect(typeof n).toBe("number"));
      });
    });
  });

  describe("transitions", () => {
    it("应包含基础过渡", () => {
      expect(transitions.fadeIn).toBeDefined();
      const fadeIn = transitions.fadeIn() as { duration?: number };
      expect(fadeIn.duration).toBeGreaterThan(0);
    });

    it("应包含 spring 过渡", () => {
      expect(transitions.springGentle).toBeDefined();
      expect(transitions.springSnappy).toBeDefined();
      expect(transitions.springFirm).toBeDefined();
      expect(transitions.springBouncy).toBeDefined();
    });

    it("spring 过渡应包含 stiffness 和 damping", () => {
      const springs = [
        transitions.springGentle(),
        transitions.springSnappy(),
        transitions.springFirm(),
        transitions.springBouncy(),
      ];
      springs.forEach((s) => {
        const spring = s as { stiffness?: number; damping?: number };
        expect(spring.stiffness).toBeGreaterThan(0);
        expect(spring.damping).toBeGreaterThan(0);
      });
    });
  });

  describe("duration", () => {
    it("应包含多级时长", () => {
      expect(duration.fast).toBeGreaterThan(0);
      expect(duration.normal).toBeGreaterThan(duration.fast);
      expect(duration.slower).toBeGreaterThan(duration.normal);
      expect(duration.slowest).toBeGreaterThan(duration.slower);
    });
  });

  describe("variants", () => {
    it("scrollReveal 应包含 hidden 和 visible 状态", () => {
      expect(scrollReveal.hidden).toBeDefined();
      expect(scrollReveal.visible).toBeDefined();
    });

    it("heroEntrance 应包含 hidden 和 visible 状态", () => {
      expect(heroEntrance.hidden).toBeDefined();
      expect(heroEntrance.visible).toBeDefined();
    });

    it("staggerContainer 应返回带 staggerChildren 的 variants", () => {
      const result = staggerContainer(0.1, 0.2);
      expect(result.hidden).toBeDefined();
      expect(result.visible).toBeDefined();
      const visible = result.visible as {
        transition?: { staggerChildren?: number; delayChildren?: number };
      };
      expect(visible.transition?.staggerChildren).toBe(0.1);
      expect(visible.transition?.delayChildren).toBe(0.2);
    });

    it("staggerItem 应包含 hidden 和 visible 状态", () => {
      expect(staggerItem.hidden).toBeDefined();
      expect(staggerItem.visible).toBeDefined();
    });

    it("faqCollapse 应包含 collapsed 和 expanded 状态", () => {
      expect(faqCollapse.collapsed).toBeDefined();
      expect(faqCollapse.expanded).toBeDefined();
      const collapsed = faqCollapse.collapsed as { height?: number; opacity?: number };
      expect(collapsed.height).toBe(0);
      expect(collapsed.opacity).toBe(0);
    });

    it("energyRing 应包含 animate 状态", () => {
      expect(energyRing).toBeDefined();
    });

    it("energyRingStroke 应包含 animate 状态", () => {
      expect(energyRingStroke).toBeDefined();
    });
  });

  describe("parallaxDepth", () => {
    it("应包含 near/mid/far 三个层级", () => {
      expect(parallaxDepth.near).toBeGreaterThan(parallaxDepth.mid);
      expect(parallaxDepth.mid).toBeGreaterThan(parallaxDepth.far);
      expect(parallaxDepth.far).toBeGreaterThan(0);
    });
  });
});
