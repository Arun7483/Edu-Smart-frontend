import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/courseService';

@Component({
  selector: 'app-instructor-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './students.html',
  styleUrls: ['./students.css']
})
export class InstructorStudentsComponent implements OnInit {
  searchTerm: string = '';
  selectedCourse: string = 'ALL';

  studentForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  isSubmitted = false;

  myCourses: any[] = [];
  students: any[] = [];
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private courseService: CourseService,
    private studentService: StudentService
  ) {
    this.studentForm = this.fb.group({
      enrollmentId: [null], // Added to track database ID
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courseId: ['', Validators.required],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      grade: [''],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.id) {
      this.loadCourses();
      this.loadStudents();
    }
  }

  loadCourses() {
    this.courseService.getCoursesByInstructor(this.currentUser.id).subscribe({
      next: (data) => this.myCourses = data,
      error: (err) => console.error('Error loading courses', err)
    });
  }

  loadStudents() {
    this.studentService.getStudents(this.currentUser.id).subscribe({
      next: (data) => this.students = data,
      error: (err) => console.error('Error loading students', err)
    });
  }

  get f() { return this.studentForm.controls; }

  get filteredStudents() {
    return this.students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            student.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      // Match the DB ID if filtering
      const matchesCourse = this.selectedCourse === 'ALL' || student.courseId == this.selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  }

  markAttendance(student: any, status: string) {
    student.attendance = student.attendance === status ? null : status;
  }

  saveAttendance() {
    this.studentService.saveBulkAttendance(this.currentUser.id, this.students).subscribe({
      next: () => alert("Today's attendance has been successfully saved!"),
      error: (err) => console.error('Failed to save attendance', err)
    });
  }

  openModal(student?: any) {
    this.isModalOpen = true;
    this.isSubmitted = false;

    if (student) {
      this.isEditing = true;
      this.studentForm.patchValue(student);
    } else {
      this.isEditing = false;
      this.resetForm();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  deleteStudent(enrollmentId: number) {
    if (confirm('Are you sure you want to remove this student from the roster?')) {
      this.studentService.deleteStudent(enrollmentId).subscribe({
        next: () => {
          // Instant UI removal
          this.students = this.students.filter(s => s.enrollmentId !== enrollmentId);
        },
        error: (err) => console.error('Failed to delete student', err)
      });
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.studentForm.invalid) return;

    this.studentService.saveStudent(this.currentUser.id, this.studentForm.value).subscribe({
      next: (savedStudent) => {
        if (this.isEditing) {
          const index = this.students.findIndex(s => s.enrollmentId === savedStudent.enrollmentId);
          if (index !== -1) this.students[index] = savedStudent;
        } else {
          this.students.unshift(savedStudent);
        }
        this.closeModal();
      },
      error: (err) => console.error('Failed to save student', err)
    });
  }

  resetForm() {
    this.studentForm.reset({
      enrollmentId: null,
      progress: 0,
      status: 'ACTIVE'
    });
  }
}