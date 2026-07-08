import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import Demo from "@/components/Demo";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import DownloadSection from "@/components/Download";
import Footer from "@/components/Footer";

function Divider() {
  return <div className="section-divider max-w-4xl mx-auto" />;
}

export default function Home() {
  // Force scroll to top on mount (belt-and-suspenders with index.html script)
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
      <Demo />
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
