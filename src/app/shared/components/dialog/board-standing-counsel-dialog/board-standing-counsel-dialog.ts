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
  selector: 'app-board-standing-counsel-dialog',
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
  templateUrl: './board-standing-counsel-dialog.html',
  styleUrl: './board-standing-counsel-dialog.scss',
})
export class BoardStandingCounselDialog {
  boardStandingCounselForm!: FormGroup;
  loading = false;
  counselTypes = ['Additional Advocate General', 'Additional Government Pleader', 'CMWSSB not respondent' ];
  counselNames = ['Deva', 'Mr.S.Shaji Bino'];

  constructor(
    public dialogRef: MatDialogRef<BoardStandingCounselDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createPetitioner();
    if (data) this.boardStandingCounselForm.patchValue(data);
  }

  createPetitioner() {
    this.boardStandingCounselForm = this.fb.group({
      boardstandingcounseltype: ['', Validators.required],
      boardstandingcounselname: ['', Validators.required],
    });
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.boardStandingCounselForm.valid) {
      this.dialogRef.close(this.boardStandingCounselForm.value);

      setTimeout(() => {
        this.loading = false;
      }, 1500);
    } else {
      this.boardStandingCounselForm.markAllAsTouched();
    }
    this.loading = false;
  }
}
