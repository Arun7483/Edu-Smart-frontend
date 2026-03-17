import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentServicee {
  private apiUrl = 'http://localhost:9090/api/student';

  constructor(private http: HttpClient) {}

  // Fetches the metrics, top 3 courses, and deadlines
  getStudentOverview(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${studentId}/overview`);
  }

  // Fetches the full list of enrolled courses
  getEnrolledCourses(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${studentId}/courses`);
  }

  // Action to enroll in a new course
  enrollInCourse(studentId: number, courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${studentId}/enroll/${courseId}`, {});
  }
  // For the full "My Learning" list
  getMyCourses(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${studentId}/courses`);
  }
  getStudentAssessments(studentId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${studentId}/assessments`);
}
getQuizDetails(quizId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quiz/${quizId}`);
  }

  // 🚀 ADD THIS: Submit the result
  submitQuiz(submission: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit`, submission);
  }
}