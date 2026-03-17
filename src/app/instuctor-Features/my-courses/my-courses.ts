import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CourseService } from '../../services/courseService';
import { ChangeDetectorRef } from '@angular/core'; // ✅ Good job importing this!

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-courses.html',
  styleUrls: ['./my-courses.css']
})
export class MyCoursesComponent implements OnInit {
  courseForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  isSubmitted = false;
  
  courses: any[] = []; 
  currentUser: any = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef // ✅ Good job injecting this!
  ) {
    this.courseForm = this.fb.group({
      id: [null], 
      courseId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      instructorId: ['', Validators.required],
      status: ['DRAFT', Validators.required],
      lessons: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.courseForm.patchValue({ instructorId: this.currentUser.email });
      this.loadCourses(); 
    }
  }

  // --- Database Fetch ---
  loadCourses() {
    if (this.currentUser && this.currentUser.id) {
      this.courseService.getCoursesByInstructor(this.currentUser.id).subscribe({
        next: (data) => {
          this.courses = data;
          this.cdr.detectChanges(); // 🚀 WAKES ANGULAR UP ON LOAD
        },
        error: (err) => console.error('Error fetching courses:', err)
      });
    }
  }

  get f() { return this.courseForm.controls; }
  get lessons() { return this.courseForm.get('lessons') as FormArray; }

  createLessonFormGroup(title = '', link = '', desc = ''): FormGroup {
    return this.fb.group({
      lessonTitle: [title, Validators.required],
      videoLink: [link, Validators.required],
      lessonDescription: [desc]
    });
  }

  addLesson() {
    this.lessons.push(this.createLessonFormGroup());
  }

  removeLesson(index: number) {
    this.lessons.removeAt(index);
  }

  openModal(course?: any) {
    this.isModalOpen = true;
    this.isSubmitted = false;
    this.lessons.clear(); 

    if (course) {
      this.isEditing = true;
      
      if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach((lesson: any) => {
          this.lessons.push(this.createLessonFormGroup(lesson.lessonTitle, lesson.videoLink, lesson.lessonDescription));
        });
      }
      
      this.courseForm.patchValue(course);
    } else {
      this.isEditing = false;
      this.resetForm();
      this.addLesson(); 
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  deleteCourse(courseId: number) {
    if (!courseId) return; 
    
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (confirmDelete) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== courseId);
          this.cdr.detectChanges(); // 🚀 WAKES ANGULAR UP AFTER DELETE
        },
        error: (err) => console.error('Error deleting course:', err)
      });
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.courseForm.invalid) {
      return;
    }

    const courseData = this.courseForm.getRawValue();

    this.courseService.saveCourse(this.currentUser.id, courseData).subscribe({
      next: (savedCourseFromDatabase) => {
        
        if (this.isEditing) {
          const index = this.courses.findIndex(c => c.id === savedCourseFromDatabase.id);
          if (index !== -1) {
            this.courses[index] = savedCourseFromDatabase;
          }
        } else {
          this.courses.unshift(savedCourseFromDatabase);
        }
        
        this.closeModal(); 
        this.cdr.detectChanges(); // 🚀 WAKES ANGULAR UP AFTER SAVE/EDIT
      },
      error: (err) => console.error('Error saving course:', err)
    });
  }

  resetForm() {
    this.courseForm.reset({
      id: null, 
      instructorId: this.currentUser ? this.currentUser.email : '',
      status: 'DRAFT'
    });
    this.lessons.clear();
  }
}