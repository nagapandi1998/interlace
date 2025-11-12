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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import {
  provideNativeDateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-document-dialog',
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
    MatDatepickerModule,
  ],
  providers: [
    DatePipe,
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './document-dialog.html',
  styleUrl: './document-dialog.scss',
})
export class DocumentDialog {
  documentForm!: FormGroup;
  loading = false;
  documenttype = ['Written Statement', 'Writ Petition', 'Grounds', 'Plaint Copy', 'IA Petitio'];

  constructor(
    public dialogRef: MatDialogRef<DocumentDialog>,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createDocument();
    if (data) this.documentForm.patchValue(data);
  }

  createDocument() {
    this.documentForm = this.fb.group({
      documenttype: ['', Validators.required],
      documentdate: ['', Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.documentForm.valid) {
      const formValue = { ...this.documentForm.value };

      if (formValue.documentdate) {
        formValue.documentdate = this.datePipe.transform(formValue.documentdate, 'dd/MM/yyyy');
      }

      this.dialogRef.close(formValue);
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    } else {
      this.documentForm.markAllAsTouched();
    }
    this.loading = false;
  }
}
