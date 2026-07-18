import type { QuiddityFeature } from "./types";

/**
 * Quiddity Agent 预告模块内容（8 项特性）
 * 保留并加强预告，体现下一代 AI 体验
 */
export const quiddityFeatures: QuiddityFeature[] = [
  {
    id: "multi-agent",
    icon: "Bot",
    title: { zh: "多 Agent 协作", en: "Multi-Agent Collaboration" },
    desc: {
      zh: "多个 AI Agent 并行工作，各司其职、协同配合，高效完成复杂任务。",
      en: "Multiple AI agents working in parallel — each with its own role, collaborating on complex tasks efficiently.",
    },
  },
  {
    id: "persona",
    icon: "UserCheck",
    title: { zh: "人设辅佐模式", en: "Persona Assist Mode" },
    desc: {
      zh: "AI 以特定身份和角色辅佐你完成工作——不只是一个工具，更像一个懂你的搭档。",
      en: "AI assists you in a defined role — not just a tool, but a partner who gets you.",
    },
  },
  {
    id: "workspace",
    icon: "ShieldCheck",
    title: { zh: "工作区安全隔离", en: "Workspace Isolation" },
    desc: {
      zh: "独立工作区管理，权限可控、风险最小化。每个项目互不干扰，安全稳定。",
      en: "Independent workspaces with controllable permissions and minimized risk. Projects don't interfere — safe and stable.",
    },
  },
  {
    id: "skills",
    icon: "Wrench",
    title: { zh: "强大 Skill 库", en: "Powerful Skills" },
    desc: {
      zh: "内置丰富的 Skills，可独立完成多项专业工作。从代码审查到文档生成，开箱即用。",
      en: "Built-in rich skills that independently handle professional work — code review, doc generation, all out of the box.",
    },
  },
  {
    id: "translate",
    icon: "Languages",
    title: { zh: "智能翻译前置", en: "Smart Pre-Translation" },
    desc: {
      zh: "如你允许，AI 可先将你的消息翻译优化后再处理，让表达更精准，理解更到位。",
      en: "With your permission, AI can pre-translate and refine your messages for clearer expression and better understanding.",
    },
  },
  {
    id: "classic",
    icon: "Palette",
    title: { zh: "延续经典体验", en: "Continued Classic UX" },
    desc: {
      zh: "动画与主题风格沿用上一代设计语言，熟悉的交互，更强大的内核。",
      en: "Animations and themes continue the previous design language — familiar interactions, more powerful core.",
    },
  },
  {
    id: "sessions",
    icon: "Layers",
    title: { zh: "无限会话保留", en: "Unlimited Sessions" },
    desc: {
      zh: "延续 Quiddity 上一代的无限会话、多模型切换等经典功能，体验不打折。",
      en: "Continues Quiddity's classic unlimited sessions, multi-model switching — full experience, no compromise.",
    },
  },
  {
    id: "free",
    icon: "HeartHandshake",
    title: { zh: "完全免费", en: "Completely Free" },
    desc: {
      zh: "Quiddity Agent 不作商业变现，完全免费开放。我们的目标始终是做出好用的 AI 工具。",
      en: "Quiddity Agent is not commercialized — completely free. Our goal remains building great AI tools.",
    },
  },
];

/** Quiddity Agent 区标题 */
export const quiddityBadge = {
  zh: "NEXT GENERATION",
  en: "NEXT GENERATION",
};

export const quidditySectionTitle = {
  zh: "下一代 AI 体验",
  en: "Next-Gen AI Experience",
};

export const quidditySectionHighlight = {
  zh: "Quiddity Agent",
  en: "Quiddity Agent",
};

export const quidditySectionSubtitle = {
  zh: "Quiddity Agent 是 Quiddity 正在打造的新一代 Agent AI 工具。支持自主任务规划、工具调用与流程自动化，从「对话助手」进化为「能独立干活的 AI 搭档」。",
  en: "Quiddity Agent is the next-gen agentic AI tool we're building. Supports autonomous task planning, tool invocation, and workflow automation — evolving from a chat assistant into an AI partner that gets work done.",
};

/** 品牌标语分隔 */
export const quidditySlogan = {
  zh: "知所不尽 · 往复不止",
  en: "Know no bounds · Repeat no end",
};

export const quidditySloganSubtitle = {
  zh: "持续探索 AI 的更多可能",
  en: "Continuously exploring AI's possibilities",
};

/** CTA */
export const quiddityCtaTitle = {
  zh: "Quiddity Agent · 开发中",
  en: "Quiddity Agent · In Development",
};

export const quiddityCtaSubtitle = {
  zh: "2027 年前上线，敬请期待",
  en: "Launching before 2027 — stay tuned",
};

export const quiddityCtaButton = {
  zh: "预约体验",
  en: "Reserve a Spot",
};
