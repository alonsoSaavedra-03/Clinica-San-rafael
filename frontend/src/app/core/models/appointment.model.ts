import { Doctor } from './doctor.model';
import { Specialty } from './specialty.model';
import { User } from './user.model';

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'atendida' | 'cancelada';

export interface VitalSigns {
  blood_pressure?: string; // ej. 120/80 mmHg
  heart_rate?: number; // lpm
  temperature?: number; // °C
  respiratory_rate?: number; // rpm
  oxygen_saturation?: number; // %
  weight?: number; // kg
  height?: number; // cm
  bmi?: number; // kg/m2
  bmi_status?: string; // Normal, Sobrepeso, etc.
}

export interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface ClinicalAttentionData {
  vitals?: VitalSigns;
  physical_exam?: string;
  diagnosis_code?: string;
  diagnosis_description?: string;
  diagnosis_type?: 'Definitivo' | 'Presuntivo' | 'Reiterativo';
  prescriptions?: PrescriptionItem[];
  diagnostic_tests?: string;
  next_control?: string;
  recommendations?: string;
  clinical_notes?: string;
}

export interface Appointment {
  id: number;
  confirmation_code: string;
  patient_id: number;
  doctor_id: number;
  specialty_id: number;
  appointment_date: string; // 'YYYY-MM-DD'
  appointment_time: string; // 'HH:mm'
  reason: string;
  status: AppointmentStatus;
  clinical_notes?: string;
  vitals?: VitalSigns;
  diagnosis_code?: string;
  diagnosis_description?: string;
  diagnosis_type?: 'Definitivo' | 'Presuntivo' | 'Reiterativo';
  prescriptions?: PrescriptionItem[];
  next_control?: string;
  recommendations?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  created_at?: string;
  patient?: User;
  doctor?: Doctor;
  specialty?: Specialty;
}

export interface CreateAppointmentDto {
  doctor_id: number;
  specialty_id: number;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  patient_id?: number;
}
