import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    MatCard,
    MatSnackBarModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  hide = true;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Logging in with:', email, password);
      if (email == 'admin@gmail.com' && password == 'admin@123') {
        this.router.navigate(['/home']);
      } else if (email !== 'admin@gmail.com') {
        this.snackBar.open('Username is invalid', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      } else if (password !== 'admin@123') {
        this.snackBar.open('password is invalid', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }
    } else {
      this.loginForm.markAllAsTouched();
      this.snackBar.open('Enter mandatory details', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  forgotpassword(){
     this.snackBar.open('Temporary password has been sent to your email.', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
  }
}
