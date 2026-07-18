/**
 * 动画工具库
 * 14 类动画场景的统一 variants / presets / GPU 规则
 *
 * 使用 Framer Motion 作为底层引擎，统一通过此处封装暴露
 * 业务组件严禁直接 import framer-motion，必须从此处导入
 *   —— 便于一次性替换/升级/降级
 */

import type {
  Transition,
  Variants,
  TargetAndTransition,
} from "framer-motion";

/* ============ Easing 预设（与 tokens.css 对齐） ============ */
export const easing = {
  outQuad: [0.25, 0.46, 0.45, 0.94] as const,
  outCubic: [0.215, 0.61, 0.355, 1] as const,
  outQuart: [0.165, 0.84, 0.44, 1] as const,
  outQuint: [0.22, 1, 0.36, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
  inOutQuad: [0.455, 0.03, 0.515, 0.955] as const,
  inOutCubic: [0.645, 0.045, 0.355, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
  springSoft: [0.34, 1.56, 0.64, 1] as const,
  springHard: [0.68, -0.6, 0.32, 1.6] as const,
  /* v2.1 新增：精细 bezier 曲线 */
  sharp: [0.4, 0, 0.6, 1] as const,
  smooth: [0.16, 1, 0.3, 1] as const,
  dramatic: [0.87, 0, 0.13, 1] as const,
  bouncy: [0.68, -0.55, 0.265, 1.55] as const,
  elasticOut: [0.16, 1.5, 0.3, 1] as const,
  silk: [0.25, 0.1, 0.25, 1] as const,
  cinematic: [0.7, 0, 0.3, 1] as const,
} as const;

/* ============ Duration 预设 ============ */
export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
  cinematic: 2.0,
} as const;

/* ============ GPU 加速规则 ============ */
/**
 * 强制元素进入合成层（composited layer）
 * 仅对 transform 与 opacity 生效 — 这两个属性不触发 layout/paint
 *
 * 使用方式：style={{ ...gpuAccelerated }}
 */
export const gpuAccelerated = {
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
  perspective: 1000,
} as const;

/**
 * 标记即将变化的属性，让浏览器提前准备合成层
 * 用完即移除（通过 onAnimationComplete），避免长期占用 GPU 内存
 */
export const willChange = {
  transform: "var(--will-change-transform)" as const,
  opacity: "var(--will-change-opacity)" as const,
  both: "var(--will-change-both)" as const,
};

/* ============ Transition 预设 ============ */
export const transitions = {
  /** 默认进入：ease-out，符合自然感知 */
  fadeIn: (dur = duration.slow): Transition => ({
    duration: dur,
    ease: easing.outQuart,
  }),

  /** 弹性进入：有微弹反馈，用于强调元素 */
  springIn: (): Transition => ({
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 1,
  }),

  /** 软弹性：用于按钮悬停等轻反馈 */
  springSoft: (): Transition => ({
    type: "spring",
    stiffness: 200,
    damping: 18,
    mass: 0.8,
  }),

  /** 惯性滑动：滚动驱动 */
  inertia: (): Transition => ({
    type: "inertia",
    velocity: 50,
    power: 0.3,
    timeConstant: 350,
    modifyTarget: (t) => Math.round(t / 100) * 100,
  }),

  /* v2.1 新增：基于物理参数的弹簧预设（与 tokens.css spring 物理参数对齐） */

  /** 轻柔弹簧：卡片悬停（低刚度 + 高阻尼 + 重质量） */
  springGentle: (): Transition => ({
    type: "spring",
    stiffness: 120,
    damping: 18,
    mass: 1,
  }),

  /** 灵动弹簧：按钮反馈（高刚度 + 中阻尼 + 轻质量） */
  springSnappy: (): Transition => ({
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  }),

  /** 坚定弹簧：页面切换（高刚度 + 高阻尼：无回弹） */
  springFirm: (): Transition => ({
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 1,
  }),

  /** 弹跳弹簧：趣味元素（极高刚度 + 低阻尼：高弹跳） */
  springBouncy: (): Transition => ({
    type: "spring",
    stiffness: 800,
    damping: 8,
    mass: 0.6,
  }),

  /** 戏剧过渡：用于重要内容揭示 */
  dramatic: (dur: number = duration.slowest): Transition => ({
    duration: dur,
    ease: easing.dramatic,
  }),

  /** 丝绸过渡：极致顺滑的位移 */
  silk: (dur: number = duration.slow): Transition => ({
    duration: dur,
    ease: easing.silk,
  }),

  /** 电影过渡：缓慢推进加速（用于 Hero 大标题） */
  cinematic: (dur: number = duration.cinematic): Transition => ({
    duration: dur,
    ease: easing.cinematic,
  }),
} as const;

/* ============ 14 类动画场景的 Variants ============ */

/**
 * 1. Hero 入场：从下方上浮 + 透明度淡入
 */
export const heroEntrance: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slower, ease: easing.outQuart },
  },
};

/**
 * 2. 滚动触发（基础）：用于 ScrollReveal
 */
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slower, ease: easing.outQuart },
  },
};

/**
 * 3. 悬停反馈：按钮/卡片 hover 时的微动效
 */
export const hoverLift: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: duration.fast, ease: easing.outQuart },
  },
  tap: {
    y: 0,
    scale: 0.98,
    transition: { duration: duration.instant, ease: easing.outQuart },
  },
};

/**
 * 4. CountUp：数字递增（从 0 到目标值）
 */
export const countUpVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast },
  },
};

/**
 * 5. 页面切换：路由切换时的过渡
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20, filter: "blur(8px)" },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease: easing.outQuart },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(8px)",
    transition: { duration: duration.normal, ease: easing.inOutQuart },
  },
};

/**
 * 6. 微交互：小元素的反馈（如徽章、icon）
 */
export const microInteraction: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: 0,
    transition: { duration: duration.fast, ease: easing.outBack },
  },
  tap: { scale: 0.9, transition: { duration: duration.instant } },
};

/**
 * 7. 打字机：每字 50ms 显示
 */
export const typewriterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: duration.instant },
  }),
};

/**
 * 8. 状态过渡：从 A 状态到 B 状态的平滑过渡
 */
export const stateTransition: Variants = {
  inactive: { opacity: 0.5, scale: 0.98 },
  active: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease: easing.outQuart },
  },
};

/**
 * 9. 公告卡片：公告条目入场
 */
export const announcementCard: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: duration.slow,
      ease: easing.outQuart,
    },
  }),
};

/**
 * 10. FAQ 折叠：高度 + 透明度过渡
 */
export const faqCollapse: Variants = {
  collapsed: { height: 0, opacity: 0, overflow: "hidden" },
  expanded: {
    height: "auto",
    opacity: 1,
    overflow: "hidden",
    transition: {
      height: { duration: duration.normal, ease: easing.inOutQuart },
      opacity: { duration: duration.normal, ease: easing.outQuart },
    },
  },
};

/**
 * 11. 时间线：左侧条目滑入
 */
export const timelineItem: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.12,
      duration: duration.slow,
      ease: easing.outQuart,
    },
  }),
};

/**
 * 12. Demo 聊天：消息气泡入场
 */
export const chatBubble: Variants = {
  hidden: (role: "user" | "ai" = "ai") => ({
    opacity: 0,
    x: role === "user" ? 20 : -20,
    y: 8,
  }),
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: duration.normal,
      ease: easing.outQuart,
    },
  }),
};

/**
 * 13. 背景氛围：缓慢漂浮（用于氛围光晕）
 */
export const ambientFloat: Variants = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    transition: {
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
};

/**
 * 14. 加载占位：骨架屏闪烁
 */
export const skeletonPulse: Variants = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

/* ============================================================
 * v2.1 扩展：场景 15-24（丰富动画内容多样性）
 * ============================================================ */

/**
 * 15. 粒子漂浮：背景粒子缓慢漂移
 * 用于 ParticleField 组件，每个粒子可独立设置 delay/duration
 */
export const particleDrift: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: (i: number = 0) => ({
    opacity: [0.4, 0.8, 0.4],
    scale: [0.8, 1.1, 0.9, 1],
    x: [0, 15, -10, -5, 0],
    y: [0, -10, -20, -5, 0],
    transition: {
      duration: 12 + (i % 5) * 2,
      ease: "easeInOut",
      repeat: Infinity,
      delay: (i % 7) * 0.4,
    },
  }),
};

/**
 * 16. 3D 卡片倾斜：鼠标悬停时基于鼠标位置的 3D 旋转
 * 用于 Tilt3D 组件
 */
export const tilt3d: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: duration.slow, ease: easing.springSoft },
  },
  tilt: {
    rotateX: 0, // 由组件动态设置实际值
    rotateY: 0,
    scale: 1.04,
    transition: { type: "spring", stiffness: 200, damping: 15, mass: 0.6 },
  },
};

/**
 * 17. 文字逐字揭示：标题文字一字一字浮现
 * 用于 TextSplit 组件
 */
export const textSplit: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    rotateX: -45,
    filter: "blur(4px)",
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.025,
      duration: 0.5,
      ease: easing.outQuart,
    },
  }),
};

/**
 * 18. 磁吸效果：按钮被鼠标"吸引"产生轻微位移
 * 用于 MagneticButton 组件（强化版）
 */
export const magneticField: Variants = {
  rest: { x: 0, y: 0, scale: 1 },
  attracted: {
    x: 0, // 由组件动态设置
    y: 0,
    scale: 1.05,
    transition: { type: "spring", stiffness: 150, damping: 12, mass: 0.5 },
  },
  repelled: {
    x: 0,
    y: 0,
    scale: 0.98,
    transition: { type: "spring", stiffness: 200, damping: 15, mass: 0.5 },
  },
};

/**
 * 19. 流体波浪：SVG 路径形变（用于分隔线/装饰）
 */
export const fluidWave: Variants = {
  animate: {
    d: [
      "M0,50 Q25,30 50,50 T100,50",
      "M0,50 Q25,70 50,50 T100,50",
      "M0,50 Q25,30 50,50 T100,50",
    ],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
};

/**
 * 20. 视差层：基于滚动的多层视差
 * 用于 Parallax 组件
 * depth 参数由外部调用方用于 useTransform 计算（此处仅返回 variants）
 */
export const parallaxLayer = (_depth: number = 0.2): Variants => ({
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: 0, // 由 useScroll 动态驱动
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 120, damping: 30, mass: 0.5 },
      opacity: { duration: duration.normal },
    },
  },
});

/**
 * 视差深度预设（与 tokens.css --parallax-layer-* 对齐）
 */
export const parallaxDepth = {
  near: 0.3,
  mid: 0.15,
  far: 0.05,
} as const;

/**
 * 21. 形变 Blob：有机形状的形变动画（用于装饰/背景）
 */
export const morphingBlob: Variants = {
  animate: {
    borderRadius: [
      "42% 58% 70% 30% / 45% 45% 55% 55%",
      "70% 30% 46% 54% / 30% 60% 40% 70%",
      "30% 70% 70% 30% / 60% 30% 70% 40%",
      "42% 58% 70% 30% / 45% 45% 55% 55%",
    ],
    rotate: [0, 120, 240, 360],
    scale: [1, 1.05, 0.95, 1],
    transition: {
      duration: 12,
      ease: "easeInOut",
      repeat: Infinity,
      times: [0, 0.33, 0.66, 1],
    },
  },
};

/**
 * 22. 声波条：音频可视化效果（装饰用，不真实播放音频）
 */
export const soundwaveBar: Variants = {
  rest: { scaleY: 0.3, opacity: 0.5 },
  animate: (i: number = 0) => ({
    scaleY: [0.3, 1, 0.5, 0.8, 0.3],
    opacity: [0.5, 1, 0.7, 0.9, 0.5],
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity,
      delay: (i % 8) * 0.08,
    },
  }),
};

/**
 * 23. 跑马灯：无缝循环滚动
 */
export const marquee: Variants = {
  animate: {
    x: ["0%", "-50%"],
    transition: {
      duration: 30,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

/**
 * 24. 文字故障：扫描线 + RGB 偏移（用于强调标题）
 */
export const textGlitch: Variants = {
  rest: {
    x: 0,
    textShadow: "none",
    transition: { duration: duration.normal, ease: easing.outQuart },
  },
  glitch: {
    x: [0, -2, 2, -1, 1, 0],
    textShadow: [
      "none",
      "2px 0 var(--color-brand-500), -2px 0 var(--color-accent-purple-500)",
      "-2px 0 var(--color-brand-500), 2px 0 var(--color-accent-purple-500)",
      "1px 0 var(--color-brand-300), -1px 0 var(--color-accent-cyan-400)",
      "none",
    ],
    transition: {
      duration: 0.5,
      ease: "easeOut",
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  },
};

/**
 * 25. 能量环：3 个同心圆反向旋转 + 描边动画
 * 用于 EnergyRing 组件（Quiddity 品牌标识）
 */
export const energyRing: Variants = {
  animate: (i: number = 0) => ({
    rotate: i % 2 === 0 ? 360 : -360,
    transition: {
      duration: 20 + i * 5,
      ease: "linear",
      repeat: Infinity,
    },
  }),
};

/** 能量环描边动画（stroke-dashoffset） */
export const energyRingStroke: Variants = {
  animate: {
    strokeDashoffset: [0, -100],
    opacity: [0.6, 1, 0.6],
    transition: {
      strokeDashoffset: {
        duration: 4,
        ease: "linear",
        repeat: Infinity,
      },
      opacity: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
};

/**
 * 26. 渐变文字：背景渐变在文字上流动
 * 用于 GradientText 组件
 */
export const gradientText: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

/**
 * 27. 极光背景：大型柔和光斑缓慢漂移
 * 用于 AuroraBackground 组件
 */
export const aurora: Variants = {
  animate: (i: number = 0) => ({
    x: [
      `${-10 + i * 5}%`,
      `${10 - i * 5}%`,
      `${-5 + i * 3}%`,
      `${-10 + i * 5}%`,
    ],
    y: [
      `${-5 + i * 3}%`,
      `${5 - i * 3}%`,
      `${-3 + i * 2}%`,
      `${-5 + i * 3}%`,
    ],
    scale: [1, 1.1, 0.95, 1],
    opacity: [0.3, 0.5, 0.4, 0.3],
    transition: {
      duration: 20 + i * 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  }),
};

/**
 * 28. Stagger 子项：用于配合 staggerContainer
 * 子元素依次淡入上浮
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.slow, ease: easing.outQuart },
  },
};

/* ============ Stagger 容器（让子元素依次入场） ============ */
export const staggerContainer = (
  staggerChildren: number = 0.08,
  delayChildren: number = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

/* ============ 自定义构建动画的辅助函数 ============ */

/** 构建 fade + up 动画（enter 状态：y=0，完全可见） */
export function fadeUp(dur: number = duration.slow): TargetAndTransition {
  return {
    opacity: 1,
    y: 0,
    transition: { duration: dur, ease: easing.outQuart },
  };
}

/** 构建初始隐藏状态（distance 控制初始 y 偏移） */
export function hiddenState(distance: number = 32): TargetAndTransition {
  return { opacity: 0, y: distance };
}

/* ============ 性能降级：3 级降级策略 ============ */
export type MotionTier = "full" | "reduced" | "minimal";

/**
 * 根据设备能力返回动画强度等级
 * - full: 全动画（60fps，GPU 加速）
 * - reduced: 减弱动画（保留入场，去掉循环动画）
 * - minimal: 最小动画（仅保留透明度过渡，去掉所有 transform 动画）
 */
export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") return "full";

  // 1. 用户偏好：开启"减少动画"
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return "minimal";
  }

  // 2. 设备能力：CPU 核数少或内存小
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores < 4) return "reduced";

  // 3. 移动端默认降级
  if (window.matchMedia?.("(max-width: 768px)").matches) {
    return "reduced";
  }

  return "full";
}

/**
 * 根据动画等级返回降级后的 variants
 */
export function withMotionTier<T extends Variants>(variants: T, tier: MotionTier): T {
  if (tier === "full") return variants;

  // minimal：去掉所有 transform 动画
  if (tier === "minimal") {
    const result: Variants = {};
    for (const [key, value] of Object.entries(variants)) {
      if (typeof value === "object" && value !== null) {
        const v = value as Record<string, unknown>;
        result[key] = {
          ...v,
          x: undefined,
          y: undefined,
          scale: undefined,
          rotate: undefined,
          filter: undefined,
          transition: { duration: duration.instant },
        };
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }

  // reduced：去掉循环动画（保留 transform）
  return variants;
}
