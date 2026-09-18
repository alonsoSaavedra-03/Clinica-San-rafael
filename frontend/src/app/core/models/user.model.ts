export type UserRole = 'paciente' | 'medico' | 'administrador';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  dni?: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
  birth_date?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: User;
  token: string;
}
