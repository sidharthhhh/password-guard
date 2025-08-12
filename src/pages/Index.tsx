import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/hero-section";
import { Dashboard } from "@/components/dashboard";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Dashboard />
    </div>
  );
};

export default Index;
