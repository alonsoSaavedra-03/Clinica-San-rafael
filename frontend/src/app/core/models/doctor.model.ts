import { Specialty } from './specialty.model';
import { User } from './user.model';

export interface DoctorSchedule {
  id?: number;
  doctor_id?: number;
  day_of_week: number; // 1: Lunes, ..., 6: Sábado
  start_time: string;  // '08:00'
  end_time: string;    // '13:00'
  slot_duration_minutes?: number;
  is_active: boolean;
}

export interface Doctor {
  id: number;
  user_id: number;
  specialty_id: number;
  cmp: string;                 // Colegio Médico del Perú
  rne?: string;                // Registro Nacional de Especialista
  bio: string;
  consultation_fee: number;    // Tarifa en Soles (PEN)
  office_number: string;
  avatar_url?: string;
  is_available: boolean;
  user?: User;
  specialty?: Specialty;
  schedules?: DoctorSchedule[];
}

export interface AvailableSlot {
  time: string;       // '09:00'
  display: string;    // '09:00 AM'
  available: boolean;
  status: 'Disponible' | 'Ocupado' | 'Pasado';
}

export interface DaySlotsResponse {
  success: boolean;
  available: boolean;
  date: string;
  message?: string;
  slots: AvailableSlot[];
}
