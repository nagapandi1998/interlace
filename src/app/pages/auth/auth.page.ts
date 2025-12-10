import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth/auth.service';
import { Loader } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    Loader,
  ],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss',
})
export class AuthPage {
  hide = true;
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['admin123', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      this.showError('Enter mandatory details');

      return;
    } else {
      let loginreq = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value,
      };

      this.loading = true;

      this.authService.verifyUser(loginreq).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Login success:', response);

          // Save token or session if needed
          // localStorage.setItem('accessToken', response.accessToken);

          this.showSuccess('Login successful!');

          this.router.navigate(['/allcases']);
        },

        error: (error) => {
          this.loading = false;

          console.error('Login error:', error);

          if (error.status === 403) {
            this.showError('Invalid username or password');
          } else if (error.status === 400) {
            this.showError('Bad request. Please check your inputs.');
          } else {
            this.showError('Server error. Please try again later.');
          }
        },
      });
    }
  }

  forgotpassword() {
    this.showSuccess('Temporary password has been sent to your email.');
  }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
