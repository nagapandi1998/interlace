import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../../app/shared/service/auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const sessionData = sessionStorage.getItem('loginuser');
  const user = sessionData ? JSON.parse(sessionData) : null;

  const accessToken = user?.accessToken;
  const refreshToken = user?.refreshToken;

  const authReq = accessToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (
        err.status === 401 &&
        !req.url.includes('/refresh') &&
        refreshToken
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken({ refreshToken }).pipe(
            switchMap(res => {
              isRefreshing = false;

              user.accessToken = res.accessToken;
              sessionStorage.setItem('loginuser', JSON.stringify(user));

              refreshTokenSubject.next(res.accessToken);

              return next(
                authReq.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` },
                })
              );
            }),
            catchError(error => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => error);
            })
          );
        }

        // ? WAIT for refresh to complete
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token =>
            next(
              authReq.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
              })
            )
          )
        );
      }

      return throwError(() => err);
    })
  );
};


// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const userSessionData = sessionStorage.getItem('loginuser');
//   let accessToken: string | null = null;

//   if (userSessionData) {
//     try {
//       const parsedUserData = JSON.parse(userSessionData);
//       accessToken = parsedUserData?.accessToken ?? null;
//     } catch {
//       console.error('Invalid session data in sessionStorage');
//     }
//   }

//   const request = req.clone({
//     setHeaders: {
//       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//       'Content-Type': 'application/json',
//     },
//   });

//   return next(request);
// };
