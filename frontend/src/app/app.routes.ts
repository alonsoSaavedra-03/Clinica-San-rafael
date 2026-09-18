import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { BookingWizardComponent } from './features/appointments/booking-wizard/booking-wizard.component';
import { SpecialtiesComponent } from './features/specialties/specialties.component';
import { DoctorsComponent } from './features/doctors/doctors.component';
import { PatientDashboardComponent } from './features/patient/patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './features/doctor/doctor-dashboard/doctor-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AuthService } from './core/services/auth.service';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

const dashboardRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUserValue;

  if (!user) {
    return router.parseUrl('/login');
  }
  if (user.role === 'medico') {
    return router.parseUrl('/doctor/dashboard');
  }
  if (user.role === 'administrador') {
    return router.parseUrl('/admin/dashboard');
  }
  return router.parseUrl('/patient/dashboard');
};

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Salud Rápida S.A. — Sistema de Citas Médicas' },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión — Salud Rápida S.A.' },
  { path: 'register', component: RegisterComponent, title: 'Registro de Pacientes — Salud Rápida S.A.' },
  { path: 'booking', component: BookingWizardComponent, title: 'Reserva de Citas — Salud Rápida S.A.' },
  { path: 'especialidades', component: SpecialtiesComponent, title: 'Especialidades Médicas — Clínica San Rafael' },
  { path: 'medicos', component: DoctorsComponent, title: 'Staff Médico — Clínica San Rafael' },
  {
    path: 'dashboard',
    canActivate: [dashboardRedirectGuard],
    children: []
  },
  {
    path: 'patient/dashboard',
    component: PatientDashboardComponent,
    canActivate: [authGuard, roleGuard(['paciente', 'administrador'])],
    title: 'Portal del Paciente — Salud Rápida S.A.'
  },
  {
    path: 'doctor/dashboard',
    component: DoctorDashboardComponent,
    canActivate: [authGuard, roleGuard(['medico', 'administrador'])],
    title: 'Agenda Médica — Salud Rápida S.A.'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard(['administrador'])],
    title: 'Panel Administrativo — Salud Rápida S.A.'
  },
  { path: '**', redirectTo: '' }
];
