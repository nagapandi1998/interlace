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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Loader } from '../../../shared/components/loader/loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MenuService } from '../../../shared/service/menu/menu.service';
import { ToastService } from '../../../shared/service/toaster/toast-service';
import { DeleteDialog } from '../../../shared/components/dialog/delete-dialog/delete-dialog';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';

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
  selector: 'app-menu',
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
    MatAutocompleteModule,
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
    'folder_special',
    'edit',
    'list_alt',
    'create_new_folder',
    'description',
    'verified_user',
    'people_alt',

  ];
  filteredIcons: string[] = [...this.icons];
  dataSource = new MatTableDataSource<MenuTableRow>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('addMenuDialog') addMenuDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  isUpdate = false;

  constructor(
    private menuServise: MenuService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {
    this.initMenuForm();
    this.fetchAllMenus();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initMenuForm() {
    this.menuForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      path: ['', Validators.required],
      parentId: [null],
      sortOrder: [1, Validators.required],
      icon: ['', Validators.required],
    });
  }

  filterIcons(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredIcons = this.icons.filter(icon => icon.toLowerCase().includes(filterValue));
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
          this.dataSource.sort = this.sort;
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

  openMenuDialog(content: TemplateRef<any>, update: boolean, row?: MenuTableRow) {
    this.isUpdate = update;

    if (!this.isUpdate) {
      // Add mode — reset form
      this.menuForm.reset({
        id: '',
        title: '',
        path: '',
        parentId: null,
        sortOrder: 1,
        icon: '',
      });
    } else if (row) {
      // Edit mode — set form values
      const parentId = this.allMenus.find((m) => m.title === row.parentTitle)?.id ?? null;

      this.menuForm.setValue({
        id: row.id,
        title: row.title,
        path: row.path,
        parentId: parentId,
        sortOrder: row.sortOrder,
        icon: row.icon,
      });
    }

    this.dialogRef = this.dialog.open(content, {
      width: '400px',
      disableClose: true,
    });
  }

  deleteMenu(menu: MenuTableRow) {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '400px',
      disableClose: true,
      data: {
        message: `Are you sure you want to delete menu "${menu.title}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      console.log('Delete confirmed:', confirmed);

      if (confirmed !== true) {
        return;
      }

      this.loading = true;

      this.menuServise.deleteMenu(menu.id).subscribe({
        next: () => {
          this.toastService.showMsg('success', 'Menu deleted successfully');
          this.fetchAllMenus();
          this.loading = false;
        },
        error: () => {
          this.toastService.showMsg('error', 'Failed to delete menu', 'bottom-center');
          this.loading = false;
        },
      });
    });
  }

  submitMenu() {
    if (!this.menuForm.valid) {
      this.menuForm.markAllAsTouched();
      this.toastService.showMsg('warning', 'Enter mandatory details');
      return;
    }

    this.loading = true;
    if (!this.isUpdate) {
      this.insertMenuEntry();
    } else {
      this.updateMenuEntry();
    }
  }

  insertMenuEntry() {
    let menuData = {
      title: this.menuForm.controls['title'].value,
      path: this.menuForm.controls['path'].value,
      parentId: this.menuForm.controls['parentId'].value,
      sortOrder: this.menuForm.controls['sortOrder'].value,
      icon: this.menuForm.controls['icon'].value,
    };

    this.menuServise.createMenu(menuData).subscribe({
      next: () => {
        this.toastService.showMsg('success', 'Menu created successfully');
        this.closeDialog();
        this.fetchAllMenus();
        this.menuServise.retriveMenuByUser() //update menu in the sidebar
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

  updateMenuEntry() {
    let menuData = {
      id: this.menuForm.controls['id'].value,
      title: this.menuForm.controls['title'].value,
      path: this.menuForm.controls['path'].value,
      parentId: this.menuForm.controls['parentId'].value,
      sortOrder: this.menuForm.controls['sortOrder'].value,
      icon: this.menuForm.controls['icon'].value,
    };

    this.menuServise.updateMenu(menuData).subscribe({
      next: () => {
        this.toastService.showMsg('success', 'Menu updated successfully');
        this.closeDialog();
        this.fetchAllMenus();
        this.menuServise.retriveMenuByUser() //update menu in the sidebar
        this.loading = false;
        this.isUpdate = false;
      },
      error: (error) => {
        this.toastService.showMsg('error', 'Failed to update menu', 'bottom-center');
        this.loading = false;
      },
    });
  }
}
