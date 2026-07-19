import { useNavigate } from "react-router-dom";

/**
 * 404 页面 — 极简黑蓝主题
 * 布局独立：不引入 Layout，不渲染 Navbar
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 overflow-hidden relative">
      {/* 背景光晕（极淡，不喧宾夺主） */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(20, 176, 255, 0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-lg">
        {/* 大号 404 */}
        <h1
          className="text-gradient text-[120px] sm:text-[160px] font-black leading-none select-none"
          style={{ letterSpacing: "-0.04em" }}
        >
          404
        </h1>

        {/* 分隔线 */}
        <div className="section-divider mx-auto my-8" style={{ maxWidth: 240 }} />

        {/* 文案 */}
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          页面不存在
        </h2>
        <p className="text-sm text-dark-400 mb-10 leading-relaxed">
          你访问的页面可能已被移除、重命名，或从未存在。
          <br />
          请检查链接或返回首页继续探索。
        </p>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-press inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-brand-500 hover:bg-brand-400 text-dark-950 text-sm font-semibold transition-all duration-300 shadow-lg shadow-brand-500/20 w-full sm:w-auto"
          >
            返回首页
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-press inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full glass text-dark-200 hover:text-white text-sm transition-all duration-300 hover:border-brand-500/30 hover:bg-white/5 w-full sm:w-auto border-0 cursor-pointer"
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
