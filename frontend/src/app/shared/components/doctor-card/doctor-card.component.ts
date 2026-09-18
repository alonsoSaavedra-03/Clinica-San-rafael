import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorNamePipe } from '../../../core/pipes/doctor-name.pipe';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule, DoctorNamePipe],
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.css']
})
export class DoctorCardComponent {
  @Input({ required: true }) doctor!: Doctor;
  @Input() showBookButton: boolean = true;
  @Output() book = new EventEmitter<Doctor>();

  onSelect(): void {
    this.book.emit(this.doctor);
  }
}
