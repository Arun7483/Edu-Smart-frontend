import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth-service';
import { StudentServicee } from '../../services/studentDashboard';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-learning.html',
  styleUrls: ['./my-learning.css']
})
export class MyLearningComponent implements OnInit {
  myCourses: any[] = [];
  isLoading = true;

  constructor(
    private studentService: StudentServicee,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.loadMyCourses(user.id);
    }
  }

  loadMyCourses(userId: number) {
    this.studentService.getMyCourses(userId).subscribe({
      next: (data) => {
        this.myCourses = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load courses", err);
        this.isLoading = false;
      }
    });
  }
}