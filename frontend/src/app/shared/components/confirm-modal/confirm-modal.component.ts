import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirmar Acción';
  @Input() message: string = '¿Está seguro de continuar con esta operación?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Volver';
  @Input() isDanger: boolean = false;
  @Input() requireInput: boolean = false;
  @Input() inputLabel: string = 'Motivo:';
  @Input() inputPlaceholder: string = 'Ingrese el detalle...';

  @Input() reasonsList: string[] = [
    'Reprogramación solicitada por el paciente',
    'Incompatibilidad de horario o cruce de turnos',
    'Urgencia médica hospitalaria / Intervención imprevista',
    'Inasistencia / Paciente no se presentó a la consulta',
    'Falta de disponibilidad temporal de consultorio o equipo',
    'Motivo de salud / Fuerza mayor',
    'Otro motivo (especificar en el detalle)'
  ];

  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  selectedReason: string = 'Reprogramación solicitada por el paciente';
  inputValue: string = '';
  inputError: string | null = null;
  notifyPatient: boolean = true;

  onConfirm(): void {
    if (this.requireInput) {
      if (this.selectedReason === 'Otro motivo (especificar en el detalle)' && (!this.inputValue || this.inputValue.trim().length < 5)) {
        this.inputError = 'Por favor detalle el motivo de la cancelación (mínimo 5 caracteres).';
        return;
      }
      const fullReason = this.inputValue && this.inputValue.trim()
        ? `${this.selectedReason} — ${this.inputValue.trim()}`
        : this.selectedReason;
      this.confirm.emit(fullReason);
    } else {
      this.confirm.emit(this.inputValue || 'Confirmado');
    }
    this.reset();
  }

  onCancel(): void {
    this.cancel.emit();
    this.reset();
  }

  private reset(): void {
    this.inputValue = '';
    this.inputError = null;
    this.selectedReason = this.reasonsList[0] || 'Reprogramación solicitada por el paciente';
    this.notifyPatient = true;
  }
}
