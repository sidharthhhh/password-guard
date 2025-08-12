import { Shield, Menu, User, LogOut } from "lucide-react";
import { Button } from "./button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">PasswordGuard</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#vault" className="text-muted-foreground hover:text-foreground transition-colors">
            Vault
          </a>
          <a href="#settings" className="text-muted-foreground hover:text-foreground transition-colors">
            Settings
          </a>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="security-badge">
            <Shield className="h-3 w-3 mr-1" />
            Secured
          </div>
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};