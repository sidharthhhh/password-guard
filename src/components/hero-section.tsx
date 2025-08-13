import { Shield, Lock, Key, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/security-hero.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  const features = [
    "End-to-end encryption",
    "Secure password generation", 
    "Cross-platform sync",
    "Biometric authentication"
  ];

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleViewDemo = () => {
    navigate('/register');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-glow/20 rounded-full blur-lg animate-float" style={{animationDelay: '4s'}} />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Military-grade security</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
              Your passwords, 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> perfectly protected</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Store, generate, and manage all your passwords with enterprise-grade security. 
              Access your vault anywhere, anytime, with complete peace of mind.
            </p>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div 
                key={feature} 
                className="flex items-center gap-2 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="btn-security glow-effect"
              onClick={handleGetStarted}
            >
              <Key className="h-5 w-5 mr-2" />
              Start Securing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-border hover:bg-accent"
              onClick={handleViewDemo}
            >
              <Lock className="h-5 w-5 mr-2" />
              Create Account
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-4">
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">256-bit</span> encryption
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">Zero-knowledge</span> architecture
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">SOC 2</span> compliant
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative animate-scale-in">
          <div className="relative z-10">
            <img 
              src={heroImage} 
              alt="Security Shield" 
              className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
            />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl scale-110 animate-pulse" />
        </div>
      </div>
    </section>
  );
};