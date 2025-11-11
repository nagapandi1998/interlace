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
  selector: 'app-petitioner',
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
  templateUrl: './petitioner.html',
  styleUrl: './petitioner.scss',
})
export class PetitionerDialog {
  petitionerForm!: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<PetitionerDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createPetitioner();
    if (data) this.petitionerForm.patchValue(data);
  }

  createPetitioner() {
    this.petitionerForm = this.fb.group({
      petitionerName: ['', Validators.required],
      petitioneraddress: ['', Validators.required]
    });
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.petitionerForm.valid) {
      this.dialogRef.close(this.petitionerForm.value);

      setTimeout(() => {
        this.loading = false;
      }, 1500);
    } else {
      this.petitionerForm.markAllAsTouched();
    }
    this.loading = false;
  }
}
