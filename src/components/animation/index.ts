/**
 * 动画组件统一出口
 * 业务组件从此处导入：
 *   import { ScrollReveal, MagneticButton, Typewriter, ParticleField } from "@/components/animation";
 *
 * v2.1 新增组件：ParticleField / Marquee / Parallax / Tilt3D / TextSplit / SoundWave / MorphingBlob / TextGlitch
 */

export { default as ScrollReveal } from "./ScrollReveal";
export type { ScrollRevealProps } from "./ScrollReveal";

export { default as MagneticButton } from "./MagneticButton";
export type { MagneticButtonProps } from "./MagneticButton";

export { default as Ripple } from "./Ripple";
export type { RippleProps } from "./Ripple";

export { default as ScrollProgress } from "./ScrollProgress";
export type { ScrollProgressProps } from "./ScrollProgress";

export { default as Typewriter } from "./Typewriter";
export type { TypewriterProps } from "./Typewriter";

export { default as CountUp } from "./CountUp";
export type { CountUpProps } from "./CountUp";

export { default as PageTransition } from "./PageTransition";
export type { PageTransitionProps } from "./PageTransition";

export { default as Skeleton, SkeletonText } from "./Skeleton";

export { default as SpotlightCard } from "./SpotlightCard";
export type { SpotlightCardProps } from "./SpotlightCard";

/* v2.1 扩展组件 */

export { default as ParticleField } from "./ParticleField";
export type { ParticleFieldProps } from "./ParticleField";

export { default as Marquee } from "./Marquee";
export type { MarqueeProps } from "./Marquee";

export { default as Parallax } from "./Parallax";
export type { ParallaxProps } from "./Parallax";

export { default as Tilt3D } from "./Tilt3D";
export type { Tilt3DProps } from "./Tilt3D";

export { default as TextSplit } from "./TextSplit";
export type { TextSplitProps } from "./TextSplit";

export { default as SoundWave } from "./SoundWave";
export type { SoundWaveProps } from "./SoundWave";

export { default as MorphingBlob } from "./MorphingBlob";
export type { MorphingBlobProps } from "./MorphingBlob";

export { default as TextGlitch } from "./TextGlitch";
export type { TextGlitchProps } from "./TextGlitch";

export { default as EnergyRing } from "./EnergyRing";
export type { EnergyRingProps } from "./EnergyRing";

export { default as GradientText } from "./GradientText";
export type { GradientTextProps } from "./GradientText";

export { default as AuroraBackground } from "./AuroraBackground";
export type { AuroraBackgroundProps } from "./AuroraBackground";

/* 阶段 B 新增：全局焦点跟踪系统 */

export { default as CursorGlow } from "./CursorGlow";
export type { CursorGlowProps } from "./CursorGlow";

export { default as GlobalTilt } from "./GlobalTilt";
export type { GlobalTiltProps } from "./GlobalTilt";

export { default as MagneticText } from "./MagneticText";
export type { MagneticTextProps } from "./MagneticText";

/* 阶段 C 新增：Canvas 2D + WebGL 视觉层（"做实"质感升级） */

export { default as FilmGrain } from "./FilmGrain";
export type { FilmGrainProps } from "./FilmGrain";

export { default as ShaderGradient } from "./ShaderGradient";
export type { ShaderGradientProps } from "./ShaderGradient";
