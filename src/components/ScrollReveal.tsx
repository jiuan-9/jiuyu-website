import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal(threshold);

  return (
    <div
      ref={ref}
      className={`scroll-reveal transition-[transform,opacity] [transition-duration:var(--reveal-duration,800ms)] ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 [transform:translateY(var(--reveal-distance,32px))]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
