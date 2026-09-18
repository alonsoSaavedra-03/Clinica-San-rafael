import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-banner.component.html',
  styleUrls: ['./alert-banner.component.css']
})
export class AlertBannerComponent {
  notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
