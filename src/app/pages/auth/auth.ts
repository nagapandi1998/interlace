import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
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
    NgbCarouselModule,
    MatCheckboxModule,
    Loader,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  hide = true;
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['admin@gmail.com', [Validators.required, Validators.email]],
      password: ['admin@123', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;

      const { email, password } = this.loginForm.value;
      console.log('Logging in with:', email, password);
      if (email == 'admin@gmail.com' && password == 'admin@123') {
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/allcases']);
        }, 1000);
      } else if (email !== 'admin@gmail.com') {
        setTimeout(() => {
          this.loading = false;
          this.snackBar.open('Username is invalid', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }, 700);
      } else if (password !== 'admin@123') {
        setTimeout(() => {
          this.loading = false;
          this.snackBar.open('password is invalid', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }, 700);
      }
    } else {
      this.loading = true;
      this.loginForm.markAllAsTouched();

      setTimeout(() => {
        this.loading = false;

        this.snackBar.open('Enter mandatory details', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }, 700);
    }
  }

  forgotpassword() {
    this.snackBar.open('Temporary password has been sent to your email.', '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }
}
