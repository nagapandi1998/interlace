import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  userURL = environment.userUrl;

  constructor(private http: HttpClient) {}

  retriveAllUsers(): Observable<any> {
    return this.http.get<any>(this.userURL);
  }

    createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.userURL, userData);
  }
}
