import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { Specialty } from '../../core/models/specialty.model';
import { Doctor } from '../../core/models/doctor.model';

@Component({
  selector: 'app-specialties',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.css']
})
export class SpecialtiesComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private router = inject(Router);

  specialties: Specialty[] = [];
  doctors: Doctor[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  ngOnInit(): void {
    this.doctorService.getSpecialties().subscribe(specs => {
      this.specialties = specs;
      this.doctorService.getDoctors().subscribe(docs => {
        this.doctors = docs;
        this.loading = false;
      });
    });
  }

  get filteredSpecialties(): Specialty[] {
    if (!this.searchTerm.trim()) {
      return this.specialties;
    }
    const term = this.searchTerm.toLowerCase();
    return this.specialties.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  }

  getDoctorCount(specialtyId: number): number {
    return this.doctors.filter(d => d.specialty_id === specialtyId).length;
  }

  goToBooking(specialtyId: number): void {
    this.router.navigate(['/booking'], { queryParams: { specialty_id: specialtyId } });
  }

  goToDoctors(specialtyId: number): void {
    this.router.navigate(['/medicos'], { queryParams: { specialty_id: specialtyId } });
  }
}
