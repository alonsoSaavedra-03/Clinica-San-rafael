# Clínica San Rafael — Sistema Web de Reserva de Citas Médicas

> **Clínica San Rafael S.A. | R.U.C. 20584930192 | Registro IPRESS N° 00014285 (SuSalud)**  
> Plataforma web oficial para la reserva, gestión y auditoría de consultas médicas especializadas en tiempo real.  
> **Actualización del Sistema:** Módulo de atención médica clínica, triaje digital, recetas electrónicas y agendamiento interactivo.

---

## 🏥 Descripción del Proyecto

La empresa **Salud Rápida S.A.** (operando bajo la marca asistencial **Clínica San Rafael**) identificó cuellos de botella en la gestión telefónica y presencial de citas médicas: prolongados tiempos de espera, confusión en horarios y pérdida de turnos por falta de confirmación.

Este sistema web dinámico y moderno, construido en **Angular 17**, resuelve integralmente la problemática mediante:
* **Programación en Tiempo Real:** Wizard guiado de 4 pasos para selección de especialidad, médico con fotografía y credenciales colegiadas (CMP/RNE), fechas y turnos (slots de 30 minutos).
* **Gestión Multirrol Diferenciada:** Portales especializados para **Pacientes**, **Médicos** y **Administradores**.
* **Atención Médica Digital:** Módulo interactivo con SweetAlert2 para registrar diagnósticos CIE-10, recetas médicas y emisión de descansos médicos.
* **Identidad Institucional:** Paleta oficial en Azul Marino Real (`#1B365D`) y Rojo Coral Asistencial (`#E63946`), sellos oficiales SuSalud y acreditación hospitalaria internacional.
* **Cero Emojis:** 100% de la interfaz desarrollada con iconografía vectorial SVG y SweetAlert2 institucional.

---

## 🚀 Despliegue en Vercel

Este repositorio incluye la configuración de enrutamiento SPA (`vercel.json`) lista para producción en [Vercel](https://vercel.com).

### Opción 1: Despliegue Directo (Automático)
1. Importa este repositorio (`https://github.com/alonsoSaavedra-03/Clinica-San-rafael`) en Vercel.
2. Vercel detectará la configuración automáticamente desde el archivo raíz `vercel.json` y compilará el frontend con `cd frontend && npm install && npm run build`.

### Opción 2: Configurando Root Directory
* En los ajustes del proyecto en Vercel, define:
  * **Root Directory:** `frontend`
  * **Framework Preset:** Angular
  * **Build Command:** `ng build`
  * **Output Directory:** `dist/frontend/browser`

---

## 💻 Ejecución Local

### Prerrequisitos
* Node.js v18 o superior
* npm v9 o superior

### Instrucciones

```bash
# 1. Clonar el repositorio
git clone https://github.com/alonsoSaavedra-03/Clinica-San-rafael.git
cd Clinica-San-rafael

# 2. Instalar dependencias del frontend
cd frontend
npm install

# 3. Iniciar el servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`.

---

## 👤 Credenciales de Acceso para Pruebas

| Rol | Correo Electrónico | Contraseña | Funcionalidad Principal |
| :--- | :--- | :--- | :--- |
| **Paciente** | `paciente@saludrapida.pe` | `password123` | Reserva de citas, historial, cancelación y reprogramación |
| **Médico** | `carlos.mendoza@saludrapida.pe` | `password123` | Agenda diaria, atención de consultas y prescripción |
| **Administrador** | `admin@saludrapida.pe` | `password123` | Métricas generales, auditoría de citas y control de estado |

---

## 📁 Estructura del Repositorio

```text
Clinica-San-rafael/
├── frontend/                               # Aplicación Angular 17 (Standalone)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                      # Servicios, Modelos, Guards, Interceptors, Pipes
│   │   │   ├── shared/                    # Header, Footer, Modales, Tablas, Componentes
│   │   │   └── features/                  # Home, Especialidades, Médicos, Booking, Dashboards
│   │   └── assets/                        # Fotografías de especialistas y branding
│   ├── vercel.json                        # Reglas de reescritura para SPA en Vercel
│   └── package.json                       # Dependencias y scripts de construcción
├── backend/                               # API RESTful en Laravel (Opcional / Modo Dual)
├── vercel.json                            # Configuración de despliegue raíz para Vercel
└── README.md                              # Documentación del sistema
```

---

## ⚖️ Licencia y Cumplimiento
Desarrollado en cumplimiento de los lineamientos de la **Superintendencia Nacional de Salud (SuSalud)** y el Código de Protección y Defensa del Consumidor (Ley N° 29571).
