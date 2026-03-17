import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/loginService';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  // 2. Inject LoginService instead of AuthService
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private loginService: LoginService 
  ) {
    this.signupForm = this.fb.group({
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      return;
    }

    const signupData = this.signupForm.value;
    
    // 3. Use .subscribe() to handle the real HTTP request
    this.loginService.registerUser(signupData).subscribe({
      next: (response) => {
        // Registration successful! Spring Boot returned 200 OK
        alert('Signup successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Registration failed (e.g., email already exists / Spring Boot returned 400)
        console.error('Signup error:', err);
        this.errorMessage = 'An account with this email already exists or the server is down.';
      }
    });
  }
}