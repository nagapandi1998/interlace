import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  constructor(private router: Router, private route: ActivatedRoute) {}

  getBreadcrumb() {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith('INIT'),
      map(() => {
        let current = this.route.root;
        let breadcrumb = '';

        while (current.firstChild) {
          current = current.firstChild;
          if (current.snapshot.data['breadcrumb']) {
            breadcrumb = current.snapshot.data['breadcrumb'];
          }
        }

        return breadcrumb;
      })
    );
  }
}
