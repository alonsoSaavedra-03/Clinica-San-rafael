import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Specialty } from '../models/specialty.model';
import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private readonly USERS_KEY = 'sr_users';
  private readonly SPECIALTIES_KEY = 'sr_specialties';
  private readonly DOCTORS_KEY = 'sr_doctors';
  private readonly APPOINTMENTS_KEY = 'sr_appointments';

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    const DATA_VERSION = 'sr_v5_booking_portraits';
    const isUpToDate = localStorage.getItem('sr_data_version') === DATA_VERSION;

    if (!isUpToDate) {
      localStorage.removeItem(this.USERS_KEY);
      localStorage.removeItem(this.DOCTORS_KEY);
      localStorage.removeItem(this.APPOINTMENTS_KEY);
      localStorage.removeItem(this.SPECIALTIES_KEY);
      localStorage.setItem('sr_data_version', DATA_VERSION);
    }

    if (!localStorage.getItem(this.SPECIALTIES_KEY)) {
      const specialties: Specialty[] = [
        { id: 1, name: 'Medicina General', description: 'Evaluación integral, despistaje preventivo y tratamiento clínico inicial.', icon: 'stethoscope', is_active: true },
        { id: 2, name: 'Cardiología', description: 'Diagnóstico y tratamiento avanzado del sistema cardiovascular y arritmias.', icon: 'heart', is_active: true },
        { id: 3, name: 'Pediatría', description: 'Atención médica integral, control de crecimiento y vacunas de niños y adolescentes.', icon: 'user-check', is_active: true },
        { id: 4, name: 'Traumatología y Ortopedia', description: 'Tratamiento de fracturas, esguinces, dolencias articulares y lesiones deportivas.', icon: 'activity', is_active: true },
        { id: 5, name: 'Ginecología y Obstetricia', description: 'Salud reproductiva femenina, despistaje ginecológico y control prenatal.', icon: 'shield', is_active: true },
        { id: 6, name: 'Dermatología', description: 'Tratamiento clínico de afecciones de la piel, cabello, uñas y manchas.', icon: 'sun', is_active: true },
      ];
      localStorage.setItem(this.SPECIALTIES_KEY, JSON.stringify(specialties));
    }

    if (!localStorage.getItem(this.USERS_KEY)) {
      const users: User[] = [
        {
          id: 1,
          name: 'Lic. María Elena Torres',
          email: 'admin@saludrapida.pe',
          role: 'administrador',
          dni: '10293847',
          phone: '+51 912 345 678',
          avatar_url: 'assets/images/doctors/doctor_gabriela_vega.jpg'
        },
        {
          id: 2,
          name: 'Juan Pérez Alvarado',
          email: 'paciente@saludrapida.pe',
          role: 'paciente',
          dni: '72839102',
          phone: '+51 984 567 890',
          birth_date: '1992-05-14',
          address: 'Av. Javier Prado Este 2450, San Borja, Lima'
        },
        {
          id: 3,
          name: 'Dr. Carlos Mendoza Paredes',
          email: 'carlos.mendoza@saludrapida.pe',
          role: 'medico',
          dni: '40892314',
          phone: '+51 987 654 321',
          avatar_url: 'assets/images/doctors/doctor_carlos_mendoza.jpg'
        },
        {
          id: 4,
          name: 'Dra. Patricia Silva Rojas',
          email: 'patricia.silva@saludrapida.pe',
          role: 'medico',
          dni: '42189032',
          phone: '+51 976 543 210',
          avatar_url: 'assets/images/doctors/doctor_patricia_silva.jpg'
        },
        {
          id: 5,
          name: 'Dr. Fernando Benavides Castro',
          email: 'fernando.benavides@saludrapida.pe',
          role: 'medico',
          dni: '38902145',
          phone: '+51 965 432 109',
          avatar_url: 'assets/images/doctors/doctor_fernando_benavides.jpg'
        },
        {
          id: 6,
          name: 'Dra. Gabriela Vega Ugarte',
          email: 'gabriela.vega@saludrapida.pe',
          role: 'medico',
          dni: '45091283',
          phone: '+51 954 321 098',
          avatar_url: 'assets/images/doctors/doctor_gabriela_vega.jpg'
        },
        {
          id: 7,
          name: 'Dra. Elena Vásquez Morales',
          email: 'elena.vasquez@saludrapida.pe',
          role: 'medico',
          dni: '43901284',
          phone: '+51 943 210 987',
          avatar_url: 'assets/images/doctors/doctor_elena_vasquez.jpg'
        },
        {
          id: 8,
          name: 'Dr. Rodrigo Salazar Pardo',
          email: 'rodrigo.salazar@saludrapida.pe',
          role: 'medico',
          dni: '41982345',
          phone: '+51 932 109 876',
          avatar_url: 'assets/images/doctors/doctor_rodrigo_salazar.jpg'
        },
        {
          id: 9,
          name: 'Rosa Morales Chumpitaz',
          email: 'rosa.morales@gmail.com',
          role: 'paciente',
          dni: '09812345',
          phone: '+51 992 114 558'
        },
        {
          id: 10,
          name: 'Marco Antonio Ramos',
          email: 'marco.ramos@gmail.com',
          role: 'paciente',
          dni: '44521098',
          phone: '+51 981 776 221'
        },
        {
          id: 11,
          name: 'Lucía Paredes Ríos',
          email: 'lucia.paredes@hotmail.com',
          role: 'paciente',
          dni: '71908234',
          phone: '+51 974 332 119'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    if (!localStorage.getItem(this.DOCTORS_KEY)) {
      const doctors: Doctor[] = [
        {
          id: 1,
          user_id: 3,
          specialty_id: 2, // Cardiología
          cmp: '48291',
          rne: '24109',
          bio: 'Cardiólogo clínico con más de 14 años de experiencia en centros de alta complejidad. Miembro de la Sociedad Peruana de Cardiología.',
          consultation_fee: 120.00,
          office_number: 'Cons. 302 - Torre A',
          avatar_url: 'assets/images/doctors/doctor_carlos_mendoza.jpg',
          is_available: true,
          user: { id: 3, name: 'Dr. Carlos Mendoza Paredes', email: 'carlos.mendoza@saludrapida.pe', role: 'medico', phone: '+51 987 654 321', avatar_url: 'assets/images/doctors/doctor_carlos_mendoza.jpg' },
          specialty: { id: 2, name: 'Cardiología', description: 'Diagnóstico y tratamiento avanzado del corazón', icon: 'heart' },
          schedules: [
            { day_of_week: 1, start_time: '08:00', end_time: '13:00', is_active: true },
            { day_of_week: 2, start_time: '08:00', end_time: '13:00', is_active: true },
            { day_of_week: 3, start_time: '08:00', end_time: '13:00', is_active: true },
            { day_of_week: 4, start_time: '14:00', end_time: '18:00', is_active: true },
            { day_of_week: 5, start_time: '08:00', end_time: '13:00', is_active: true },
            { day_of_week: 6, start_time: '08:00', end_time: '12:00', is_active: true },
          ]
        },
        {
          id: 2,
          user_id: 4,
          specialty_id: 3, // Pediatría
          cmp: '52104',
          rne: '27891',
          bio: 'Pediatra certificada en atención integral de la infancia, inmunizaciones y nutrición temprana. Trato empático y cálido con los niños.',
          consultation_fee: 100.00,
          office_number: 'Cons. 204 - Torre B',
          avatar_url: 'assets/images/doctors/doctor_patricia_silva.jpg',
          is_available: true,
          user: { id: 4, name: 'Dra. Patricia Silva Rojas', email: 'patricia.silva@saludrapida.pe', role: 'medico', phone: '+51 976 543 210', avatar_url: 'assets/images/doctors/doctor_patricia_silva.jpg' },
          specialty: { id: 3, name: 'Pediatría', description: 'Atención integral del niño y adolescente', icon: 'user-check' },
          schedules: [
            { day_of_week: 1, start_time: '09:00', end_time: '14:00', is_active: true },
            { day_of_week: 2, start_time: '09:00', end_time: '14:00', is_active: true },
            { day_of_week: 3, start_time: '09:00', end_time: '14:00', is_active: true },
            { day_of_week: 4, start_time: '09:00', end_time: '14:00', is_active: true },
            { day_of_week: 5, start_time: '09:00', end_time: '14:00', is_active: true },
          ]
        },
        {
          id: 3,
          user_id: 5,
          specialty_id: 4, // Traumatología
          cmp: '39820',
          rne: '18490',
          bio: 'Cirujano traumatólogo especialista en artroscopía de hombro y rodilla, lesiones deportivas y patologías de columna.',
          consultation_fee: 130.00,
          office_number: 'Cons. 108 - Torre A',
          avatar_url: 'assets/images/doctors/doctor_fernando_benavides.jpg',
          is_available: true,
          user: { id: 5, name: 'Dr. Fernando Benavides Castro', email: 'fernando.benavides@saludrapida.pe', role: 'medico', phone: '+51 965 432 109', avatar_url: 'assets/images/doctors/doctor_fernando_benavides.jpg' },
          specialty: { id: 4, name: 'Traumatología y Ortopedia', description: 'Tratamiento de lesiones óseas y articulares', icon: 'activity' },
          schedules: [
            { day_of_week: 1, start_time: '14:00', end_time: '19:00', is_active: true },
            { day_of_week: 2, start_time: '14:00', end_time: '19:00', is_active: true },
            { day_of_week: 4, start_time: '14:00', end_time: '19:00', is_active: true },
            { day_of_week: 6, start_time: '08:00', end_time: '13:00', is_active: true },
          ]
        },
        {
          id: 4,
          user_id: 6,
          specialty_id: 1, // Medicina General
          cmp: '61294',
          rne: undefined,
          bio: 'Médico cirujano egresada de la Universidad Nacional Mayor de San Marcos con enfoque preventivo, control de hipertensión y diabetes.',
          consultation_fee: 70.00,
          office_number: 'Cons. 101 - Primer Nivel',
          avatar_url: 'assets/images/doctors/doctor_gabriela_vega.jpg',
          is_available: true,
          user: { id: 6, name: 'Dra. Gabriela Vega Ugarte', email: 'gabriela.vega@saludrapida.pe', role: 'medico', phone: '+51 954 321 098', avatar_url: 'assets/images/doctors/doctor_gabriela_vega.jpg' },
          specialty: { id: 1, name: 'Medicina General', description: 'Evaluación y medicina preventiva', icon: 'stethoscope' },
          schedules: [
            { day_of_week: 1, start_time: '08:00', end_time: '14:00', is_active: true },
            { day_of_week: 2, start_time: '08:00', end_time: '14:00', is_active: true },
            { day_of_week: 3, start_time: '08:00', end_time: '14:00', is_active: true },
            { day_of_week: 4, start_time: '08:00', end_time: '14:00', is_active: true },
            { day_of_week: 5, start_time: '08:00', end_time: '14:00', is_active: true },
          ]
        },
        {
          id: 5,
          user_id: 7,
          specialty_id: 5, // Ginecología y Obstetricia
          cmp: '55431',
          rne: '30124',
          bio: 'Especialista en ginecología integral, control prenatal de alto riesgo, colposcopía y salud reproductiva.',
          consultation_fee: 110.00,
          office_number: 'Cons. 401 - Torre B',
          avatar_url: 'assets/images/doctors/doctor_elena_vasquez.jpg',
          is_available: true,
          user: { id: 7, name: 'Dra. Elena Vásquez Morales', email: 'elena.vasquez@saludrapida.pe', role: 'medico', phone: '+51 943 210 987', avatar_url: 'assets/images/doctors/doctor_elena_vasquez.jpg' },
          specialty: { id: 5, name: 'Ginecología y Obstetricia', description: 'Salud reproductiva femenina y control prenatal', icon: 'shield' },
          schedules: [
            { day_of_week: 1, start_time: '08:00', end_time: '13:00', is_active: true },
            { day_of_week: 2, start_time: '08:00', end_time: '13:00', is_active: true },
            { day_of_week: 3, start_time: '14:00', end_time: '18:00', is_active: true },
            { day_of_week: 5, start_time: '08:00', end_time: '13:00', is_active: true },
          ]
        },
        {
          id: 6,
          user_id: 8,
          specialty_id: 6, // Dermatología
          cmp: '49812',
          rne: '26540',
          bio: 'Dermatólogo clínico y estético. Experto en fotodermatosis, acné severo, detección precoz de lunares y dermatoscopía.',
          consultation_fee: 115.00,
          office_number: 'Cons. 205 - Torre A',
          avatar_url: 'assets/images/doctors/doctor_rodrigo_salazar.jpg',
          is_available: true,
          user: { id: 8, name: 'Dr. Rodrigo Salazar Pardo', email: 'rodrigo.salazar@saludrapida.pe', role: 'medico', phone: '+51 932 109 876', avatar_url: 'assets/images/doctors/doctor_rodrigo_salazar.jpg' },
          specialty: { id: 6, name: 'Dermatología', description: 'Tratamiento clínico de la piel, cabello y uñas', icon: 'sun' },
          schedules: [
            { day_of_week: 1, start_time: '09:00', end_time: '14:00', is_active: true },
            { day_of_week: 3, start_time: '09:00', end_time: '14:00', is_active: true },
            { day_of_week: 4, start_time: '14:00', end_time: '19:00', is_active: true },
            { day_of_week: 6, start_time: '09:00', end_time: '13:00', is_active: true },
          ]
        }
      ];
      localStorage.setItem(this.DOCTORS_KEY, JSON.stringify(doctors));
    }

    if (!localStorage.getItem(this.APPOINTMENTS_KEY)) {
      const today = new Date();
      const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
      const toYmd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const in2Days = new Date(today);
      in2Days.setDate(in2Days.getDate() + 2);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const fourDaysAgo = new Date(today);
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const appointments: Appointment[] = [
        {
          id: 101,
          confirmation_code: 'SR-74291',
          patient_id: 2,
          doctor_id: 1,
          specialty_id: 2,
          appointment_date: toYmd(tomorrow),
          appointment_time: '09:00',
          reason: 'Control cardiológico semestral y despistaje de riesgo cardiovascular.',
          status: 'confirmada',
          created_at: new Date().toISOString()
        },
        {
          id: 102,
          confirmation_code: 'SR-81045',
          patient_id: 2,
          doctor_id: 4,
          specialty_id: 1,
          appointment_date: toYmd(today),
          appointment_time: '11:30',
          reason: 'Evaluación médica general y revisión de exámenes de perfil lipídico.',
          status: 'confirmada',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 103,
          confirmation_code: 'SR-63108',
          patient_id: 2,
          doctor_id: 2,
          specialty_id: 3,
          appointment_date: toYmd(fourDaysAgo),
          appointment_time: '10:30',
          reason: 'Control pediátrico de niño sano, esquema de vacunas y nutrición.',
          status: 'atendida',
          clinical_notes: 'Diagnóstico: Z00.1 Control de salud de rutina del niño. Triaje: Peso 14.2 kg, Talla 94 cm, SatO2 99%. Desarrollo psicomotor adecuado. Se autoriza vacuna de refuerzo. Próximo control en 6 meses.',
          created_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          id: 104,
          confirmation_code: 'SR-55219',
          patient_id: 2,
          doctor_id: 3,
          specialty_id: 4,
          appointment_date: toYmd(weekAgo),
          appointment_time: '15:00',
          reason: 'Dolor agudo en rodilla derecha tras práctica deportiva de fin de semana.',
          status: 'cancelada',
          cancellation_reason: 'Reprogramación solicitada por el paciente por cruce con horario laboral.',
          created_at: new Date(Date.now() - 86400000 * 8).toISOString()
        },
        {
          id: 105,
          confirmation_code: 'SR-92140',
          patient_id: 2,
          doctor_id: 1,
          specialty_id: 2,
          appointment_date: toYmd(yesterday),
          appointment_time: '08:30',
          reason: 'Score de calcio coronario y evaluación electrocardiográfica de esfuerzo.',
          status: 'atendida',
          clinical_notes: 'Diagnóstico: I10 Hipertensión arterial esencial estadio 1. Triaje: PA 138/86 mmHg, FC 74 lpm. Se prescribe Losartán 50mg cada 24 horas y dieta hiposódica estricta. Control en 30 días.',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 106,
          confirmation_code: 'SR-38412',
          patient_id: 7,
          doctor_id: 1,
          specialty_id: 2,
          appointment_date: toYmd(today),
          appointment_time: '10:00',
          reason: 'Evaluación cardiológica prequirúrgica para procedimiento laparoscópico.',
          status: 'confirmada',
          created_at: new Date().toISOString()
        },
        {
          id: 107,
          confirmation_code: 'SR-49120',
          patient_id: 8,
          doctor_id: 4,
          specialty_id: 1,
          appointment_date: toYmd(today),
          appointment_time: '15:30',
          reason: 'Cuadro de cefalea tensional recurrente y fatiga física.',
          status: 'confirmada',
          created_at: new Date().toISOString()
        },
        {
          id: 108,
          confirmation_code: 'SR-67891',
          patient_id: 9,
          doctor_id: 3,
          specialty_id: 4,
          appointment_date: toYmd(yesterday),
          appointment_time: '16:00',
          reason: 'Traumatismo cerrado en tobillo izquierdo por caída en escaleras.',
          status: 'atendida',
          clinical_notes: 'Diagnóstico: S93.4 Esguince de ligamento peroneoastragalino grado 2. Triaje: Sin deformidad ósea palpable. Se coloca vendaje funcional compresivo, reposo relativo por 7 días y Naproxeno 550mg cada 12 horas por 5 días.',
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 109,
          confirmation_code: 'SR-78234',
          patient_id: 8,
          doctor_id: 2,
          specialty_id: 3,
          appointment_date: toYmd(in2Days),
          appointment_time: '11:00',
          reason: 'Consulta de control de peso y evaluación de alergia estacional.',
          status: 'confirmada',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.APPOINTMENTS_KEY, JSON.stringify(appointments));
    }
  }

  // Getters y Setters seguros
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getSpecialties(): Specialty[] {
    return JSON.parse(localStorage.getItem(this.SPECIALTIES_KEY) || '[]');
  }

  getDoctors(): Doctor[] {
    return JSON.parse(localStorage.getItem(this.DOCTORS_KEY) || '[]');
  }

  saveDoctors(doctors: Doctor[]): void {
    localStorage.setItem(this.DOCTORS_KEY, JSON.stringify(doctors));
  }

  getAppointments(): Appointment[] {
    const raw: Appointment[] = JSON.parse(localStorage.getItem(this.APPOINTMENTS_KEY) || '[]');
    const users = this.getUsers();
    const doctors = this.getDoctors();
    const specialties = this.getSpecialties();

    // Enriquecer con relaciones
    return raw.map(app => {
      const patient = users.find(u => u.id === app.patient_id);
      const doctor = doctors.find(d => d.id === app.doctor_id);
      const specialty = specialties.find(s => s.id === app.specialty_id);
      return {
        ...app,
        patient,
        doctor,
        specialty
      };
    });
  }

  saveAppointments(apps: Appointment[]): void {
    // Almacenar solo campos clave para evitar duplicación
    const clean = apps.map(({ patient, doctor, specialty, ...rest }) => rest);
    localStorage.setItem(this.APPOINTMENTS_KEY, JSON.stringify(clean));
  }
}
