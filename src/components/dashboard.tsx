import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid, List, LogOut, User, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PasswordCard } from "./password-card";
import { AddPasswordModal } from "./add-password-modal";
import { EditPasswordModal } from "./edit-password-modal";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, PasswordEntry } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      loadPasswords();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const loadPasswords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userPasswords = await apiService.getPasswords();
      setPasswords(userPasswords);
    } catch (error) {
      console.error('Error loading passwords:', error);
      setError('Failed to load passwords');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await loadPasswords();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await apiService.searchPasswords(searchTerm);
      setPasswords(searchResults);
    } catch (error) {
      console.error('Error searching passwords:', error);
      setError('Failed to search passwords');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePassword = async (id: string) => {
    try {
      await apiService.deletePassword(id);
      setPasswords(passwords.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting password:', error);
      setError('Failed to delete password');
    }
  };

  const handlePasswordAdded = (newPassword: PasswordEntry) => {
    setPasswords(prev => [newPassword, ...prev]);
    setError(null);
  };

  const handlePasswordUpdated = (updatedPassword: PasswordEntry) => {
    setPasswords(prev => prev.map(p => p._id === updatedPassword._id ? updatedPassword : p));
    setError(null);
  };

  const handleAddPassword = () => {
    if (!user) {
      setError('Please log in to add passwords');
      navigate('/login');
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleEditPassword = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setIsEditModalOpen(true);
  };

  const filteredPasswords = passwords.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.website && item.website.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <section className="py-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to access your password vault and manage your credentials securely.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')}>
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <section className="py-20 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Password Vault</h2>
              <p className="text-muted-foreground">
                Welcome back, {user?.username}! Manage your {passwords.length} stored credentials securely
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="btn-security"
                onClick={handleAddPassword}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Password
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-card border-border"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
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
                key={password._id} 
                className="animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <PasswordCard 
                  {...password}
                  onDelete={() => handleDeletePassword(password._id)}
                  onEdit={() => handleEditPassword(password)}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPasswords.length === 0 && passwords.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No passwords yet</h3>
              <p className="text-muted-foreground">
                Start by adding your first password to your secure vault.
              </p>
              <Button 
                className="mt-4"
                onClick={handleAddPassword}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Password
              </Button>
            </div>
          )}

          {filteredPasswords.length === 0 && passwords.length > 0 && (
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

      {/* Add Password Modal */}
      <AddPasswordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPasswordAdded={handlePasswordAdded}
      />

      {/* Edit Password Modal */}
      <EditPasswordModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPassword(null);
        }}
        onPasswordUpdated={handlePasswordUpdated}
        password={selectedPassword}
      />
    </>
  );
};