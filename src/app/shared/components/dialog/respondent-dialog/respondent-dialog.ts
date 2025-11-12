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
  selector: 'app-respondent-dialog',
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
  templateUrl: './respondent-dialog.html',
  styleUrl: './respondent-dialog.scss',
})
export class RespondentDialog {
  respondentForm!: FormGroup;
  loading = false;
  respondentTypes = ['CMWSSB', 'Others'];
  regionNmaes = ['North', 'South', 'East', 'West'];
  officeTypeNames = ['Area', 'Department'];
  areadeptnames = ['Area 1', 'Area 2', 'Area 3'];
  subofftypeNames = ['Head Office', 'Zonal Office', 'Divisional Office'];
  depatlocations = ['Chennai', 'Coimbatore', 'Madurai'];
  employeecategories = ['Permanent', 'Contract'];
  categorytypes = ['Technical', 'Non-Technical'];
  designations = ['Manager', 'Assistant Manager', 'Clerk'];
  roles = ['Primary', 'Secondary'];
  counselNames = ['Deva', 'Mr.S.Shaji Bino'];

  constructor(
    public dialogRef: MatDialogRef<RespondentDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createRespondent();
    if (data) this.respondentForm.patchValue(data);

    this.respondentForm.get('respondenttype')?.valueChanges.subscribe((type) => {
      this.onRespondentTypeChange(type);
    });
  }

  createRespondent() {
    this.respondentForm = this.fb.group({
      respondenttype: ['', Validators.required],
      regionname: ['', Validators.required],
      officetypename: ['', Validators.required],
      areadeptname: ['', Validators.required],
      subofftypename: ['', Validators.required],
      depotlocation: ['', Validators.required],
      employeecategory: ['', Validators.required],
      categorytype: ['', Validators.required],
      designation: ['', Validators.required],
      role: [''],
      respondentname: ['', Validators.required],
      details: ['', Validators.required],
    });
  }
  onRespondentTypeChange(type: string) {
    if (type === 'Others') {
      // Show name & details (required)
      this.respondentForm.get('respondentname')?.setValidators([Validators.required]);
      this.respondentForm.get('details')?.setValidators([Validators.required]);

      // Clear dropdowns, set them to "-"
      [
        'regionname',
        'officetypename',
        'areadeptname',
        'subofftypename',
        'depotlocation',
        'employeecategory',
        'categorytype',
        'designation',
        'role',
      ].forEach((ctrl) => {
        this.respondentForm.get(ctrl)?.setValue('-');
        this.respondentForm.get(ctrl)?.clearValidators();
      });
    } else if (type === 'CMWSSB') {
      // Hide name & details (set to "-")
      this.respondentForm.get('respondentname')?.setValue('-');
      this.respondentForm.get('details')?.setValue('-');
      this.respondentForm.get('respondentname')?.clearValidators();
      this.respondentForm.get('details')?.clearValidators();

      // Reapply required validators for dropdowns
      [
        'regionname',
        'officetypename',
        'areadeptname',
        'subofftypename',
        'depotlocation',
        'employeecategory',
        'categorytype',
        'designation',
      ].forEach((ctrl) => {
        this.respondentForm.get(ctrl)?.setValidators([Validators.required]);
      });
    } else {
      // Reset all if none selected
      this.respondentForm.reset();
    }

    // update form validation state
    this.respondentForm.updateValueAndValidity();
  }
  
  close() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.respondentForm.valid) {
      this.dialogRef.close(this.respondentForm.value);

      setTimeout(() => {
        this.loading = false;
      }, 1500);
    } else {
      this.respondentForm.markAllAsTouched();
    }
    this.loading = false;
  }
}
