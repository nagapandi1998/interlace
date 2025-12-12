import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userSessionData = sessionStorage.getItem('loginuser');
  let accessToken: string | null = null;

  if (userSessionData) {
    try {
      const parsedUserData = JSON.parse(userSessionData);
      accessToken = parsedUserData?.accessToken ?? null;
    } catch {
      console.error('Invalid session data in sessionStorage');
    }
  }

  const request = req.clone({
    setHeaders: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  return next(request);
};
