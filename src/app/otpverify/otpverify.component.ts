import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-otpverify',
  standalone: true,
  templateUrl: './otpverify.component.html',
  styleUrls: ['./otpverify.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class OtpVerificationComponent implements OnInit {
  otpForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.otpForm = this.fb.group({
      contact: [{ value: '', disabled: true }, Validators.required], // disable editing
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    // Get the contact from navigation state (sent from registration)
    const stateContact = history.state.contact;
    if (stateContact) {
      this.otpForm.patchValue({ contact: stateContact });
    } else {
      // If no contact, redirect back to registration
      this.router.navigate(['/register']);
    }
  }

  onSubmit() {
    if (!this.otpForm.valid) return;

    this.loading = true;

    const contact = this.otpForm.get('contact')?.value; // get the value from disabled field
    const otp = this.otpForm.get('otp')?.value;

    const payload: any = { otp };
    if (contact.includes('@')) payload.email = contact;
    else payload.phone = contact;

    this.authService.verifyOtp(payload).subscribe({
      next: (res) => {
        alert(res.message || 'Verification successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || 'OTP verification failed');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
