import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private refreshSidebarMenus = new Subject<void>();
  refreshMenu$ = this.refreshSidebarMenus.asObservable();
  menuURL = environment.menuUrl;

  constructor(private http: HttpClient) {}

  retriveAllMenus(): Observable<any> {
    return this.http.get<any>(this.menuURL);
  }

  retriveMenuByUser(): Observable<any> {
    return this.http.get<any>(`${this.menuURL}/user`);
  }

  createMenu(menuData: any): Observable<any> {
    return this.http.post<any>(this.menuURL, menuData);
  }

  updateMenu(menuData: any): Observable<any> {
    return this.http.put<any>(`${this.menuURL}/${menuData.id}`, menuData);
  }

  deleteMenu(id: number): Observable<any> {
    return this.http.delete<any>(`${this.menuURL}/${id}`);
  }

  refreshSidebarMenu() {
    this.refreshSidebarMenus.next();
  }
}
