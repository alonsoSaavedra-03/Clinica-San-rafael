import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../core/models/appointment.model';
import { UserRole } from '../../../core/models/user.model';
import { DoctorNamePipe } from '../../../core/pipes/doctor-name.pipe';
import { AppointmentDatePipe } from '../../../core/pipes/appointment-date.pipe';
import { TimeSlotPipe } from '../../../core/pipes/time-slot.pipe';
import { StatusBadgePipe } from '../../../core/pipes/status-badge.pipe';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-table',
  standalone: true,
  imports: [
    CommonModule,
    DoctorNamePipe,
    AppointmentDatePipe,
    TimeSlotPipe,
    StatusBadgePipe
  ],
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.css']
})
export class AppointmentTableComponent {
  @Input({ required: true }) appointments: Appointment[] = [];
  @Input() userRole: UserRole = 'paciente';
  @Input() loading: boolean = false;

  @Output() cancel = new EventEmitter<Appointment>();
  @Output() attend = new EventEmitter<Appointment>();
  @Output() viewDetail = new EventEmitter<Appointment>();

  onCancel(app: Appointment, event?: Event): void {
    if (event) event.stopPropagation();
    this.cancel.emit(app);
  }

  onAttend(app: Appointment, event?: Event): void {
    if (event) event.stopPropagation();
    this.attend.emit(app);
  }

  onView(app: Appointment, event?: Event): void {
    if (event) event.stopPropagation();
    this.openDetailModal(app);
    this.viewDetail.emit(app);
  }

  openDetailModal(app: Appointment): void {
    const statusColor = app.status === 'confirmada' ? '#10B981' : (app.status === 'atendida' ? '#3B82F6' : '#E63946');
    const statusName = app.status === 'confirmada' ? 'Confirmada' : (app.status === 'atendida' ? 'Atendida' : 'Cancelada');
    const docName = app.doctor?.user?.name || 'Dr. Especialista';
    const specName = app.specialty?.name || 'Medicina General';
    const patientName = app.patient?.name || 'Paciente Registrado';
    const patientDni = app.patient?.dni || '72839102';
    const patientPhone = app.patient?.phone || '+51 984 567 890';
    const patientEmail = app.patient?.email || 'paciente@saludrapida.pe';

    const docAvatar = app.doctor?.avatar_url
      ? `<img src="${app.doctor.avatar_url}" style="width: 46px; height: 46px; border-radius: 12px; object-fit: cover; border: 1.5px solid #1B365D; flex-shrink: 0;" alt="${docName}">`
      : `<div style="width: 46px; height: 46px; border-radius: 12px; background: #F0F4F9; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #1B365D; flex-shrink: 0;">${docName.charAt(0)}</div>`;

    let extraNoteSection = '';
    if (app.clinical_notes) {
      const formattedLines = app.clinical_notes.split('\n').map(line => `<div>${line}</div>`).join('');
      extraNoteSection = `
        <div style="margin-top: 0.75rem; padding: 0.85rem 1rem; background: #ECFDF5; border-radius: 10px; border-left: 4px solid #10B981; text-align: left;">
          <div style="font-weight: 800; color: #065F46; font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.35rem;">Expediente Clínico & Receta Médica</div>
          <div style="font-size: 0.8125rem; color: #064E3B; line-height: 1.5; white-space: pre-line;">${app.clinical_notes}</div>
        </div>
      `;
    } else if (app.cancellation_reason) {
      extraNoteSection = `
        <div style="margin-top: 0.75rem; padding: 0.85rem 1rem; background: #FEF2F2; border-radius: 10px; border-left: 4px solid #E63946; text-align: left;">
          <div style="font-weight: 800; color: #991B1B; font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase;">Motivo de Cancelación Registrado</div>
          <div style="font-size: 0.875rem; color: #B91C1C; margin-top: 0.35rem; line-height: 1.45;">${app.cancellation_reason}</div>
        </div>
      `;
    }

    const canAttend = (this.userRole === 'medico' || this.userRole === 'administrador') && app.status === 'confirmada';
    const canCancel = app.status === 'confirmada' || app.status === 'pendiente';

    Swal.fire({
      title: `<span style="font-family: var(--font-heading); font-weight: 800; color: #1B365D; font-size: 1.25rem;">Cita Médica • ${app.confirmation_code}</span>`,
      html: `
        <div style="text-align: left; font-size: 0.875rem; color: #334155; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.6rem; border-bottom: 1px solid #E2E8F0;">
            <span style="font-weight: 600; color: #64748B;">Estado de la Cita:</span>
            <span style="background: ${statusColor}; color: #FFFFFF; font-weight: 800; font-size: 0.78rem; padding: 0.25rem 0.75rem; border-radius: 9999px;">
              ${statusName.toUpperCase()}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
            <div style="background: #F8FAFC; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #94A3B8;">Fecha y Hora</div>
              <div style="font-weight: 800; color: #1B365D; margin-top: 0.2rem;">${app.appointment_date}</div>
              <div style="font-size: 0.8125rem; color: #64748B;">Turno: <strong>${app.appointment_time}</strong></div>
            </div>

            <div style="background: #F8FAFC; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #94A3B8;">Consultorio Asignado</div>
              <div style="font-weight: 800; color: #1B365D; margin-top: 0.2rem;">${app.doctor?.office_number || 'Consultorio 204'}</div>
              <div style="font-size: 0.8125rem; color: #64748B;">Sede Central San Rafael</div>
            </div>
          </div>

          <div style="background: #F8FAFC; padding: 0.75rem 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 0.75rem;">
            ${docAvatar}
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #94A3B8;">Médico Especialista</div>
              <div style="font-weight: 800; color: #1B365D; font-size: 0.95rem; margin-top: 0.15rem;">${docName}</div>
              <div style="font-size: 0.8125rem; color: #E63946; font-weight: 700;">${specName} • CMP: ${app.doctor?.cmp || '45210'}${app.doctor?.rne ? ' | RNE: ' + app.doctor.rne : ''}</div>
            </div>
          </div>

          <div style="background: #F8FAFC; padding: 0.75rem 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #94A3B8;">Paciente</div>
            <div style="font-weight: 800; color: #1B365D; font-size: 0.95rem; margin-top: 0.15rem;">${patientName}</div>
            <div style="font-size: 0.8125rem; color: #64748B; margin-top: 0.2rem;">
              DNI: <strong>${patientDni}</strong> • Tel: <strong>${patientPhone}</strong><br>
              Email: <strong>${patientEmail}</strong>
            </div>
          </div>

          <div style="background: #F8FAFC; padding: 0.75rem 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #94A3B8;">Motivo de Consulta Médica</div>
            <div style="font-size: 0.875rem; color: #334155; line-height: 1.45; margin-top: 0.25rem;">${app.reason || 'Consulta médica general / ambulatoria'}</div>
          </div>

          ${extraNoteSection}
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#1B365D',
      showDenyButton: canAttend,
      denyButtonText: 'Atender Paciente',
      denyButtonColor: '#10B981',
      showCancelButton: canCancel,
      cancelButtonText: 'Cancelar Cita',
      cancelButtonColor: '#E63946',
      background: '#FFFFFF'
    }).then((result) => {
      if (result.isDenied) {
        this.onAttend(app);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.onCancel(app);
      }
    });
  }
}
