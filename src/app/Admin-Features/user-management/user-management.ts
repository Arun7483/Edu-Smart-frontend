import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AdminUserService } from '../../services/admin-user.service';

// 🚀 1. IMPORT CHANGEDETECTORREF
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  
  userForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  
  searchTerm = '';
  roleFilter = 'ALL';

  constructor(
    private fb: FormBuilder, 
    private adminUserService: AdminUserService,
    private cdr: ChangeDetectorRef // 🚀 2. INJECT IT HERE
  ) {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['STUDENT', Validators.required],
      status: ['ACTIVE', Validators.required],
      password: [''] 
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminUserService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.cdr.detectChanges(); // 🚀 3. WAKE ANGULAR UP ON LOAD!
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = this.roleFilter === 'ALL' || u.role === this.roleFilter;
      return matchSearch && matchRole;
    });
  }

  openModal(user?: any) {
    this.isModalOpen = true;
    if (user) {
      this.isEditing = true;
      this.userForm.patchValue(user);
    } else {
      this.isEditing = false;
      this.userForm.reset({ role: 'STUDENT', status: 'ACTIVE' });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.adminUserService.saveUser(this.userForm.value).subscribe({
      next: () => {
        this.loadUsers(); // loadUsers already has detectChanges inside it!
        this.closeModal();
      },
      error: (err) => console.error('Error saving user', err)
    });
  }

  toggleStatus(user: any) {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.adminUserService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.status = newStatus; 
        this.cdr.detectChanges(); // 🚀 4. WAKE ANGULAR UP ON STATUS TOGGLE!
      }
    });
  }

  deleteUser(id: number) {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      this.adminUserService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.applyFilters();
          this.cdr.detectChanges(); // 🚀 5. WAKE ANGULAR UP AFTER DELETE!
        }
      });
    }
  }
}