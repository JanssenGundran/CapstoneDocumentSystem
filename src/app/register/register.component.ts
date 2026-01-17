import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Make sure this points to your service

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize form with only the required fields
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const { email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.loading = true;

    // Call backend register method
    this.authService.register({ email, password }).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        alert('Registration successful!');
        this.router.navigate(['/login']).catch(err => {
          console.error('Navigation error:', err);
          alert('Unable to navigate to login page.');
        });
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert(err.error?.message || 'Registration failed');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

    goToLogin(): void {
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
