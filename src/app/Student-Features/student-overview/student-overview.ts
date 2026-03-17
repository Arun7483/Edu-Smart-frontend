import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Corrected class name
import { AuthService } from '../../services/auth-service';
import { StudentServicee } from '../../services/studentDashboard';

@Component({
  selector: 'app-student-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-overview.html',
  styleUrls: ['./student-overview.css']
})
export class StudentOverviewComponent implements OnInit {
  
  studentName: string = '';
  
  // Initialized with 0s until data arrives
  studentMetrics = {
    coursesInProgress: 0,
    completedCourses: 0,
    currentAverage: 0,
    certificatesEarned: 0
  };

  enrolledCourses: any[] = [];
  upcomingDeadlines: any[] = [];

  constructor(
    private studentService: StudentServicee, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.id) {
      this.loadDashboard(currentUser.id);
    }
  }

  loadDashboard(userId: number) {
    this.studentService.getStudentOverview(userId).subscribe({
      next: (data) => {
        // Mapping backend DTO to frontend properties
        this.studentName = data.studentName;
        this.studentMetrics = data.metrics;
        this.enrolledCourses = data.enrolledCourses;
        this.upcomingDeadlines = data.upcomingDeadlines;
      },
      error: (err) => {
        console.error('Failed to load student dashboard data', err);
      }
    });
  }
}