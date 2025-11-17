import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-layout',
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
    Header,
    Footer,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  isSidebarOpen = true;
  isMobile = window.innerWidth <= 768;

  // Track open state per menu
  openMenus: { [key: string]: boolean } = {};

  // Dynamic menu structure
  menus: MenuItem[] = [
  {
    key: 'employee',
    label: 'Employees',
    icon: 'people_alt',
    children: [
      {
        key: 'allEmployees',
        label: 'All Employees',
        route: '/home',
        icon: 'list_alt'
      },
      {
        key: 'addEmployee',
        label: 'Add Employees',
        icon: 'person_add',
        children: [
          {
            key: 'uiLibrary',
            label: 'UI Library',
            icon: 'integration_instructions',
            children: [
              {
                key: 'materialForm',
                label: 'Angular Material',
                route: '/materialform',
                icon: 'widgets'
              },
              {
                key: 'ngBootstrap',
                label: 'Ng Bootstrap',
                route: '/bootstrapform',
                icon: 'grid_view'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'case',
    label: 'Court Case',
    icon: 'folder_special',
    children: [
      {
        key: 'allCases',
        label: 'All Cases',
        route: '/allcases',
        icon: 'folder_open'
      },
      {
        key: 'caseCreation',
        label: 'Case Creation',
        route: '/casecreation',
        icon: 'create_new_folder'
      }
    ]
  }
];


  constructor(private router: Router) {}

  ngOnInit() {
    // Close sidebar on mobile by default
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }

    // Auto-close sidebar on mobile when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.isSidebarOpen = false;
        }
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMenu(menuKey: string): void {
    this.openMenus[menuKey] = !this.openMenus[menuKey];
  }

  // Enhanced toggle with sidebar state management
  onSidebarToggle(): void {
    this.toggleSidebar();
    // Close all menus when sidebar collapses
    if (!this.isSidebarOpen) {
      this.openMenus = {};
    }
  }

  // Check if menu has children
  hasChildren(menu: MenuItem): boolean {
    return !!menu.children && menu.children.length > 0;
  }

  // Check if menu is active based on route
  isMenuActive(menu: MenuItem): boolean {
    if (menu.route) {
      return this.router.isActive(menu.route, false);
    }
    if (menu.children) {
      return menu.children.some(child => this.isMenuActive(child));
    }
    return false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = (event.target as Window).innerWidth <= 768;
    // Auto-manage sidebar state based on screen size
    if (!this.isMobile) {
      this.isSidebarOpen = true;
    } else {
      this.isSidebarOpen = false;
    }
  }
}