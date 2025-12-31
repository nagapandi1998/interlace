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

  // Attach access token if present
  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      // Ignore refresh API itself
      if (req.url.includes('/refresh')) {
        authService.logout();
        return throwError(() => err);
      }

      // Handle 401 only
      if (err.status === 401 && refreshToken) {
        // First request triggers refresh
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken({ refreshToken }).pipe(
            switchMap((res) => {
              isRefreshing = false;

              // Update BOTH tokens (important)
              user.accessToken = res.accessToken;
              user.refreshToken = res.refreshToken;
              sessionStorage.setItem('loginuser', JSON.stringify(user));

              refreshTokenSubject.next(res.accessToken);

              // Retry ORIGINAL request with NEW token
              return next(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`,
                  },
                })
              );
            }),
            catchError((error) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => error);
            })
          );
        }

        // Other requests wait for refresh to finish
        return refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
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
