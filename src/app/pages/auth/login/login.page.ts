import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from '../../../shared/service/toaster/toast-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { Loader } from '../../../shared/components/loader/loader';

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
    Loader,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class AuthPage implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loading = false;
  animateLeft = signal(false);
  animateRight = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    setTimeout(() => this.animateLeft.set(true), 100);
    setTimeout(() => this.animateRight.set(true), 300);
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      this.toastService.showMsg('warning', 'Enter mandatory details');

      return;
    } else {
      let loginreq = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value,
      };

      this.loading = true;

      this.authService.verifyUser(loginreq).subscribe({
        next: (loginresponse) => {
          this.loading = false;
          console.log('Login success:', loginresponse);

          // Save token
          sessionStorage.setItem('loginuser', JSON.stringify(loginresponse));

          this.toastService.showMsg('success', 'You have logged in successfully!');

          this.router.navigate(['/courtcase/allcases']);
        },

        error: (error) => {
          this.loading = false;

          console.error('Login error:', error);

          if (error.status === 403) {
            this.toastService.showMsg('error', 'Invalid username or password.');
          } else if (error.status === 400) {
            this.toastService.showMsg('error', 'Invalid request. Please check your inputs.');
          } else {
            this.toastService.showMsg('error', 'Something went wrong. Please try again later.');
          }
        },
      });
    }
  }

  forgotpassword() {
    this.toastService.showMsg('success', 'A temporary password has been sent to your registered email.');
  }
}
