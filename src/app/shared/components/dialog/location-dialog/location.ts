import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Loader } from '../../loader/loader';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    Loader,
  ],
  templateUrl: './location.html',
  styleUrl: './location.scss',
})
export class LocationDialog {
  locationForm!: FormGroup;
  loading = false;
  regions = ['North', 'South', 'East', 'West'];
  officeTypes = ['Area', 'Department'];
  areas = ['Area 1', 'Area 2'];
  subOffices = ['Sub 1', 'Sub 2'];
  depots = ['Depot 1', 'Depot 2'];

  constructor(
    public dialogRef: MatDialogRef<LocationDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createLocation();
    if (data) this.locationForm.patchValue(data);
  }

  createLocation() {
    this.locationForm = this.fb.group({
      regionName: ['', Validators.required],
      officeTypeName: ['', Validators.required],
      areaDeptName: ['', Validators.required],
      subOfficeTypeName: ['', Validators.required],
      depotLocation: ['', Validators.required],
    });
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);

      setTimeout(() => {
        this.loading = false;
      }, 1500);
    } else {
      this.locationForm.markAllAsTouched();
    }
    this.loading = false;
  }
}
