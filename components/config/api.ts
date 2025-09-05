// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Authentication
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh/`,
    
    // Patients
    PATIENTS: `${API_BASE_URL}/api/patients/patientlar/`,
    PATIENT_DETAIL: (id: string) => `${API_BASE_URL}/api/patients/patientlar/${id}/`,
    PATIENT_UPDATE: (id: string) => `${API_BASE_URL}/api/patients/patientlar/${id}/update/`,
    PATIENT_DELETE: (id: string) => `${API_BASE_URL}/api/patients/patientlar/${id}/delete/`,
    PATIENT_ARCHIVE: (id: string) => `${API_BASE_URL}/api/patients/patientlar/${id}/archive/`,
    
    // Medical Records
    MEDICAL_RECORDS: `${API_BASE_URL}/api/patients/medical-records/`,
    
    // Medications
    MEDICATIONS: `${API_BASE_URL}/api/patients/prescriptions/`,
    MEDICATION_CREATE: `${API_BASE_URL}/api/patients/prescriptions/`,
    MEDICATION_UPDATE: (id: string) => `${API_BASE_URL}/api/patients/prescriptions/${id}/`,
    MEDICATION_DELETE: (id: string) => `${API_BASE_URL}/api/patients/prescriptions/${id}/`,
    
    // Chat
    CHAT_SESSIONS: `${API_BASE_URL}/api/chat/gpt/chats/`,
    CHAT_SEND_MESSAGE: (id: string) => `${API_BASE_URL}/api/chat/gpt/chats/${id}/send_message/`,
    
    // Profile
    PROFILE: `${API_BASE_URL}/api/accounts/profile/`,
  }
};

export default API_CONFIG;
