/**
 * PageTransition — 页面切换过渡
 * 包裹路由页面，在进入/离开时执行过渡动画
 *
 * 用法：
 *   <PageTransition>
 *     <Hero />
 *   </PageTransition>
 */

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pageTransition } from "@/lib/animation";

export type PageTransitionProps = {
  children: ReactNode;
  /** 触发过渡的 key（通常是路由 path） */
  pageKey?: string;
  className?: string;
};

export default function PageTransition({
  children,
  pageKey,
  className = "",
}: PageTransitionProps) {
  const reduced = useReducedMotion();

  // 用户开启减少动画时，直接显示
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        className={className}
        variants={pageTransition}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
