/**
 * Tilt3D - 3D Card Tilt
 */
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { type ReactNode, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type Tilt3DProps = {
  children: ReactNode;
  maxAngle?: number;
  scale?: number;
  glare?: boolean;
  perspective?: number;
  className?: string;
};

export default function Tilt3D({
  children,
  maxAngle = 12,
  scale = 1.04,
  glare = true,
  perspective = 1000,
  className = "",
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 15, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [maxAngle, -maxAngle]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [-maxAngle, maxAngle]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15), transparent 60%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerStyle: CSSProperties = { perspective };

  if (reduced) {
    return (
      <div className={className} style={containerStyle}>
        <div>{children}</div>
      </div>
    );
  }

  const motionStyle: MotionStyle = {
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
    willChange: "transform",
  };

  return (
    <div className={className} style={containerStyle}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={motionStyle}
        whileHover={{ scale }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: glareBg,
              borderRadius: "inherit",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}