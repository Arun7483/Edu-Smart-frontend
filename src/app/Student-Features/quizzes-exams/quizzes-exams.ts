import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentServicee } from '../../services/studentDashboard'; // Using your service name
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-student-quizzes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quizzes-exams.html',
  styleUrls: ['./quizzes-exams.css']
})
export class StudentQuizzesComponent implements OnInit {
  
  upcomingQuizzes: any[] = [];
  completedQuizzes: any[] = [];
  isLoading = true;

  constructor(
    private studentService: StudentServicee,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.loadAllAssessments(user.id);
    }
  }

  loadAllAssessments(userId: number) {
    this.studentService.getStudentAssessments(userId).subscribe({
      next: (data: any[]) => {
        // Logic to separate based on the status we defined in the backend DTO
        this.upcomingQuizzes = data.filter(q => q.status === 'PENDING');
        this.completedQuizzes = data.filter(q => q.status === 'COMPLETED');
        
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Failed to load assessments", err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}