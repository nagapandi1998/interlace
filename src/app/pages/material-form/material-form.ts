import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatSnackBarModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './material-form.html',
  styleUrl: './material-form.scss',
})
export class MaterialForm {
  employeeForm!: FormGroup;
  departments = ['IT', 'HR', 'Finance', 'Admin'];
  designations = ['Software Engineer', 'Human Resource', 'Tester', 'Manager'];
  managers = ['Bala', 'Anitha', 'Kumar', 'Suresh'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  qualifications = ['Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'];
  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.createEmployee();
  }

  createEmployee() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      age: ['', [Validators.required]],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      dob: ['', Validators.required],
      doj: ['', Validators.required],
      dor: [''],
      reportingManager: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      gender: ['', Validators.required],
      qualification: ['', Validators.required],
      status: ['', Validators.required],
      officialMailId: ['', [Validators.required, Validators.email]],
      altemail: [''],
      maritalStatus: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log('Form Submitted:', this.employeeForm.value);
      this.snackBar.open('Form submitted successfully!', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
      });
    } else {
      this.employeeForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields.', '', {
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
