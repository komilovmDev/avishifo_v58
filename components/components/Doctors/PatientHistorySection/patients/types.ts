// /app/patients/types.ts
// Этот файл содержит все определения типов TypeScript для модуля пациентов.

// --- Типы для ответа от API ---
export interface PatientResponse {
  id: number | string;
  full_name: string;
  passport_series: string;
  passport_number: string;
  phone: string | null;
  secondary_phone?: string | null;
  email?: string | null;
  birth_date: string | null;
  gender: string | null;
  blood_group: string | null;
  address: string | null;
  created_at?: string | null;
}

// --- Типы для сущностей в UI ---
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  refill: string;
}

export interface VitalSign {
  date: string;
  bp: string;
  pulse: string;
  temp: string;
  weight: string;
}

export interface HistoryEntry {
  id?: string;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  documents: string[];
}

export interface Patient {
  id: string;
  name: string;
  age: number | string;
  gender: string;
  lastVisit: string;
  status: string;
  statusColor: "amber" | "green" | "blue" | "gray" | string; // Уточняем возможные цвета
  phone: string;
  email: string;
  address: string;
  insurance: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  lastDiagnosis: string;
  avatar?: string;
  nextAppointment: string;
  medications: Medication[];
  vitals: VitalSign[];
  history: HistoryEntry[];
}

// --- Типы для форм ---
export interface NewPatientForm {
  fish: string;
  passportSeries: string;
  passportNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  address: string;
}

export interface NewHistoryEntryForm {
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  documents: string[];
}

export interface NewMedicationForm {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  refill: string;
}

export interface NewVitalsForm {
  date: string;
  bp: string;
  pulse: string;
  temp: string;
  weight: string;
}

export interface NewDocumentForm {
  name: string;
  type: string;
  file: File | null;
}

// Тип для большой формы истории болезни
export interface MedicalHistoryForm {
  fish: string;
  birthDate: string;
  nationality: string;
  education: string;
  profession: string;
  workplace: string;
  workPosition: string;
  homeAddress: string;
  visitDate: string;
  mainComplaints: string;
  systemicDiseases: string;
  respiratoryComplaints: string;
  cough: string;
  sputum: string;
  hemoptysis: string;
  chestPain: string;
  dyspnea: string;
  cardiovascularComplaints: string;
  heartPain: string;
  heartRhythm: string;
  palpitations: string;
  digestiveComplaints: string;
  vomiting: string;
  abdominalPain: string;
  epigastricPain: string;
  bowelMovements: string;
  analSymptoms: string;
  urinaryComplaints: string;
  endocrineComplaints: string;
  musculoskeletalComplaints: string;
  nervousSystemComplaints: string;
  doctorRecommendations: string;
}