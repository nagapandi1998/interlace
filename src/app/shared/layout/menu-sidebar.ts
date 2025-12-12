import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterOutlet, RouterLink, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { MenuService } from '../service/menu/menu.service';
import { BreadcrumbComponent } from '../components/breadcrumb.component/breadcrumb.component';
import { ToastService } from '../service/toaster/toast-service';
import { Loader } from '../components/loader/loader';

interface MenuItem {
  id: number;
  title: string;
  path?: string;
  icon?: string | null;
  children?: MenuItem[];
  allowed?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    MatTooltipModule,
    Header,
    Footer,
    BreadcrumbComponent,
    Loader,
  ],
  templateUrl: './menu-sidebar.html',
  styleUrl: './menu-sidebar.scss',
  animations: [
    trigger('sidebarWidth', [
      state('full', style({ width: '290px' })),
      state('slim', style({ width: '70px' })),
      transition('full <=> slim', animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
    trigger('fadeLabel', [
      state('visible', style({ opacity: 1, display: 'inline' })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('visible <=> hidden', animate('200ms ease')),
    ]),
  ],
})
export class MenuSidebar implements OnInit {
  // isSidebarOpen = true;
  isSlim = false;
  isMobile = window.innerWidth <= 768;
  openMenus: { [id: number]: boolean } = {};
  loading = false;
  // menu structure
  menus: MenuItem[] = [];

  constructor(
    private router: Router,
    private menuServise: MenuService,
    private toastService: ToastService
  ) {
    this.fetchMenuByUser();
  }

  fetchMenuByUser() {
    this.menuServise.retriveMenuByUser().subscribe({
      next: (menuresponse) => {
        this.loading = false;
        this.menus = menuresponse;

        console.log('Menus loaded: ', this.menus);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 403) {
          this.toastService.showMsg('error', 'Fetch Menu error', 'bottom-center');
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

  ngOnInit() {
    if (this.isMobile) {
      this.isSlim = true;
    }

    this.router.events.pipe(filter((ev) => ev instanceof NavigationEnd)).subscribe(() => {
      if (this.isMobile) {
        this.isSlim = true;
        this.openMenus = {};
      }
    });
  }

  toggleSidebarMode() {
    this.isSlim = !this.isSlim;

    if (this.isSlim) {
      this.openMenus = {};
    }
  }

toggleMenu(id: number) {
  if (this.isSlim) return;

  // Close all other menus except the clicked one
  Object.keys(this.openMenus).forEach((key) => {
    if (Number(key) !== id) {
      this.openMenus[Number(key)] = false;
    }
  });

  // Toggle the clicked one
  this.openMenus[id] = !this.openMenus[id];
}

  hasChildren(item: MenuItem) {
    return item.children && item.children.length > 0;
  }

  isMenuActive(menu: MenuItem): boolean {
    if (menu.path)
      return this.router.isActive(menu.path, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
    return menu.children?.some((child) => this.isMenuActive(child)) || false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.isMobile = (e.target as Window).innerWidth <= 768;
    if (this.isMobile) this.isSlim = true;
  }
}
