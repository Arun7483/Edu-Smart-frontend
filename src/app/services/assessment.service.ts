import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = 'http://localhost:9090/api/instructor';

  constructor(private http: HttpClient) {}

  getAssessments(instructorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${instructorId}/assessments`);
  }

  saveAssessment(instructorId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${instructorId}/assessments`, data);
  }

  deleteAssessment(assessmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assessments/${assessmentId}`);
  }
}