import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserRole } from '../../../core/models/user.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading: boolean = false;
  errorMessage: string | null = null;

  fillDemo(role: UserRole): void {
    if (role === 'paciente') {
      this.loginForm.patchValue({ email: 'paciente@saludrapida.pe', password: 'paciente123' });
    } else if (role === 'medico') {
      this.loginForm.patchValue({ email: 'carlos.mendoza@saludrapida.pe', password: 'password123' });
    } else if (role === 'administrador') {
      this.loginForm.patchValue({ email: 'admin@saludrapida.pe', password: 'admin123' });
    }
  }

  fillSpecificDoctor(email: string): void {
    this.loginForm.patchValue({ email, password: 'password123' });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // SweetAlert2: Verificando credenciales con animación
    Swal.fire({
      title: '<span style="font-family: var(--font-heading); font-weight: 800; color: #1B365D; font-size: 1.35rem;">Comprobando credenciales...</span>',
      html: '<div style="font-size: 0.95rem; color: #64748B; margin-top: 0.5rem; line-height: 1.5;">Validando acceso seguro a Clínica San Rafael</div>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: '#FFFFFF',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;

        // Modal de éxito de SweetAlert2 con icono animado institucional
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: '<span style="font-family: var(--font-heading); font-weight: 800; color: #1B365D;">¡Acceso Concedido!</span>',
            html: `<div style="font-size: 0.95rem; color: #334155; margin-top: 0.25rem;">Bienvenido(a), <strong>${res.user.name}</strong></div>`,
            showConfirmButton: false,
            timer: 1100,
            iconColor: '#10B981',
            background: '#FFFFFF'
          }).then(() => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            if (returnUrl) {
              this.router.navigateByUrl(returnUrl);
              return;
            }

            if (res.user.role === 'medico') {
              this.router.navigate(['/doctor/dashboard']);
            } else if (res.user.role === 'administrador') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/patient/dashboard']);
            }
          });
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
        this.errorMessage = msg;

        // Alerta SweetAlert2 de error institucional
        Swal.fire({
          icon: 'error',
          title: '<span style="font-family: var(--font-heading); font-weight: 800; color: #1B365D;">Acceso Denegado</span>',
          text: msg,
          confirmButtonText: 'Reintentar',
          confirmButtonColor: '#E63946',
          iconColor: '#E63946',
          background: '#FFFFFF'
        });
      }
    });
  }
}
