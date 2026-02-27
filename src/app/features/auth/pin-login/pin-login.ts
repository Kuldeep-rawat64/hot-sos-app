import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pin-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './pin-login.html',
  styleUrls: ['./pin-login.scss'],
})
export class PinLogin implements OnInit {
  pinForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  // PIN digits displayed as dots
  get pinDots(): number[] {
    return Array(6).fill(0);
  }

  get enteredPin(): string {
    return this.pinForm.get('pin')?.value || '';
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.pinForm = this.fb.group({
      pin: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/), // exactly 6 digits
        ],
      ],
    });
  }

  // Called by numeric keypad buttons
  onKeyPress(digit: string): void {
    if (this.enteredPin.length < 6) {
      const newPin = this.enteredPin + digit;
      this.pinForm.patchValue({ pin: newPin });
      this.errorMessage = ''; // clear error on new input
    }
  }

  // Called by backspace button
  onDelete(): void {
    const newPin = this.enteredPin.slice(0, -1);
    this.pinForm.patchValue({ pin: newPin });
    this.errorMessage = '';
  }

  // Called by Continue button
  onSubmit(): void {
    if (this.pinForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.enteredPin).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.success && response.token) {
          await this.storageService.setToken(response.token);
          if (response.name) await this.storageService.setName(response.name);
          this.router.navigate(['/shell']);
        } else if (response.error === 'offline') {
          this.errorMessage = 'No internet connection. Please try again.';
        } else {
          this.errorMessage = 'Invalid PIN. Please try again.';
          this.pinForm.patchValue({ pin: '' }); // clear PIN on error
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong. Please try again.';
      },
    });
  }
}
