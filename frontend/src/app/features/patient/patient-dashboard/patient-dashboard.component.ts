import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';
import { AppointmentTableComponent } from '../../../shared/components/appointment-table/appointment-table.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PortalHeaderComponent } from '../../../shared/components/portal-header/portal-header.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppointmentTableComponent,
    ConfirmModalComponent,
    PortalHeaderComponent
  ],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  currentUser$ = this.authService.currentUser$;
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading: boolean = true;
  selectedStatus: string = 'todas';

  // Modal de cancelación
  cancelModalOpen: boolean = false;
  selectedAppointmentToCancel: Appointment | null = null;

  // Modal de detalle
  detailModalOpen: boolean = false;
  selectedAppointmentDetail: Appointment | null = null;

  get confirmedCount(): number {
    return this.appointments.filter(a => a.status === 'confirmada').length;
  }

  get attendedCount(): number {
    return this.appointments.filter(a => a.status === 'atendida').length;
  }

  get cancelledCount(): number {
    return this.appointments.filter(a => a.status === 'cancelada').length;
  }

  get nextAppointment(): Appointment | null {
    const confirmed = this.appointments
      .filter(a => a.status === 'confirmada')
      .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date));
    return confirmed.length > 0 ? confirmed[0] : null;
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Error al cargar el historial de citas.');
      }
    });
  }

  onFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedStatus === 'todas') {
      this.filteredAppointments = [...this.appointments];
    } else {
      this.filteredAppointments = this.appointments.filter(a => a.status === this.selectedStatus);
    }
  }

  openCancelModal(app: Appointment): void {
    this.selectedAppointmentToCancel = app;
    this.cancelModalOpen = true;
  }

  confirmCancellation(reason: string): void {
    if (!this.selectedAppointmentToCancel) return;

    this.appointmentService.cancelAppointment(this.selectedAppointmentToCancel.id, reason).subscribe({
      next: () => {
        this.cancelModalOpen = false;
        this.selectedAppointmentToCancel = null;
        this.notificationService.success('La cita médica fue cancelada correctamente.');
        this.loadAppointments();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Error al cancelar la cita.');
      }
    });
  }

  openDetailModal(app: Appointment): void {
    this.selectedAppointmentDetail = app;
    this.detailModalOpen = true;
  }
}
