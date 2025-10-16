import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bootstrap-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './bootstrap-form.html',
  styleUrl: './bootstrap-form.scss',
})
export class BootstrapForm {
  constructor(private router: Router, private snackBar: MatSnackBar,) {}

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      this.snackBar.open('Form submitted successfully!.', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
    } else {
      this.form.markAllAsTouched();
      this.snackBar.open('Enter mandatory details', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
