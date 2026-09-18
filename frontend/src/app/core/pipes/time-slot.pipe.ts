import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado para formatear horarios a formato legible con AM/PM.
 * Entrada: "09:00:00" o "15:30"
 * Salida: "09:00 AM" o "03:30 PM"
 */
@Pipe({
  name: 'timeSlot',
  standalone: true
})
export class TimeSlotPipe implements PipeTransform {
  transform(timeStr: string | undefined | null): string {
    if (!timeStr) return '--:--';

    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) return timeStr;

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 horas es 12 AM

    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${minutes} ${ampm}`;
  }
}
