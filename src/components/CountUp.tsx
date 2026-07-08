import { useRef, useEffect, useState } from "react";

interface CountUpProps {
  end: number | string;
  suffix?: string;
  duration?: number;
}

export default function CountUp({ end, suffix = "", duration = 2000 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const isString = typeof end === "string";
  const numericEnd = !isString ? (end as number) : 0;

  // Observer for scroll-triggered animation
  useEffect(() => {
    if (isString) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, isString]);

  // Count-up animation
  useEffect(() => {
    if (isString || !hasAnimated) return;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericEnd));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasAnimated, numericEnd, duration, isString]);

  // Render string value directly (e.g. "∞")
  if (isString) {
    return (
      <span ref={ref}>
        {end}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
