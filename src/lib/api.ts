const API_BASE_URL = 'https://password-guard.onrender.com/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface User {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLogin?: string;
}

interface PasswordEntry {
  _id: string;
  userId: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  category: string;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface CreatePasswordData {
  title: string;
  username: string;
  password: string;
  website?: string;
  category: string;
  notes?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.message || 'Registration failed');
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to get user data');
  }

  // Password methods
  async getPasswords(): Promise<PasswordEntry[]> {
    const response = await this.request<{ passwords: PasswordEntry[] }>('/passwords');
    
    if (response.success && response.data) {
      return response.data.passwords;
    }

    throw new Error(response.message || 'Failed to fetch passwords');
  }

  async getPassword(id: string): Promise<PasswordEntry> {
    const response = await this.request<{ password: PasswordEntry }>(`/passwords/${id}`);
    
    if (response.success && response.data) {
      return response.data.password;
    }

    throw new Error(response.message || 'Failed to fetch password');
  }

  async createPassword(passwordData: CreatePasswordData): Promise<PasswordEntry> {
    const response = await this.request<{ password: PasswordEntry }>('/passwords', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });

    if (response.success && response.data) {
      return response.data.password;
    }

    throw new Error(response.message || 'Failed to create password');
  }

  async updatePassword(id: string, passwordData: Partial<CreatePasswordData>): Promise<PasswordEntry> {
    const response = await this.request<{ password: PasswordEntry }>(`/passwords/${id}`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });

    if (response.success && response.data) {
      return response.data.password;
    }

    throw new Error(response.message || 'Failed to update password');
  }

  async deletePassword(id: string): Promise<void> {
    const response = await this.request<void>(`/passwords/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete password');
    }
  }

  async searchPasswords(query: string): Promise<PasswordEntry[]> {
    const response = await this.request<{ passwords: PasswordEntry[] }>(`/passwords/search/${encodeURIComponent(query)}`);
    
    if (response.success && response.data) {
      return response.data.passwords;
    }

    throw new Error(response.message || 'Failed to search passwords');
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string; environment: string }> {
    const response = await this.request<{ message: string; timestamp: string; environment: string }>('/health');
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Health check failed');
  }
}

export const apiService = new ApiService();
export type { User, PasswordEntry, AuthResponse, CreatePasswordData };
