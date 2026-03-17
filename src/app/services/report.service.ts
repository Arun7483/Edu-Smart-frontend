import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:9090/api/instructor';

  constructor(private http: HttpClient) {}

  getInstructorReports(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${instructorId}/reports`);
  }
}