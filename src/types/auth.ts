export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // hashed
  createdAt: string;
}

export interface PasswordEntry {
  id: string;
  userId: string;
  title: string;
  username: string;
  password: string; // encrypted
  website: string;
  category: string;
  lastUpdated: string;
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
