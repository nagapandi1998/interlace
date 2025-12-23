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
  parentId?: number | null;
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
  // animations: [
  //   trigger('sidebarWidth', [
  //     state('full', style({ width: '290px' })),
  //     state('slim', style({ width: '70px' })),
  //     transition('full <=> slim', animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  //   ]),
  //   trigger('fadeLabel', [
  //     state('visible', style({ opacity: 1, display: 'inline' })),
  //     state('hidden', style({ opacity: 0, display: 'none' })),
  //     transition('visible <=> hidden', animate('200ms ease')),
  //   ]),
  // ],
  animations: [
    // SIDEBAR WIDTH ANIMATION
    trigger('sidebarWidth', [
      state('full', style({ width: '290px' })),
      state('slim', style({ width: '80px' })),
      transition('full <=> slim', animate('350ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),

    // SUB MENU EXPAND / COLLAPSE
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('expanded <=> collapsed', animate('300ms ease')),
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
    this.menus = [
      {
        id: 1,
        title: 'Admin',
        path: '/admin',
        icon: 'admin_panel_settings',
        children: [
          {
            id: 2,
            title: 'Users',
            path: '/admin/users',
            icon: 'group',
            children: [],
            allowed: true,
            parentId: 1,
          },
          {
            id: 3,
            title: 'Manage Users',
            path: '/admin/users/manage',
            icon: 'manage_accounts',
            children: [],
            allowed: true,
            parentId: 1,
          },
        ],
        allowed: true,
        parentId: null,
      },
      {
        id: 4,
        title: 'Court Case',
        path: '/courtcase',
        icon: 'folder_special',
        children: [
          {
            id: 5,
            title: 'All Cases',
            path: '/courtcase/allcases',
            icon: 'folder_open',
            children: [],
            allowed: true,
            parentId: 4,
          },
          {
            id: 6,
            title: 'Case Creation',
            path: '/courtcase/casecreation',
            icon: 'create_new_folder',
            children: [],
            allowed: true,
            parentId: 4,
          },
        ],
        allowed: true,
        parentId: null,
      },
      {
        id: 7,
        title: 'Text Editor',
        path: '/texteditor',
        icon: 'edit',
        children: [
          {
            id: 8,
            title: 'Editor',
            path: '/texteditor/editor',
            icon: 'description',
            children: [],
            allowed: true,
            parentId: 7,
          },
        ],
        allowed: true,
        parentId: null,
      },
      {
        id: 9,
        title: 'Master',
        path: '/master',
        icon: 'settings',
        children: [
          {
            id: 10,
            title: 'Menu',
            path: '/master/menu',
            icon: 'view_list',
            children: [],
            allowed: true,
            parentId: 9,
          },
        ],
        allowed: true,
        parentId: null,
      },
    ];
  }

  ngOnInit() {
    if (this.isMobile) {
      this.isSlim = true;
    }

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.menus.forEach((menu) => {
        if (menu.children && this.isParentActive(menu)) {
          this.openMenus[menu.id] = true;
        }
      });
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

  // isMenuActive(menu: MenuItem): boolean {
  //   if (menu.path)
  //     return this.router.isActive(menu.path, {
  //       paths: 'exact',
  //       queryParams: 'ignored',
  //       fragment: 'ignored',
  //       matrixParams: 'ignored',
  //     });
  //   return menu.children?.some((child) => this.isMenuActive(child)) || false;
  // }

  isMenuActive(menu: MenuItem): boolean {
    if (!menu.path) return false;

    return this.router.isActive(menu.path, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  isParentActive(menu: MenuItem): boolean {
    if (!menu.children) return false;

    return menu.children.some((child) => child.path && this.router.url.startsWith(child.path));
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.isMobile = (e.target as Window).innerWidth <= 768;
    if (this.isMobile) this.isSlim = true;
  }
}
