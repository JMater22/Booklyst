import { User } from '../types/user.types';
import { storageService } from './storageService';
import mockUsers from '../data/mockUsers.json';

export const authService = {
  // Mock login
  login(email: string, password: string, rememberMe: boolean = false): User | null {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      storageService.set('currentUser', user);
      storageService.set('rememberMe', rememberMe);
      return user as User;
    }

    return null;
  },

  // Mock register
  register(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: `user${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // In a real app, this would save to a database
    // For mock, we save to localStorage
    const users = storageService.get<User[]>('registeredUsers') || [];
    users.push(newUser);
    storageService.set('registeredUsers', users);
    storageService.set('currentUser', newUser);

    return newUser;
  },

  // Logout
  logout(): void {
    storageService.remove('currentUser');
  },

  // Get current user
  getCurrentUser(): User | null {
    return storageService.get<User>('currentUser');
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};
