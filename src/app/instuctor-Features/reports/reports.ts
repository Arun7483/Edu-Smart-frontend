import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-instructor-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class InstructorReportsComponent implements OnInit {
  
  overviewMetrics = {
    totalStudents: 0,
    avgCompletionRate: 0,
    overallAvgGrade: 0,
    assessmentsGraded: 0
  };

  courseReports: any[] = [];
  studentsAtRisk: any[] = [];

  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.id) {
      this.loadReports();
    }
  }

  loadReports() {
    this.reportService.getInstructorReports(this.currentUser.id).subscribe({
      next: (data) => {
        this.overviewMetrics = data.overviewMetrics;
        this.courseReports = data.courseReports;
        this.studentsAtRisk = data.studentsAtRisk;
      },
      error: (err) => console.error("Failed to load reports", err)
    });
  }

  getScoreClass(score: number): string {
    if (score >= 85) return 'score-excellent';
    if (score >= 70) return 'score-good';
    return 'score-warning';
  }

  exportReport(type: string) {
    alert(`Generating ${type} report as CSV... This will download shortly.`);
  }
}