import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCourseService } from '../../services/admin-course.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses-catelog.html',
  styleUrls: ['./courses-catelog.css']
})
export class CourseCatalogComponent implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  
  searchTerm = '';
  statusFilter = 'ALL'; 

  constructor(private adminCourseService: AdminCourseService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.adminCourseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        
        // Auto-filter to PENDING if any exist so Admin sees them immediately!
        const hasPending = this.courses.some(c => c.status === 'PENDING');
        if (hasPending) {
          this.statusFilter = 'PENDING';
        }
        
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading courses', err)
    });
  }

  applyFilters() {
    this.filteredCourses = this.courses.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          c.instructorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          c.courseCode.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus = this.statusFilter === 'ALL' || c.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  changeStatus(course: any, newStatus: string) {
    this.adminCourseService.updateCourseStatus(course.id, newStatus).subscribe({
      next: () => {
        course.status = newStatus; 
        this.applyFilters(); // Re-apply filters so it disappears from the 'Pending' view instantly
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  deleteCourse(id: number) {
    if (confirm("WARNING: Are you sure you want to permanently delete this course? This will remove all associated lessons and assignments.")) {
      this.adminCourseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c.id !== id);
          this.applyFilters();
        },
        error: (err) => alert('Cannot delete course. It may have active students enrolled. Try changing the status to ARCHIVED instead.')
      });
    }
  }
}