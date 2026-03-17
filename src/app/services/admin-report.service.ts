import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminReportService {
  private apiUrl = 'http://localhost:9090/api/admin/reports';

  constructor(private http: HttpClient) {}

  getGlobalReports(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}