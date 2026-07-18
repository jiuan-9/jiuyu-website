import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AppPreview from "@/components/AppPreview";
import UseCases from "@/components/UseCases";
import HowItWorks from "@/components/HowItWorks";
import ProviderShowcase from "@/components/ProviderShowcase";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import QuiddityPreview from "@/components/QuiddityPreview";
import DownloadSection from "@/components/Download";
import Footer from "@/components/Footer";
import Announcements from "@/components/Announcements";

function Divider() {
  return <div className="section-divider max-w-4xl mx-auto" />;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 transition-all duration-400 backdrop-blur-md ${
        visible ? "back-to-top visible" : "back-to-top pointer-events-none"
      }`}
      aria-label="回到顶部"
    >
      <ChevronUp size={18} />
    </button>
  );
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <Divider />
      <Announcements />
      <Divider />
      <Features />
      <Divider />
      <AppPreview />
      <Divider />
      <UseCases />
      <Divider />
      <ProviderShowcase />
      <Divider />
      <HowItWorks />
      <Divider />
      <Stats />
      <Divider />
      <FAQ />
      <Divider />
      <QuiddityPreview />
      <Divider />
      <DownloadSection />
      <Footer />
      <BackToTop />
    </main>
  );
}
