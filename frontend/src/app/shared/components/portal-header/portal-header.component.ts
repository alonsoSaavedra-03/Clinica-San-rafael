import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portal-header.component.html',
  styleUrls: ['./portal-header.component.css']
})
export class PortalHeaderComponent {
  @Input() portalTitle: string = 'Portal del Paciente';
  @Input() portalSubtitle: string = 'Salud Rápida S.A.';

  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  currentUser$ = this.authService.currentUser$;
  clinicName = environment.clinicName;

  async logout(): Promise<void> {
    const confirmed = await this.notificationService.confirm(
      '¿Cerrar Sesión?',
      'Se cerrará tu sesión activa en el portal de Clínica San Rafael.',
      'Sí, Salir',
      true
    );

    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
