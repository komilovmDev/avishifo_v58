"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/config/api";

// Импортируем все типы из нашего центрального файла
import {
  Patient,
  PatientResponse,
  NewPatientForm,
  MedicalHistoryForm,
  NewMedicationForm,
  NewDocumentForm,
  HistoryEntry,
  Medication,
  VitalSign,
} from "./types";

// Импортируем компоненты, которые мы создали
import { PatientListView } from "./components/PatientListView";
import { PatientDetailView } from "./components/PatientDetailView";
import { CreatePatientDialog } from "./components/dialogs/CreatePatientDialog";
import { AddHistoryDialog } from "./components/dialogs/AddHistoryDialog";
import { EditHistoryDialog } from "./components/dialogs/EditHistoryDialog";
import { AddMedicationDialog } from "./components/dialogs/AddMedicationDialog";
import { AddVitalsDialog } from "./components/dialogs/AddVitalsDialog";
import { AddDocumentDialog } from "./components/dialogs/AddDocumentDialog";
import { Loader2 } from "lucide-react";

// Моковые данные в качестве ЗАПАСНОГО варианта на случай ошибки API во время разработки.
const FALLBACK_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Иванов Иван (Fallback)",
    age: 45,
    gender: "Мужской",
    lastVisit: "2 дня назад",
    status: "Наблюдение",
    statusColor: "amber",
    phone: "+7 (900) 123-45-67",
    email: "ivanov@example.com",
    address: "г. Москва, ул. Ленина, д. 10, кв. 15",
    insurance: "ОМС №1234567890",
    bloodType: "A(II) Rh+",
    allergies: ["Пенициллин"],
    chronicConditions: ["Гипертония"],
    lastDiagnosis: "Компенсированный сахарный диабет",
    nextAppointment: "25.08.2024",
    medications: [],
    vitals: [],
    history: [],
  },
  {
    id: "p2",
    name: "Петрова Анна (Fallback)",
    age: 32,
    gender: "Женский",
    lastVisit: "1 неделю назад",
    status: "Активное лечение",
    statusColor: "green",
    phone: "+7 (900) 987-65-43",
    email: "petrova@example.com",
    address: "г. Санкт-Петербург, ул. Пушкина, д. 5, кв. 42",
    insurance: "ОМС №0987654321",
    bloodType: "O(I) Rh-",
    allergies: ["Орехи"],
    chronicConditions: ["Бронхиальная астма"],
    lastDiagnosis: "БА, контролируемое течение",
    nextAppointment: "30.08.2024",
    medications: [],
    vitals: [],
    history: [],
  },
];

export default function PatientsPage() {
  const router = useRouter();

  // --- Состояние компонента ---
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [showCreatePatientDialog, setShowCreatePatientDialog] = useState(false);
  const [showAddHistoryDialog, setShowAddHistoryDialog] = useState(false);
  const [showEditHistoryDialog, setShowEditHistoryDialog] = useState(false);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState<HistoryEntry | null>(null);
  const [showAddMedicationDialog, setShowAddMedicationDialog] = useState(false);
  const [showAddVitalsDialog, setShowAddVitalsDialog] = useState(false);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);

  const [newPatient, setNewPatient] = useState<NewPatientForm>({
    fish: "",
    passportSeries: "",
    passportNumber: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "Мужской",
    bloodType: "A(II) Rh+",
    address: "",
  });
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryForm>({
    fish: "",
    birthDate: "",
    nationality: "",
    education: "",
    profession: "",
    workplace: "",
    workPosition: "",
    homeAddress: "",
    visitDate: "",
    mainComplaints: "",
    systemicDiseases: "",
    respiratoryComplaints: "",
    cough: "",
    sputum: "",
    hemoptysis: "",
    chestPain: "",
    dyspnea: "",
    cardiovascularComplaints: "",
    heartPain: "",
    heartRhythm: "",
    palpitations: "",
    digestiveComplaints: "",
    vomiting: "",
    abdominalPain: "",
    epigastricPain: "",
    bowelMovements: "",
    analSymptoms: "",
    urinaryComplaints: "",
    endocrineComplaints: "",
    musculoskeletalComplaints: "",
    nervousSystemComplaints: "",
    doctorRecommendations: "",
    respiratoryFiles: [],
    cardiovascularFiles: [],
    digestiveFiles: [],
    urinaryFiles: [],
    endocrineFiles: [],
    musculoskeletalFiles: [],
    nervousSystemFiles: [],
  });
  const [newMedication, setNewMedication] = useState<NewMedicationForm>({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    refill: "",
  });
  const [newDocument, setNewDocument] = useState<NewDocumentForm>({
    name: "",
    type: "",
    file: null,
  });

  // --- Взаимодействие с API ---
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found. Please log in.");

      const response = await fetch(
        API_CONFIG.ENDPOINTS.PATIENTS,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const patientsArray = Array.isArray(data)
        ? data
        : data.data || data.results || [];

      const validPatients = patientsArray.filter(
        (p: any): p is PatientResponse =>
          p != null && typeof p === "object" && "id" in p
      );

      const transformedPatients = validPatients.map(
        (patient: PatientResponse): Patient => ({
          id: String(patient.id),
          name: patient.full_name || "Не указано",
          phone: patient.phone || "Не указан",
          email: patient.email || "Не указан",
          address: patient.address || "Не указан",
          age: patient.birth_date
            ? Math.floor(
                (new Date().getTime() -
                  new Date(patient.birth_date).getTime()) /
                  31557600000
              )
            : "Не указан",
          gender: patient.gender || "Не указан",
          lastVisit: patient.created_at
            ? new Date(patient.created_at).toLocaleDateString("ru-RU")
            : "Неизвестно",
          status: patient.status === 'archived' ? 'Архив' : patient.status === 'active' ? 'Активный' : 'Наблюдение',
          statusColor: patient.status === 'archived' ? 'gray' : patient.status === 'active' ? 'green' : 'amber',
          insurance: `ОМС №${patient.passport_series || ""}${
            patient.passport_number || ""
          }`,
          bloodType: patient.blood_group || "Не указан",
          allergies: [],
          chronicConditions: [],
          lastDiagnosis: "Первичный осмотр",
          nextAppointment: "Не назначено",
          medications: (() => {
            try {
              const raw = localStorage.getItem("avishifo_patient_meds")
              const map = raw ? JSON.parse(raw) : {}
              const list = Array.isArray(map[String(patient.id)]) ? map[String(patient.id)] : []
              return list
            } catch {
              return []
            }
          })(),
          vitals: (() => {
            try {
              const raw = localStorage.getItem("avishifo_patient_vitals")
              const map = raw ? JSON.parse(raw) : {}
              const list = Array.isArray(map[String(patient.id)]) ? map[String(patient.id)] : []
              return list
            } catch {
              return []
            }
          })(),
          history: [],
        })
      );

      setPatients(transformedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert(
        `Ошибка загрузки пациентов: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Будут показаны запасные данные.`
      );
      setPatients(FALLBACK_PATIENTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Вызываем загрузку данных при первом рендере
  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle URL parameters for persistent routing
  useEffect(() => {
    // Check if there's a patient ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const patientIdFromUrl = urlParams.get('patient');
    
    if (patientIdFromUrl && patientIdFromUrl !== selectedPatientId) {
      setSelectedPatientId(patientIdFromUrl);
    }
  }, []);

  // Update selectedPatient when selectedPatientId changes
  useEffect(() => {
    if (selectedPatientId) {
      console.log("Looking for patient with ID:", selectedPatientId, "Type:", typeof selectedPatientId);
      console.log("Available patients:", patients.map(p => ({ id: p.id, type: typeof p.id, name: p.name })));
      
      const patient = patients.find((p) => String(p.id) === String(selectedPatientId));
      console.log("Found patient:", patient);
      setSelectedPatient(patient || null);
    } else {
      setSelectedPatient(null);
    }
  }, [selectedPatientId, patients]);

  // Fetch medical history when a patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      fetchMedicalHistory(selectedPatientId);
      // Update URL to include patient ID
      const url = new URL(window.location.href);
      url.searchParams.set('patient', selectedPatientId);
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [selectedPatientId, router]);

  // --- Обработчики ---
  const createPatientHandler = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found. Please log in.");

      // Map UI values to backend expected fields
      const mapGender = (g: string) => (g === "Женский" ? "female" : g === "Мужской" ? "male" : null);
      const mapBloodGroup = (b: string) => {
        switch (b) {
          case "A(II) Rh+": return "A+";
          case "A(II) Rh-": return "A-";
          case "B(III) Rh+": return "B+";
          case "B(III) Rh-": return "B-";
          case "AB(IV) Rh+": return "AB+";
          case "AB(IV) Rh-": return "AB-";
          case "O(I) Rh+": return "O+";
          case "O(I) Rh-": return "O-";
          default: return null;
        }
      };

      const payload = {
        full_name: newPatient.fish,
        passport_series: newPatient.passportSeries,
        passport_number: newPatient.passportNumber,
        phone: newPatient.phone || null,
        birth_date: newPatient.birthDate || null,
        gender: mapGender(newPatient.gender),
        blood_group: mapBloodGroup(newPatient.bloodType),
        address: newPatient.address || null,
        status: 'active',
      } as any;

              const response = await fetch(`${API_CONFIG.BASE_URL}/api/patients/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create patient: ${response.status} ${text}`);
      }

      // Close dialog and refresh list
      setShowCreatePatientDialog(false);
      await fetchPatients();
    } catch (error) {
      console.error("Error creating patient:", error);
      alert(`Ошибка создания пациента: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const addHistoryEntryHandler = async () => {
    if (!selectedPatientId) {
      console.error("No patient selected for adding history.");
      return;
    }

    const formData = new FormData();
    formData.append("patient", selectedPatientId);

    // Map text fields to backend format
    formData.append("fish", medicalHistory.fish || "");
    formData.append("tugilgan_sana", medicalHistory.birthDate || "");
    formData.append("millati", medicalHistory.nationality || "");
    formData.append("malumoti", medicalHistory.education || "");
    formData.append("kasbi", medicalHistory.profession || "");
    formData.append("ish_joyi", medicalHistory.workplace || "");
    formData.append("ish_vazifasi", medicalHistory.workPosition || "");
    formData.append("uy_manzili", medicalHistory.homeAddress || "");
    formData.append("kelgan_vaqti", medicalHistory.visitDate || new Date().toISOString());
    formData.append("shikoyatlar", medicalHistory.mainComplaints || "");
    formData.append("asosiy_kasalliklar", medicalHistory.systemicDiseases || "");
    formData.append("nafas_tizimi", medicalHistory.respiratoryComplaints || "");
    formData.append("yurak_qon_shikoyatlari", medicalHistory.cardiovascularComplaints || "");
    formData.append("hazm_tizimi", medicalHistory.digestiveComplaints || "");
    formData.append("siydik_tizimi", medicalHistory.urinaryComplaints || "");
    formData.append("endokrin_tizimi", medicalHistory.endocrineComplaints || "");
    formData.append("tayanch_tizimi", medicalHistory.musculoskeletalComplaints || "");
    formData.append("asab_tizimi", medicalHistory.nervousSystemComplaints || "");
    formData.append("doktor_tavsiyalari", medicalHistory.doctorRecommendations || "");

    // Add files
    (medicalHistory.respiratoryFiles || []).forEach((file) =>
      formData.append("nafas_tizimi_hujjat", file)
    );
    (medicalHistory.cardiovascularFiles || []).forEach((file) =>
      formData.append("yurak_qon_shikoyatlari_hujjat", file)
    );
    (medicalHistory.digestiveFiles || []).forEach((file) =>
      formData.append("hazm_tizimi_hujjat", file)
    );
    (medicalHistory.urinaryFiles || []).forEach((file) =>
      formData.append("siydik_tizimi_hujjat", file)
    );
    (medicalHistory.endocrineFiles || []).forEach((file) =>
      formData.append("endokrin_tizimi_hujjat", file)
    );
    (medicalHistory.musculoskeletalFiles || []).forEach((file) =>
      formData.append("tayanch_tizimi_hujjat", file)
    );
    (medicalHistory.nervousSystemFiles || []).forEach((file) =>
      formData.append("asab_tizimi_hujjat", file)
    );

    try {
      const token = localStorage.getItem("accessToken");
      
      // Debug: Log what we're sending to backend
      console.log("Sending to backend:", {
        patient: selectedPatientId,
        kelgan_vaqti: medicalHistory.visitDate || new Date().toISOString(),
        fish: medicalHistory.fish,
        shikoyatlar: medicalHistory.mainComplaints
      });
      
              const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/`,
          {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to save medical history");
      
      // Close the dialog after successful submission
      handleCloseAddHistoryDialog();
      
      // Refresh the specific patient's medical history
      if (selectedPatientId) {
        await fetchMedicalHistory(selectedPatientId);
      }
    } catch (error) {
      console.error("Error saving history:", error);
      alert("Ошибка при сохранении истории болезни.");
    }
  };

  const editHistoryEntryHandler = async (updatedHistory: MedicalHistoryForm) => {
    if (!selectedPatientId) {
      console.error("No patient selected for editing history.");
      return;
    }

    const formData = new FormData();
    formData.append("patient", selectedPatientId);

    // Map text fields to backend format
    formData.append("fish", updatedHistory.fish || "");
    formData.append("tugilgan_sana", updatedHistory.birthDate || "");
    formData.append("millati", updatedHistory.nationality || "");
    formData.append("malumoti", updatedHistory.education || "");
    formData.append("kasbi", updatedHistory.profession || "");
    formData.append("ish_joyi", updatedHistory.workplace || "");
    formData.append("ish_vazifasi", updatedHistory.workPosition || "");
    formData.append("uy_manzili", updatedHistory.homeAddress || "");
    formData.append("kelgan_vaqti", updatedHistory.visitDate || new Date().toISOString());
    formData.append("shikoyatlar", updatedHistory.mainComplaints || "");
    formData.append("asosiy_kasalliklar", updatedHistory.systemicDiseases || "");
    formData.append("nafas_tizimi", updatedHistory.respiratoryComplaints || "");
    formData.append("yurak_qon_shikoyatlari", updatedHistory.cardiovascularComplaints || "");
    formData.append("hazm_tizimi", updatedHistory.digestiveComplaints || "");
    formData.append("siydik_tizimi", updatedHistory.urinaryComplaints || "");
    formData.append("endokrin_tizimi", updatedHistory.endocrineComplaints || "");
    formData.append("tayanch_tizimi", updatedHistory.musculoskeletalComplaints || "");
    formData.append("asab_tizimi", updatedHistory.nervousSystemComplaints || "");
    formData.append("doktor_tavsiyalari", updatedHistory.doctorRecommendations || "");

    // Add files
    (updatedHistory.respiratoryFiles || []).forEach((file) =>
      formData.append("nafas_tizimi_hujjat", file)
    );
    (updatedHistory.cardiovascularFiles || []).forEach((file) =>
      formData.append("yurak_qon_shikoyatlari_hujjat", file)
    );
    (updatedHistory.digestiveFiles || []).forEach((file) =>
      formData.append("hazm_tizimi_hujjat", file)
    );
    (updatedHistory.urinaryFiles || []).forEach((file) =>
      formData.append("siydik_tizimi_hujjat", file)
    );
    (updatedHistory.endocrineFiles || []).forEach((file) =>
      formData.append("endokrin_tizimi_hujjat", file)
    );
    (updatedHistory.musculoskeletalFiles || []).forEach((file) =>
      formData.append("tayanch_tizimi_hujjat", file)
    );
    (updatedHistory.nervousSystemFiles || []).forEach((file) =>
      formData.append("asab_tizimi_hujjat", file)
    );

    try {
      const token = localStorage.getItem("accessToken");
      
      // Debug: Log what we're sending to backend
      console.log("Editing - Sending to backend:", {
        patient: selectedPatientId,
        kelgan_vaqti: updatedHistory.visitDate || new Date().toISOString(),
        fish: updatedHistory.fish,
        shikoyatlar: updatedHistory.mainComplaints
      });
      
              const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/`,
          {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update medical history");
      
      // Close the dialog after successful submission
      handleCloseEditHistoryDialog();
      
      // Refresh the specific patient's medical history
      if (selectedPatientId) {
        await fetchMedicalHistory(selectedPatientId);
      }
    } catch (error) {
      console.error("Error updating history:", error);
      throw new Error("Ошибка при обновлении истории болезни.");
    }
  };

  const handleOpenEditHistoryDialog = (entry: HistoryEntry) => {
    setEditingHistoryEntry(entry);
    setShowEditHistoryDialog(true);
  };

  const handleCloseEditHistoryDialog = () => {
    setEditingHistoryEntry(null);
    setShowEditHistoryDialog(false);
  };

  const clearMedicalHistoryForm = () => {
    setMedicalHistory({
      fish: "",
      birthDate: "",
      nationality: "",
      education: "",
      profession: "",
      workplace: "",
      workPosition: "",
      homeAddress: "",
      visitDate: new Date().toISOString().split('T')[0], // Set current date for new entries
      mainComplaints: "",
      systemicDiseases: "",
      respiratoryComplaints: "",
      cough: "",
      sputum: "",
      hemoptysis: "",
      chestPain: "",
      dyspnea: "",
      cardiovascularComplaints: "",
      heartPain: "",
      heartRhythm: "",
      palpitations: "",
      digestiveComplaints: "",
      vomiting: "",
      abdominalPain: "",
      epigastricPain: "",
      bowelMovements: "",
      analSymptoms: "",
      urinaryComplaints: "",
      endocrineComplaints: "",
      musculoskeletalComplaints: "",
      nervousSystemComplaints: "",
      doctorRecommendations: "",
      respiratoryFiles: [],
      cardiovascularFiles: [],
      digestiveFiles: [],
      urinaryFiles: [],
      endocrineFiles: [],
      musculoskeletalFiles: [],
      nervousSystemFiles: [],
    });
  };

  const handleOpenAddHistoryDialog = () => {
    // Reset form and set current date
    setMedicalHistory({
      fish: "",
      birthDate: "",
      nationality: "",
      education: "",
      profession: "",
      workplace: "",
      workPosition: "",
      homeAddress: "",
      visitDate: new Date().toISOString().split('T')[0], // Set current date for new entries
      mainComplaints: "",
      systemicDiseases: "",
      respiratoryComplaints: "",
      cough: "",
      sputum: "",
      hemoptysis: "",
      chestPain: "",
      dyspnea: "",
      cardiovascularComplaints: "",
      heartPain: "",
      heartRhythm: "",
      palpitations: "",
      digestiveComplaints: "",
      vomiting: "",
      abdominalPain: "",
      epigastricPain: "",
      bowelMovements: "",
      analSymptoms: "",
      urinaryComplaints: "",
      endocrineComplaints: "",
      musculoskeletalComplaints: "",
      nervousSystemComplaints: "",
      doctorRecommendations: "",
      respiratoryFiles: [],
      cardiovascularFiles: [],
      digestiveFiles: [],
      urinaryFiles: [],
      endocrineFiles: [],
      musculoskeletalFiles: [],
      nervousSystemFiles: [],
    });
    setShowAddHistoryDialog(true);
  };

  const handleCloseAddHistoryDialog = () => {
    setShowAddHistoryDialog(false);
    clearMedicalHistoryForm();
  };

  const addMedicationHandler = async () => {
    // UI-level storage because backend requires medical_record_id
    if (!selectedPatientId) {
      alert("Сначала выберите пациента.")
      return
    }

    // Update UI state
    setPatients((prev) => prev.map((p) => (
      p.id === selectedPatientId
        ? { ...p, medications: [...p.medications, { ...newMedication }] }
        : p
    )))

    // Persist to localStorage per patient
    const storageKey = "avishifo_patient_meds"
    const raw = localStorage.getItem(storageKey)
    const map = raw ? JSON.parse(raw) : {}
    const list = Array.isArray(map[selectedPatientId]) ? map[selectedPatientId] : []
    map[selectedPatientId] = [...list, { ...newMedication }]
    localStorage.setItem(storageKey, JSON.stringify(map))

    setShowAddMedicationDialog(false)
  };


  const fetchMedicalHistory = async (patientId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found.");

              const response = await fetch(`${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/?patient_id=${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const historyData = Array.isArray(data) ? data : [data];
      
      // Debug: Log the raw data from backend
      console.log("Raw history data from backend:", historyData);

      // Transform backend data to frontend format
      const transformedHistory: HistoryEntry[] = historyData.map((entry: any) => {
        // Collect all file fields from the entry with full URLs
        const allFiles: string[] = [];
        
        // Check all possible file fields and add them to the documents array
        const fileFields = [
          'asosiy_kasalliklar_hujjat',
          'nafas_tizimi_hujjat',
          'yotal_hujjat',
          'balgam_hujjat',
          'qon_tuflash_hujjat',
          'kokrak_ogriq_hujjat',
          'nafas_qisishi_hujjat',
          'yurak_qon_shikoyatlari_hujjat',
          'yurak_ogriq_hujjat',
          'yurak_urishi_ozgarishi_hujjat',
          'yurak_urishi_sezish_hujjat',
          'hazm_tizimi_hujjat',
          'qusish_hujjat',
          'qorin_ogriq_hujjat',
          'qorin_shish_hujjat',
          'ich_ozgarishi_hujjat',
          'anus_shikoyatlar_hujjat',
          'siydik_tizimi_hujjat',
          'endokrin_tizimi_hujjat',
          'tayanch_tizimi_hujjat',
          'asab_tizimi_hujjat',
          'doktor_tavsiyalari_hujjat'
        ];

        fileFields.forEach(field => {
          if (entry[field]) {
            // Store the full file path/URL for access
            allFiles.push(entry[field]);
          }
        });

        // Parse the date properly from backend
        let parsedDate: Date;
        
        // Debug: Log all available date fields
        console.log(`Entry ${entry.id} date fields:`, {
          kelgan_vaqti: entry.kelgan_vaqti,
          yuborilgan_vaqt: entry.yuborilgan_vaqt,
          created_at: entry.created_at,
          updated_at: entry.updated_at
        });
        
        // Priority order for date fields: kelgan_vaqti > created_at > updated_at > yuborilgan_vaqt
        if (entry.kelgan_vaqti) {
          parsedDate = new Date(entry.kelgan_vaqti);
        } else if (entry.created_at) {
          parsedDate = new Date(entry.created_at);
        } else if (entry.updated_at) {
          parsedDate = new Date(entry.updated_at);
        } else if (entry.yuborilgan_vaqt) {
          parsedDate = new Date(entry.yuborilgan_vaqt);
        } else {
          parsedDate = new Date();
        }

        // Format date for display
        const formattedDate = parsedDate.toLocaleDateString("ru-RU");
        
        // Store the original date for sorting - ensure it's a valid ISO string
        const originalDate = parsedDate.toISOString();
        
        // Debug logging for date parsing
        console.log(`Entry ${entry.id}: kelgan_vaqti=${entry.kelgan_vaqti}, parsed=${parsedDate.toISOString()}, formatted=${formattedDate}`);
        
        // Validate parsed date
        if (isNaN(parsedDate.getTime())) {
          console.warn(`Invalid date parsed for entry ${entry.id}, using current date`);
          parsedDate = new Date();
        }

        return {
          id: `hist-${entry.id}`,
          date: formattedDate,
          originalDate: originalDate, // Add this for proper sorting
          type: "Kasallik tarixi (Uzbek)",
          doctor: "Joriy shifokor",
          diagnosis: entry.shikoyatlar?.split("\n")[0] || "Kompleks tekshiruv",
          notes: `
ASOSIY MA'LUMOTLAR:
F.I.SH: ${entry.fish || "Kiritilmagan"}
Tug'ilgan sanasi: ${entry.tugilgan_sana || "Kiritilmagan"}
Millati: ${entry.millati || "Kiritilmagan"}
Ma'lumoti: ${entry.malumoti || "Kiritilmagan"}
Kasbi: ${entry.kasbi || "Kiritilmagan"}
Ish joyi: ${entry.ish_joyi || "Kiritilmagan"}
Ish joyidagi vazifasi: ${entry.ish_vazifasi || "Kiritilmagan"}
Uy manzili: ${entry.uy_manzili || "Kiritilmagan"}

KELGAN VAQTDAGI SHIKOYATLARI:
${entry.shikoyatlar || "Kiritilmagan"}

BEMORNING ASOSIY TIZIMLI KASALLIKLARI:
${entry.asosiy_kasalliklar || "Kiritilmagan"}

NAFAS TIZIMIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${entry.nafas_tizimi || "Kiritilmagan"}
Yo'tal: ${entry.yotal || "Kiritilmagan"}
Balg'am: ${entry.balgam || "Kiritilmagan"}
Qon tuflash: ${entry.qon_tuflash || "Kiritilmagan"}
Ko'krak qafasidagi og'riq: ${entry.kokrak_ogriq || "Kiritilmagan"}
Nafas qisishi: ${entry.nafas_qisishi || "Kiritilmagan"}

YURAK QON AYLANISHI TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${entry.yurak_qon_shikoyatlari || "Kiritilmagan"}
Yurak sohasidagi og'riq: ${entry.yurak_ogriq || "Kiritilmagan"}
Yurak urishining o'zgarishi: ${entry.yurak_urishi_ozgarishi || "Kiritilmagan"}
Yurak urishini bemor his qilishi: ${entry.yurak_urishi_sezish || "Kiritilmagan"}

HAZM TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${entry.hazm_tizimi || "Kiritilmagan"}
Qusish: ${entry.qusish || "Kiritilmagan"}
Qorin og'riqi: ${entry.qorin_ogriq || "Kiritilmagan"}
To'sh osti va boshqa sohalarda og'riq: ${entry.qorin_shish || "Kiritilmagan"}
Ich kelishining o'zgarishi: ${entry.ich_ozgarishi || "Kiritilmagan"}
Anus sohasidagi simptomlar: ${entry.anus_shikoyatlar || "Kiritilmagan"}

SIYDIK AJRATISH TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${entry.siydik_tizimi || "Kiritilmagan"}

ENDOKRIN TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${entry.endokrin_tizimi || "Kiritilmagan"}

TAYANCH HARAKAT TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${entry.tayanch_tizimi || "Kiritilmagan"}

ASAB TIZIMI:
${entry.asab_tizimi || "Kiritilmagan"}

DOKTOR TAVSIYALARI:
${entry.doktor_tavsiyalari || "Kiritilmagan"}
          `.trim(),
          documents: allFiles,
        };
      });

      // Sort history entries by date (newest first)
      const sortedHistory = transformedHistory.sort((a, b) => {
        // Use the original date for accurate sorting
        const dateA = new Date(a.originalDate || a.date);
        const dateB = new Date(b.originalDate || b.date);
        
        // Validate dates
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          console.warn(`Invalid date detected: A=${a.originalDate || a.date}, B=${b.originalDate || b.date}`);
          return 0; // Keep original order for invalid dates
        }
        
        // Debug logging
        console.log(`Sorting: ${a.date} (${dateA.toISOString()}) vs ${b.date} (${dateB.toISOString()})`);
        
        // Newest entries should appear at the TOP (descending order)
        const result = dateB.getTime() - dateA.getTime();
        console.log(`Sort result: ${result} (${result > 0 ? 'B comes first' : result < 0 ? 'A comes first' : 'equal'})`);
        return result;
      });

      // Update the patient's history in the local state
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === patientId
            ? { ...p, history: sortedHistory }
            : p
        )
      );

      console.log("Medical history refreshed for patient:", patientId);
      console.log("Sorted history order:", sortedHistory.map(h => ({ date: h.date, originalDate: h.originalDate })));
      
      // Debug: Log the final sorted result
      console.log("Final sorted history entries:", sortedHistory.map((entry, index) => ({
        index,
        id: entry.id,
        date: entry.date,
        originalDate: entry.originalDate,
        parsedDate: new Date(entry.originalDate || entry.date).toISOString()
      })));
      
      // Additional debug: Show the actual order in the UI
      console.log("UI Display Order (should be newest first):");
      sortedHistory.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.date} - ${entry.diagnosis}`);
      });
    } catch (error) {
      console.error("Error fetching medical history:", error);
      alert(`Error fetching medical history: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const addDocumentHandler = async () => {
    // UI-level add document with persistent data URL in localStorage + immediate UI update
    if (!selectedPatientId) {
      alert("Сначала выберите пациента.")
      return
    }

    const file = newDocument.file
    const fileName = newDocument.name || (file ? file.name : "Документ")
    const fileType = newDocument.type || (file ? file.type : "")
    const dateStr = new Date().toLocaleDateString('ru-RU')

    let dataUrl: string | null = null
    if (file) {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => resolve(String(fr.result || ''))
        fr.onerror = () => reject(new Error('Failed to read file'))
        fr.readAsDataURL(file)
      }).catch(() => null) as string | null
    }

    // Immediate UI update: attach the document name to latest history entry
    setPatients((prev) => prev.map((p) => {
      if (p.id !== selectedPatientId) return p
      let history = [...p.history]
      if (history.length === 0) {
        history = [{ id: `hist-temp-${Date.now()}`, date: dateStr, type: 'Документ', doctor: '—', diagnosis: '—', notes: '', documents: [] }]
      }
      history[history.length - 1] = {
        ...history[history.length - 1],
        documents: [...history[history.length - 1].documents, fileName]
      }
      return { ...p, history }
    }))

    // Persist full document (name, type, date, dataUrl) per patient
    const storageKey = "avishifo_patient_docs"
    const raw = localStorage.getItem(storageKey)
    const map = raw ? JSON.parse(raw) : {}
    const list = Array.isArray(map[selectedPatientId]) ? map[selectedPatientId] : []
    map[selectedPatientId] = [...list, { name: fileName, type: fileType, date: dateStr, url: dataUrl }]
    localStorage.setItem(storageKey, JSON.stringify(map))

    setShowAddDocumentDialog(false)
  };

  // Фильтрация и выборка данных
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(searchLower) ||
      patient.lastDiagnosis.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower);
    const matchesFilter = !filterStatus || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });


  // --- Delete and Archive Handlers ---
  const handleDeletePatient = async (patientId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      console.log("Deleting patient with ID:", patientId);
      console.log("Delete URL:", API_CONFIG.ENDPOINTS.PATIENT_DELETE(patientId));
      console.log("Patient ID type:", typeof patientId);

      const response = await fetch(
        API_CONFIG.ENDPOINTS.PATIENT_DELETE(patientId),
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove patient from local state
      setPatients(prev => prev.filter(p => p.id !== patientId));
      
      // If deleted patient was selected, clear selection
      if (selectedPatientId === patientId) {
        setSelectedPatientId(null);
        const url = new URL(window.location.href);
        url.searchParams.delete('patient');
        router.replace(url.pathname + url.search, { scroll: false });
      }

      console.log("Patient deleted successfully");
    } catch (error) {
      console.error("Error deleting patient:", error);
      // You might want to show a toast notification here
    }
  };

  const handleArchivePatient = async (patientId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      console.log("Archiving patient with ID:", patientId);
      console.log("Archive URL:", API_CONFIG.ENDPOINTS.PATIENT_ARCHIVE(patientId));
      console.log("Patient ID type:", typeof patientId);

      // Update patient status to archived
      const response = await fetch(
        API_CONFIG.ENDPOINTS.PATIENT_ARCHIVE(patientId),
        {
          method: "PATCH",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Archive response:", result);

      // Update patient in local state using backend response
      setPatients(prev => 
        prev.map(p => 
          p.id === patientId 
            ? { ...p, status: "Архив", statusColor: "gray" }
            : p
        )
      );

      console.log("Patient archived successfully");
    } catch (error) {
      console.error("Error archiving patient:", error);
      // You might want to show a toast notification here
    }
  };

  const handleUnarchivePatient = async (patientId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      console.log("Unarchiving patient with ID:", patientId);

      // Update patient status to active
      const response = await fetch(
        API_CONFIG.ENDPOINTS.PATIENT_ARCHIVE(patientId),
        {
          method: "PATCH",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: 'active' })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Unarchive response:", result);

      // Update patient in local state
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === patientId 
            ? { ...patient, status: 'Активный', statusColor: 'green' }
            : patient
        )
      );

      console.log("Patient unarchived successfully");
    } catch (error) {
      console.error("Error unarchiving patient:", error);
      // You might want to show a toast notification here
    }
  };

  const handleAddMedication = async (medicationData: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      console.log("Adding medication to backend:", medicationData);
      console.log("Selected patient:", selectedPatient);

      // Find or create medical record for this patient
      let medicalRecord = selectedPatient?.medicalRecords?.[0];
      
      if (!medicalRecord) {
        console.log("No medical record found, creating one...");
        console.log("Patient ID:", selectedPatient?.id, "Type:", typeof selectedPatient?.id);
        
        // First, let's check if patient exists in backend
        const patientCheckResponse = await fetch(API_CONFIG.ENDPOINTS.PATIENT_DETAIL(selectedPatient?.id || ''), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!patientCheckResponse.ok) {
          throw new Error(`Patient with ID ${selectedPatient?.id} not found in backend`);
        }
        
        const patientData = await patientCheckResponse.json();
        console.log("Patient data from backend:", patientData);
        
        // Use the actual patient ID from backend
        const actualPatientId = patientData.id || selectedPatient?.id;
        
        // Create a medical record for this patient
        const createRecordResponse = await fetch(API_CONFIG.ENDPOINTS.MEDICAL_RECORDS, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            patient_id: actualPatientId,
            chief_complaint: "Общий осмотр",
            diagnosis: "Общий осмотр",
            notes: "Медицинская карта создана автоматически"
          })
        });

        if (!createRecordResponse.ok) {
          const errorText = await createRecordResponse.text();
          console.error("Medical record creation error:", errorText);
          throw new Error(`Failed to create medical record: ${createRecordResponse.status} - ${errorText}`);
        }

        medicalRecord = await createRecordResponse.json();
        console.log("Created medical record:", medicalRecord);
        
        // Update selectedPatient with the new medical record
        setSelectedPatient(prev => 
          prev ? { 
            ...prev, 
            medicalRecords: [medicalRecord]
          } : null
        );
      }

      // Prepare data for backend
      const backendData = {
        medical_record_id: medicalRecord.id,
        medication_name: medicationData.name,
        dosage: medicationData.dosage,
        frequency: medicationData.frequency,
        start_date: medicationData.time,
        end_date: medicationData.refill || null,
        instructions: medicationData.instructions || ""
      };
      
      console.log("Backend data for medication creation:", backendData);
      console.log("Medical record ID:", medicalRecord.id, "Type:", typeof medicalRecord.id);

      // Create medication in backend
      console.log("Sending request to:", API_CONFIG.ENDPOINTS.MEDICATION_CREATE);
      const response = await fetch(API_CONFIG.ENDPOINTS.MEDICATION_CREATE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(backendData)
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const newMedication = await response.json();
      console.log("Medication created successfully:", newMedication);

      // Refresh medications from backend instead of adding to local state
      await refreshMedications();

      console.log("Medication added successfully to backend");
      alert("Лекарство успешно добавлено!");
    } catch (error) {
      console.error("Error adding medication:", error);
      alert(`Ошибка при добавлении лекарства: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Function to refresh medications for the selected patient
  const refreshMedications = async () => {
    if (!selectedPatient) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch medications filtered by patient ID
      const response = await fetch(`${API_CONFIG.ENDPOINTS.MEDICATIONS}?patient_id=${selectedPatient.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Refreshed medications from backend for patient:", selectedPatient.id, data);
        
        let medications = [];
        if (data.results && Array.isArray(data.results)) {
          medications = data.results;
        } else if (Array.isArray(data)) {
          medications = data;
        } else {
          return;
        }
        
        // Update the selected patient with refreshed medications
        const updatedMedications = medications.map((med: any) => ({
          id: med.id,
          name: med.medication_name,
          dosage: med.dosage,
          frequency: med.frequency,
          time: med.start_date,
          refill: med.end_date || 'Не указано',
          instructions: med.instructions || ''
        }));
        
        setSelectedPatient(prev => 
          prev ? { ...prev, medications: updatedMedications } : null
        );
        
        // Update in patients list as well
        setPatients(prevPatients => 
          prevPatients.map(patient => 
            patient.id === selectedPatient?.id 
              ? { ...patient, medications: updatedMedications }
              : patient
          )
        );
        
        console.log("Medications refreshed successfully");
      } else {
        console.error("Failed to refresh medications:", response.status);
      }
    } catch (error) {
      console.error("Error refreshing medications:", error);
    }
  };

  const handleDeleteMedication = async (medicationId: string | number) => {
    try {
      const id = String(medicationId);
      console.log("Deleting medication with ID:", id);

      // All medications are now from backend, no local medications

      // Handle backend medication deletion
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      console.log("Deleting backend medication");

      // Delete medication from backend
      const response = await fetch(
        API_CONFIG.ENDPOINTS.MEDICATION_DELETE(id),
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh medications from backend instead of updating local state
      await refreshMedications();

      console.log("Backend medication deleted successfully");
    } catch (error) {
      console.error("Error deleting medication:", error);
      // You might want to show a toast notification here
    }
  };

  // Function to add vital signs
  const handleAddVitalSign = async (vitalSignData: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      console.log("Adding vital sign to backend:", vitalSignData);
      console.log("Selected patient:", selectedPatient);

      // Find or create medical record for this patient
      let medicalRecord = selectedPatient?.medicalRecords?.[0];
      
      if (!medicalRecord) {
        console.log("No medical record found, creating one...");
        console.log("Patient ID:", selectedPatient?.id, "Type:", typeof selectedPatient?.id);
        
        // First, let's check if patient exists in backend
        const patientCheckResponse = await fetch(API_CONFIG.ENDPOINTS.PATIENT_DETAIL(selectedPatient?.id || ''), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!patientCheckResponse.ok) {
          throw new Error(`Patient with ID ${selectedPatient?.id} not found in backend`);
        }
        
        const patientData = await patientCheckResponse.json();
        console.log("Patient data from backend:", patientData);
        
        // Use the actual patient ID from backend
        const actualPatientId = patientData.id || selectedPatient?.id;
        
        // Create a medical record for this patient
        const createRecordResponse = await fetch(API_CONFIG.ENDPOINTS.MEDICAL_RECORDS, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            patient_id: actualPatientId,
            chief_complaint: "Общий осмотр",
            diagnosis: "Общий осмотр",
            notes: "Медицинская карта создана автоматически"
          })
        });

        if (!createRecordResponse.ok) {
          const errorText = await createRecordResponse.text();
          console.error("Medical record creation error:", errorText);
          throw new Error(`Failed to create medical record: ${createRecordResponse.status} - ${errorText}`);
        }

        const newMedicalRecord = await createRecordResponse.json();
        console.log("Medical record created:", newMedicalRecord);
        medicalRecord = { id: newMedicalRecord.id };
      }

      // Create vital sign
      const response = await fetch(API_CONFIG.ENDPOINTS.VITAL_SIGN_CREATE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          medical_record_id: medicalRecord.id,
          blood_pressure_systolic: vitalSignData.bp_systolic ? parseInt(vitalSignData.bp_systolic) : null,
          blood_pressure_diastolic: vitalSignData.bp_diastolic ? parseInt(vitalSignData.bp_diastolic) : null,
          heart_rate: vitalSignData.pulse ? parseInt(vitalSignData.pulse) : null,
          temperature_celsius: vitalSignData.temp ? parseFloat(vitalSignData.temp) : null,
          weight_kg: vitalSignData.weight ? parseFloat(vitalSignData.weight) : null,
          height_cm: vitalSignData.height ? parseInt(vitalSignData.height) : null,
          respiratory_rate: vitalSignData.respiratory_rate ? parseInt(vitalSignData.respiratory_rate) : null,
          oxygen_saturation: vitalSignData.oxygen_saturation ? parseInt(vitalSignData.oxygen_saturation) : null,
          notes: vitalSignData.notes || '',
          measurement_time: vitalSignData.dateTime || (vitalSignData.date + 'T12:00:00Z') // Use combined dateTime or fallback
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const newVitalSign = await response.json();
      console.log("Vital sign created successfully:", newVitalSign);

      // Refresh vital signs from backend
      await refreshVitalSigns();

      console.log("Vital sign added successfully to backend");
      alert("Показатели здоровья успешно добавлены!");
    } catch (error) {
      console.error("Error adding vital sign:", error);
      alert(`Ошибка при добавлении показателей: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Function to refresh vital signs from backend
  const refreshVitalSigns = async () => {
    if (!selectedPatient) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch vital signs filtered by patient ID
      const response = await fetch(`${API_CONFIG.ENDPOINTS.VITAL_SIGNS}?patient_id=${selectedPatient.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Refreshed vital signs from backend for patient:", selectedPatient.id, data);
        
        let vitalSigns = [];
        if (data.results && Array.isArray(data.results)) {
          vitalSigns = data.results;
        } else if (Array.isArray(data)) {
          vitalSigns = data;
        } else {
          return;
        }
        
        // Update the selected patient with refreshed vital signs
        const updatedVitalSigns = vitalSigns.map((vs: any) => {
          const measurementTime = new Date(vs.measurement_time);
          const date = measurementTime.toISOString().split('T')[0]; // Extract date part
          const time = measurementTime.toTimeString().slice(0, 5); // Extract time part (HH:MM)
          
          return {
            id: vs.id,
            date: date,
            time: time,
            bp: vs.blood_pressure_systolic && vs.blood_pressure_diastolic
              ? `${vs.blood_pressure_systolic}/${vs.blood_pressure_diastolic}`
              : '',
            pulse: vs.heart_rate?.toString() || '',
            temp: vs.temperature_celsius?.toString() || '',
            weight: vs.weight_kg?.toString() || '',
            height: vs.height_cm?.toString() || '',
            respiratory_rate: vs.respiratory_rate?.toString() || '',
            oxygen_saturation: vs.oxygen_saturation?.toString() || '',
            notes: vs.notes || ''
          };
        });
        
        setSelectedPatient(prev => 
          prev ? { ...prev, vitals: updatedVitalSigns } : null
        );
        
        // Update in patients list as well
        setPatients(prevPatients => 
          prevPatients.map(patient => 
            patient.id === selectedPatient?.id 
              ? { ...patient, vitals: updatedVitalSigns }
              : patient
          )
        );
        
        console.log("Vital signs refreshed successfully");
      } else {
        console.error("Failed to refresh vital signs:", response.status);
      }
    } catch (error) {
      console.error("Error refreshing vital signs:", error);
    }
  };

  // Function to delete vital signs
  const handleDeleteVitalSign = async (vitalSignId: string | number) => {
    try {
      const id = String(vitalSignId);
      console.log("Deleting vital sign with ID:", id);

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      console.log("Deleting backend vital sign");

      // Delete vital sign from backend
      const response = await fetch(
        API_CONFIG.ENDPOINTS.VITAL_SIGN_DELETE(id),
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Backend vital sign deleted successfully");
      
      // Refresh vital signs from backend
      await refreshVitalSigns();
      
      alert("Показатели здоровья успешно удалены!");
    } catch (error) {
      console.error("Error deleting vital sign:", error);
      alert(`Ошибка при удалении показателей: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // --- Рендеринг ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      {selectedPatient ? (
        <PatientDetailView
          patient={selectedPatient}
          onClose={() => {
            setSelectedPatientId(null);
            // Clear patient ID from URL
            const url = new URL(window.location.href);
            url.searchParams.delete('patient');
            router.replace(url.pathname + url.search, { scroll: false });
          }}
          onOpenAddHistoryDialog={handleOpenAddHistoryDialog}
          onOpenEditHistoryDialog={handleOpenEditHistoryDialog}
          onOpenAddMedicationDialog={() => setShowAddMedicationDialog(true)}
          onOpenAddVitalsDialog={() => setShowAddVitalsDialog(true)}
          onOpenAddDocumentDialog={() => setShowAddDocumentDialog(true)}
          onRefreshHistory={() => fetchMedicalHistory(selectedPatientId || '')}
          onAddMedication={handleAddMedication}
          onDeleteMedication={handleDeleteMedication}
          onRefreshMedications={refreshMedications}
          onAddVitalSign={handleAddVitalSign}
          onDeleteVitalSign={handleDeleteVitalSign}
        />
      ) : (
        <PatientListView
          patients={filteredPatients}
          allPatients={patients}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterStatus}
          onSelectPatient={(patientId) => {
            setSelectedPatientId(patientId);
            // Update URL to include patient ID
            const url = new URL(window.location.href);
            url.searchParams.set('patient', patientId);
            router.replace(url.pathname + url.search, { scroll: false });
          }}
          onOpenCreateDialog={() => setShowCreatePatientDialog(true)}
          onRefresh={fetchPatients}
          onDeletePatient={handleDeletePatient}
          onArchivePatient={handleArchivePatient}
          onUnarchivePatient={handleUnarchivePatient}
        />
      )}

      <CreatePatientDialog
        open={showCreatePatientDialog}
        onOpenChange={setShowCreatePatientDialog}
        newPatient={newPatient}
        setNewPatient={setNewPatient}
        onSubmit={createPatientHandler}
        isLoading={isLoading}
      />
      <AddHistoryDialog
        open={showAddHistoryDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseAddHistoryDialog();
          }
        }}
        medicalHistory={medicalHistory}
        setMedicalHistory={setMedicalHistory}
        patientId={selectedPatientId ? parseInt(selectedPatientId) : undefined} // Pass the selected patient ID
        onSubmitSuccess={addHistoryEntryHandler}
      />
      <EditHistoryDialog
        open={showEditHistoryDialog}
        onOpenChange={(open) => {
          setShowEditHistoryDialog(open);
          if (!open) {
            handleCloseEditHistoryDialog();
          }
        }}
        historyEntry={editingHistoryEntry}
        onSubmit={editHistoryEntryHandler}
      />
      <AddMedicationDialog
        isOpen={showAddMedicationDialog}
        onClose={() => setShowAddMedicationDialog(false)}
        onAddMedication={handleAddMedication}
      />
      <AddVitalsDialog
        open={showAddVitalsDialog}
        onOpenChange={setShowAddVitalsDialog}
        onAddVitalSign={handleAddVitalSign}
      />
      <AddDocumentDialog
        open={showAddDocumentDialog}
        onOpenChange={setShowAddDocumentDialog}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
        onSubmit={addDocumentHandler}
      />
    </>
  );
}