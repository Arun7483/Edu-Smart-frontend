import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { AssessmentService } from '../../services/assessment.service';
import { CourseService } from '../../services/courseService';

// 🚀 1. IMPORT CHANGEDETECTORREF
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './assesment.html',
  styleUrls: ['./assesment.css']
})
export class AssessmentsComponent implements OnInit {
  assessmentForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  isSubmitted = false;
  
  myCourses: any[] = []; 
  assessments: any[] = []; 
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private assessmentService: AssessmentService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef // 🚀 2. INJECT IT HERE
  ) {
    this.assessmentForm = this.fb.group({
      id: [null],
      title: ['', Validators.required], 
      courseId: ['', Validators.required],
      type: ['QUIZ', Validators.required],
      maxScore: [100, [Validators.required, Validators.min(1)]],
      status: ['DRAFT', Validators.required] 
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.id) {
      this.loadCourses();
      this.loadAssessments();
    }
  }

  loadCourses() {
    this.courseService.getCoursesByInstructor(this.currentUser.id).subscribe({
      next: (data) => {
        this.myCourses = data;
        this.cdr.detectChanges(); // 🚀 3. WAKE ANGULAR UP ON LOAD
      },
      error: (err) => console.error('Failed to load courses', err)
    });
  }

  loadAssessments() {
    this.assessmentService.getAssessments(this.currentUser.id).subscribe({
      next: (data) => {
        this.assessments = data;
        this.cdr.detectChanges(); // 🚀 4. WAKE ANGULAR UP ON LOAD
      },
      error: (err) => console.error('Failed to load assessments', err)
    });
  }

  get f() { return this.assessmentForm.controls; }

  openModal(assessment?: any) {
    this.isModalOpen = true;
    this.isSubmitted = false;

    if (assessment) {
      this.isEditing = true;
      this.assessmentForm.patchValue(assessment);
    } else {
      this.isEditing = false;
      this.resetForm();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  deleteAssessment(assessmentId: number) {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.assessmentService.deleteAssessment(assessmentId).subscribe({
        next: () => {
          this.assessments = this.assessments.filter(a => a.id !== assessmentId);
          this.cdr.detectChanges(); // 🚀 5. WAKE ANGULAR UP AFTER DELETE
        },
        error: (err) => console.error('Failed to delete', err)
      });
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.assessmentForm.invalid) {
      return;
    }

    this.assessmentService.saveAssessment(this.currentUser.id, this.assessmentForm.value).subscribe({
      next: (savedAssessment) => {
        if (this.isEditing) {
          const index = this.assessments.findIndex(a => a.id === savedAssessment.id);
          if (index !== -1) this.assessments[index] = savedAssessment;
        } else {
          this.assessments.unshift(savedAssessment);
        }
        this.closeModal();
        this.cdr.detectChanges(); // 🚀 6. WAKE ANGULAR UP AFTER SAVE/EDIT
      },
      error: (err) => console.error('Failed to save assessment', err)
    });
  }

  resetForm() {
    this.assessmentForm.reset({
      id: null,
      type: 'QUIZ',
      maxScore: 100,
      status: 'DRAFT'
    });
  }
}