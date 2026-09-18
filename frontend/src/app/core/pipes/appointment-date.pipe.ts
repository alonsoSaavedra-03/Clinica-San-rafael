import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado para formatear fechas de citas en formato institucional en español.
 * Formato 'long': "Jueves, 18 de Septiembre 2026"
 * Formato 'short': "18/09/2026"
 */
@Pipe({
  name: 'appointmentDate',
  standalone: true
})
export class AppointmentDatePipe implements PipeTransform {
  private dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  private meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  transform(value: string | Date | undefined | null, format: 'long' | 'short' | 'relative' = 'long'): string {
    if (!value) return '-';

    // Parsear fecha evitando desfasaje horario
    let dateObj: Date;
    if (typeof value === 'string') {
      const parts = value.split('-');
      if (parts.length === 3) {
        dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else {
        dateObj = new Date(value);
      }
    } else {
      dateObj = value;
    }

    if (isNaN(dateObj.getTime())) return String(value);

    if (format === 'short') {
      const d = String(dateObj.getDate()).padStart(2, '0');
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const y = dateObj.getFullYear();
      return `${d}/${m}/${y}`;
    }

    const diaNombre = this.dias[dateObj.getDay()];
    const diaNum = dateObj.getDate();
    const mesNombre = this.meses[dateObj.getMonth()];
    const anio = dateObj.getFullYear();

    return `${diaNombre}, ${diaNum} de ${mesNombre} ${anio}`;
  }
}
