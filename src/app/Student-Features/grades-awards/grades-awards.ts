import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grades-awards.html',
  styleUrls: ['./grades-awards.css']
})
export class GradesComponent implements OnInit {
  
  gradeData: any[] = [];
  isLoading = true;
  currentUser: any = null;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.id) {
      this.loadGrades();
    }
  }

  loadGrades() {
    this.studentService.getStudentGrades(this.currentUser.id).subscribe({
      next: (data: any[]) => {
        this.gradeData = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // 🚀 Wakes Angular up!
      },
      error: (err: any) => {
        console.error("Failed to load grades", err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadCertificate(courseTitle: string) {
    alert(`Generating Certificate for ${courseTitle}... Your PDF will download shortly.`);
    // Future logic: This would call a backend endpoint that generates a PDF via iText or JasperReports
  }
}