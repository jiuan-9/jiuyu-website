import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProviderShowcase from "@/components/ProviderShowcase";
import UseCases from "@/components/UseCases";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Preview from "@/components/Preview";
import FAQ from "@/components/FAQ";
import DownloadSection from "@/components/Download";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <Features />
      <ProviderShowcase />
      <UseCases />
      <HowItWorks />
      <Stats />
      <Preview />
      <FAQ />
      <DownloadSection />
      <Footer />
    </main>
  );
}
