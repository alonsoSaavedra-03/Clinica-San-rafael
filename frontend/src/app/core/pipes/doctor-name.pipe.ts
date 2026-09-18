import { Pipe, PipeTransform } from '@angular/core';
import { Doctor } from '../models/doctor.model';

/**
 * Pipe personalizado para formatear el nombre y credenciales oficiales del médico.
 * Ejemplo: "Dr. Carlos Mendoza Paredes — CMP: 48291"
 */
@Pipe({
  name: 'doctorName',
  standalone: true
})
export class DoctorNamePipe implements PipeTransform {
  transform(doctor: Doctor | undefined | null, showCmp: boolean = true): string {
    if (!doctor) return 'Médico asignado';

    const rawName = doctor.user?.name || 'Especialista';
    let formatted = rawName;

    // Agregar prefijo Dr. o Dra. si no lo contiene ya
    if (!formatted.startsWith('Dr.') && !formatted.startsWith('Dra.')) {
      formatted = `Dr. ${formatted}`;
    }

    if (showCmp && doctor.cmp) {
      formatted += ` (CMP ${doctor.cmp})`;
    }

    return formatted;
  }
}
