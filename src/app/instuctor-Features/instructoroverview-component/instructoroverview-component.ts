import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor.service';
import { LoginService } from '../../services/loginService';

// 🚀 1. IMPORT CHANGEDETECTORREF
import { ChangeDetectorRef } from '@angular/core'; 

@Component({
  selector: 'app-instructoroverview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructoroverview-component.html',
  styleUrls: ['./instructoroverview-component.css'],
})
export class InstructoroverviewComponent implements OnInit {
  
  instructorName = "Instructor";
  metrics = {
    activeCourses: 0,
    totalStudents: 0,
    pendingGrades: 0
  };

  constructor(
    private instructorService: InstructorService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef // 🚀 2. INJECT IT HERE
  ) {}

  ngOnInit() {
    // 1. Get the logged-in user from session storage
    const currentUser = this.loginService.getCurrentUser();
    
    if (currentUser && currentUser.id) {
      this.instructorName = currentUser.name;

      // 2. Fetch real metrics from MySQL via Spring Boot
      this.instructorService.getDashboardMetrics(currentUser.id).subscribe({
        next: (data) => {
          this.metrics = data;
          
          // 🚀 3. WAKE ANGULAR UP! Force the UI to redraw the numbers instantly.
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Failed to load dashboard metrics', err);
        }
      });
    }
  }
}