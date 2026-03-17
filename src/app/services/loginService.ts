import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // Point this exactly to your Spring Boot controller mapping
  private apiUrl = 'http://localhost:9090/api/auth';
  
  // Keep using sessionStorage for secure, tab-specific active logins
  private currentUserKey = 'eduSmart_currentUser';

  constructor(private http: HttpClient) {}

  // 1. Register User (Sends POST to /api/auth/signup)
  registerUser(userData: any): Observable<any> {
    // We expect a plain text response ("User registered successfully") from your backend
    return this.http.post(`${this.apiUrl}/signup`, userData, { responseType: 'text' });
  }

  // 2. Login User (Sends POST to /api/auth/login)
  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // If login is successful, intercept the response and save it to session storage
        if (response && response.email) {
          sessionStorage.setItem(this.currentUserKey, JSON.stringify(response));
        }
      })
    );
  }

  // 3. Get Active User for Dashboards
  getCurrentUser(): any {
    const userJson = sessionStorage.getItem(this.currentUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  // 4. Logout
  logout(): void {
    sessionStorage.removeItem(this.currentUserKey);
  }
}