import { User, PasswordEntry } from '@/types/auth';
import { generateId } from './auth';

const USERS_KEY = 'password-guard-users';
const PASSWORDS_KEY = 'password-guard-passwords';

export const storage = {
  // User management
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User): void => {
    const users = storage.getUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string): User | null => {
    const users = storage.getUsers();
    return users.find(user => user.email === email) || null;
  },

  // Password management
  getPasswords: (userId: string): PasswordEntry[] => {
    const passwords = localStorage.getItem(PASSWORDS_KEY);
    if (!passwords) return [];
    
    const allPasswords = JSON.parse(passwords) as PasswordEntry[];
    return allPasswords.filter(p => p.userId === userId);
  },

  savePassword: (password: PasswordEntry): void => {
    const passwords = storage.getAllPasswords();
    const existingIndex = passwords.findIndex(p => p.id === password.id);
    
    if (existingIndex >= 0) {
      passwords[existingIndex] = password;
    } else {
      passwords.push(password);
    }
    
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  },

  deletePassword: (passwordId: string): void => {
    const passwords = storage.getAllPasswords();
    const filtered = passwords.filter(p => p.id !== passwordId);
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(filtered));
  },

  getAllPasswords: (): PasswordEntry[] => {
    const passwords = localStorage.getItem(PASSWORDS_KEY);
    return passwords ? JSON.parse(passwords) : [];
  },

  // Session management
  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem('password-guard-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('password-guard-current-user');
    }
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('password-guard-current-user');
    return user ? JSON.parse(user) : null;
  },

  // Clear all data (for testing/debugging)
  clearAll: (): void => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(PASSWORDS_KEY);
    localStorage.removeItem('password-guard-current-user');
  }
};
