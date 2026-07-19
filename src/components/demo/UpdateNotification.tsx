// ── 更新通知气泡组件 ──
// 检测到新版本后弹出，30 秒自动消失
// 用户可以在侧边栏设置中点击"检查更新"手动跳转下载

import { useState, useEffect } from "react";
import { X, Download, Sparkles } from "lucide-react";

interface UpdateNotificationProps {
  version: string;
  downloadUrl: string;
  onDismiss: () => void;
}

export default function UpdateNotification({
  version,
  downloadUrl,
  onDismiss,
}: UpdateNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // 入场动画
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // 30 秒后自动消失
  useEffect(() => {
    const timer = setTimeout(() => handleDismiss(), 30_000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(), 400);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] max-w-[340px] w-[calc(100vw-3rem)] transition-all duration-400 ease-out ${
        visible && !leaving
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      <div className="glass-strong rounded-2xl border border-brand-500/20 p-4 shadow-2xl shadow-brand-500/5 backdrop-blur-xl">
        {/* 进度条（30秒倒计时） */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl overflow-hidden bg-white/[0.04]">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-brand-600 animate-shrink-bar"
            style={{ animationDuration: "30s" }}
          />
        </div>

        <div className="flex items-start gap-3">
          {/* 图标 */}
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={18} className="text-brand-400" />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-white">新版本可用</span>
              <button
                onClick={handleDismiss}
                className="w-5 h-5 rounded-md flex items-center justify-center text-dark-500 hover:text-dark-300 hover:bg-white/[0.06] transition-colors shrink-0"
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-[11px] text-dark-400 leading-relaxed mb-3">
              Quiddity <span className="text-brand-400 font-medium">v{version}</span> 已发布，建议更新以获取最新功能。
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-[11px] font-medium transition-all duration-200 active:scale-95"
            >
              <Download size={13} />
              前往下载
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
