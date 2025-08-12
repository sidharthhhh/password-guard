import { useState } from "react";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PasswordCard } from "./password-card";

const mockPasswords = [
  {
    id: "1",
    title: "Google Account",
    username: "john.doe@gmail.com",
    password: "SecurePass123!",
    website: "google.com",
    category: "Personal",
    lastUpdated: "2 days ago"
  },
  {
    id: "2",
    title: "GitHub",
    username: "johndoe",
    password: "GitSecure456$",
    website: "github.com",
    category: "Work",
    lastUpdated: "1 week ago"
  },
  {
    id: "3",
    title: "Netflix",
    username: "john.doe@gmail.com",
    password: "Netflix789&",
    website: "netflix.com",
    category: "Entertainment",
    lastUpdated: "3 days ago"
  },
  {
    id: "4",
    title: "Banking",
    username: "john.doe",
    password: "Bank2024!@#",
    website: "bank.com",
    category: "Finance",
    lastUpdated: "5 days ago"
  },
  {
    id: "5",
    title: "Spotify",
    username: "johndoe",
    password: "Music2024$",
    website: "spotify.com",
    category: "Entertainment",
    lastUpdated: "1 day ago"
  },
  {
    id: "6",
    title: "LinkedIn",
    username: "john.doe@professional.com",
    password: "Career123!",
    website: "linkedin.com",
    category: "Work",
    lastUpdated: "4 days ago"
  }
];

export const Dashboard = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPasswords = mockPasswords.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Password Vault</h2>
            <p className="text-muted-foreground">
              Manage your {mockPasswords.length} stored credentials securely
            </p>
          </div>
          
          <Button className="btn-security">
            <Plus className="h-4 w-4 mr-2" />
            Add Password
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Password Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {filteredPasswords.map((password, index) => (
            <div 
              key={password.id} 
              className="animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <PasswordCard {...password} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPasswords.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No passwords found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or add a new password.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};