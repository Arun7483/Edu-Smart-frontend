import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

// 🚀 1. IMPORT CHANGEDETECTORREF
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-overview.html',
  styleUrls: ['./admin-dashboard-overview.css']
})
export class AdminOverviewComponent implements OnInit {
  
  systemMetrics = {
    totalStudents: 0,
    totalInstructors: 0,
    activeCourses: 0,
    systemHealth: '100%'
  };

  enrollmentTrends: any[] = [];
  recentActivity: any[] = [];

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef // 🚀 2. INJECT IT HERE
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.adminService.getDashboardOverview().subscribe({
      next: (data) => {
        // Assign the real data from MySQL
        this.systemMetrics = data.systemMetrics;
        this.enrollmentTrends = data.enrollmentTrends;
        this.recentActivity = data.recentActivity;

        // 🚀 3. WAKE ANGULAR UP! Force the UI to draw the real numbers instantly.
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Failed to load admin overview", err);
      }
    });
  }

  refreshActivity() {
    this.loadDashboardData(); // Re-fetches the live data when the refresh button is clicked
  }
}