import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuUserURL = environment.menuUserUrl;

  constructor(private http: HttpClient) {}

  retriveMenuByUser(): Observable<any> {
    return this.http.get<any>(this.menuUserURL);
  }
}
