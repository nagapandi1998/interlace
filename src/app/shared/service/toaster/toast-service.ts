import { Injectable } from '@angular/core';
import { HotToastService, ToastOptions } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: HotToastService) {}

  showMsg(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    position:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right' = 'top-center',
    duration: number = 4000
  ) {
    const config: ToastOptions<unknown> = {
      position,
      duration,
    };

    switch (type) {
      case 'success':
        return this.toast.success(message, config);
      case 'error':
        return this.toast.error(message, config);
      case 'info':
        return this.toast.info(message, config);
      case 'warning':
        return this.toast.warning(message, config);
      default:
        return this.toast.show(message, config);
    }
  }
}
