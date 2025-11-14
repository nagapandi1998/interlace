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
    Loader,
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
    this.loadCaseData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addCase() {
    this.router.navigate(['/casecreation']);
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
        approvalStatus: item.approvalStatus ?? 'Pending', // default value
      }));

      this.dataSource.data = mappedData;
    }

    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
}
