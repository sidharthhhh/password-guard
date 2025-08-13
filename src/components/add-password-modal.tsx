import React, { useState } from "react";
import { X, Plus, Eye, EyeOff, RefreshCw, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { apiService, PasswordEntry } from "@/lib/api";
import { generatePassword, getPasswordStrength, defaultPasswordOptions, PasswordOptions } from "@/lib/password-generator";

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordAdded: (password: PasswordEntry) => void;
}

const categories = [
  "General",
  "Work",
  "Personal",
  "Finance",
  "Entertainment",
  "Shopping",
  "Social Media",
  "Email",
  "Gaming",
  "Other"
];

export const AddPasswordModal: React.FC<AddPasswordModalProps> = ({
  isOpen,
  onClose,
  onPasswordAdded
}) => {
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
    category: "General",
    notes: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>(defaultPasswordOptions);
  const [showGenerator, setShowGenerator] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const newPassword = await apiService.createPassword({
        title: formData.title.trim(),
        username: formData.username.trim(),
        password: formData.password,
        website: formData.website.trim() || undefined,
        category: formData.category,
        notes: formData.notes.trim() || undefined
      });

      onPasswordAdded(newPassword);
      handleClose();
    } catch (error) {
      console.error('Error creating password:', error);
      setErrors({ general: 'Failed to create password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      username: "",
      password: "",
      website: "",
      category: "General",
      notes: ""
    });
    setErrors({});
    setShowPassword(false);
    setIsLoading(false);
    setShowGenerator(false);
    setPasswordOptions(defaultPasswordOptions);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const generateNewPassword = () => {
    const newPassword = generatePassword(passwordOptions);
    setFormData(prev => ({ ...prev, password: newPassword }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Password</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Gmail Account"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="e.g., john.doe@gmail.com"
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter your password"
                className={`pr-20 ${errors.password ? "border-destructive" : ""}`}
              />
              <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(formData.password)}
                  className="h-8 w-8 p-0"
                  disabled={!formData.password}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8 p-0"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="flex items-center justify-between text-sm">
                <span>Strength: <span className={passwordStrength.color}>{passwordStrength.label}</span></span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 w-4 rounded ${
                        level <= passwordStrength.score
                          ? passwordStrength.score <= 2
                            ? 'bg-red-500'
                            : passwordStrength.score <= 4
                            ? 'bg-yellow-500'
                            : passwordStrength.score <= 5
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Password Generator */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowGenerator(!showGenerator)}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {showGenerator ? 'Hide' : 'Show'} Password Generator
              </Button>

              {showGenerator && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Length: {passwordOptions.length}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateNewPassword}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  
                  <Slider
                    value={[passwordOptions.length]}
                    onValueChange={(value) => setPasswordOptions(prev => ({ ...prev, length: value[0] }))}
                    max={32}
                    min={8}
                    step={1}
                    className="w-full"
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                      <Switch
                        id="uppercase"
                        checked={passwordOptions.includeUppercase}
                        onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeUppercase: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                      <Switch
                        id="lowercase"
                        checked={passwordOptions.includeLowercase}
                        onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeLowercase: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="numbers">Numbers (0-9)</Label>
                      <Switch
                        id="numbers"
                        checked={passwordOptions.includeNumbers}
                        onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeNumbers: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                      <Switch
                        id="symbols"
                        checked={passwordOptions.includeSymbols}
                        onCheckedChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeSymbols: checked }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="e.g., https://gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
