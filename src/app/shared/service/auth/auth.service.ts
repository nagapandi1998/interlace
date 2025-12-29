import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../toaster/toast-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = environment.authUrl;

  constructor(private http: HttpClient, private router: Router, private toastService: ToastService) {}

  verifyUser(logindata: any): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/login`, logindata);
  }

  refreshToken(tokenData: any): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/refresh`, tokenData);
  }

  changePassword(changepassdata: any): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/change-password`, changepassdata);
  }

  logout(): void {
    const sessionData = sessionStorage.getItem('loginuser');
    const tokens = sessionData ? JSON.parse(sessionData) : null;

    const tokenData = {
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken,
    };

    this.http.post(`${this.loginUrl}/logout`, tokenData).subscribe({
      next: () => {
        this.toastService.showMsg('success', 'Logged out successfully.');
        this.clearSession();

      },
      error: () => {
        this.toastService.showMsg('error', 'Error during logout. Clearing session.');
        this.clearSession();
      },
    });
  }
  
  clearSession(): void {
    sessionStorage.clear();
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}
