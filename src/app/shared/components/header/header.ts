import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  showDropdown: boolean = false;
@Input() sidebarOpen: boolean = true;

  constructor(private authService: AuthService ,private router: Router) {}

  close() {
    this.showDropdown = false;
  }

  changePassword(){
    this.router.navigate(['/auth/changepassword']);
  }

  logout() {
   this.authService.logout();
  }
}
