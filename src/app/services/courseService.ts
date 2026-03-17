import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // Matches the base path of your Spring Boot CourseController
  private apiUrl = 'http://localhost:9090/api/instructor';

  constructor(private http: HttpClient) {}

  /**
   * GET: Fetch all courses for a specific instructor
   */
  getCoursesByInstructor(instructorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${instructorId}/courses`);
  }

  /**
   * POST: Create a new course OR Update an existing one
   * (Spring Boot handles both via the same endpoint)
   */
  saveCourse(instructorId: number, courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${instructorId}/courses`, courseData);
  }

  /**
   * DELETE: Remove a course by its ID
   */
  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/${courseId}`);
  }
}