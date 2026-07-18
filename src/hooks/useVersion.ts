/**
 * useVersion — 从 public/version.json 读取版本信息
 *
 * 替代原来硬编码在 Hero.tsx / FAQ.tsx 中的版本号
 * 确保网站显示的版本号与 GitHub Release 始终一致
 *
 * 用法：
 *   const { version, releaseDate, downloadUrl, isLoading } = useVersion();
 */

import { useEffect, useState } from "react";

export type VersionInfo = {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  releaseNotes: string;
};

const DEFAULT_VERSION: VersionInfo = {
  version: "1.1.0",
  releaseDate: "",
  downloadUrl: "#download",
  releaseNotes: "",
};

/**
 * 简易内存缓存，避免每次 mount 都重新 fetch
 * （version.json 内容稳定，只在发版后由 sync 脚本更新）
 */
let cached: VersionInfo | null = null;
let inflight: Promise<VersionInfo> | null = null;

async function fetchVersion(): Promise<VersionInfo> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const resp = await fetch("/version.json", { cache: "no-cache" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as Partial<VersionInfo>;
      cached = {
        version: data.version ?? DEFAULT_VERSION.version,
        releaseDate: data.releaseDate ?? DEFAULT_VERSION.releaseDate,
        downloadUrl: data.downloadUrl ?? DEFAULT_VERSION.downloadUrl,
        releaseNotes: data.releaseNotes ?? DEFAULT_VERSION.releaseNotes,
      };
      return cached;
    } catch (err) {
      console.warn("[useVersion] 读取 version.json 失败，使用默认值", err);
      return DEFAULT_VERSION;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function useVersion(): {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  releaseNotes: string;
  isLoading: boolean;
  error: Error | null;
} {
  const [info, setInfo] = useState<VersionInfo>(cached ?? DEFAULT_VERSION);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    if (cached) {
      setInfo(cached);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchVersion()
      .then((data) => {
        if (mounted) {
          setInfo(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { ...info, isLoading, error };
}

/**
 * 格式化版本号为短显示形式（如 "v1.1.0"）
 */
export function formatVersion(version: string): string {
  const v = version.trim();
  return v.startsWith("v") ? v : `v${v}`;
}

export default useVersion;
