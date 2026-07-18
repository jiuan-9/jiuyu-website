/**
 * ScrollReveal - 兼容性封装
 * v2.1: 底层已迁移到 Framer Motion 实现 (src/components/animation/ScrollReveal.tsx)
 * 此文件仅作 re-export，保持向后兼容（10+ 业务组件从此处导入）
 *
 * 新增能力（由底层提供）：
 *   - variants / delay / once / as 等可选参数
 *   - prefers-reduced-motion 自动降级
 *   - GPU 加速（transform/opacity only）
 */
export { default } from "@/components/animation/ScrollReveal";
export type { ScrollRevealProps } from "@/components/animation/ScrollReveal";