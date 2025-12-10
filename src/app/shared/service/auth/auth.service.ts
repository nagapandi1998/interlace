import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = environment.authUrl;

  constructor(private http: HttpClient) {}

  verifyUser(logindata: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, logindata);
  }
}
