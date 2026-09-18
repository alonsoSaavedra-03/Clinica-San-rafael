import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Appointment,
  VitalSigns,
  PrescriptionItem,
  ClinicalAttentionData
} from '../../../core/models/appointment.model';
import { Doctor, DoctorSchedule } from '../../../core/models/doctor.model';
import { AppointmentTableComponent } from '../../../shared/components/appointment-table/appointment-table.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PortalHeaderComponent } from '../../../shared/components/portal-header/portal-header.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppointmentTableComponent,
    ConfirmModalComponent,
    PortalHeaderComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  currentUser$ = this.authService.currentUser$;
  currentDoctor: Doctor | null = null;
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  schedules: DoctorSchedule[] = [];

  activeTab: 'agenda' | 'horarios' = 'agenda';
  selectedStatus: string = 'todas';
  loading: boolean = true;

  // Modal para atender paciente
  attendModalOpen: boolean = false;
  selectedAppointmentToAttend: Appointment | null = null;
  formSubmitting: boolean = false;
  notesError: string | null = null;

  // Triaje y Signos Vitales
  vitals: VitalSigns = {
    blood_pressure: '120/80',
    heart_rate: 76,
    temperature: 36.6,
    respiratory_rate: 18,
    oxygen_saturation: 98,
    weight: 70,
    height: 172,
    bmi: 23.7,
    bmi_status: 'Normal'
  };

  // Examen clínico y Anamnesis
  physicalExamInput: string = '';

  // Diagnóstico CIE-10
  selectedDiagnosisCie: string = 'I10';
  customDiagnosisDesc: string = '';
  diagnosisType: 'Definitivo' | 'Presuntivo' | 'Reiterativo' = 'Definitivo';

  cie10Catalog = [
    { code: 'I10', name: 'Hipertensión arterial esencial (primaria)', spec: 'Cardiología' },
    { code: 'I20.9', name: 'Angina de pecho no especificada', spec: 'Cardiología' },
    { code: 'I49.9', name: 'Arritmia cardíaca no especificada', spec: 'Cardiología' },
    { code: 'Z00.1', name: 'Control de salud de rutina del niño y lactante', spec: 'Pediatría' },
    { code: 'J00', name: 'Rinofaringitis aguda (resfriado común)', spec: 'Pediatría' },
    { code: 'J02.9', name: 'Faringitis aguda no especificada', spec: 'Pediatría' },
    { code: 'S93.4', name: 'Esguince y desgarro de ligamento de tobillo', spec: 'Traumatología' },
    { code: 'M54.5', name: 'Lumbago no especificado / Lumbalgia mecánica', spec: 'Traumatología' },
    { code: 'M25.5', name: 'Dolor articular / Artralgia de rodilla', spec: 'Traumatología' },
    { code: 'K29.7', name: 'Gastritis no especificada', spec: 'Medicina General' },
    { code: 'E11', name: 'Diabetes mellitus tipo 2', spec: 'Medicina General' },
    { code: 'R51', name: 'Cefalea tensional / Migraña', spec: 'Medicina General' },
    { code: 'Z00.0', name: 'Examen médico general preventivo (Chequeo anual)', spec: 'General' },
    { code: 'OTRO', name: 'Otro diagnóstico clínico (escribir descripción)', spec: 'General' }
  ];

  // Prescripciones / Medicamentos
  prescriptionsList: PrescriptionItem[] = [
    {
      medication: 'Paracetamol 500mg',
      dosage: '1 tableta vía oral',
      frequency: 'Cada 8 horas',
      duration: 'Por 3 a 5 días',
      instructions: 'Tomar después de los alimentos.'
    }
  ];

  // Apoyo al Diagnóstico y Control
  diagnosticTestsInput: string = '';
  recommendationsInput: string = 'Reposo relativo, mantener abundante hidratación (2L agua/día) y evitar factores desencadenantes.';
  nextControlInput: string = 'En 7 días';

  // Modal para cancelar cita
  cancelModalOpen: boolean = false;
  selectedAppointmentToCancel: Appointment | null = null;

  diasSemana = [
    { day: 1, name: 'Lunes' },
    { day: 2, name: 'Martes' },
    { day: 3, name: 'Miércoles' },
    { day: 4, name: 'Jueves' },
    { day: 5, name: 'Viernes' },
    { day: 6, name: 'Sábado' }
  ];

  ngOnInit(): void {
    this.loadDoctorProfile();
  }

  loadDoctorProfile(): void {
    this.doctorService.getDoctors().subscribe(docs => {
      const user = this.authService.currentUserValue;
      const found = docs.find(d => d.user_id === user?.id) || docs[0];
      this.currentDoctor = found;
      this.schedules = found.schedules ? JSON.parse(JSON.stringify(found.schedules)) : [];
      this.loadDoctorAppointments();
    });
  }

  loadDoctorAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Error al cargar la agenda médica.');
      }
    });
  }

  onFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  getCountByStatus(status: string): number {
    return this.appointments.filter(a => a.status === status).length;
  }

  applyFilter(): void {
    if (this.selectedStatus === 'todas') {
      this.filteredAppointments = [...this.appointments];
    } else {
      this.filteredAppointments = this.appointments.filter(a => a.status === this.selectedStatus);
    }
  }

  calculateBmi(): void {
    if (this.vitals.weight && this.vitals.height && this.vitals.height > 0) {
      const heightM = this.vitals.height / 100;
      const val = Number((this.vitals.weight / (heightM * heightM)).toFixed(1));
      this.vitals.bmi = val;
      if (val < 18.5) this.vitals.bmi_status = 'Bajo peso';
      else if (val < 25.0) this.vitals.bmi_status = 'Normal';
      else if (val < 30.0) this.vitals.bmi_status = 'Sobrepeso';
      else this.vitals.bmi_status = 'Obesidad';
    }
  }

  addPrescriptionItem(): void {
    this.prescriptionsList.push({
      medication: '',
      dosage: '1 tableta vía oral',
      frequency: 'Cada 8 horas',
      duration: 'Por 5 días',
      instructions: 'Tomar con abundante agua'
    });
  }

  removePrescriptionItem(index: number): void {
    if (this.prescriptionsList.length > 1) {
      this.prescriptionsList.splice(index, 1);
    }
  }

  openAttendModal(app: Appointment): void {
    this.selectedAppointmentToAttend = app;
    this.notesError = null;
    this.formSubmitting = false;

    // Precargar según especialidad o paciente
    if (app.specialty?.name?.toLowerCase().includes('cardio')) {
      this.selectedDiagnosisCie = 'I10';
      this.vitals.blood_pressure = '130/85';
      this.vitals.heart_rate = 74;
      this.physicalExamInput = 'Ruidos cardíacos rítmicos normofonéticos. No soplos audibles. Murmullo vesicular pasa bien en ambos campos pulmonares.';
      this.prescriptionsList = [
        { medication: 'Losartán Potásico 50mg', dosage: '1 tableta', frequency: 'Cada 24 horas (mañanas)', duration: 'Por 30 días', instructions: 'Tomar en ayunas con agua tibia.' }
      ];
      this.recommendationsInput = 'Dieta hiposódica (baja en sal), caminata diaria de 30 minutos y control de presión matutino.';
      this.nextControlInput = 'En 30 días';
    } else if (app.specialty?.name?.toLowerCase().includes('pedia')) {
      this.selectedDiagnosisCie = 'Z00.1';
      this.vitals.blood_pressure = '100/65';
      this.vitals.heart_rate = 96;
      this.vitals.weight = 16.5;
      this.vitals.height = 98;
      this.calculateBmi();
      this.physicalExamInput = 'Paciente pediátrico reactivo, afebril, buen estado nutricional y de hidratación. Faringe congestiva leve sin placas.';
      this.prescriptionsList = [
        { medication: 'Paracetamol Jarabe 120mg/5ml', dosage: '5 ml', frequency: 'Cada 8 horas condicional a fiebre (>38°C)', duration: 'Por 3 días', instructions: 'Vía oral con cuchara dosificadora.' }
      ];
      this.recommendationsInput = 'Líquidos tibios frecuentes, reposo en casa, control de temperatura cada 6 horas.';
      this.nextControlInput = 'En 5 días';
    } else if (app.specialty?.name?.toLowerCase().includes('trauma')) {
      this.selectedDiagnosisCie = 'M54.5';
      this.vitals.blood_pressure = '120/80';
      this.vitals.heart_rate = 78;
      this.physicalExamInput = 'Contractura muscular paravertebral lumbar bilateral. Maniobra de Lasègue negativa. Sin déficit neurológico distal.';
      this.prescriptionsList = [
        { medication: 'Meloxicam 15mg + Pridinol', dosage: '1 tableta', frequency: 'Cada 24 horas después de almuerzo', duration: 'Por 5 días', instructions: 'Tomar con protector gástrico si requiere.' }
      ];
      this.recommendationsInput = 'Evitar levantar cargas pesadas, aplicar calor local 15 min 2 veces al día y sesiones de fisioterapia post-agudo.';
      this.nextControlInput = 'En 10 días';
    } else {
      this.selectedDiagnosisCie = 'K29.7';
      this.vitals.blood_pressure = '120/80';
      this.vitals.heart_rate = 75;
      this.physicalExamInput = 'Abdomen blando, depresible, leve dolor a la palpación en epigastrio. Ruidos hidroaéreos presentes.';
      this.prescriptionsList = [
        { medication: 'Omeprazol 20mg', dosage: '1 cápsula', frequency: 'Cada 24 horas (en ayunas)', duration: 'Por 14 días', instructions: '30 minutos antes del desayuno.' }
      ];
      this.recommendationsInput = 'Fraccionar comidas en 5 tomas al día. Evitar irritantes, café, cítricos y condimentos excesivos.';
      this.nextControlInput = 'En 15 días';
    }

    this.calculateBmi();
    this.attendModalOpen = true;
  }

  submitAttend(): void {
    if (!this.selectedAppointmentToAttend) return;

    // Validación
    let diagDesc = '';
    if (this.selectedDiagnosisCie === 'OTRO') {
      if (!this.customDiagnosisDesc || this.customDiagnosisDesc.trim().length < 4) {
        this.notesError = 'Por favor ingrese la descripción del diagnóstico clínico.';
        return;
      }
      diagDesc = this.customDiagnosisDesc.trim();
    } else {
      const foundCie = this.cie10Catalog.find(c => c.code === this.selectedDiagnosisCie);
      diagDesc = foundCie ? `${foundCie.code} — ${foundCie.name}` : this.selectedDiagnosisCie;
    }

    const hasEmptyMeds = this.prescriptionsList.some(p => !p.medication || p.medication.trim().length < 2);
    if (hasEmptyMeds) {
      this.notesError = 'Complete el nombre de los medicamentos prescritos o elimine las filas vacías.';
      return;
    }

    this.formSubmitting = true;

    // Formateo del resumen clínico completo
    const vitalsStr = `PA: ${this.vitals.blood_pressure || '-'} mmHg | FC: ${this.vitals.heart_rate || '-'} lpm | Temp: ${this.vitals.temperature || '-'}°C | SpO2: ${this.vitals.oxygen_saturation || '-'}% | Peso: ${this.vitals.weight || '-'} kg | Talla: ${this.vitals.height || '-'} cm | IMC: ${this.vitals.bmi || '-'} (${this.vitals.bmi_status || 'Normal'})`;
    const prescriptionsStr = this.prescriptionsList
      .map(p => `• ${p.medication}: ${p.dosage}, ${p.frequency}, ${p.duration}. Indicaciones: ${p.instructions || 'Según lo prescrito'}`)
      .join('\n');

    const fullClinicalSummary = `
[DIAGNÓSTICO CIE-10 (${this.diagnosisType.toUpperCase()})]: ${diagDesc}
[FUNCIONES VITALES]: ${vitalsStr}
[HALLAZGOS CLÍNICOS]: ${this.physicalExamInput || 'Evaluación médica presencial sin hallazgos de alarma.'}
[RECETA MÉDICA (Rp.)]:
${prescriptionsStr}
[RECOMENDACIONES]: ${this.recommendationsInput || 'Continuar cuidados habituales.'}
[PRÓXIMO CONTROL]: ${this.nextControlInput || 'A necesidad'}
    `.trim();

    const attentionData: ClinicalAttentionData = {
      vitals: { ...this.vitals },
      physical_exam: this.physicalExamInput,
      diagnosis_code: this.selectedDiagnosisCie,
      diagnosis_description: diagDesc,
      diagnosis_type: this.diagnosisType,
      prescriptions: [...this.prescriptionsList],
      diagnostic_tests: this.diagnosticTestsInput,
      next_control: this.nextControlInput,
      recommendations: this.recommendationsInput,
      clinical_notes: fullClinicalSummary
    };

    const targetApp = this.selectedAppointmentToAttend;

    this.appointmentService.attendAppointment(targetApp.id, attentionData).subscribe({
      next: (updatedApp) => {
        this.formSubmitting = false;
        this.attendModalOpen = false;
        this.selectedAppointmentToAttend = null;
        this.loadDoctorAppointments();

        // Lanzar SweetAlert2 con la Receta Médica Digital Oficial
        this.showPrescriptionReceiptSwal(updatedApp, attentionData, diagDesc);
      },
      error: (err) => {
        this.formSubmitting = false;
        this.notificationService.error(err?.message || 'Error al guardar la atención médica.');
      }
    });
  }

  showPrescriptionReceiptSwal(app: Appointment, data: ClinicalAttentionData, diagDesc: string): void {
    const doc = this.currentDoctor;
    const patientName = app.patient?.name || 'Paciente';
    const patientDni = app.patient?.dni || '72839102';
    const dateStr = app.appointment_date;
    const timeStr = app.appointment_time;

    const medsHtml = (data.prescriptions || [])
      .map((m, idx) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 0.6rem 0.5rem; font-weight: 700; color: #1B365D;">${idx + 1}. ${m.medication}</td>
          <td style="padding: 0.6rem 0.5rem; color: #334155;">${m.dosage}</td>
          <td style="padding: 0.6rem 0.5rem; color: #334155;">${m.frequency}</td>
          <td style="padding: 0.6rem 0.5rem; color: #64748B;">${m.duration}</td>
        </tr>
      `).join('');

    Swal.fire({
      icon: 'success',
      title: '<span style="font-family: var(--font-heading); color: #1B365D; font-weight: 800;">Atención Concluida con Éxito</span>',
      html: `
        <div style="text-align: left; font-size: 0.875rem; color: #334155; margin-top: 0.5rem;">
          <p style="margin-bottom: 0.85rem; color: #475569;">
            La consulta fue registrada en el historial clínico del paciente y la receta médica digital ha sido emitida.
          </p>

          <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 1.25rem; font-family: var(--font-body);">
            <!-- Membrete Receta -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1B365D; padding-bottom: 0.6rem; margin-bottom: 0.85rem;">
              <div>
                <div style="font-weight: 900; color: #1B365D; font-size: 1rem; text-transform: uppercase;">Clínica San Rafael</div>
                <div style="font-size: 0.7rem; color: #64748B;">RECETA MÉDICA AMBULATORIA • CÓDIGO: <strong>${app.confirmation_code}</strong></div>
              </div>
              <div style="text-align: right; font-size: 0.75rem; color: #64748B;">
                Fecha: <strong>${dateStr} ${timeStr}</strong>
              </div>
            </div>

            <!-- Datos Paciente y Médico -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem; font-size: 0.8125rem;">
              <div>
                <span style="color: #64748B;">Paciente:</span> <strong>${patientName}</strong><br>
                <span style="color: #64748B;">DNI:</span> <strong>${patientDni}</strong>
              </div>
              <div style="text-align: right;">
                <span style="color: #64748B;">Médico:</span> <strong>${doc?.user?.name || 'Dr. Médico'}</strong><br>
                <span style="color: #64748B;">CMP:</span> <strong>${doc?.cmp || '-'}</strong> | <span style="color: #64748B;">Esp:</span> <strong>${doc?.specialty?.name || '-'}</strong>
              </div>
            </div>

            <!-- Diagnóstico -->
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.5rem 0.75rem; border-radius: 6px; margin-bottom: 0.85rem; font-size: 0.8125rem;">
              <strong style="color: #1D4ED8;">Diagnóstico (${data.diagnosis_type || 'Definitivo'}):</strong> ${diagDesc}
            </div>

            <!-- Tabla de Medicamentos -->
            <div style="margin-bottom: 0.85rem;">
              <div style="font-weight: 800; font-size: 0.75rem; color: #1B365D; text-transform: uppercase; margin-bottom: 0.35rem;">RP. / Tratamiento Farmacológico:</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem;">
                <thead>
                  <tr style="background: #E2E8F0; text-align: left; font-size: 0.72rem; color: #475569;">
                    <th style="padding: 0.4rem 0.5rem;">Medicamento</th>
                    <th style="padding: 0.4rem 0.5rem;">Dosis</th>
                    <th style="padding: 0.4rem 0.5rem;">Frecuencia</th>
                    <th style="padding: 0.4rem 0.5rem;">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  ${medsHtml}
                </tbody>
              </table>
            </div>

            <!-- Indicaciones y Próximo Control -->
            <div style="font-size: 0.78rem; color: #475569; background: #FFFFFF; border: 1px solid #E2E8F0; padding: 0.6rem; border-radius: 6px;">
              <div><strong>Indicaciones:</strong> ${data.recommendations || 'Ninguna adicional'}</div>
              <div style="margin-top: 0.25rem;"><strong>Próximo Control:</strong> ${data.next_control || 'Alta médica'}</div>
            </div>

            <!-- Sello Digital -->
            <div style="margin-top: 1rem; text-align: right; padding-top: 0.5rem; border-top: 1px dashed #CBD5E1; font-size: 0.72rem; color: #059669; font-weight: 700;">
              Documento firmado electrónicamente bajo la Ley N° 27269 de Firmas y Certificados Digitales.
            </div>
          </div>
        </div>
      `,
      confirmButtonText: 'Entendido y Cerrar',
      confirmButtonColor: '#1B365D',
      showCancelButton: true,
      cancelButtonText: 'Imprimir Receta',
      cancelButtonColor: '#10B981',
      background: '#FFFFFF'
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        window.print();
      }
    });
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
        this.notificationService.warning('Cita cancelada correctamente y notificada.');
        this.loadDoctorAppointments();
      },
      error: (err) => {
        this.notificationService.error(err?.message || 'Error al cancelar cita.');
      }
    });
  }

  saveSchedules(): void {
    if (!this.currentDoctor) return;

    this.doctorService.updateSchedules(this.currentDoctor.id, this.schedules).subscribe({
      next: () => {
        this.notificationService.success('Horarios semanales de atención actualizados correctamente.');
      },
      error: () => {
        this.notificationService.error('Error al guardar los horarios.');
      }
    });
  }

  getDayName(dayNum: number): string {
    return this.diasSemana.find(d => d.day === dayNum)?.name || `Día ${dayNum}`;
  }
}
