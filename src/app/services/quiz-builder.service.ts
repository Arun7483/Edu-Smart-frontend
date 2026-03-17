import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizBuilderService {
  private apiUrl = 'http://localhost:9090/api/instructor';

  constructor(private http: HttpClient) {}

  saveQuizDetails(instructorId: number, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${instructorId}/quiz-builder`, payload);
  }
}