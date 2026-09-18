import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment, CreateAppointmentDto, ClinicalAttentionData } from '../models/appointment.model';
import { MockDataService } from './mock-data.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface ClinicStats {
  total: number;
  confirmed: number;
  attended: number;
  cancelled: number;
  todayCount: number;
  totalDoctors: number;
  totalPatients: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private authService = inject(AuthService);

  getAppointments(filters?: { status?: string; doctor_id?: number; patient_id?: number; date?: string }): Observable<Appointment[]> {
    if (!environment.useMock) {
      let params = new HttpParams();
      if (filters?.status) params = params.set('status', filters.status);
      if (filters?.date) params = params.set('date', filters.date);

      return this.http.get<{ success: boolean; data: Appointment[] }>(`${environment.apiUrl}/appointments`, { params })
        .pipe(map(r => r.data));
    }

    const currentUser = this.authService.currentUserValue;
    let list = this.mockData.getAppointments();

    // Filtrar según rol
    if (currentUser?.role === 'paciente') {
      list = list.filter(a => a.patient_id === currentUser.id);
    } else if (currentUser?.role === 'medico') {
      const doc = this.mockData.getDoctors().find(d => d.user_id === currentUser.id);
      if (doc) {
        list = list.filter(a => a.doctor_id === doc.id);
      }
    }

    if (filters?.status && filters.status !== 'todas') {
      list = list.filter(a => a.status === filters.status);
    }
    if (filters?.date) {
      list = list.filter(a => a.appointment_date === filters.date);
    }
    if (filters?.doctor_id) {
      list = list.filter(a => a.doctor_id === filters.doctor_id);
    }

    // Ordenar por fecha descendente y hora ascendente
    list.sort((a, b) => {
      const dateDiff = new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.appointment_time.localeCompare(b.appointment_time);
    });

    return of(list);
  }

  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    if (!environment.useMock) {
      return this.http.post<{ success: boolean; data: Appointment }>(`${environment.apiUrl}/appointments`, dto)
        .pipe(map(r => r.data));
    }

    const appointments = this.mockData.getAppointments();
    const currentUser = this.authService.currentUserValue;

    // Validar si ya está ocupado el turno
    const collision = appointments.some(a =>
      a.doctor_id === dto.doctor_id &&
      a.appointment_date === dto.appointment_date &&
      a.appointment_time === dto.appointment_time &&
      (a.status === 'confirmada' || a.status === 'pendiente')
    );

    if (collision) {
      return throwError(() => new Error('El horario seleccionado acaba de ser reservado. Por favor seleccione otro turno.'));
    }

    const code = `SR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newAppointment: Appointment = {
      id: Date.now(),
      confirmation_code: code,
      patient_id: dto.patient_id || currentUser?.id || 2,
      doctor_id: dto.doctor_id,
      specialty_id: dto.specialty_id,
      appointment_date: dto.appointment_date,
      appointment_time: dto.appointment_time,
      reason: dto.reason,
      status: 'confirmada',
      created_at: new Date().toISOString()
    };

    appointments.unshift(newAppointment);
    this.mockData.saveAppointments(appointments);

    // Retornar la cita enriquecida
    const enriched = this.mockData.getAppointments().find(a => a.id === newAppointment.id) || newAppointment;
    return of(enriched);
  }

  cancelAppointment(id: number, reason: string): Observable<Appointment> {
    if (!environment.useMock) {
      return this.http.patch<{ success: boolean; data: Appointment }>(
        `${environment.apiUrl}/appointments/${id}/cancel`,
        { reason }
      ).pipe(map(r => r.data));
    }

    const list = this.mockData.getAppointments();
    const target = list.find(a => a.id === id);

    if (!target) {
      return throwError(() => new Error('Cita médica no encontrada.'));
    }

    if (target.status === 'atendida') {
      return throwError(() => new Error('No es posible cancelar una cita médica que ya ha sido atendida.'));
    }

    target.status = 'cancelada';
    target.cancellation_reason = reason;
    target.cancelled_by = this.authService.currentUserValue?.role || 'paciente';

    this.mockData.saveAppointments(list);
    return of(target);
  }

  attendAppointment(id: number, data: ClinicalAttentionData | string): Observable<Appointment> {
    if (!environment.useMock) {
      const notes = typeof data === 'string' ? data : (data.clinical_notes || '');
      return this.http.patch<{ success: boolean; data: Appointment }>(
        `${environment.apiUrl}/appointments/${id}/attend`,
        { clinical_notes: notes }
      ).pipe(map(r => r.data));
    }

    const list = this.mockData.getAppointments();
    const target = list.find(a => a.id === id);

    if (!target) {
      return throwError(() => new Error('Cita no encontrada.'));
    }

    target.status = 'atendida';

    if (typeof data === 'string') {
      target.clinical_notes = data;
    } else {
      target.clinical_notes = data.clinical_notes || `${data.diagnosis_code ? '[' + data.diagnosis_code + '] ' : ''}${data.diagnosis_description || ''}`;
      target.vitals = data.vitals;
      target.diagnosis_code = data.diagnosis_code;
      target.diagnosis_description = data.diagnosis_description;
      target.diagnosis_type = data.diagnosis_type;
      target.prescriptions = data.prescriptions;
      target.next_control = data.next_control;
      target.recommendations = data.recommendations;
    }

    this.mockData.saveAppointments(list);
    return of(target);
  }

  getStats(): Observable<ClinicStats> {
    const list = this.mockData.getAppointments();
    const doctors = this.mockData.getDoctors();
    const users = this.mockData.getUsers();

    const todayStr = new Date().toISOString().split('T')[0];

    const stats: ClinicStats = {
      total: list.length,
      confirmed: list.filter(a => a.status === 'confirmada').length,
      attended: list.filter(a => a.status === 'atendida').length,
      cancelled: list.filter(a => a.status === 'cancelada').length,
      todayCount: list.filter(a => a.appointment_date === todayStr).length,
      totalDoctors: doctors.length,
      totalPatients: users.filter(u => u.role === 'paciente').length
    };

    return of(stats);
  }
}
