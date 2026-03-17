import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/loginService';
 // Make sure this path is correct

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-login.html',
  styleUrls: ['./login-login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;
  errorMessage = ''; 

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      // The role is here so your HTML buttons work! Default is STUDENT.
      role: ['STUDENT', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    // Send the data to Spring Boot
    this.loginService.loginUser(this.loginForm.value).subscribe({
      next: (user) => {
        // We use the role returned from the DATABASE (user.role) to route them securely
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (user.role === 'INSTRUCTOR') {
          this.router.navigate(['/instructor-dashboard']);
        } else if (user.role === 'STUDENT') {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.errorMessage = 'Unauthorized role access.';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}