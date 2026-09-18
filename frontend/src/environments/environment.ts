export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  clinicName: 'Clínica San Rafael',
  clinicPhone: '(01) 480-0000',
  clinicEmergency: '(01) 480-0099',
  clinicAddress: 'Av. Javier Prado Este 2450, San Borja, Lima, Perú',
  // Si useMock es true, la aplicación funciona de forma autónoma con datos realistas
  // en localStorage. Si es false, se comunica con Laravel Sanctum en localhost:8000.
  useMock: true
};
