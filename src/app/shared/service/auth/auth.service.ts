import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = environment.authUrl;

  constructor(private http: HttpClient, private router: Router) {}

  verifyUser(logindata: any): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/login`, logindata);
  }

  refreshToken(tokenData: any): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/refresh`, tokenData);
  }

  changePassword(changepassdata: any): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/change-password`, changepassdata);
  }

  logout() {
    sessionStorage.clear();

    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }
}
