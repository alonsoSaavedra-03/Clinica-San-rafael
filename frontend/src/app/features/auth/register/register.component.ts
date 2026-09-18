import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9+ ]{9,15}$')]],
    birth_date: [''],
    address: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  loading: boolean = false;
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const val = this.registerForm.value;
    this.authService.register({
      name: val.name,
      email: val.email,
      password: val.password,
      dni: val.dni,
      phone: val.phone,
      birth_date: val.birth_date,
      address: val.address
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.notificationService.success('¡Registro completado con éxito! Bienvenido(a) a Salud Rápida S.A.');
        this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.message || 'Error al registrar paciente. Intente nuevamente.';
        this.errorMessage = msg;
        this.notificationService.error(msg);
      }
    });
  }
}
