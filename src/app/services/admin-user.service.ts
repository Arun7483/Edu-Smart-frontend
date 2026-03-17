import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = 'http://localhost:9090/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/status?status=${status}`, {});
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}