import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { Loader } from '../../shared/components/loader/loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-all-cases',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    Loader,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './all-cases.html',
  styleUrl: './all-cases.scss',
})
export class AllCases {
  loading = false;
  displayedColumns: string[] = [
    'id',
    'caseNo',
    'filingDate',
    'receivedDate',
    'year',
    'courtCategory',
    'courtName',
    'caseType',
    'approvalStatus',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {
    this.setEmpDtaa();
    this.loadCaseData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  setEmpDtaa() {
    this.loading = true;
    const storedData = sessionStorage.getItem('caseData');
    if (!storedData) {
      const defaultCaseData = [
        {
          id: 1,
          courtCategoryType: 'City Civil Court',
          nameOfCourt: 'City Civil Court, Chennai',
          type: 'Appeal',
          filedBy: 'Against Cmwssb',
          caseType: 'MWSTA',
          categoryType: 'Category 1',
          subCategoryType: 'Sub-category 1',
          filingDate: '19/11/2025',
          receivedDate: '20/11/2025',
          caseNo: 'Case 1',
          year: 2025,
          legalCellFileNo: '123',
          concernedOfficeFileNo: '123',
          nextHearingDate: '28/11/2025',
          approvalStatus: 'Pending',
          caseDetails: 'de',
          prayerSubject: 'prayer',
          location: [
            {
              regionName: 'North',
              officeTypeName: 'Area',
              areaDeptName: 'Area 1',
              subOfficeTypeName: 'Sub 1',
              depotLocation: 'Depot 1',
            },
          ],
          petitioner: [
            {
              petitionerName: 'As',
              petitioneraddress: 'as',
            },
          ],
          boardStandingCounsel: [
            {
              boardstandingcounseltype: 'Additional Advocate General',
              boardstandingcounselname: 'Deva',
            },
          ],
          respondent: [
            {
              respondenttype: 'Others',
              regionname: '-',
              officetypename: '-',
              areadeptname: '-',
              subofftypename: '-',
              depotlocation: '-',
              employeecategory: '-',
              categorytype: '-',
              designation: '-',
              role: '-',
              respondentname: 'as',
              details: 'as',
            },
          ],
          document: [
            {
              documenttype: 'Writ Petition',
              documentdate: '29/11/2025',
            },
          ],
        },
        {
          id: 2,
          courtCategoryType: 'csdfg',
          nameOfCourt: 'vvvcv',
          type: 'NGT',
          filedBy: 'Against Cmwssb',
          caseType: 'MWSTB',
          categoryType: 'Category 1',
          subCategoryType: 'Sub-category 1',
          filingDate: '22/11/2025',
          receivedDate: '26/11/2025',
          caseNo: 'Case 2',
          year: 2025,
          legalCellFileNo: '456',
          concernedOfficeFileNo: '456',
          nextHearingDate: '29/11/2025',
          approvalStatus: 'Approved',
          caseDetails: 'de',
          prayerSubject: 'prayer',
          location: [
            {
              regionName: 'North',
              officeTypeName: 'Area',
              areaDeptName: 'Area 1',
              subOfficeTypeName: 'Sub 1',
              depotLocation: 'Depot 1',
            },
          ],
          petitioner: [
            {
              petitionerName: 'As',
              petitioneraddress: 'as',
            },
          ],
          boardStandingCounsel: [
            {
              boardstandingcounseltype: 'Additional Advocate General',
              boardstandingcounselname: 'Deva',
            },
          ],
          respondent: [
            {
              respondenttype: 'Others',
              regionname: '-',
              officetypename: '-',
              areadeptname: '-',
              subofftypename: '-',
              depotlocation: '-',
              employeecategory: '-',
              categorytype: '-',
              designation: '-',
              role: '-',
              respondentname: 'as',
              details: 'as',
            },
          ],
          document: [
            {
              documenttype: 'Writ Petition',
              documentdate: '29/11/2025',
            },
          ],
        },
        {
          id: 3,
          courtCategoryType: 'fvdfs',
          nameOfCourt: 'vvvv',
          type: 'Cont.P',
          filedBy: 'Filed By Cmwssb',
          caseType: 'MWSTD',
          categoryType: 'Category 2',
          subCategoryType: 'Sub-category 2',
          filingDate: '24/11/2025',
          receivedDate: '26/11/2025',
          caseNo: 'Case 3',
          year: 2025,
          legalCellFileNo: '678',
          concernedOfficeFileNo: '678',
          nextHearingDate: '30/11/2025',
          approvalStatus: 'Forward',
          caseDetails: 'de',
          prayerSubject: 'prayer',
          location: [
            {
              regionName: 'North',
              officeTypeName: 'Area',
              areaDeptName: 'Area 1',
              subOfficeTypeName: 'Sub 1',
              depotLocation: 'Depot 1',
            },
          ],
          petitioner: [
            {
              petitionerName: 'As',
              petitioneraddress: 'as',
            },
          ],
          boardStandingCounsel: [
            {
              boardstandingcounseltype: 'Additional Advocate General',
              boardstandingcounselname: 'Deva',
            },
          ],
          respondent: [
            {
              respondenttype: 'Others',
              regionname: '-',
              officetypename: '-',
              areadeptname: '-',
              subofftypename: '-',
              depotlocation: '-',
              employeecategory: '-',
              categorytype: '-',
              designation: '-',
              role: '-',
              respondentname: 'as',
              details: 'as',
            },
          ],
          document: [
            {
              documenttype: 'Writ Petition',
              documentdate: '29/11/2025',
            },
          ],
        },
        {
          id: 4,
          courtCategoryType: 'Supreme Court',
          nameOfCourt: 'City Civil Court, Chennai',
          type: 'NGT',
          filedBy: 'Filed By Cmwssb',
          caseType: 'MWSTB',
          categoryType: 'Category 3',
          subCategoryType: 'Sub-category 3',
          filingDate: '15/11/2025',
          receivedDate: '18/11/2025',
          caseNo: 'Case 4',
          year: 2025,
          legalCellFileNo: '901',
          concernedOfficeFileNo: '901',
          nextHearingDate: '25/11/2025',
          approvalStatus: 'Returned',
          caseDetails: 'de',
          prayerSubject: 'prayer',
          location: [
            {
              regionName: 'North',
              officeTypeName: 'Area',
              areaDeptName: 'Area 1',
              subOfficeTypeName: 'Sub 1',
              depotLocation: 'Depot 1',
            },
          ],
          petitioner: [
            {
              petitionerName: 'As',
              petitioneraddress: 'as',
            },
          ],
          boardStandingCounsel: [
            {
              boardstandingcounseltype: 'Additional Advocate General',
              boardstandingcounselname: 'Deva',
            },
          ],
          respondent: [
            {
              respondenttype: 'Others',
              regionname: '-',
              officetypename: '-',
              areadeptname: '-',
              subofftypename: '-',
              depotlocation: '-',
              employeecategory: '-',
              categorytype: '-',
              designation: '-',
              role: '-',
              respondentname: 'as',
              details: 'as',
            },
          ],
          document: [
            {
              documenttype: 'Writ Petition',
              documentdate: '29/11/2025',
            },
          ],
        },
      ];
      sessionStorage.setItem('caseData', JSON.stringify(defaultCaseData));
    }

    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  addCase() {
    this.router.navigate(['/casecreation']);
  }

  editCase(caseId: number) {
    this.router.navigate(['/casecreation', caseId]);
  }

  viewCase(caseId: number) {
    this.router.navigate(['/casecreation', caseId], {
      queryParams: { view: true },
    });
  }

  loadCaseData() {
    this.loading = true;

    const caseDataStr = sessionStorage.getItem('caseData');

    if (caseDataStr) {
      const rawData = JSON.parse(caseDataStr);

      // Convert single object → array (table needs array)
      const arr = Array.isArray(rawData) ? rawData : [rawData];

      // Map JSON fields to table fields
      const mappedData = arr.map((item) => ({
        id: item.id,
        caseNo: item.caseNo,
        filingDate: item.filingDate,
        receivedDate: item.receivedDate,
        year: item.year,
        courtCategory: item.courtCategoryType,
        courtName: item.nameOfCourt,
        caseType: item.caseType,
        approvalStatus: item.approvalStatus,
      }));

      this.dataSource.data = mappedData;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }

    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
