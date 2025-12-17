import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuUserURL = environment.menuUrl;

  constructor(private http: HttpClient) {}

  retriveAllMenus(): Observable<any> {
    return this.http.get<any>(this.menuUserURL);
  }

  retriveMenuByUser(): Observable<any> {
    return this.http.get<any>(`${this.menuUserURL}/user`);
  }

  createMenu(menuData: any): Observable<any> {
    return this.http.post<any>(this.menuUserURL, menuData);
  }

  updateMenu( menuData: any): Observable<any> {
    return this.http.put<any>(`${this.menuUserURL}/${menuData.id}`, menuData);
  }

  deleteMenu(id: number): Observable<any> {
    return this.http.delete<any>(`${this.menuUserURL}/${id}`);
  }
}
