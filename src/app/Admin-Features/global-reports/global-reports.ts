import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportService } from '../../services/admin-report.service';

// 🚀 1. IMPORT CHANGEDETECTORREF
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-global-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-reports.html',
  styleUrls: ['./global-reports.css']
})
export class GlobalReportsComponent implements OnInit {
  
  reportData: any = null;
  isLoading = true;

  constructor(
    private adminReportService: AdminReportService,
    private cdr: ChangeDetectorRef // 🚀 2. INJECT IT HERE
  ) {}

  ngOnInit() {
    this.adminReportService.getGlobalReports().subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // 🚀 3. WAKE ANGULAR UP! Renders charts instantly.
      },
      error: (err) => {
        console.error('Failed to load global reports', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // Wake up even on error to clear the loading state
      }
    });
  }

  exportData() {
    alert("Exporting platform data to CSV...");
  }
}