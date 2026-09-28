export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  documentId?: string; // BI / Identidade
  specialty?: string; // If doctor
  crmOrLicence?: string; // If doctor
  assignedCenterId?: string; // If doctor
}

export type MedicalCenterId = 'mama-muxima' | 'santo-andre' | 'santa-ana';

export interface MedicalCenter {
  id: MedicalCenterId;
  name: string;
  tagline: string;
  address: string;
  zone: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  hours: string;
  image: string;
  description: string;
  facilities: string[];
}

export type ServiceType =
  | 'pediatria'
  | 'clinica-geral'
  | 'pre-natal'
  | 'ginecologia'
  | 'urologia'
  | 'ecografia'
  | 'laboratorio';

export interface ServiceDetail {
  id: ServiceType;
  name: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[]; // e.g. "Jejum de 8 a 12h para exames de sangue"
  icon: string;
  estimatedDuration: string;
  availableCenters: MedicalCenterId[];
  isExameFisico: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: ServiceType;
  specialtyName: string;
  centers: MedicalCenterId[];
  licenseNumber: string;
  bio: string;
  avatar: string;
  availableDays: string[]; // ['Segunda', 'Quarta', 'Sexta']
  timeSlots: string[]; // ['08:00', '08:30', '09:00', ...]
  experienceYears: number;
}

export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled' | 'in_progress';

export interface Appointment {
  id: string;
  protocolNumber: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDocument: string;
  centerId: MedicalCenterId;
  centerName: string;
  serviceId: ServiceType;
  serviceName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  reminderSms: boolean;
  reminderEmail: boolean;
  reminderSent: boolean;
  isTelemedicine?: boolean;
}

export interface MedicalRecord {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  centerId: MedicalCenterId;
  date: string;
  specialty: string;
  symptoms: string;
  diagnosis: string;
  prescription: string; // Medicamentos e dosagem
  labExamOrders?: string; // Requisições de exames físicos ou laboratoriais
  vitalSigns?: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
  };
  clinicalNotes: string;
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  recipientName: string;
  recipientContact: string; // phone or email
  type: 'sms' | 'email';
  timestamp: string;
  message: string;
  status: 'delivered' | 'pending';
}

export interface MonthlyStats {
  month: string;
  totalAppointments: number;
  completedAppointments: number;
  centerStats: {
    mamaMuxima: number;
    santoAndre: number;
    santaAna: number;
  };
  serviceStats: Record<string, number>;
}
