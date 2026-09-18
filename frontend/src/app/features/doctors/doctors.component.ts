import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { Doctor } from '../../core/models/doctor.model';
import { Specialty } from '../../core/models/specialty.model';
import { DoctorNamePipe } from '../../core/pipes/doctor-name.pipe';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DoctorNamePipe],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  doctors: Doctor[] = [];
  specialties: Specialty[] = [];

  searchTerm: string = '';
  selectedSpecialtyId: string = '';
  loading: boolean = true;

  ngOnInit(): void {
    this.doctorService.getSpecialties().subscribe(specs => {
      this.specialties = specs;

      this.route.queryParams.subscribe(params => {
        if (params['specialty_id']) {
          this.selectedSpecialtyId = params['specialty_id'].toString();
        }
        this.loadDoctors();
      });
    });
  }

  loadDoctors(): void {
    this.loading = true;
    const specId = this.selectedSpecialtyId ? Number(this.selectedSpecialtyId) : undefined;
    this.doctorService.getDoctors(specId).subscribe(docs => {
      this.doctors = docs;
      this.loading = false;
    });
  }

  onSpecialtyChange(): void {
    this.loadDoctors();
  }

  get filteredDoctors(): Doctor[] {
    if (!this.searchTerm.trim()) {
      return this.doctors;
    }
    const term = this.searchTerm.toLowerCase();
    return this.doctors.filter(d =>
      (d.user?.name && d.user.name.toLowerCase().includes(term)) ||
      (d.cmp && d.cmp.toLowerCase().includes(term)) ||
      (d.specialty?.name && d.specialty.name.toLowerCase().includes(term))
    );
  }

  getDoctorInitial(doctor: Doctor): string {
    return doctor.user?.name ? doctor.user.name.charAt(0) : 'D';
  }

  getDoctorScheduleSummary(doctor: Doctor): string {
    if (!doctor.schedules || doctor.schedules.length === 0) {
      return 'Lunes a Viernes (8:00 am - 1:00 pm)';
    }
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const activeDays = doctor.schedules.filter(s => s.is_active).map(s => days[s.day_of_week]);
    if (activeDays.length > 0) {
      return `${activeDays[0]} a ${activeDays[activeDays.length - 1]} (${doctor.schedules[0].start_time} - ${doctor.schedules[0].end_time})`;
    }
    return 'Lunes a Sábado';
  }

  bookWithDoctor(doctor: Doctor): void {
    this.router.navigate(['/booking'], {
      queryParams: {
        doctor_id: doctor.id,
        specialty_id: doctor.specialty_id
      }
    });
  }
}
