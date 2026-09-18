import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService, ClinicStats } from '../../../core/services/appointment.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Appointment } from '../../../core/models/appointment.model';
import { Doctor } from '../../../core/models/doctor.model';
import { User } from '../../../core/models/user.model';
import { AppointmentTableComponent } from '../../../shared/components/appointment-table/appointment-table.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PortalHeaderComponent } from '../../../shared/components/portal-header/portal-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppointmentTableComponent,
    ConfirmModalComponent,
    PortalHeaderComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private mockData = inject(MockDataService);
  private notificationService = inject(NotificationService);

  stats: ClinicStats | null = null;
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  doctors: Doctor[] = [];
  users: User[] = [];

  activeTab: 'citas' | 'medicos' | 'usuarios' = 'citas';
  selectedStatus: string = 'todas';
  selectedDate: string = '';
  loading: boolean = true;

  cancelModalOpen: boolean = false;
  selectedAppointmentToCancel: Appointment | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.appointmentService.getStats().subscribe(s => this.stats = s);

    this.appointmentService.getAppointments().subscribe(apps => {
      this.appointments = apps;
      this.applyFilter();
      this.loading = false;
    });

    this.doctorService.getDoctors().subscribe(docs => this.doctors = docs);
    this.users = this.mockData.getUsers();
  }

  onFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  getCountByStatus(status: string): number {
    return this.appointments.filter(a => a.status === status).length;
  }

  onDateFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.applyFilter();
  }

  clearDateFilter(): void {
    this.selectedDate = '';
    this.applyFilter();
  }

  applyFilter(): void {
    let list = [...this.appointments];

    if (this.selectedStatus !== 'todas') {
      list = list.filter(a => a.status === this.selectedStatus);
    }

    if (this.selectedDate) {
      list = list.filter(a => a.appointment_date === this.selectedDate);
    }

    this.filteredAppointments = list;
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
        this.notificationService.warning('Cita cancelada administrativamente.');
        this.loadData();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Error al cancelar la cita.');
      }
    });
  }
}
