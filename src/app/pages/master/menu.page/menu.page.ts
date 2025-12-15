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
import { MenuService } from '../../../shared/service/menu/menu.service';
import { ToastService } from '../../../shared/service/toaster/toast-service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

interface Privilege {
  id: number;
  apiName: string;
  privilegeName: string;
}

interface MenuItem {
  id: number;
  title: string;
  path: string;
  sortOrder: number;
  icon: string;
  parent: MenuItem | null;
  requiredPrivileges: Privilege[];
}

export interface MenuTableRow {
  id: number;
  title: string;
  path: string;
  parentTitle: string;
  sortOrder: number;
  icon: string;
}

@Component({
  selector: 'app-menu.page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    Loader,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './menu.page.html',
  styleUrl: './menu.page.scss',
})
export class MenuPage implements AfterViewInit {
  loading = false;
  menuForm!: FormGroup;
  displayedColumns: string[] = ['title', 'path', 'parentTitle', 'sortOrder', 'icon', 'actions'];
  allMenus: MenuItem[] = [];
  parentMenus: MenuItem[] = [];
  icons: string[] = [
    'settings',
    'menu',
    'admin_panel_settings',
    'group',
    'manage_accounts',
    'folder_open',
    'edit',
    'list_alt',
  ];
  dataSource = new MatTableDataSource<MenuTableRow>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('addMenuDialog') addMenuDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private menuServise: MenuService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {
    this.createMenuForm();
    this.fetchAllMenus();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  createMenuForm() {
    this.menuForm = this.fb.group({
      title: ['', Validators.required],
      path: ['', Validators.required],
      parentId: [null],
      sortOrder: [1, Validators.required],
      icon: ['', Validators.required],
    });
  }
  private mapToTableRows(menus: MenuItem[]): MenuTableRow[] {
    return menus.map((menu) => ({
      id: menu.id,
      title: menu.title,
      path: menu.path,
      parentTitle: menu.parent ? menu.parent.title : '-',
      sortOrder: menu.sortOrder,
      icon: menu.icon,
    }));
  }

  fetchAllMenus() {
    this.menuServise.retriveAllMenus().subscribe({
      next: (menuresponse: MenuItem[]) => {
        this.loading = false;
        this.allMenus = menuresponse;
        this.parentMenus = menuresponse.filter((m) => m.parent === null);

        this.dataSource.data = this.mapToTableRows(this.allMenus);
        console.log('All Menus: ', this.allMenus);
        console.log('Data Source: ', this.dataSource.data);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 403) {
          this.toastService.showMsg('error', 'Fetch All Menu error', 'bottom-center');
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  addMenu() {
    this.menuForm.reset({
      title: '',
      path: '',
      parentId: null,
      sortOrder: 1,
      icon: '',
    });

    this.dialogRef = this.dialog.open(this.addMenuDialog, {
      width: '400px',
      disableClose: true,
    });
  }

  saveMenu() {
    if (!this.menuForm.valid) {
      this.menuForm.markAllAsTouched();
      this.toastService.showMsg('warning', 'Enter mandatory details');
      return;
    }

    this.loading = true;

    const payload = {
      title: this.menuForm.value.title,
      Path: this.menuForm.value.path,
      parentId: this.menuForm.value.parentId,
      sortOrder: this.menuForm.value.sortOrder,
      icon: this.menuForm.value.icon,
    };

    console.log('Menu Payload: ', payload);
    this.menuServise.createMenu(payload).subscribe({
      next: () => {
        this.toastService.showMsg('success', 'Menu created successfully');
        this.closeDialog();
        this.fetchAllMenus();
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 400) {
          this.toastService.showMsg(
            'error',
            'Menu already exists. Please use a different title or path.',
            'bottom-center'
          );
        }
        if (error.status === 403) {
          this.toastService.showMsg('error', 'Failed to create menu', 'bottom-center');
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
}
