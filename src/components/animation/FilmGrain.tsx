/**
 * FilmGrain — 全局微噪点纹理层（"做实"关键）
 *
 * 阶段 C 核心：用 Canvas 2D 生成 256×256 噪点纹理 → data URL → CSS background-image
 *   - 真实摄影感：模拟胶片颗粒，让纯色背景"活"起来，不再"塑料感"
 *   - 零 rAF 开销：Canvas 只渲染一次，转 data URL 后由 CSS 静态平铺
 *   - mixBlendMode: overlay —— 与下层颜色融合，不抢戏
 *   - 移动端 / 低端设备：不渲染（性能优先）
 *   - reduced motion：仍渲染（静态噪点不影响前庭觉）
 *
 * 视觉效果：背景有一层若隐若现的"颗粒感"，让纯黑/纯色背景像真实摄影。
 */

import { useEffect, useState } from "react";
import { getDevicePerformanceProfile } from "@/lib/perf";

export interface FilmGrainProps {
  /** 噪点不透明度（0-1），默认 0.045（克制，不抢戏） */
  opacity?: number;
  /** 噪点纹理大小，默认 256（越大越细腻，越小越粗颗粒） */
  size?: number;
  /** 混合模式，默认 overlay */
  blendMode?: "overlay" | "soft-light" | "screen";
  /** z-index，默认 1（在背景层之上，内容之下） */
  zIndex?: number;
}

export default function FilmGrain({
  opacity = 0.045,
  size = 256,
  blendMode = "overlay",
  zIndex = 1,
}: FilmGrainProps) {
  const [noiseUrl, setNoiseUrl] = useState<string>("");
  const [profile, setProfile] = useState(getDevicePerformanceProfile());

  // 监听设备性能变化（窗口尺寸变化等）
  useEffect(() => {
    const update = () => setProfile(getDevicePerformanceProfile());
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // 生成噪点纹理（只生成一次）
  useEffect(() => {
    if (typeof document === "undefined") return;
    // 移动端 / 低端设备：不渲染
    if (profile.isMobile || profile.tier === "low") return;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // 灰度噪点（每通道独立随机，避免偏色）
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    setNoiseUrl(canvas.toDataURL("image/png"));
  }, [size, profile.isMobile, profile.tier]);

  if (!noiseUrl || profile.isMobile || profile.tier === "low") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        backgroundImage: `url(${noiseUrl})`,
        backgroundRepeat: "repeat",
        opacity,
        mixBlendMode: blendMode,
        zIndex,
        // 避免噪点纹理拉伸（让浏览器按 256×256 平铺）
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
