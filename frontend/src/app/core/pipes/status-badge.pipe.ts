import { Pipe, PipeTransform } from '@angular/core';
import { AppointmentStatus } from '../models/appointment.model';

/**
 * Pipe personalizado para formatear el estado de una cita médica
 * a un texto legible para el paciente y la clase CSS del badge.
 */
@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: AppointmentStatus | string | undefined | null): { label: string; cssClass: string } {
    switch (status) {
      case 'confirmada':
        return { label: 'Confirmada', cssClass: 'badge-confirmed' };
      case 'atendida':
        return { label: 'Atendida', cssClass: 'badge-attended' };
      case 'cancelada':
        return { label: 'Cancelada', cssClass: 'badge-cancelled' };
      case 'pendiente':
      default:
        return { label: 'Pendiente', cssClass: 'badge-pending' };
    }
  }
}
