/**
 * useFpsMonitor — React Hook 包装的 FPS 监控
 * 自动启动并订阅，组件卸载时自动停止
 *
 * 用法：
 *   const { current, report, isLow } = useFpsMonitor();
 *   if (isLow) console.warn("掉帧了！");
 */

import { useEffect, useState } from "react";
import { fpsMonitor, type FpsReport, type FpsSample } from "@/lib/perf";

export type UseFpsMonitorOptions = {
  /** 自动启动（默认 true） */
  autoStart?: boolean;
  /** 掉帧阈值，默认 50 */
  lowFpsThreshold?: number;
};

export function useFpsMonitor(options: UseFpsMonitorOptions = {}) {
  const { autoStart = true, lowFpsThreshold = 50 } = options;
  const [current, setCurrent] = useState<FpsSample | null>(null);
  const [report, setReport] = useState<FpsReport | null>(null);
  const [isLow, setIsLow] = useState(false);

  useEffect(() => {
    if (autoStart && !fpsMonitor.isRunning()) {
      fpsMonitor.start();
    }

    const unsubscribe = fpsMonitor.subscribe((sample) => {
      setCurrent(sample);
      setIsLow(sample.fps < lowFpsThreshold);
    });

    // 每秒更新一次报告
    const interval = setInterval(() => {
      setReport(fpsMonitor.getReport(5000));
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [autoStart, lowFpsThreshold]);

  return { current, report, isLow };
}

export default useFpsMonitor;
