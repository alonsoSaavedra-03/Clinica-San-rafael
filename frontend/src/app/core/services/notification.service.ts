import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  public notifications$: Observable<AppNotification[]> = this.notificationsSubject.asObservable();

  show(notification: Omit<AppNotification, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const item: AppNotification = { ...notification, id };
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...current, item]);

    const duration = notification.duration !== undefined ? notification.duration : 4500;
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  success(message: string, title: string = 'Operación Exitosa'): void {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title: string = 'Atención'): void {
    this.show({ type: 'error', title, message, duration: 6000 });
  }

  info(message: string, title: string = 'Información'): void {
    this.show({ type: 'info', title, message });
  }

  warning(message: string, title: string = 'Aviso'): void {
    this.show({ type: 'warning', title, message });
  }

  confirm(title: string, text: string, confirmText: string = 'Sí, continuar', isDanger: boolean = false): Promise<boolean> {
    return Swal.fire({
      title: `<span style="font-family: var(--font-heading); font-weight: 800; color: #1B365D;">${title}</span>`,
      text,
      icon: isDanger ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: isDanger ? '#E63946' : '#1B365D',
      cancelButtonColor: '#64748B',
      reverseButtons: true,
      background: '#FFFFFF',
      customClass: {
        confirmButton: 'btn-swal-confirm',
        cancelButton: 'btn-swal-cancel'
      }
    }).then(result => result.isConfirmed);
  }

  dismiss(id: string): void {
    const current = this.notificationsSubject.getValue().filter(n => n.id !== id);
    this.notificationsSubject.next(current);
  }
}

