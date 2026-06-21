export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  RESEARCHER = 'RESEARCHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  nmcId?: string; // National Medical Commission ID
  imrNumber?: string; // Indian Medical Register Number
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface PatientRecord {
  id: string;
  date: string;
  diagnosis: string;
  doctor: string;
  treatmentType: 'Allopathy' | 'Ayurveda' | 'Homeopathy' | 'Integrated';
  status: 'Ongoing' | 'Recovered' | 'Critical';
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: 'Video' | 'In-Person';
  status: 'Confirmed' | 'Pending';
}

export interface ComparisonData {
  condition: string;
  allopathyScore: number;
  ayurvedaScore: number;
  homeopathyScore: number;
  integratedScore: number;
}