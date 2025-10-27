import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Home implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'designation',
    'officialMailId',
    'status',
  ];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router) {
    this.setEmpDtaa();
    this.loadEmployeeData();
  }

  setEmpDtaa() {
    const storedData = sessionStorage.getItem('employeeData');
    if (!storedData) {
      const defaultEmployees = [
        {
          id: 1,
          firstName: 'NagaPandi',
          lastName: 'Gandhi',
          mobile: '9867898778',
          age: 26,
          department: 'IT',
          designation: 'Software Engineer',
          dob: '2025-10-26T18:30:00.000Z',
          doj: '2025-10-26T18:30:00.000Z',
          dor: '2025-10-27T18:30:00.000Z',
          reportingManager: 'Anitha',
          bloodGroup: 'A+',
          gender: 'male',
          qualification: "Bachelor's Degree",
          status: 'Active',
          officialMailId: 'nagapandi@gmail.com',
          altemail: 'nagapandi@gmail.com',
          maritalStatus: 'single',
          aadhar: '222222222222',
          pan: '2222222222',
          uan: '222222222222',
          emermobile: '9999999999',
          address: 'Thirumangalam',
        },
        {
          id: 2,
          firstName: 'Ranjith',
          lastName: 'Kumar',
          mobile: '9876897678',
          age: 26,
          department: 'IT',
          designation: 'Software Engineer',
          dob: '2025-10-26T18:30:00.000Z',
          doj: '2025-10-26T18:30:00.000Z',
          dor: '2025-10-27T18:30:00.000Z',
          reportingManager: 'Anitha',
          bloodGroup: 'A+',
          gender: 'male',
          qualification: "Bachelor's Degree",
          status: 'Inactive',
          officialMailId: 'ranjith@gmail.com',
          altemail: 'ranjith@gmail.com',
          maritalStatus: 'single',
          aadhar: '222222222222',
          pan: '2222222222',
          uan: '222222222222',
          emermobile: '9999999999',
          address: 'Dindugal',
        },
      ];
      sessionStorage.setItem('employeeData', JSON.stringify(defaultEmployees));
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployeeData() {
    const storedData = sessionStorage.getItem('employeeData');
    if (storedData) {
      this.dataSource.data = JSON.parse(storedData);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
