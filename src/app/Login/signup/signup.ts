import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the form with validation rules
    this.signupForm = this.fb.group({
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator }); // Apply custom validator to the whole group
  }

  // Custom validator to ensure passwords match
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    // If both exist and don't match, set an error on the confirmPassword control
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      // Clear the error if they now match
      confirmPassword.setErrors(null);
    }
    return null;
  }

  // Helper getter for easy access to form fields in the HTML template
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.isSubmitted = true;

    // Stop if the form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    // If valid, log the data (Replace this with your actual API call)
    console.log('Signup Data:', this.signupForm.value);
    
    // Example: Navigate to login page after successful signup
    // this.router.navigate(['/login']);
  }
}