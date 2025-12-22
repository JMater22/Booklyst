export interface User {
  id: string;
  email: string;
  password: string;
  role: 'customer' | 'owner';
  name: string;
  phone: string;
  profilePic: string | null;
  createdAt?: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}
