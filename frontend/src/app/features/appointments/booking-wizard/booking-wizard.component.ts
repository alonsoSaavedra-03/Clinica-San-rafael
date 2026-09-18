import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Specialty } from '../../../core/models/specialty.model';
import { Doctor, AvailableSlot } from '../../../core/models/doctor.model';
import { Appointment } from '../../../core/models/appointment.model';
import { DoctorNamePipe } from '../../../core/pipes/doctor-name.pipe';
import { AppointmentDatePipe } from '../../../core/pipes/appointment-date.pipe';
import { TimeSlotPipe } from '../../../core/pipes/time-slot.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DoctorNamePipe,
    AppointmentDatePipe,
    TimeSlotPipe
  ],
  templateUrl: './booking-wizard.component.html',
  styleUrls: ['./booking-wizard.component.css']
})
export class BookingWizardComponent implements OnInit {
  clinicName = environment.clinicName;
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  step: number = 1; // 1: Especialidad, 2: Médico, 3: Fecha y Turno, 4: Motivo y Datos, 5: Éxito
  specialties: Specialty[] = [];
  doctors: Doctor[] = [];
  availableSlots: AvailableSlot[] = [];

  selectedSpecialty: Specialty | null = null;
  selectedDoctor: Doctor | null = null;
  selectedDate: string = '';
  selectedSlot: AvailableSlot | null = null;

  confirmedAppointment: Appointment | null = null;

  loadingSlots: boolean = false;
  submitting: boolean = false;
  minDate: string = '';

  bookingForm: FormGroup = this.fb.group({
    reason: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(500)]],
    patient_name: ['', [Validators.required]],
    patient_dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    patient_phone: ['', [Validators.required]]
  });

  ngOnInit(): void {
    // Establecer fecha mínima (mañana o hoy)
    const today = new Date();
    const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
    this.minDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    this.selectedDate = this.minDate;

    // Cargar datos del usuario si está logueado
    const user = this.authService.currentUserValue;
    if (user) {
      this.bookingForm.patchValue({
        patient_name: user.name,
        patient_dni: user.dni || '',
        patient_phone: user.phone || ''
      });
    }

    // Cargar especialidades
    this.doctorService.getSpecialties().subscribe(specs => {
      this.specialties = specs;

      // Parámetros de query si vinieron desde la landing
      this.route.queryParams.subscribe(params => {
        if (params['specialty_id']) {
          const spec = this.specialties.find(s => s.id === Number(params['specialty_id']));
          if (spec) this.selectSpecialty(spec);
        }
        if (params['doctor_id']) {
          this.doctorService.getDoctorById(Number(params['doctor_id'])).subscribe(doc => {
            if (doc) {
              this.selectSpecialty(doc.specialty || this.specialties[0]);
              this.selectDoctor(doc);
            }
          });
        }
      });
    });
  }

  selectSpecialty(spec: Specialty): void {
    this.selectedSpecialty = spec;
    this.doctorService.getDoctors(spec.id).subscribe(docs => {
      this.doctors = docs;
      this.step = 2;
    });
  }

  selectDoctor(doc: Doctor): void {
    this.selectedDoctor = doc;
    this.step = 3;
    this.loadSlots();
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.selectedSlot = null;
    this.loadSlots();
  }

  loadSlots(): void {
    if (!this.selectedDoctor || !this.selectedDate) return;

    this.loadingSlots = true;
    this.availableSlots = [];
    this.doctorService.getAvailableSlots(this.selectedDoctor.id, this.selectedDate).subscribe({
      next: (res) => {
        this.loadingSlots = false;
        this.availableSlots = res.slots || [];
      },
      error: () => {
        this.loadingSlots = false;
        this.notificationService.error('No se pudo verificar la disponibilidad de horarios.');
      }
    });
  }

  selectSlot(slot: AvailableSlot): void {
    if (!slot.available) return;
    this.selectedSlot = slot;
  }

  goToDetails(): void {
    if (!this.selectedSlot) {
      this.notificationService.warning('Por favor seleccione un horario disponible.');
      return;
    }
    this.step = 4;
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    if (!this.selectedDoctor || !this.selectedSpecialty || !this.selectedSlot) {
      this.notificationService.error('Faltan datos requeridos para completar la reserva.');
      return;
    }

    this.submitting = true;

    this.appointmentService.createAppointment({
      doctor_id: this.selectedDoctor.id,
      specialty_id: this.selectedSpecialty.id,
      appointment_date: this.selectedDate,
      appointment_time: this.selectedSlot.time,
      reason: this.bookingForm.value.reason
    }).subscribe({
      next: (appointment) => {
        this.submitting = false;
        this.confirmedAppointment = appointment;
        this.step = 5;
        this.notificationService.success(
          `Cita médica agendada correctamente. Código: ${appointment.confirmation_code}`,
          'Reserva Exitosa'
        );
      },
      error: (err) => {
        this.submitting = false;
        this.notificationService.error(err?.message || 'Error al procesar la cita médica.');
      }
    });
  }

  goToStep(targetStep: number): void {
    if (targetStep < this.step) {
      this.step = targetStep;
    }
  }

  resetBooking(): void {
    this.step = 1;
    this.selectedSpecialty = null;
    this.selectedDoctor = null;
    this.selectedSlot = null;
    this.confirmedAppointment = null;
    this.bookingForm.patchValue({ reason: '' });
  }
}
