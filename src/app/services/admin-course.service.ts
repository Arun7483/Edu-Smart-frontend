import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCourseService {
  private apiUrl = 'http://localhost:9090/api/admin/courses';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateCourseStatus(courseId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${courseId}/status?status=${status}`, {});
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}`);
  }
}