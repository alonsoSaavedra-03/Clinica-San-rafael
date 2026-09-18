# Backend API — Salud Rápida S.A.

API RESTful desarrollada en **Laravel** con autenticación **Laravel Sanctum** y base de datos **MySQL**, diseñada para alimentar la plataforma web médica de Salud Rápida S.A.

---

## 🛠️ Requisitos Previos
* PHP >= 8.2 con extensiones `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`.
* Composer 2.x
* Servidor MySQL (XAMPP, Laragon, WampServer o Docker)

---

## 🚀 Pasos de Instalación y Despliegue

1. **Copiar archivo de variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Configurar la base de datos en `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=salud_rapida_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Crea la base de datos `salud_rapida_db` en tu motor MySQL o phpMyAdmin)*

3. **Instalar dependencias de Composer:**
   ```bash
   composer install
   ```

4. **Generar la clave de aplicación:**
   ```bash
   php artisan key:generate
   ```

5. **Ejecutar migraciones y seeders con datos iniciales:**
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Iniciar el servidor local:**
   ```bash
   php artisan serve --port=8000
   ```
   La API quedará escuchando en `http://localhost:8000/api/v1`

---

## 🔑 Cuentas Semilla (Seeders) para Pruebas

| Rol | Correo | Contraseña | Detalle |
|---|---|---|---|
| **Administrador** | `admin@saludrapida.pe` | `admin123` | Control total, reportes, KPIs |
| **Médico (Cardiología)** | `carlos.mendoza@saludrapida.pe` | `password123` | CMP: 48291, Cons. 302 |
| **Médico (Pediatría)** | `patricia.silva@saludrapida.pe` | `password123` | CMP: 52104, Cons. 204 |
| **Médico (Traumatología)** | `fernando.benavides@saludrapida.pe` | `password123` | CMP: 39820, Cons. 108 |
| **Médico (Medicina Gral.)** | `gabriela.vega@saludrapida.pe` | `password123` | CMP: 61294, Cons. 101 |
| **Paciente Demo** | `paciente@saludrapida.pe` | `paciente123` | DNI: 72839102 |

---

## 📡 Endpoints Principales

### Autenticación
* `POST /api/v1/auth/register` - Registro público de pacientes
* `POST /api/v1/auth/login` - Inicio de sesión (devuelve Bearer Token Sanctum)
* `GET /api/v1/auth/profile` - Perfil de usuario en sesión (requiere token)
* `POST /api/v1/auth/logout` - Revocación del token activo

### Catálogo y Disponibilidad
* `GET /api/v1/specialties` - Lista de especialidades activas
* `GET /api/v1/doctors` - Directorio médico con filtro `?specialty_id=X&search=nombre`
* `GET /api/v1/doctors/{id}` - Ficha de médico y horarios
* `GET /api/v1/doctors/{id}/available-slots?date=YYYY-MM-DD` - Turnos disponibles en tiempo real (30 min)

### Gestión de Citas
* `GET /api/v1/appointments` - Citas (filtradas por rol: paciente ve las suyas, médico su agenda, admin todas)
* `POST /api/v1/appointments` - Reservar cita con confirmación automática
* `GET /api/v1/appointments/{id}` - Detalle de cita
* `PUT /api/v1/appointments/{id}` - Reprogramar cita
* `PATCH /api/v1/appointments/{id}/cancel` - Cancelar cita con motivo
* `PATCH /api/v1/appointments/{id}/attend` - (Médico) Registrar atención y notas clínicas

### Administración
* `GET /api/v1/admin/dashboard` - Métricas de citas, pacientes e indicadores
* `GET /api/v1/admin/users` - Gestión de usuarios
