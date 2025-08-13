import { Shield, Menu, User, LogOut, LogIn } from "lucide-react";
import { Button } from "./button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          {user ? (
            <>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <a href="#vault" className="text-muted-foreground hover:text-foreground transition-colors">
                Vault
              </a>
              <a href="#settings" className="text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </a>
            </>
          ) : (
            <>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
                Security
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="security-badge">
            <Shield className="h-3 w-3 mr-1" />
            Secured
          </div>
          
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {user.username}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="hidden md:flex">
                  Get Started
                </Button>
              </Link>
            </>
          )}
          
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};