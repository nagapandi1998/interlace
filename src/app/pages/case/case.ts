import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  provideNativeDateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { Loader } from '../../shared/components/loader/loader';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocationDialog } from '../../shared/components/dialog/location-dialog/location';
import { PetitionerDialog } from '../../shared/components/dialog/petitioner-dialog/petitioner';
import { BoardStandingCounselDialog } from '../../shared/components/dialog/board-standing-counsel-dialog/board-standing-counsel-dialog';
import { RespondentDialog } from '../../shared/components/dialog/respondent-dialog/respondent-dialog';
import { DocumentDialog } from '../../shared/components/dialog/document-dialog/document-dialog';

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
  selector: 'app-case',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    Loader,
    MatTableModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './case.html',
  styleUrl: './case.scss',
})
export class Case {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  formSubmitted = false;
  loading = false;
  casecreationForm!: FormGroup;
  years: number[] = [];
  courtCategoryTypes: string[] = [
    'City Civil Court',
    'csdfg',
    'fvdfs',
    'High Court of Madras',
    'Supreme Court',
  ];
  nameOfCourts: string[] = ['City Civil Court, Chennai', 'vvvcv', 'vvvv'];
  types: string[] = ['Appeal', 'Cont.P', 'NGT', 'SLP'];
  filedBys: string[] = ['Against Cmwssb', 'Filed By Cmwssb'];
  caseTypes: string[] = ['MWSTA', 'MWSTB', 'MWSTC', 'MWSTD'];
  categoryTypes: string[] = ['Category 1', 'Category 2', 'Category 3'];
  subCategoryTypes: string[] = ['Sub-category 1', 'Sub-category 2', 'Sub-category 3'];
  locationData: any[] = [];
  locationdisplayedColumns: string[] = [
    'primary',
    'regionName',
    'officeTypeName',
    'areaDeptName',
    'subOfficeName',
    'depotLocation',
    'actions',
  ];

  petitionerData: any[] = [];
  petitionerdisplayedColumns: string[] = ['petitionerName', 'petitioneraddress', 'actions'];

  boardStandingCounselData: any[] = [];
  boardStandingCounseldisplayedColumns: string[] = [
    'boardstandingcounseltype',
    'boardstandingcounselname',
    'actions',
  ];

  respondentData: any[] = [];
  respondentdisplayedColumns: string[] = [
    'respondenttype',
    'regionname',
    'officetypename',
    'areadeptname',
    'designation',
    'role',
    'respondentname',
    'details',
    'actions',
  ];

  documentData: any[] = [];
  documentdisplayedColumns: string[] = ['documenttype', 'attachments', 'documentdate', 'actions'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.createCaseCreation();
    this.generateYears();
  }

  createCaseCreation() {
    this.casecreationForm = this.fb.group({
      courtCategoryType: ['', Validators.required],
      nameOfCourt: ['', Validators.required],
      type: ['', Validators.required],
      filedBy: ['', Validators.required],
      caseType: ['', Validators.required],
      categoryType: ['', Validators.required],
      subCategoryType: ['', Validators.required],
      filingDate: ['', Validators.required],
      receivedDate: ['', Validators.required],
      caseNo: ['', Validators.required],
      year: ['', Validators.required],
      legalCellFileNo: [''],
      concernedOfficeFileNo: [''],
      nextHearingDate: [''],

      //  <-- case details form -->
      caseDetails: ['', Validators.required],
      prayerSubject: ['', Validators.required],
    });
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1990; i--) {
      this.years.push(i);
    }
  }

  openLocationDialog(data?: any, index?: number) {
    const dialogRef = this.dialog.open(LocationDialog, {
      width: '400px',
      data: data || {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Location Data:', result);
        if (index != null) this.locationData[index] = result;
        else this.locationData.push(result);
        this.locationData = [...this.locationData];
      }
    });
  }

  editLocation(data: any, index: number) {
    const dialogRef = this.dialog.open(LocationDialog, {
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.locationData[index] = result;
        this.locationData = [...this.locationData];
      }
    });
  }

  deleteLocation(index: number) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      console.log('Dialog result:', confirmed);
      if (confirmed === true) {
        this.locationData.splice(index, 1);
        this.locationData = [...this.locationData];
      }
    });
  }

  openPetitionerDialog(data?: any, index?: number) {
    const dialogRef = this.dialog.open(PetitionerDialog, {
      width: '400px',
      data: data || {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Petitioner  Data:', result);
        if (index != null) this.petitionerData[index] = result;
        else this.petitionerData.push(result);
        this.petitionerData = [...this.petitionerData];
      }
    });
  }

  editPetitioner(data: any, index: number) {
    const dialogRef = this.dialog.open(PetitionerDialog, {
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.petitionerData[index] = result;
        this.petitionerData = [...this.petitionerData];
      }
    });
  }

  deletePetitioner(index: number) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.petitionerData.splice(index, 1);
        this.petitionerData = [...this.petitionerData];
      }
    });
  }

  openBoardStandingCounselDialog(data?: any, index?: number) {
    const dialogRef = this.dialog.open(BoardStandingCounselDialog, {
      width: '400px',
      data: data || {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Board data:', result);
        if (index != null) this.boardStandingCounselData[index] = result;
        else this.boardStandingCounselData.push(result);
        this.boardStandingCounselData = [...this.boardStandingCounselData];
      }
    });
  }

  editBoardStandingCounsel(data: any, index: number) {
    const dialogRef = this.dialog.open(BoardStandingCounselDialog, {
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.boardStandingCounselData[index] = result;
        this.boardStandingCounselData = [...this.boardStandingCounselData];
      }
    });
  }

  deleteBoardStandingCounsel(index: number) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.boardStandingCounselData.splice(index, 1);
        this.boardStandingCounselData = [...this.boardStandingCounselData];
      }
    });
  }

  openRespondentDialog(data?: any, index?: number) {
    const dialogRef = this.dialog.open(RespondentDialog, {
      width: '400px',
      data: data || {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Board data:', result);
        if (index != null) this.respondentData[index] = result;
        else this.respondentData.push(result);
        this.respondentData = [...this.respondentData];
      }
    });
  }

  editRespondent(data: any, index: number) {
    const dialogRef = this.dialog.open(RespondentDialog, {
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.respondentData[index] = result;
        this.respondentData = [...this.respondentData];
      }
    });
  }

  deleteRespondent(index: number) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed == true) {
        this.respondentData.splice(index, 1);
        this.respondentData = [...this.respondentData];
      }
    });
  }

  openDocumentDialog(data?: any, index?: number) {
    const dialogRef = this.dialog.open(DocumentDialog, {
      width: '400px',
      data: data || {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Board data:', result);
        if (index != null) this.documentData[index] = result;
        else this.documentData.push(result);
        this.documentData = [...this.documentData];
      }
    });
  }

  onFileSelected(event: any, index: number) {
    const file: File = event.target.files[0];
    if (file) {
      // Store the file in your documentData array
      this.documentData[index].file = file;
      this.documentData[index].fileName = file.name;
    }
  }

  deleteDocument(index: number) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.documentData.splice(index, 1);
        this.documentData = [...this.documentData];
      }
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    console.log('Submitting form...');
    if (this.casecreationForm.valid) {
      this.loading = true;
      console.log('Form Submitted:', this.casecreationForm.value);
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
      this.casecreationForm.markAllAsTouched();
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
