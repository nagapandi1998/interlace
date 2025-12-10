import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbService } from '../../service/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  breadcrumb$: any;
  constructor(private breadcrumbService: BreadcrumbService) {
    this.getBreadcrumb();
  }

  getBreadcrumb() {
    this.breadcrumb$ = this.breadcrumbService.getBreadcrumb();
  }
}
