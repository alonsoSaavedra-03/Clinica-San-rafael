import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  clinicName = environment.clinicName;
  clinicPhone = environment.clinicPhone;
  clinicEmergency = environment.clinicEmergency;

  currentUser$ = this.authService.currentUser$;
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  getDashboardRoute(role?: string): string {
    switch (role) {
      case 'medico':
        return '/doctor/dashboard';
      case 'administrador':
        return '/admin/dashboard';
      case 'paciente':
      default:
        return '/patient/dashboard';
    }
  }

  getDashboardLabel(role?: string): string {
    switch (role) {
      case 'medico':
        return 'Mi Agenda';
      case 'administrador':
        return 'Panel Admin';
      case 'paciente':
      default:
        return 'Mis Citas';
    }
  }

  switchRole(role: UserRole): void {
    this.authService.switchDemoUser(role);
    this.closeMobileMenu();
    if (role === 'paciente') {
      this.router.navigate(['/patient/dashboard']);
    } else if (role === 'medico') {
      this.router.navigate(['/doctor/dashboard']);
    } else if (role === 'administrador') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
