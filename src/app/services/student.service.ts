import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:9090/api/instructor';

  constructor(private http: HttpClient) {}

  getStudents(instructorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${instructorId}/students`);
  }

  saveStudent(instructorId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${instructorId}/students`, data);
  }

  saveBulkAttendance(instructorId: number, data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${instructorId}/students/attendance`, data);
  }
  getMyCourses(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${studentId}/courses`);
  }

  deleteStudent(enrollmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${enrollmentId}`);
  }






  getStudentAssessments(studentId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${studentId}/assessments`);
}


getStudentGrades(studentId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${studentId}/grades`);
}


getConversations(studentId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${studentId}/messages`);
}

sendMessage(msg: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/messages/send`, msg);
}
}