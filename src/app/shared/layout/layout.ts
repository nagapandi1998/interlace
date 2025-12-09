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
import { BreadcrumbComponent } from '../components/breadcrumb.component/breadcrumb.component';

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
    BreadcrumbComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  // isSidebarOpen = true;
  isSlim = false;
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
    // {
    //   key: 'employee',
    //   label: 'Employees',
    //   icon: 'people_alt',
    //   children: [
    //     {
    //       key: 'allEmployees',
    //       label: 'All Employees',
    //       route: '/home',
    //       icon: 'list_alt',
    //     },
    //     {
    //       key: 'addEmployee',
    //       label: 'Add Employees',
    //       icon: 'person_add',
    //       children: [
    //         {
    //           key: 'uiLibrary',
    //           label: 'UI Library',
    //           icon: 'integration_instructions',
    //           children: [
    //             {
    //               key: 'materialForm',
    //               label: 'Angular Material',
    //               route: '/materialform',
    //               icon: 'widgets',
    //             },
    //             {
    //               key: 'ngBootstrap',
    //               label: 'Ng Bootstrap',
    //               route: '/bootstrapform',
    //               icon: 'grid_view',
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      key: 'textEditor',
      label: 'Text Editor',
      icon: 'description',
      children: [
        // {
        //   key: 'TinyMCEEditor',
        //   label: 'TinyMCE Editor',
        //   route: '/tinytexteditor',
        //   icon: 'editor',
        // },
        {
          key: 'textEditor',
          label: 'Superdoc Editor',
          route: '/texteditor',
          icon: 'edit',
        },
      ],
    },
  ];

  constructor(private router: Router) {}

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

  toggleMenu(key: string) {
    if (this.isSlim) return;
    this.openMenus[key] = !this.openMenus[key];
  }

  hasChildren(item: MenuItem) {
    return item.children && item.children.length > 0;
  }

  isMenuActive(menu: MenuItem): boolean {
    if (menu.route)
      return this.router.isActive(menu.route, {
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
