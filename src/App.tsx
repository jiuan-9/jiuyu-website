import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useI18n } from "@/store/i18n";
import { appLoadingText } from "@/content";

const Home = lazy(() => import("@/pages/Home"));
const Demo = lazy(() => import("@/pages/Demo"));
const Timeline = lazy(() => import("@/pages/Timeline"));
const Legal = lazy(() => import("@/pages/legal/Legal"));
const Announcements = lazy(() => import("@/pages/Announcements"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Loading() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        </div>
        <span className="text-sm text-dark-400">{t(appLoadingText)}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
