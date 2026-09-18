export interface Specialty {
  id: number;
  name: string;
  description: string;
  icon: string;
  doctors_count?: number;
  is_active?: boolean;
}
