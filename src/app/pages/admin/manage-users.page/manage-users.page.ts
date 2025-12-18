import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Loader } from '../../../shared/components/loader/loader';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../../shared/service/admin/admin-service';
import { ToastService } from '../../../shared/service/toaster/toast-service';

export interface Privilege {
  id?: number;
  apiName?: string;
  privilegeName?: string;
}

export interface Role {
  id: number;
  roleName?: string;
  privileges?: Privilege[];
}

export interface AssignedEmployee {
  id?: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  department: string;
}

export interface CreateUserPayload {
  id?: number;
  username: string;
  active: boolean;
  passwordResetRequired: boolean;
  roles: Role[];
  assignedEmployee: AssignedEmployee;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    Loader,
  ],
  templateUrl: './manage-users.page.html',
  styleUrl: './manage-users.page.scss',
})
export class ManageUsersPage {
  loading = false;
  usercreationForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastService: ToastService
  ) {
    this.createUserForm();
  }

  createUserForm() {
    this.usercreationForm = this.fb.group({
      employeeCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      active: ['', Validators.required],
      roleName: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  private buildCreateUserPayload(form: any): CreateUserPayload {
    return {
      // id: 0,
      username: form.username,
      active: form.active,
      passwordResetRequired: true,
      roles: [
        {
          id: 1,
          roleName: form.roleName,
          privileges: [],
        },
      ],
      assignedEmployee: {
        // id: 0,
        employeeCode: form.employeeCode,
        firstName: form.firstName,
        lastName: form.lastName,
        department: form.department,
      },
    };
  }

  onSubmit() {
    if (!this.usercreationForm.valid) {
      this.usercreationForm.markAllAsTouched();
      this.toastService.showMsg('warning', 'Please fill all required fields');
      return;
    }

    // console.log('Form Submitted', this.usercreationForm.value);
    const userData: CreateUserPayload = this.buildCreateUserPayload(this.usercreationForm.value);
    console.log('Create User Payload:', userData);

    this.loading = true; 
    this.adminService.createUser(userData).subscribe({
      next: (userResponse) => {
        this.loading = false; 
        console.log('User created successfully:', userResponse);
        this.toastService.showMsg('success', 'User created successfully');
        this.goBack();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 400) {
          this.toastService.showMsg(
            'error',
            'User already exists. Please use a different username.',
            'bottom-center'
          );
        }
        if (error.status === 403) {
          this.toastService.showMsg('error', 'Failed to create user', 'bottom-center');
        } else {
          this.toastService.showMsg(
            'error',
            'Server error. Please try again later.',
            'bottom-center'
          );
        }
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}
