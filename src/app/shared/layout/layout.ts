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
import { BreadcrumbComponent } from '../components/breadcrumb.component/breadcrumb.component';
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
    Loader,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
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
        }),
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        }),
      ),
      transition('expanded <=> collapsed', animate('300ms ease')),
    ]),
  ],
})
export class Layout implements OnInit {
  // isSidebarOpen = true;
  isSlim = false;
  isMobile = window.innerWidth <= 768;
  openMenus: { [id: number]: boolean } = {};
  loading = false;

  // menu structure
  menus: MenuItem[] = [
    //     {
    //   key: 'dashboard',
    //   label: 'Dashboard',
    //   icon: 'dashboard',
    //   route: '/home',
    // },
    {
      id: 1,
      title: 'Court Case',
      path: '/courtcase',
      icon: 'folder_special',
      children: [
        {
          id: 1,
          title: 'All Cases',
          path: '/allcases',
          icon: 'folder_open',
        },
        {
          id: 2,
          title: 'Case Creation',
          path: '/casecreation',
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
      id: 2,
      title: 'Text Editor',
      path: '/texteditor',
      icon: 'description',
      children: [
        // {
        //   key: 'TinyMCEEditor',
        //   label: 'TinyMCE Editor',
        //   route: '/tinytexteditor',
        //   icon: 'editor',
        // },
        {
          id: 1,
          title: 'Editor',
          path: '/texteditor',
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
