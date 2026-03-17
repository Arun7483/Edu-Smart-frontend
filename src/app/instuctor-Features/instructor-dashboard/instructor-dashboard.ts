import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './instructor-dashboard.html',
  styleUrls: ['./instructor-dashboard.css']
})
export class InstructorDashboardComponent implements OnInit {
  currentUser: any = null;
  isProfileMenuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router, private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.cdr.detectChanges();

    if (!this.currentUser || this.currentUser.role !== 'INSTRUCTOR') {
      this.router.navigate(['/login']);
    }
  }

  // Toggles the profile dropdown menu
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}