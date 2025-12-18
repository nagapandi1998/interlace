import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { ToastService } from '../../../shared/service/toaster/toast-service';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Loader,
  ],
  templateUrl: './change-password.page.html',
  styleUrl: './change-password.page.scss',
})
export class ChangePasswordPage {
  hideOld = true;
  hideNew = true;
  hideConfirm = true;
  loading = false;
  changeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.initChanePasswordForm();
  }

  initChanePasswordForm() {
    this.changeForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

passwordMatchValidator(form: FormGroup) {
  const newPass = form.get('newPassword')?.value;
  const confirmPass = form.get('confirmPassword')?.value;

  if (!newPass || !confirmPass) {
    return null;
  }

  return newPass === confirmPass ? null : { mismatch: true };
}

  onSubmit() {
    if (this.changeForm.hasError('mismatch')) {
      this.toastService.showMsg('warning', 'New password and confirm password do not match');
      return;
    }

    if (!this.changeForm.valid) {
      this.changeForm.markAllAsTouched();
      this.toastService.showMsg('warning', 'Enter mandatory details');
      return;
    }

    const payload = {
      oldPassword: this.changeForm.value.oldPassword,
      newPassword: this.changeForm.value.newPassword,
    };

    this.loading = true;
    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.showMsg('success', 'Your password has been changed successfully.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading = false;
        this.toastService.showMsg('error', 'Failed to change password. Please try again.');
      },
    });
  }
}
