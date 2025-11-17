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
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
    Header,
    Footer,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  isSidebarOpen = true;
  isMobile = window.innerWidth <= 768;
  openMenus: { [key: string]: boolean } = {};

  // menu structure
  menus: MenuItem[] = [
    //     {
    //   key: 'dashboard',
    //   label: 'Dashboard',
    //   icon: 'dashboard',
    //   route: '/home',
    // },
    {
      key: 'employee',
      label: 'Employees',
      icon: 'people_alt',
      children: [
        {
          key: 'allEmployees',
          label: 'All Employees',
          route: '/home',
          icon: 'list_alt',
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
                  icon: 'widgets',
                },
                {
                  key: 'ngBootstrap',
                  label: 'Ng Bootstrap',
                  route: '/bootstrapform',
                  icon: 'grid_view',
                },
              ],
            },
          ],
        },
      ],
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
          icon: 'folder_open',
        },
        {
          key: 'caseCreation',
          label: 'Case Creation',
          route: '/casecreation',
          icon: 'create_new_folder',
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private getAllDescendantKeys(menu: MenuItem): string[] {
    const keys: string[] = [menu.key];

    if (menu.children) {
      menu.children.forEach((child) => {
        keys.push(...this.getAllDescendantKeys(child));
      });
    }

    return keys;
  }

  toggleMenu(menuKey: string, level: number = 1) {
    const isAlreadyOpen = this.openMenus[menuKey];

    if (level === 1) {
      this.menus.forEach((menu) => {
        if (menu.key !== menuKey) {
          this.openMenus[menu.key] = false;

          const allChildKeys = this.getAllDescendantKeys(menu);
          allChildKeys.forEach((key) => (this.openMenus[key] = false));
        }
      });
    }

    this.openMenus[menuKey] = !isAlreadyOpen;
  }

  onSidebarToggle(): void {
    this.toggleSidebar();
    if (!this.isSidebarOpen) {
      this.openMenus = {};
    }
  }

  hasChildren(menu: MenuItem): boolean {
    return !!menu.children && menu.children.length > 0;
  }

  isMenuActive(menu: MenuItem): boolean {
    if (menu.route) {
      return this.router.isActive(menu.route, false);
    }
    if (menu.children) {
      return menu.children.some((child) => this.isMenuActive(child));
    }
    return false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = (event.target as Window).innerWidth <= 768;
    if (!this.isMobile) {
      this.isSidebarOpen = true;
    } else {
      this.isSidebarOpen = false;
    }
  }
}
