import { Routes } from '@angular/router';
import { LandingPageComponent } from './Landing-page/landing-component/landing-component';
import { SignupComponent } from './Login/signup/signup';
import { LoginComponent } from './Login/login-login/login-login';
import { InstructorDashboardComponent } from './instuctor-Features/instructor-dashboard/instructor-dashboard';
import {  MyCoursesComponent } from './instuctor-Features/my-courses/my-courses';
import { InstructoroverviewComponent } from './instuctor-Features/instructoroverview-component/instructoroverview-component';
import { AssessmentsComponent } from './instuctor-Features/assesment/assesment';
import { InstructorStudentsComponent } from './instuctor-Features/students/students';
import { InstructorQuizBuilderComponent } from './instuctor-Features/quizz/quizz';
import { InstructorReportsComponent } from './instuctor-Features/reports/reports';
import { AdminDashboardComponent } from './Admin-Features/admin-dashboard/admin-dashboard';
import { AdminOverviewComponent } from './Admin-Features/admin-dashboard-overview/admin-dashboard-overview';
import { UserManagementComponent } from './Admin-Features/user-management/user-management';
import { CourseCatalogComponent } from './Admin-Features/courses-catelog/courses-catelog';
import { GlobalReportsComponent } from './Admin-Features/global-reports/global-reports';
import { StudentDashboardComponent } from './Student-Features/student-dashboard/student-dashboard';
import { StudentOverviewComponent } from './Student-Features/student-overview/student-overview';
import { MyLearningComponent } from './Student-Features/my-learning/my-learning';
import { StudentQuizzesComponent } from './Student-Features/quizzes-exams/quizzes-exams';
import { GradesComponent } from './Student-Features/grades-awards/grades-awards';
import { MessagesComponent } from './Student-Features/messages/messages';
import { QuizPlayerComponent } from './Student-Features/quiz-player/quiz-player';

// Import your standalone components

export const routes: Routes = [
  // Default route loading the Landing Page
  { path: '', component: LandingPageComponent }, 
  
  // Authentication Routes
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  
{ 
    path: 'instructor-dashboard', 
    component: InstructorDashboardComponent,
    children: [
      // Default to the overview when they first log in
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      
      // The child routes
      { path: 'overview', component: InstructoroverviewComponent },
      { path: 'my-courses', component: MyCoursesComponent },
      { path: 'assessments', component: AssessmentsComponent },
      { path: 'quizz', component:InstructorQuizBuilderComponent }, // The new Quiz Builder
      { path: 'students', component: InstructorStudentsComponent },
      { path: 'reports', component: InstructorReportsComponent }
    ]
  },


{ 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent},
      // Add this line inside the children array for admin-dashboard:
{ path: 'user-management', component: UserManagementComponent },
{ path: 'course-catalog', component: CourseCatalogComponent },
{ path: 'global-reports', component: GlobalReportsComponent }
      // Future routes (user-management, settings) go here
    ]
  },




  { 
    path: 'student-dashboard', 
    component: StudentDashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: StudentOverviewComponent},
      { 
        path: 'my-learning', 
        component: MyLearningComponent // The enrolled courses list
      },
      { path: 'quizzes', component: StudentQuizzesComponent },
      { path: 'grades', component: GradesComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'quiz-player/:id', component: QuizPlayerComponent }

      // Future routes (my-learning, take-assessment) go here
    ]
  },



  // Catch-all wildcard route to redirect invalid URLs back to the home page
  { path: '**', redirectTo: '' } 
];