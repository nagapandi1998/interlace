import { Component, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { Loader } from '../../../shared/components/loader/loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../../shared/service/admin/admin-service';
import { ToastService } from '../../../shared/service/toaster/toast-service';
import { DeleteDialog } from '../../../shared/components/dialog/delete-dialog/delete-dialog';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';

interface Privilege {
  id: number;
  apiName: string;
  privilegeName: string;
}

interface Role {
  id: number;
  roleName: string;
  privileges: Privilege[];
}

interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  department: string;
}

interface User {
  id: number;
  username: string;
  active: boolean;
  roles: Role[];
  passwordResetRequired: boolean;
  assignedEmployee: Employee | null;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    Loader,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './users.page.html',
  styleUrl: './users.page.scss',
})
export class UsersPage implements AfterViewInit {
  loading = false;
  allUsers: User[] = [];
  displayedColumns: string[] = ['username', 'roleName', 'active', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {
    this.fetchAllUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchAllUsers() {
    this.adminService.retriveAllUsers().subscribe({
      next: (userresponse: User[]) => {
        this.loading = false;
        this.allUsers = userresponse;

        this.dataSource.data = this.allUsers;
        console.log('All Users: ', this.allUsers);
        console.log('Data Source: ', this.dataSource.data);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 403) {
          this.toastService.showMsg('error', 'Fetch All Users error', 'bottom-center');
        } else {
          this.toastService.showMsg(
            'error',
            'Server error. Please try again later.',
            'bottom-center'
          );
        }
      },
    });
  }

  getRoleNames(roles: Role[]): string {
    return roles.map((r) => r.roleName).join(', ');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addUsers() {
    this.router.navigate(['/admin/users/manage']);
  }
}
