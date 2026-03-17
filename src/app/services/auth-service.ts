import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // localStorage: Persists forever (Acts as your database of all registered users)
  private usersStorageKey = 'eduSmart_users';
  
  // sessionStorage: Cleared when tab closes (Acts as your secure active login session)
  private currentUserKey = 'eduSmart_currentUser'; 

  constructor() {
    // Automatically populate the "database" with test accounts if it is empty
    this.seedDefaultUsers();
  }

  registerUser(userData: any): boolean {
    const users = this.getAllUsers();
    
    // Check if user already exists
    const userExists = users.find((u: any) => u.email === userData.email);
    if (userExists) return false; 

    // Add new user and save to localStorage (Mock Database)
    users.push(userData);
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
    return true; 
  }

  loginUser(email: string, password: string, role: string): any {
    const users = this.getAllUsers();
    
    // Find a matching user
    const matchedUser = users.find((u: any) => 
      u.email === email && u.password === password && u.role === role
    );
    
    if (matchedUser) {
      // Save the active user session to sessionStorage
      sessionStorage.setItem(this.currentUserKey, JSON.stringify(matchedUser));
    }
    
    return matchedUser || null;
  }

  // Get the currently logged-in user for the dashboard
  getCurrentUser(): any {
    // Read from sessionStorage
    const userJson = sessionStorage.getItem(this.currentUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Clear the session on logout
  logout(): void {
    // Remove from sessionStorage
    sessionStorage.removeItem(this.currentUserKey);
  }

  // Helper method to get the "database" of users
  private getAllUsers(): any[] {
    // Read from localStorage
    const usersJson = localStorage.getItem(this.usersStorageKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // --- Developer Shortcut: Seed the Database ---
  private seedDefaultUsers() {
    const users = this.getAllUsers();
    
    // If the database is completely empty, create default test accounts
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: 'USR-999',
          name: 'System Admin',
          email: 'admin@edusmart.edu',
          password: 'admin123',
          role: 'ADMIN',
          contact: '+1 555-0000',
          status: 'ACTIVE'
        },
        {
          id: 'USR-888',
          name: 'Dr. Alan Smith',
          email: 'instructor@edusmart.edu',
          password: 'teach123',
          role: 'INSTRUCTOR',
          contact: '+1 555-1111',
          status: 'ACTIVE'
        },
        {
          id: 'USR-104',
          name: 'Sarah Jenkins',
          email: 'student@edusmart.edu',
          password: 'student123',
          role: 'STUDENT',
          contact: '+1 555-2222',
          status: 'ACTIVE'
        }
      ];
      
      // Save them all to local storage
      localStorage.setItem(this.usersStorageKey, JSON.stringify(defaultUsers));
      console.log('🌱 EduSmart mock database seeded with default users!');
    }
  }
}