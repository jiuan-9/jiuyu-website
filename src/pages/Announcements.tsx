/**
 * Announcements — 公告中心独立页面
 *
 * 包装 Announcements 组件，提供独立路由访问
 * 包含导航栏和页脚，保持与首页一致的布局
 */

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Announcements from "@/components/Announcements";
import Footer from "@/components/Footer";
import { useI18n } from "@/store/i18n";
import { backToHome } from "@/content/announcements";

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-dark-950">
      {/* 顶部返回栏 */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-brand-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t(backToHome)}
        </button>
      </div>

      {/* 公告组件 */}
      <Announcements />

      <Footer />
    </main>
  );
}