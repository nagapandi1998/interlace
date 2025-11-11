import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
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
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Loader } from '../../shared/components/loader/loader';

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
    Loader,
  ],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './material-form.html',
  styleUrl: './material-form.scss',
})
export class MaterialForm {
  loading = false;
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
      aadhar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      pan: ['', [Validators.required]],
      uan: [''],
      emermobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: [''],
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.loading = true;

      const formData = this.employeeForm.value;

      // Get existing employees from session storage
      const existingData = JSON.parse(sessionStorage.getItem('employeeData') || '[]');
      // Generate incremental ID
      const newId = existingData.length > 0 ? existingData[existingData.length - 1].id + 1 : 1;

      // Add ID to form data
      const newEmployee = { id: newId, ...formData };

      // Add new entry to array
      existingData.push(newEmployee);
      // Save to session storage
      sessionStorage.setItem('employeeData', JSON.stringify(existingData));

      console.log('Form Submitted:', formData);
      setTimeout(() => {
        this.loading = false;
        this.snackBar.open('Form submitted successfully!', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this.router.navigate(['/home']);
      }, 500);
    } else {
      this.loading = true;

      this.employeeForm.markAllAsTouched();

      setTimeout(() => {
        this.loading = false;
        this.snackBar.open('Please fill all required fields.', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }, 200);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
