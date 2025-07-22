"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Импортируем все типы из нашего центрального файла
import {
  Patient,
  PatientResponse,
  NewPatientForm,
  MedicalHistoryForm,
  NewMedicationForm,
  NewVitalsForm,
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [showCreatePatientDialog, setShowCreatePatientDialog] = useState(false);
  const [showAddHistoryDialog, setShowAddHistoryDialog] = useState(false);
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
  const [newVitals, setNewVitals] = useState<NewVitalsForm>({
    date: "",
    bp: "",
    pulse: "",
    temp: "",
    weight: "",
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
        "https://new.avishifo.uz/api/patients/patientlar/",
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
          status: "Наблюдение",
          statusColor: "amber",
          insurance: `ОМС №${patient.passport_series || ""}${
            patient.passport_number || ""
          }`,
          bloodType: patient.blood_group || "Не указан",
          allergies: [],
          chronicConditions: [],
          lastDiagnosis: "Первичный осмотр",
          nextAppointment: "Не назначено",
          medications: [],
          vitals: [],
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

  // --- Обработчики ---
  const createPatientHandler = async () => {
    // Логика создания пациента
    setShowCreatePatientDialog(false);
    await fetchPatients(); // Обновляем список после создания
  };

const addHistoryEntryHandler = async () => {
  if (!selectedPatientId) {
    console.error("No patient selected for adding history.");
    return;
  }

  const formData = new FormData();
  formData.append("patient", selectedPatientId);

  // Map text fields (example, adjust based on your MedicalHistoryForm)
  formData.append("fish", medicalHistory.fish || "");
  formData.append("kelgan_vaqti", medicalHistory.visitDate || "");
  formData.append("shikoyatlar", medicalHistory.mainComplaints || "");

  // Add files (example for respiratoryFiles)
  (medicalHistory.respiratoryFiles || []).forEach((file) =>
    formData.append("nafas_tizimi_hujjat", file)
  );

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      "https://new.avishifo.uz/api/patients/kasallik-tarixi/",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Failed to save medical history");
    setShowAddHistoryDialog(false);
    await fetchPatients(); // Refresh patient data
  } catch (error) {
    console.error("Error saving history:", error);
    alert("Ошибка при сохранении истории болезни.");
  }
};

  const addMedicationHandler = async () => {
    // Логика добавления медикаментов
    setShowAddMedicationDialog(false);
    await fetchPatients();
  };

  const addVitalsHandler = async () => {
    // Логика добавления витальных показателей
    setShowAddVitalsDialog(false);
    await fetchPatients();
  };

  const addDocumentHandler = async () => {
    // Логика добавления документа
    setShowAddDocumentDialog(false);
    await fetchPatients();
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

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

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
          onClose={() => setSelectedPatientId(null)}
          onOpenAddHistoryDialog={() => setShowAddHistoryDialog(true)}
          onOpenAddMedicationDialog={() => setShowAddMedicationDialog(true)}
          onOpenAddVitalsDialog={() => setShowAddVitalsDialog(true)}
          onOpenAddDocumentDialog={() => setShowAddDocumentDialog(true)}
        />
      ) : (
        <PatientListView
          patients={filteredPatients}
          allPatients={patients}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterStatus}
          onSelectPatient={setSelectedPatientId}
          onOpenCreateDialog={() => setShowCreatePatientDialog(true)}
          onRefresh={fetchPatients}
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
        onOpenChange={setShowAddHistoryDialog}
        medicalHistory={medicalHistory}
        setMedicalHistory={setMedicalHistory}
        patientId={selectedPatientId} // Pass the selected patient ID
        onSubmit={addHistoryEntryHandler}
      />
      <AddMedicationDialog
        open={showAddMedicationDialog}
        onOpenChange={setShowAddMedicationDialog}
        newMedication={newMedication}
        setNewMedication={setNewMedication}
        onSubmit={addMedicationHandler}
      />
      <AddVitalsDialog
        open={showAddVitalsDialog}
        onOpenChange={setShowAddVitalsDialog}
        newVitals={newVitals}
        setNewVitals={setNewVitals}
        onSubmit={addVitalsHandler}
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