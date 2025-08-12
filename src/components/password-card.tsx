import { useState } from "react";
import { Eye, EyeOff, Globe, Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface PasswordCardProps {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  category?: string;
  lastUpdated?: string;
}

export const PasswordCard = ({ 
  title, 
  username, 
  password, 
  website, 
  category,
  lastUpdated 
}: PasswordCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div 
      className="password-card h-48 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Front Face */}
      <div className={`card-face ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{website}</p>
                </div>
              </div>
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Username:</span>
              <span className="ml-2 text-card-foreground">{username}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Updated {lastUpdated || '2 days ago'}
            </div>
          </div>
        </div>
      </div>

      {/* Back Face */}
      <div className={`card-face card-back ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
        <div className="p-6 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Username
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-card-foreground font-mono">{username}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(username)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Password
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-card-foreground font-mono">
                  {showPassword ? password : '••••••••'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-6 w-6 p-0"
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(password)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};