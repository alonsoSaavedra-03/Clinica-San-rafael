import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Doctor, DaySlotsResponse, AvailableSlot, DoctorSchedule } from '../models/doctor.model';
import { Specialty } from '../models/specialty.model';
import { MockDataService } from './mock-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  getSpecialties(): Observable<Specialty[]> {
    if (!environment.useMock) {
      return this.http.get<{ success: boolean; data: Specialty[] }>(`${environment.apiUrl}/specialties`)
        .pipe(map(r => r.data));
    }
    return of(this.mockData.getSpecialties());
  }

  getDoctors(specialtyId?: number, search?: string): Observable<Doctor[]> {
    if (!environment.useMock) {
      let params = new HttpParams();
      if (specialtyId) params = params.set('specialty_id', specialtyId.toString());
      if (search) params = params.set('search', search);

      return this.http.get<{ success: boolean; data: Doctor[] }>(`${environment.apiUrl}/doctors`, { params })
        .pipe(map(r => r.data));
    }

    let docs = this.mockData.getDoctors();
    if (specialtyId) {
      docs = docs.filter(d => d.specialty_id === Number(specialtyId));
    }
    if (search && search.trim() !== '') {
      const term = search.toLowerCase();
      docs = docs.filter(d =>
        d.user?.name.toLowerCase().includes(term) ||
        d.specialty?.name.toLowerCase().includes(term) ||
        d.cmp.includes(term)
      );
    }
    return of(docs);
  }

  getDoctorById(id: number): Observable<Doctor | undefined> {
    if (!environment.useMock) {
      return this.http.get<{ success: boolean; data: Doctor }>(`${environment.apiUrl}/doctors/${id}`)
        .pipe(map(r => r.data));
    }
    const doc = this.mockData.getDoctors().find(d => d.id === Number(id));
    return of(doc);
  }

  /**
   * Cálculo de disponibilidad de turnos en tiempo real para una fecha.
   */
  getAvailableSlots(doctorId: number, dateStr: string): Observable<DaySlotsResponse> {
    if (!environment.useMock) {
      return this.http.get<DaySlotsResponse>(
        `${environment.apiUrl}/doctors/${doctorId}/available-slots?date=${dateStr}`
      );
    }

    const doctor = this.mockData.getDoctors().find(d => d.id === Number(doctorId));
    if (!doctor) {
      return of({ success: false, available: false, date: dateStr, slots: [], message: 'Médico no encontrado' });
    }

    // Calcular día de la semana (1 = Lunes, 6 = Sábado, 7 = Domingo)
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    let jsDay = dateObj.getDay(); // 0 = Domingo, 1 = Lunes
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;

    const schedule = doctor.schedules?.find(s => s.day_of_week === dayOfWeek && s.is_active);
    if (!schedule) {
      return of({
        success: true,
        available: false,
        date: dateStr,
        message: 'El médico no tiene turno de atención programado para este día.',
        slots: []
      });
    }

    // Buscar citas ya agendadas
    const appointments = this.mockData.getAppointments().filter(a =>
      a.doctor_id === Number(doctorId) &&
      a.appointment_date === dateStr &&
      (a.status === 'confirmada' || a.status === 'pendiente')
    );
    const bookedTimes = appointments.map(a => a.appointment_time.substring(0, 5));

    // Generar slots de 30 minutos
    const slots: AvailableSlot[] = [];
    const [startH, startM] = schedule.start_time.split(':').map(Number);
    const [endH, endM] = schedule.end_time.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const now = new Date();
    const isToday = now.getFullYear() === year && (now.getMonth() + 1) === month && now.getDate() === day;
    const currentNowMinutes = now.getHours() * 60 + now.getMinutes();

    while (currentMinutes + 30 <= endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 || 12;
      const display = `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;

      const isBooked = bookedTimes.includes(timeStr);
      const isPast = isToday && (currentMinutes <= currentNowMinutes);

      slots.push({
        time: timeStr,
        display,
        available: !isBooked && !isPast,
        status: isBooked ? 'Ocupado' : (isPast ? 'Pasado' : 'Disponible')
      });

      currentMinutes += 30;
    }

    return of({
      success: true,
      available: true,
      date: dateStr,
      slots
    });
  }

  /**
   * Actualizar horarios de atención del médico
   */
  updateSchedules(doctorId: number, schedules: DoctorSchedule[]): Observable<boolean> {
    const doctors = this.mockData.getDoctors();
    const idx = doctors.findIndex(d => d.id === doctorId);
    if (idx !== -1) {
      doctors[idx].schedules = schedules;
      this.mockData.saveDoctors(doctors);
      return of(true);
    }
    return of(false);
  }
}
