import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { Doctor } from '../../core/models/doctor.model';
import { Specialty } from '../../core/models/specialty.model';
import { environment } from '../../../environments/environment';

export interface HeroSlide {
  id: number;
  badge: string;
  headlinePre: string;
  headlineAccent: string;
  headlinePost?: string;
  description: string;
  btnText: string;
  btnRoute: string;
  btnParams?: any;
  btnIcon: string;
  image: string;
  imageAlt: string;
  gradient: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private doctorService = inject(DoctorService);
  private router = inject(Router);

  clinicName = environment.clinicName;
  clinicPhone = environment.clinicPhone;
  clinicEmergency = environment.clinicEmergency;

  specialties: Specialty[] = [];
  doctors: Doctor[] = [];
  filteredQuickDoctors: Doctor[] = [];
  loading: boolean = true;

  // Carrusel Hero Interactivo de Pantalla Completa
  currentSlideIndex: number = 0;
  private autoPlayTimer: any = null;

  slides: HeroSlide[] = [
    {
      id: 1,
      badge: 'NUEVOS SERVICIOS DE ALTA COMPLEJIDAD',
      headlinePre: 'Detecta en minutos si tienes',
      headlineAccent: 'riesgo de infarto',
      description: 'Prueba de "Score de calcio coronario" en el Centro de Imagen Cardiovascular Avanzada de Clínica San Rafael.',
      btnText: 'Más información aquí',
      btnRoute: '/booking',
      btnParams: { specialty_id: 2 },
      btnIcon: '',
      image: 'assets/images/medical_scanner_banner.jpg',
      imageAlt: 'Tomógrafo Cardiovascular 3D de Última Generación en Clínica San Rafael',
      gradient: 'linear-gradient(135deg, #09172B 0%, #152B4E 50%, #1B365D 100%)'
    },
    {
      id: 2,
      badge: 'ATENCIÓN MÉDICA INTEGRAL',
      headlinePre: 'Tu salud en manos de',
      headlineAccent: 'especialistas certificados',
      description: 'Más de 6 especialidades médicas ambulatorias con horarios disponibles en tiempo real. Agenda tu cita en segundos.',
      btnText: 'Conocer Staff de Médicos',
      btnRoute: '/medicos',
      btnIcon: '',
      image: 'assets/images/medical_doctors_banner.jpg',
      imageAlt: 'Cuerpo Médico Colegiado Clínica San Rafael',
      gradient: 'linear-gradient(135deg, #0B213F 0%, #1B365D 50%, #2A4D7E 100%)'
    },
    {
      id: 3,
      badge: 'CENTRO DE DIAGNÓSTICO INTEGRAL',
      headlinePre: 'Tecnología médica para tu',
      headlineAccent: 'rápida recuperación',
      description: 'Equipamiento cardiovascular moderno, laboratorio clínico y atención de urgencias las 24 horas del día.',
      btnText: 'Ver Todas las Especialidades',
      btnRoute: '/especialidades',
      btnIcon: '',
      image: 'assets/images/medical_care_banner.jpg',
      imageAlt: 'Diagnóstico por Imágenes Clínica San Rafael',
      gradient: 'linear-gradient(135deg, #101E33 0%, #1D2D44 50%, #293B57 100%)'
    }
  ];

  // Widget de Reserva Rápida (Estilo San Pablo)
  quickSpecialtyId: number | '' = '';
  quickDoctorId: number | '' = '';

  ngOnInit(): void {
    this.startAutoPlay();

    this.doctorService.getSpecialties().subscribe(specs => {
      this.specialties = specs;
    });

    this.doctorService.getDoctors().subscribe(docs => {
      this.doctors = docs;
      this.filteredQuickDoctors = docs;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, 6500);
  }

  stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.startAutoPlay();
  }

  onSlideCta(slide: HeroSlide): void {
    if (slide.btnParams) {
      this.router.navigate([slide.btnRoute], { queryParams: slide.btnParams });
    } else {
      this.router.navigate([slide.btnRoute]);
    }
  }

  onQuickSpecialtyChange(): void {
    if (this.quickSpecialtyId) {
      this.filteredQuickDoctors = this.doctors.filter(d => d.specialty_id === Number(this.quickSpecialtyId));
      this.quickDoctorId = '';
    } else {
      this.filteredQuickDoctors = [...this.doctors];
      this.quickDoctorId = '';
    }
  }

  onQuickSearch(): void {
    const queryParams: any = {};
    if (this.quickSpecialtyId) queryParams.specialty_id = this.quickSpecialtyId;
    if (this.quickDoctorId) queryParams.doctor_id = this.quickDoctorId;

    this.router.navigate(['/booking'], { queryParams });
  }

  onSelectDoctor(doc: Doctor): void {
    this.router.navigate(['/booking'], {
      queryParams: { doctor_id: doc.id, specialty_id: doc.specialty_id }
    });
  }

  onSelectSpecialty(spec: Specialty): void {
    this.router.navigate(['/booking'], {
      queryParams: { specialty_id: spec.id }
    });
  }
}
