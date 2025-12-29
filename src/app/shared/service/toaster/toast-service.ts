import { Injectable } from '@angular/core';
import { HotToastService, ToastOptions } from '@ngxpert/hot-toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toast: HotToastService) {}

  private baseOptions: ToastOptions<unknown> = {
    duration: 4000,
    dismissible: true,
    className: 'sonner-toast',
    style: {
      padding: '16px',
      background: 'white',
      color: 'hsl(0, 0%, 9%)',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid hsl(0, 0%, 93%)',
      borderRadius: '8px',
      fontSize: '13px',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial',
    },
  };

  private withPosition(position: ToastPosition): ToastOptions<unknown> {
    return {
      ...this.baseOptions,
      position,
    };
  }

  success(message: string, position: ToastPosition) {
    return this.toast.success(message, {
      ...this.withPosition(position),
      iconTheme: {
        primary: 'hsl(140, 100%, 27%)',
        secondary: 'white',
      },
      style: {
        ...this.baseOptions.style,
        background: 'hsl(143, 85%, 96%)',
        borderColor: 'hsl(145, 92%, 87%)',
        color: 'hsl(140, 100%, 27%)',
      },
    });
  }

  error(message: string, position: ToastPosition) {
    return this.toast.error(message, {
      ...this.withPosition(position),
      iconTheme: {
        primary: 'hsl(360, 100%, 45%)',
        secondary: 'white',
      },
      style: {
        ...this.baseOptions.style,
        background: 'hsl(359, 100%, 97%)',
        borderColor: 'hsl(359, 100%, 94%)',
        color: 'hsl(360, 100%, 45%)',
      },
    });
  }

  info(message: string, position: ToastPosition) {
    return this.toast.info(message, {
      ...this.withPosition(position),
      iconTheme: {
        primary: 'hsl(210, 92%, 45%)',
        secondary: 'white',
      },
      style: {
        ...this.baseOptions.style,
        background: 'hsl(208, 100%, 97%)',
        borderColor: 'hsl(221, 91%, 93%)',
        color: 'hsl(210, 92%, 45%)',
      },
    });
  }

  warning(message: string, position: ToastPosition) {
    return this.toast.warning(message, {
      ...this.withPosition(position),
      iconTheme: {
        primary: 'hsl(31, 92%, 45%)',
        secondary: 'white',
      },
      style: {
        ...this.baseOptions.style,
        background: 'hsl(49, 100%, 97%)',
        borderColor: 'hsl(49, 91%, 84%)',
        color: 'hsl(31, 92%, 45%)',
      },
    });
  }

  showMsg(type: ToastType, message: string, position: ToastPosition = 'top-center') {
    switch (type) {
      case 'success':
        return this.success(message, position);
      case 'error':
        return this.error(message, position);
      case 'info':
        return this.info(message, position);
      case 'warning':
        return this.warning(message, position);
    }
  }
}
