import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  // Matches your Spring Boot @RequestMapping
  private apiUrl = 'http://localhost:9090/api/instructor';

  constructor(private http: HttpClient) {}

  // Fetch the 3 top-level metrics
  getDashboardMetrics(instructorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${instructorId}/metrics`);
  }

  // We will use this in Part 2!
  getInstructorCourses(instructorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${instructorId}/courses`);
  }
}