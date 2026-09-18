import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  clinicName = environment.clinicName;
  clinicAddress = environment.clinicAddress;
  clinicPhone = environment.clinicPhone;
  clinicEmergency = environment.clinicEmergency;

  openLibroReclamaciones(): void {
    Swal.fire({
      title: '<span style="font-family: var(--font-heading); color: #1B365D; font-weight: 800;">Libro de Reclamaciones Virtual</span>',
      html: `
        <div style="text-align: left; font-size: 0.875rem; color: #334155; line-height: 1.55;">
          <p style="margin-bottom: 0.75rem;">
            Conforme a lo establecido en el <strong>Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong> y las disposiciones de <strong>SuSalud</strong>, Clínica San Rafael pone a su disposición este canal oficial para registrar su Queja o Reclamo.
          </p>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem; margin-bottom: 0.85rem; font-size: 0.8125rem;">
            <div><strong>Razón Social:</strong> Salud Rápida S.A.</div>
            <div><strong>R.U.C.:</strong> 20584930192</div>
            <div><strong>Código IPRESS SuSalud:</strong> 00014285</div>
            <div><strong>Sede Central:</strong> ${this.clinicAddress}</div>
          </div>
          <p style="font-size: 0.8125rem; color: #64748B;">
            Para canalizar su solicitud con código de seguimiento y respuesta formal en un plazo máximo legal de 15 días hábiles, escriba a <a href="mailto:atencionalusuario@saludrapida.pe" style="color: #1B365D; font-weight: 700;">atencionalusuario@saludrapida.pe</a> o comuníquese a nuestra central telefónica.
          </p>
        </div>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#1B365D',
      background: '#FFFFFF'
    });
  }

  openPrivacidad(): void {
    Swal.fire({
      title: '<span style="font-family: var(--font-heading); color: #1B365D; font-weight: 800;">Privacidad y Protección de Datos Médicos</span>',
      html: `
        <div style="text-align: left; font-size: 0.875rem; color: #334155; line-height: 1.55;">
          <p style="margin-bottom: 0.75rem;">
            En cumplimiento de la <strong>Ley N° 29733 (Protección de Datos Personales)</strong> y la <strong>Ley General de Salud N° 26842</strong>:
          </p>
          <ul style="padding-left: 1.25rem; color: #475569; font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <li><strong>Confidencialidad:</strong> Su historia clínica y atenciones son datos sensibles reservados exclusivamente para usted y el médico tratante.</li>
            <li><strong>Seguridad de Datos:</strong> Toda la información de consultas y reservas se almacena cifrada bajo estándares internacionales.</li>
            <li><strong>No comercialización:</strong> Sus datos jamás serán cedidos ni vendidos a terceros para fines publicitarios.</li>
          </ul>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#1B365D',
      background: '#FFFFFF'
    });
  }

  openTerminos(): void {
    Swal.fire({
      title: '<span style="font-family: var(--font-heading); color: #1B365D; font-weight: 800;">Términos y Condiciones del Servicio</span>',
      html: `
        <div style="text-align: left; font-size: 0.875rem; color: #334155; line-height: 1.55;">
          <p style="margin-bottom: 0.75rem;">
            Condiciones aplicables a la reserva y atención de citas en Clínica San Rafael:
          </p>
          <ul style="padding-left: 1.25rem; color: #475569; font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <li><strong>Asistencia:</strong> El paciente debe presentarse 15 minutos antes de la hora programada en el consultorio indicado.</li>
            <li><strong>Cancelación y Reprogramación:</strong> Puede realizarse desde su Portal de Paciente con al menos 2 horas de anticipación.</li>
            <li><strong>Urgencias:</strong> La plataforma web gestiona consultas ambulatorias. Si presenta una emergencia vital, acuda de inmediato al área de Emergencia 24h.</li>
          </ul>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#1B365D',
      background: '#FFFFFF'
    });
  }

  openDerechos(): void {
    Swal.fire({
      title: '<span style="font-family: var(--font-heading); color: #1B365D; font-weight: 800;">Derechos del Usuario en Salud (SuSalud)</span>',
      html: `
        <div style="text-align: left; font-size: 0.875rem; color: #334155; line-height: 1.55;">
          <p style="margin-bottom: 0.75rem;">
            Según el marco normativo de la <strong>Superintendencia Nacional de Salud (SuSalud)</strong>, son derechos fundamentales del paciente:
          </p>
          <ul style="padding-left: 1.25rem; color: #475569; font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <li>Recibir atención médica integral, oportuna y con estándares de calidad.</li>
            <li>Conocer el nombre del médico responsable, su diagnóstico e indicaciones claras.</li>
            <li>Solicitar una copia íntegra de su Historia Clínica.</li>
            <li>Expresar su consentimiento informado de manera libre y documentada.</li>
            <li>Ser atendido con respeto a su dignidad, intimidad y sin discriminación alguna.</li>
          </ul>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#1B365D',
      background: '#FFFFFF'
    });
  }
}
