import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import HowItWorks from "@/components/HowItWorks";
import ProviderShowcase from "@/components/ProviderShowcase";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import DownloadSection from "@/components/Download";
import Footer from "@/components/Footer";

function Divider() {
  return <div className="section-divider max-w-4xl mx-auto" />;
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
      <Features />
      <Divider />
      <UseCases />
      <Divider />
      <ProviderShowcase />
      <Divider />
      {/* Quiddity teaser - compact */}
      <HowItWorks />
      <Divider />
      <Stats />
      <Divider />
      <FAQ />
      <Divider />
      <DownloadSection />
      <Footer />
    </main>
  );
}
