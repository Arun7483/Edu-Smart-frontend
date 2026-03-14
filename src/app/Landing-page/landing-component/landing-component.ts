import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-component.html',
  styleUrls: ['./landing-component.css']
})
export class LandingPageComponent {
  // Mapping your SRS modules to landing page feature cards
  features = [
    { 
      icon: '📚', 
      title: 'Course Content Management', 
      description: 'Create and explore rich courses with modules, documents, videos, and quizzes.' 
    },
    { 
      icon: '📝', 
      title: 'Assessments & Grading', 
      description: 'Create secure exams and automate grading workflows for objective questions.' 
    },
    { 
      icon: '📊', 
      title: 'Analytics & Reporting', 
      description: 'Track student performance and course completion with intuitive dashboards.' 
    },
    { 
      icon: '👩‍🏫', 
      title: 'Enrollment & Attendance', 
      description: 'Seamlessly enroll students and track attendance for live sessions.' 
    }
  ];
}