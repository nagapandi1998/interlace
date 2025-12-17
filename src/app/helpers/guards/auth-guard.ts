import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!sessionStorage.getItem('loginuser');

  if (!isLoggedIn) {
    router.navigate(['/auth/login'], {
      replaceUrl: true,
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
