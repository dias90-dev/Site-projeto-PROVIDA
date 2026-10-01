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
  clinicalDirector?: string; // Direção Clínica
  municipality?: string;
  province?: string;
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
  triage?: QuickTriageData;
}

export type TriagePriorityLevel = 'verde' | 'amarelo' | 'laranja' | 'azul';

export interface QuickTriageData {
  id: string;
  appointmentId?: string; // Optional: linked to a specific appointment
  protocolNumber?: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientDocument?: string;
  centerId?: MedicalCenterId;
  centerName?: string;
  serviceId?: ServiceType;
  serviceName?: string;
  date: string;
  time: string;
  // Vital Signs
  weight: number | string; // Peso em kg
  height?: number | string; // Altura em cm
  bmi?: number | string; // IMC (kg/m²)
  bmiCategory?: string; // Abaixo do peso, Normal, Sobrepeso, Obesidade
  temperature: number | string; // Temperatura em ºC
  temperatureStatus?: 'normal' | 'febril' | 'febre_alta';
  bloodPressureSystolic: number | string; // Pressão Sistólica (mmHg)
  bloodPressureDiastolic: number | string; // Pressão Diastólica (mmHg)
  bloodPressure: string; // Ex: "120/80 mmHg"
  bloodPressureStatus?: 'otima' | 'normal' | 'pre_hipertensao' | 'hipertensao_1' | 'hipertensao_2' | 'hipotensao';
  heartRate?: number | string; // bpm
  oxygenSaturation?: number | string; // SpO2 %
  bloodGlucose?: number | string; // Glicemia mg/dL
  // Clinical Screening
  painLevel?: number; // 0-10
  mainSymptoms?: string; // Queixa principal
  symptomDuration?: string; // Ex: "Hoje", "Há 2 dias"
  allergies?: string; // Alergias a medicamentos
  currentMedications?: string; // Medicamentos em uso
  priorityLevel: TriagePriorityLevel; // Classificação de Risco (Manchester simplificado)
  observations?: string;
  submittedAt: string;
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
