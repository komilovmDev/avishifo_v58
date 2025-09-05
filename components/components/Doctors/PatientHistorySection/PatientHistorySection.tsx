"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_CONFIG } from "../../../config/api"
import {
  Search,
  ChevronRight,
  Activity,
  Calendar,
  X,
  Phone,
  Mail,
  MapPin,
  User,
  Pill,
  Filter,
  FileTextIcon,
  MessageCircleIcon,
  Plus,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react"



// --- Type Definitions ---
interface PatientResponse {
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

interface Medication {
  name: string
  dosage: string
  frequency: string
  time: string
  refill: string
}

interface VitalSign {
  date: string
  bp: string
  pulse: string
  temp: string
  weight: string
}

interface HistoryEntry {
  id?: string
  date: string
  type: string
  doctor: string
  diagnosis: string
  notes: string
  documents: string[]
}

interface Patient {
  id: string
  name: string
  age: number | string
  gender: string
  lastVisit: string
  status: string
  statusColor: string
  phone: string
  email: string
  address: string
  insurance: string
  bloodType: string
  allergies: string[]
  chronicConditions: string[]
  lastDiagnosis: string
  avatar?: string
  nextAppointment: string
  medications: Medication[]
  vitals: VitalSign[]
  history: HistoryEntry[]
}

interface NewHistoryEntryForm {
  date: string
  type: string
  doctor: string
  diagnosis: string
  notes: string
  documents: string[]
}

interface NewMedicationForm {
  name: string
  dosage: string
  frequency: string
  time: string
  refill: string
}

interface NewVitalsForm {
  date: string
  bp: string
  pulse: string
  temp: string
  weight: string
}

interface NewDocumentForm {
  name: string
  type: string
  file: File | null
}

interface NewPatientForm {
  fish: string
  passportSeries: string
  passportNumber: string
  phone: string
  email: string
  birthDate: string
  gender: string
  bloodType: string
  address: string
}

interface MedicalHistoryForm {
  fish: string
  birthDate: string
  nationality: string
  education: string
  profession: string
  workplace: string
  workPosition: string
  homeAddress: string
  visitDate: string
  mainComplaints: string
  systemicDiseases: string
  respiratoryComplaints: string
  cough: string
  sputum: string
  hemoptysis: string
  chestPain: string
  dyspnea: string
  cardiovascularComplaints: string
  heartPain: string
  heartRhythm: string
  palpitations: string
  digestiveComplaints: string
  vomiting: string
  abdominalPain: string
  epigastricPain: string
  bowelMovements: string
  analSymptoms: string
  urinaryComplaints: string
  endocrineComplaints: string
  musculoskeletalComplaints: string
  nervousSystemComplaints: string
  doctorRecommendations: string
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function PatientHistorySection() {
  const router = useRouter()
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "p1",
      name: "Иванов Иван Иванович",
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
      allergies: ["Пенициллин", "Пыльца"],
      chronicConditions: ["Гипертония", "Сахарный диабет 2 типа"],
      lastDiagnosis: "Компенсированный сахарный диабет",
      avatar: "/placeholders/avatar-male1.jpg",
      nextAppointment: "25.08.2024",
      medications: [
        {
          name: "Метформин",
          dosage: "500 мг",
          frequency: "2 раза в день",
          time: "Утром и вечером",
          refill: "15.09.2024",
        },
        {
          name: "Эналаприл",
          dosage: "10 мг",
          frequency: "1 раз в день",
          time: "Утром",
          refill: "20.09.2024",
        },
      ],
      vitals: [
        {
          date: "15.07.2024",
          bp: "135/85",
          pulse: "72",
          temp: "36.6",
          weight: "82",
        },
        {
          date: "03.05.2024",
          bp: "140/90",
          pulse: "78",
          temp: "36.7",
          weight: "83",
        },
      ],
      history: [
        {
          id: "h1p1",
          date: "15.07.2024",
          type: "Плановый осмотр",
          doctor: "Петров А.С.",
          diagnosis: "Компенсированный СД",
          notes: "Жалобы на головные боли. Контроль АД.",
          documents: ["Анализ крови_150724.pdf", "ЭКГ_150724.pdf"],
        },
        {
          id: "h2p1",
          date: "03.05.2024",
          type: "Консультация кардиолога",
          doctor: "Сидорова Е.В.",
          diagnosis: "АГ 2 ст.",
          notes: "Скорректирована терапия.",
          documents: ["Закл. кардиолога_030524.pdf"],
        },
      ],
    },
    {
      id: "p2",
      name: "Петрова Анна Сергеевна",
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
      allergies: ["Сульфаниламиды", "Орехи"],
      chronicConditions: ["Бронхиальная астма"],
      lastDiagnosis: "БА, контролируемое течение",
      avatar: "/placeholders/avatar-female1.jpg",
      nextAppointment: "30.08.2024",
      medications: [
        {
          name: "Сальбутамол",
          dosage: "100 мкг",
          frequency: "по требованию",
          time: "При приступах",
          refill: "30.09.2024",
        },
        {
          name: "Флутиказон",
          dosage: "250 мкг",
          frequency: "2 раза в день",
          time: "Утром и вечером",
          refill: "15.09.2024",
        },
      ],
      vitals: [
        {
          date: "20.07.2024",
          bp: "120/80",
          pulse: "68",
          temp: "36.6",
          weight: "58",
        },
        {
          date: "15.06.2024",
          bp: "125/85",
          pulse: "75",
          temp: "37.1",
          weight: "57",
        },
      ],
      history: [
        {
          id: "h1p2",
          date: "20.07.2024",
          type: "Плановый осмотр",
          doctor: "Иванов П.Р.",
          diagnosis: "БА, контроль",
          notes: "ФВД в норме. Продолжить терапию.",
          documents: ["Спирометрия_200724.pdf"],
        },
        {
          id: "h2p2",
          date: "15.06.2024",
          type: "Обострение",
          doctor: "Иванов П.Р.",
          diagnosis: "Обострение БА",
          notes: "Назначен курс ГКС.",
          documents: [],
        },
      ],
    },
  ])

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await fetch(API_CONFIG.ENDPOINTS.PATIENTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      const patientsArray = Array.isArray(data) ? data : data.data || data.results || [data];

      const validPatients = patientsArray.filter(
        (patient: any): patient is PatientResponse =>
          patient != null &&
          typeof patient === "object" &&
          "id" in patient &&
          patient.id != null
      );

      if (validPatients.length === 0) {
        console.warn("No valid patients found in API response");
        setPatients([]); // Set empty array or fallback to mock data
        return;
      }

      const transformedPatients = validPatients.map((patient: PatientResponse) => ({
        id: String(patient.id),
        name: patient.full_name || "Не указано",
        phone: patient.phone || "Не указан",
        email: patient.email || "Не указан",
        address: patient.address || "Не указан",
        age: patient.birth_date
          ? Math.floor(
              (new Date().getTime() - new Date(patient.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
            )
          : "Не указан",
        gender: patient.gender || "Не указан",
        lastVisit: patient.created_at
          ? new Date(patient.created_at).toLocaleDateString("ru-RU")
          : new Date().toLocaleDateString("ru-RU"),
        status: "Новый пациент",
        statusColor: "blue",
        insurance: patient.passport_series && patient.passport_number
          ? `ОМС №${patient.passport_series}${patient.passport_number}`
          : "Не указан",
        bloodType: patient.blood_group || "Не указан",
        allergies: [],
        chronicConditions: [],
        lastDiagnosis: "Первичный осмотр",
        nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU"),
        medications: [],
        vitals: [],
        history: [
          {
            id: `h1${patient.id}`,
            date: patient.created_at
              ? new Date(patient.created_at).toLocaleDateString("ru-RU")
              : new Date().toLocaleDateString("ru-RU"),
            type: "Регистрация",
            doctor: "Текущий врач",
            diagnosis: "Регистрация нового пациента",
            notes: `Паспорт: ${patient.passport_series || "Не указан"} ${patient.passport_number || "Не указан"}`,
            documents: [],
          },
        ],
      }));

      setPatients(transformedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert(`Error fetching patients: ${error instanceof Error ? error.message : "Unknown error"}`);
      setPatients(patients); // Use existing mock data
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicalHistory = async (patientId: string) => {
    try {
      setIsLoading(true);
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

      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === patientId
            ? {
                ...p,
                history: historyData.map((entry: any) => ({
                  id: `hist-${entry.id}`,
                  date: new Date(entry.yuborilgan_vaqt).toLocaleDateString("ru-RU"),
                  type: "Kasallik tarixi (Uzbek)",
                  doctor: "Joriy shifokor",
                  diagnosis: entry.shikoyatlar?.split("\n")[0] || "Kompleks tekshiruv",
                  notes: `
ASOSIY MA'LUMOTLAR:
F.I.SH: ${entry.fish || "Не указано"}
Tug'ilgan sanasi: ${entry.tugilgan_sana || "Не указано"}
Millati: ${entry.millati || "Не указано"}
Ma'lumoti: ${entry.malumoti || "Не указано"}
Kasbi: ${entry.kasbi || "Не указано"}
Ish joyi: ${entry.ish_joyi || "Не указано"}
Ish joyidagi vazifasi: ${entry.ish_vazifasi || "Не указано"}
Uy manzili: ${entry.uy_manzili || "Не указано"}

KELGAN VAQTDAGI SHIKOYATLARI:
${entry.shikoyatlar || "Не указано"}

BEMORNING ASOSIY TIZIMLI KASALLIKLARI:
${entry.asosiy_kasalliklar || "Не указано"}

NAFAS TIZIMIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${entry.nafas_tizimi || "Не указано"}
Yo'tal: ${entry.yotal || "Не указано"}
Balg'am: ${entry.balgam || "Не указано"}
Qon tuflash: ${entry.qon_tuflash || "Не указано"}
Ko'krak qafasidagi og'riq: ${entry.kokrak_ogriq || "Не указано"}
Nafas qisishi: ${entry.nafas_qisishi || "Не указано"}

YURAK QON AYLANISHI TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${entry.yurak_qon_shikoyatlari || "Не указано"}
Yurak sohasidagi og'riq: ${entry.yurak_ogriq || "Не указано"}
Yurak urishining o'zgarishi: ${entry.yurak_urishi_ozgarishi || "Не указано"}
Yurak urishini bemor his qilishi: ${entry.yurak_urishi_sezish || "Не указано"}

HAZM TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${entry.hazm_tizimi || "Не указано"}
Qusish: ${entry.qusish || "Не указано"}
Qorin og'riqi: ${entry.qorin_ogriq || "Не указано"}
To'sh osti va boshqa sohalarda og'riq: ${entry.qorin_shish || "Не указано"}
Ich kelishining o'zgarishi: ${entry.ich_ozgarishi || "Не указано"}
Anus sohasidagi simptomlar: ${entry.anus_shikoyatlar || "Не указано"}

SIYDIK AJRATISH TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${entry.siydik_tizimi || "Не указано"}

ENDOKRIN TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${entry.endokrin_tizimi || "Не указано"}

TAYANCH HARAKAT TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${entry.tayanch_tizimi || "Не указано"}

ASAB TIZIMI:
${entry.asab_tizimi || "Не указано"}

DOKTOR TAVSIYALARI:
${entry.doktor_tavsiyalari || "Не указано"}
                  `.trim(),
                  documents: entry.asosiy_kasalliklar_hujjat
                    ? [entry.asosiy_kasalliklar_hujjat.split("/").pop() || ""]
                    : [],
                })),
              }
            : p,
        ),
      );
    } catch (error) {
      console.error("Error fetching medical history:", error);
      alert(`Error fetching medical history: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    if (selectedPatientId) {
      fetchMedicalHistory(selectedPatientId);
    }
  }, [selectedPatientId]);

  // Dialog states
  const [showAddHistoryDialog, setShowAddHistoryDialog] = useState(false)
  const [showAddMedicationDialog, setShowAddMedicationDialog] = useState(false)
  const [showAddVitalsDialog, setShowAddVitalsDialog] = useState(false)
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false)
  const [showCreatePatientDialog, setShowCreatePatientDialog] = useState(false)

  // Dialog handlers
  const openAddHistoryDialog = () => {
    console.log("Opening history dialog")
    if (!selectedPatientId) {
      alert("Iltimos, avval bemorni tanlang.")
      return
    }
    
    // Set default values for easier testing
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (selectedPatient) {
      setMedicalHistory(prev => ({
        ...prev,
        fish: selectedPatient.name,
        visitDate: new Date().toISOString().split('T')[0], // Today's date
        mainComplaints: "Bosh og'riqi va halsizlik",
        systemicDiseases: "Yuq",
        respiratoryComplaints: "Yuq",
        cardiovascularComplaints: "Yuq",
        digestiveComplaints: "Yuq",
        urinaryComplaints: "Yuq",
        endocrineComplaints: "Yuq",
        musculoskeletalComplaints: "Yuq",
        nervousSystemComplaints: "Yuq",
        doctorRecommendations: "Tekshiruv va kuzatish kerak"
      }));
    }
    
    setShowAddHistoryDialog(true)
  }



  const closeAddHistoryDialog = () => {
    console.log("Closing history dialog")
    setShowAddHistoryDialog(false)
    setMedicalHistory({
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
    })
  }

  const openAddMedicationDialog = () => {
    console.log("Opening medication dialog")
    setShowAddMedicationDialog(true)
  }

  const closeAddMedicationDialog = () => {
    console.log("Closing medication dialog")
    setShowAddMedicationDialog(false)
  }

  const openAddVitalsDialog = () => {
    console.log("Opening vitals dialog")
    setShowAddVitalsDialog(true)
  }

  const closeAddVitalsDialog = () => {
    console.log("Closing vitals dialog")
    setShowAddVitalsDialog(false)
  }

  const openAddDocumentDialog = () => {
    console.log("Opening document dialog")
    setShowAddDocumentDialog(true)
  }

  const closeAddDocumentDialog = () => {
    console.log("Closing document dialog")
    setShowAddDocumentDialog(false)
  }

  const closePatientView = () => {
    console.log("Closing patient view")
    setSelectedPatientId(null)
    setShowAddHistoryDialog(false)
    setShowAddMedicationDialog(false)
    setShowAddVitalsDialog(false)
    setShowAddDocumentDialog(false)
  }

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    respiratory: false,
    cardiovascular: false,
    digestive: false,
    urinary: false,
    endocrine: false,
    musculoskeletal: false,
    nervous: false,
  })

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
  })

  const [newHistoryEntry, setNewHistoryEntry] = useState<NewHistoryEntryForm>({
    date: "",
    type: "",
    doctor: "",
    diagnosis: "",
    notes: "",
    documents: [],
  })

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
  })

  const [newMedication, setNewMedication] = useState<NewMedicationForm>({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    refill: "",
  })

  const [newVitals, setNewVitals] = useState<NewVitalsForm>({
    date: "",
    bp: "",
    pulse: "",
    temp: "",
    weight: "",
  })

  const [newDocument, setNewDocument] = useState<NewDocumentForm>({
    name: "",
    type: "",
    file: null,
  })

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      patient.name.toLowerCase().includes(searchLower) ||
      patient.lastDiagnosis.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower)
    const matchesFilter = !filterStatus || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColorName = (status: string): string => {
    const patientWithStatus = patients.find((p) => p.status === status)
    return patientWithStatus?.statusColor || "gray"
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const addHistoryEntryHandler = async () => {
    console.log("addHistoryEntryHandler called");
    console.log("selectedPatientId:", selectedPatientId);
    console.log("medicalHistory:", medicalHistory);
    
    if (!selectedPatientId) {
      console.log("Validation failed - no patient selected");
      alert("Iltimos, avval bemorni tanlang.")
      return
    }
    
    // Verify patient exists
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (!selectedPatient) {
      console.log("Validation failed - patient not found");
      alert("Bemor topilmadi. Iltimos, qaytadan tanlang.")
      return
    }
    
    if (!medicalHistory.visitDate) {
      console.log("Validation failed - no visit date");
      alert("Iltimos, tashrif sanasini kiriting.")
      return
    }
    
    if (!medicalHistory.mainComplaints) {
      console.log("Validation failed - no main complaints");
      alert("Iltimos, asosiy shikoyatlarni kiriting.")
      return
    }

    try {
      // Prepare data for API call
      const medicalHistoryData = {
        patient: selectedPatientId,
        fish: medicalHistory.fish || selectedPatient.name,
        tugilgan_sana: medicalHistory.birthDate || new Date().toISOString().split('T')[0],
        millati: medicalHistory.nationality || "",
        malumoti: medicalHistory.education || "",
        kasbi: medicalHistory.profession || "",
        ish_joyi: medicalHistory.workplace || "",
        ish_vazifasi: medicalHistory.workPosition || "",
        uy_manzili: medicalHistory.homeAddress || "",
        kelgan_vaqti: medicalHistory.visitDate,
        shikoyatlar: medicalHistory.mainComplaints,
        asosiy_kasalliklar: medicalHistory.systemicDiseases || "",
        nafas_tizimi: medicalHistory.respiratoryComplaints || "",
        yotal: medicalHistory.cough || "",
        balgam: medicalHistory.sputum || "",
        qon_tuflash: medicalHistory.hemoptysis || "",
        kokrak_ogriq: medicalHistory.chestPain || "",
        nafas_qisishi: medicalHistory.dyspnea || "",
        yurak_qon_shikoyatlari: medicalHistory.cardiovascularComplaints || "",
        yurak_ogriq: medicalHistory.heartPain || "",
        yurak_urishi_ozgarishi: medicalHistory.heartRhythm || "",
        yurak_urishi_sezish: medicalHistory.palpitations || "",
        hazm_tizimi: medicalHistory.digestiveComplaints || "",
        qusish: medicalHistory.vomiting || "",
        qorin_ogriq: medicalHistory.abdominalPain || "",
        qorin_shish: medicalHistory.epigastricPain || "",
        ich_ozgarishi: medicalHistory.bowelMovements || "",
        anus_shikoyatlar: medicalHistory.analSymptoms || "",
        siydik_tizimi: medicalHistory.urinaryComplaints || "",
        endokrin_tizimi: medicalHistory.endocrineComplaints || "",
        tayanch_tizimi: medicalHistory.musculoskeletalComplaints || "",
        asab_tizimi: medicalHistory.nervousSystemComplaints || "",
        doktor_tavsiyalari: medicalHistory.doctorRecommendations || "",
      };

      console.log("Sending medical history data to API:", medicalHistoryData);

      // Get access token
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Avtorizatsiya xatosi. Iltimos, qaytadan tizimga kiring.");
        return;
      }

      // Make API call to save medical history
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        mode: 'cors',
        body: JSON.stringify(medicalHistoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API xatosi: ${response.status} - ${errorData.message || 'Noma\'lum xato'}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      // After successfully saving to backend, fetch the updated medical history
      console.log("Fetching updated medical history from backend...");
      try {
        await fetchMedicalHistory(selectedPatientId);
        console.log("Medical history refreshed from backend");
      } catch (error) {
        console.error("Error refreshing medical history:", error);
        // Fallback: create local entry if refresh fails
        const comprehensiveNotes = `
ASOSIY MA'LUMOTLAR:
F.I.SH: ${medicalHistory.fish || selectedPatient.name}
Tug'ilgan sanasi: ${medicalHistory.birthDate || "Kiritilmagan"}
Millati: ${medicalHistory.nationality || "Kiritilmagan"}
Ma'lumoti: ${medicalHistory.education || "Kiritilmagan"}
Kasbi: ${medicalHistory.profession || "Kiritilmagan"}
Ish joyi: ${medicalHistory.workplace || "Kiritilmagan"}
Ish joyidagi vazifasi: ${medicalHistory.workPosition || "Kiritilmagan"}
Uy manzili: ${medicalHistory.homeAddress || "Kiritilmagan"}

KELGAN VAQTDAGI SHIKOYATLARI:
${medicalHistory.mainComplaints}

BEMORNING ASOSIY TIZIMLI KASALLIKLARI:
${medicalHistory.systemicDiseases || "Kiritilmagan"}

NAFAS TIZIMIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${medicalHistory.respiratoryComplaints || "Kiritilmagan"}
Yo'tal: ${medicalHistory.cough || "Kiritilmagan"}
Balg'am: ${medicalHistory.sputum || "Kiritilmagan"}
Qon tuflash: ${medicalHistory.hemoptysis || "Kiritilmagan"}
Ko'krak qafasidagi og'riq: ${medicalHistory.chestPain || "Kiritilmagan"}
Nafas qisishi: ${medicalHistory.dyspnea || "Kiritilmagan"}

YURAK QON AYLANISHI TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${medicalHistory.cardiovascularComplaints || "Kiritilmagan"}
Yurak sohasidagi og'riq: ${medicalHistory.heartPain || "Kiritilmagan"}
Yurak urishining o'zgarishi: ${medicalHistory.heartRhythm || "Kiritilmagan"}
Yurak urishini bemor his qilishi: ${medicalHistory.palpitations || "Kiritilmagan"}

HAZM TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${medicalHistory.digestiveComplaints || "Kiritilmagan"}
Qusish: ${medicalHistory.vomiting || "Kiritilmagan"}
Qorin og'riqi: ${medicalHistory.abdominalPain || "Kiritilmagan"}
To'sh osti va boshqa sohalarda og'riq: ${medicalHistory.epigastricPain || "Kiritilmagan"}
Ich kelishining o'zgarishi: ${medicalHistory.bowelMovements || "Kiritilmagan"}
Anus sohasidagi simptomlar: ${medicalHistory.analSymptoms || "Kiritilmagan"}

SIYDIK AJRATISH TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${medicalHistory.urinaryComplaints || "Kiritilmagan"}

ENDOKRIN TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${medicalHistory.endocrineComplaints || "Kiritilmagan"}

TAYANCH HARAKAT TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${medicalHistory.musculoskeletalComplaints || "Kiritilmagan"}

ASAB TIZIMI:
${medicalHistory.nervousSystemComplaints || "Kiritilmagan"}

DOKTOR TAVSIYALARI:
${medicalHistory.doctorRecommendations || "Kiritilmagan"}
        `.trim();

        const newEntryWithId: HistoryEntry = {
          id: `hist-${Date.now()}`,
          date: medicalHistory.visitDate,
          type: "Kasallik tarixi (Uzbek)",
          doctor: "Joriy shifokor",
          diagnosis: medicalHistory.mainComplaints.split("\n")[0] || "Kompleks tekshiruv",
          notes: comprehensiveNotes,
          documents: [],
        };

        console.log("Fallback: Updating patients state with new history entry");
        setPatients((prevPatients) => {
          const updatedPatients = prevPatients.map((p) => 
            p.id === selectedPatientId 
              ? { ...p, history: [newEntryWithId, ...p.history] }
              : p
          );
          console.log("Updated patients:", updatedPatients);
          return updatedPatients;
        });
      }

      // Reset form
      setMedicalHistory({
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
      });

      setExpandedSections({
        basic: true,
        respiratory: false,
        cardiovascular: false,
        digestive: false,
        urinary: false,
        endocrine: false,
        musculoskeletal: false,
        nervous: false,
      });

      closeAddHistoryDialog();
      console.log("Medical history added successfully and refreshed from backend");
      alert("Kasallik tarixi muvaffaqiyatli qo'shildi!");

    } catch (error) {
      console.error("Error saving medical history:", error);
      alert(`Xatolik yuz berdi: ${error instanceof Error ? error.message : 'Noma\'lum xato'}`);
    }
  }

  const addMedicationHandler = () => {
    if (!selectedPatientId || !newMedication.name || !newMedication.dosage || !newMedication.frequency) {
      alert("Пожалуйста, заполните название препарата, дозировку и частоту приема.")
      return
    }
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === selectedPatientId
          ? {
              ...p,
              medications: [...p.medications, { ...newMedication } as Medication],
            }
          : p,
      ),
    )
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      refill: "",
    })
    closeAddMedicationDialog()
  }

  const addVitalsHandler = () => {
    if (!selectedPatientId || !newVitals.date || !newVitals.bp || !newVitals.pulse) {
      alert("Пожалуйста, заполните дату, АД и пульс.")
      return
    }
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === selectedPatientId ? { ...p, vitals: [{ ...newVitals } as VitalSign, ...p.vitals] } : p,
      ),
    )
    setNewVitals({ date: "", bp: "", pulse: "", temp: "", weight: "" })
    closeAddVitalsDialog()
  }

  const addDocumentHandler = () => {
    if (!selectedPatientId || !newDocument.name || !newDocument.file) {
      alert("Укажите название документа и выберите файл.")
      return
    }
    const newDocEntry: HistoryEntry = {
      id: `doc-hist-${Date.now()}`,
      date: new Date().toLocaleDateString("ru-RU"),
      type: "Загруженный документ",
      doctor: "Текущий врач",
      diagnosis: newDocument.type || "Доп. документ",
      notes: `Загружен: ${newDocument.name}`,
      documents: [newDocument.file.name],
    }
    setPatients((prevPatients) =>
      prevPatients.map((p) => (p.id === selectedPatientId ? { ...p, history: [newDocEntry, ...p.history] } : p)),
    )
    setNewDocument({ name: "", type: "", file: null })
    closeAddDocumentDialog()
  }

  const createPatientHandler = async () => {
    const token = localStorage.getItem("accessToken")

    if (!newPatient.fish || !newPatient.passportSeries || !newPatient.passportNumber) {
      alert("Iltimos, F.I.SH, pasport seriyasi va raqamini to'ldiring.")
      return
    }

    setIsLoading(true)

    const payload = {
      full_name: newPatient.fish,
      passport_series: newPatient.passportSeries,
      passport_number: newPatient.passportNumber,
      birth_date: newPatient.birthDate || null,
      phone: newPatient.phone || null,
      secondary_phone: null,
      address: newPatient.address || null,
      status: 'active',
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/patients/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        const newPatientData: Patient = {
          id: String(result.data.id),
          name: result.data.full_name,
          age: result.data.birth_date
            ? Math.floor((new Date().getTime() - new Date(result.data.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
            : "Не указан",
          gender: result.data.gender || "Не указан",
          lastVisit: new Date().toLocaleDateString("ru-RU"),
          status: "Новый пациент",
          statusColor: "blue",
          phone: result.data.phone || "Не указан",
          email: newPatient.email || "Не указан",
          address: result.data.address || "Не указан",
          insurance: result.data.passport_series && result.data.passport_number
            ? `ОМС №${result.data.passport_series}${result.data.passport_number}`
            : "Не указан",
          bloodType: result.data.blood_group || "Не указан",
          allergies: [],
          chronicConditions: [],
          lastDiagnosis: "Первичный осмотр",
          nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU"),
          medications: [],
          vitals: [],
          history: [
            {
              id: `h1${result.data.id}`,
              date: new Date().toLocaleDateString("ru-RU"),
              type: "Регистрация",
              doctor: "Текущий врач",
              diagnosis: "Регистрация нового пациента",
              notes: `Паспорт: ${result.data.passport_series || "Не указан"} ${result.data.passport_number || "Не указан"}`,
              documents: [],
            },
          ],
        }

        setPatients((prevPatients) => [newPatientData, ...prevPatients])
        setNewPatient({
          fish: "",
          passportSeries: "",
          passportNumber: "",
          phone: "",
          email: "",
          birthDate: "",
          gender: "Мужской",
          bloodType: "A(II) Rh+",
          address: "",
        })
        setShowCreatePatientDialog(false)
        alert(result.message || "Пациент успешно создан!")
      } else {
        alert(result.message || "Ошибка при создании пациента. Попробуйте снова.")
      }
    } catch (error) {
      console.error("Error creating patient:", error)
      alert("Произошла ошибка при подключении к серверу. Проверьте соединение и попробуйте снова.")
    } finally {
      setIsLoading(false)
    }
  }



  const selectedPatient = patients.find((p) => p.id === selectedPatientId)

  // --- Patient Detail View ---
  if (selectedPatient) {
    const patient = selectedPatient
    const color = patient.statusColor || "gray"

    const historyIconForOverview = <History className="h-5 w-5 text-green-500" />
    const historyIconForHistoryTab = <History className="h-5 w-5 text-green-500" />

    return (
      <ScrollArea className="h-full">
        <div className="p-1 md:p-0 space-y-6">
          {/* Patient Header Card */}
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="relative shrink-0">
              <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-white shadow-md">
                <AvatarImage
                  src={
                    patient.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name) || "/placeholder.svg"}&background=random&color=fff`
                  }
                  alt={patient.name}
                />
                <AvatarFallback
                  className={`bg-gradient-to-br from-${color}-500 to-${color}-700 text-white text-3xl md:text-4xl font-semibold`}
                >
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full bg-${color}-500 border-2 border-white ring-1 ring-${color}-500`}
              ></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-x-3 gap-y-1">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">{patient.name}</h2>
                <Badge
                  className={`bg-${color}-100 text-${color}-800 border-${color}-300 px-3 py-1 text-xs font-semibold`}
                >
                  {patient.status}
                </Badge>
              </div>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                {patient.age} лет • {patient.gender} • {patient.bloodType}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Визит: {patient.lastVisit}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>След.: {patient.nextAppointment}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 mt-4 md:mt-0 shrink-0">
              <Button
                variant="outline"
                className="flex gap-2 w-full md:w-auto bg-transparent"
                onClick={closePatientView}
              >
                <X className="h-4 w-4" />
                <span>Закрыть</span>
              </Button>
              <Button
                className={`gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-90 text-white w-full md:w-auto`}
              >
                <MessageCircleIcon className="h-4 w-4" />
                <span>Сообщение</span>
              </Button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="overflow-x-auto">
              <div className="flex border-b border-gray-200 min-w-max px-2 pt-1">
                {["overview", "history", "medications", "vitals", "documents"].map((tabId) => (
                  <Button
                    key={tabId}
                    variant="ghost"
                    className={`px-4 py-3 rounded-t-md text-sm font-medium border-b-2 ${
                      activeTab === tabId
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tabId)}
                  >
                    {tabId === "overview" && "Обзор"}
                    {tabId === "history" && "История болезни"}
                    {tabId === "medications" && "Лекарства"}
                    {tabId === "vitals" && "Показатели"}
                    {tabId === "documents" && "Документы"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <Card className="xl:col-span-1 bg-white shadow-sm rounded-lg border">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                        <User className="h-5 w-5 text-teal-500" />
                        Личная информация
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span>{patient.address}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Полис ОМС</p>
                        <p>{patient.insurance}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="xl:col-span-2 bg-white shadow-sm rounded-lg border">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                        <Activity className="h-5 w-5 text-teal-500" />
                        Медицинская информация
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Группа крови</p>
                          <p className="font-medium">{patient.bloodType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Текущий диагноз</p>
                          <p className="font-medium">{patient.lastDiagnosis}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Дата визита</p>
                          <p className="font-medium">{patient.history[0]?.date || "N/A"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Аллергии</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.length ? (
                            patient.allergies.map((a, i) => (
                              <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                {a}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Не выявлено
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Хронические заболевания</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.chronicConditions.length ? (
                            patient.chronicConditions.map((c, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
                                {c}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">Не указано</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {patient.vitals.length > 0 && (
                    <Card className="xl:col-span-3 bg-white shadow-sm rounded-lg border">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                          <Activity className="h-5 w-5 text-red-500" />
                          Последние показатели (от {patient.vitals[0].date})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            {
                              label: "Давление",
                              value: patient.vitals[0].bp,
                              unit: "",
                            },
                            {
                              label: "Пульс",
                              value: patient.vitals[0].pulse,
                              unit: "уд/мин",
                            },
                            {
                              label: "Температура",
                              value: patient.vitals[0].temp,
                              unit: "°C",
                            },
                            {
                              label: "Вес",
                              value: patient.vitals[0].weight,
                              unit: "кг",
                            },
                          ].map((v) => (
                            <div
                              key={v.label}
                              className="p-3 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200 text-center"
                            >
                              <p className="text-xs text-gray-500 mb-1">{v.label}</p>
                              <p className="text-xl font-bold text-gray-800">
                                {v.value} <span className="text-sm font-normal">{v.unit}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {patient.medications.length > 0 && (
                    <Card className="xl:col-span-3 bg-white shadow-sm rounded-lg border">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                          <Pill className="h-5 w-5 text-blue-500" />
                          Текущие медикаменты
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 px-3 text-left font-medium text-gray-500">Препарат</th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">Дозировка</th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">Частота</th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">Время</th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">Рецепт до</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patient.medications.map((med, i) => (
                              <tr key={`${med.name}-${i}`} className="border-b last:border-b-0 hover:bg-gray-50">
                                <td className="py-2.5 px-3">{med.name}</td>
                                <td className="py-2.5 px-3">{med.dosage}</td>
                                <td className="py-2.5 px-3">{med.frequency}</td>
                                <td className="py-2.5 px-3">{med.time}</td>
                                <td className="py-2.5 px-3">
                                  <Badge variant="secondary">{med.refill}</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  )}
                  {patient.history.length > 0 && (
                    <Card className="xl:col-span-3 bg-white shadow-sm rounded-lg border">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                          {historyIconForOverview} Последние записи ({patient.history.slice(0, 2).length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {patient.history.slice(0, 2).map((entry) => (
                          <div key={entry.id || entry.date} className="relative pl-7 pb-1 last:pb-0">
                            <div className="absolute left-0 top-1.5 h-full border-l-2 border-gray-200"></div>
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white -left-[7px]`}
                            ></div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">{entry.date}</span>
                                  <Badge variant="outline">{entry.type}</Badge>
                                </div>
                                <Badge className={`mt-1 sm:mt-0 bg-green-100 text-green-800 self-start sm:self-auto`}>
                                  {entry.diagnosis}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-2 line-clamp-3">{entry.notes}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Врач: {entry.doctor}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {entry.documents.map((doc, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="bg-blue-50 text-blue-600 border-blue-200 cursor-pointer hover:bg-blue-100"
                                    >
                                      <FileTextIcon className="w-3 h-3 mr-1" />
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {patient.history.length > 2 && (
                          <Button
                            variant="link"
                            className="w-full text-blue-600"
                            onClick={() => setActiveTab("history")}
                          >
                            Посмотреть всю историю ({patient.history.length})
                          </Button>
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-end">
                        <Button
                          onClick={openAddHistoryDialog}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить запись
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              )}
              {activeTab === "history" && (
                <Card className="bg-white shadow-sm rounded-lg border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                      {historyIconForHistoryTab} История болезни
                    </CardTitle>
                    <Button
                      onClick={openAddHistoryDialog}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {patient.history.length > 0 ? (
                      <div className="space-y-5">
                        {patient.history.map((entry) => (
                          <div key={entry.id || entry.date} className="relative pl-7">
                            <div className="absolute left-0 top-1.5 h-full border-l-2 border-gray-200 last:hidden"></div>
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white -left-[7px]`}
                            ></div>
                            <div className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-md font-semibold text-gray-800">{entry.date}</span>
                                    <Badge variant="secondary">{entry.type}</Badge>
                                  </div>
                                  <p className="text-xs text-gray-500">Врач: {entry.doctor}</p>
                                </div>
                                <Badge
                                  className={`mt-1 sm:mt-0 bg-green-100 text-green-800 self-start sm:self-auto px-2.5 py-1`}
                                >
                                  {entry.diagnosis}
                                </Badge>
                              </div>
                              {entry.notes && (
                                <div className="p-3 bg-gray-50 rounded-md my-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
                                  <pre className="whitespace-pre-wrap font-sans">{entry.notes}</pre>
                                </div>
                              )}
                              {entry.documents.length > 0 && (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-medium text-gray-500">Документы:</span>
                                  {entry.documents.map((doc, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="bg-blue-50 text-blue-600 border-blue-200 cursor-pointer hover:bg-blue-100 text-xs"
                                    >
                                      <FileTextIcon className="w-3 h-3 mr-1" />
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">История болезни пуста.</p>
                    )}
                  </CardContent>
                </Card>
              )}
              {activeTab === "medications" && (
                <Card className="bg-white shadow-sm rounded-lg border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                      <Pill className="h-5 w-5 text-blue-500" />
                      Лекарства
                    </CardTitle>
                    <Button
                      onClick={openAddMedicationDialog}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {patient.medications.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {patient.medications.map((med, i) => (
                          <div
                            key={`${med.name}-${i}`}
                            className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition-shadow overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3">
                              <h3 className="font-semibold text-white text-md">{med.name}</h3>
                            </div>
                            <div className="p-4 space-y-2 text-sm">
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div>
                                  <p className="text-xs text-gray-500">Дозировка</p>
                                  <p className="font-medium">{med.dosage}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Частота</p>
                                  <p className="font-medium">{med.frequency}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Время приема</p>
                                <p className="font-medium">{med.time}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Рецепт до</p>
                                <Badge variant="outline" className="mt-0.5">
                                  {med.refill}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Список лекарств пуст.</p>
                    )}
                  </CardContent>
                </Card>
              )}
              {activeTab === "vitals" && (
                <Card className="bg-white shadow-sm rounded-lg border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                      <Activity className="h-5 w-5 text-red-500" />
                      Показатели здоровья
                    </CardTitle>
                    <Button
                      onClick={openAddVitalsDialog}
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {patient.vitals.length > 0 ? (
                      <>
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full min-w-[600px] text-sm">
                            <thead>
                              <tr className="border-b bg-gray-50">
                                <th className="py-2 px-3 text-left font-medium text-gray-500">Дата</th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">Давление</th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">Пульс</th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">Темп.</th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">Вес</th>
                              </tr>
                            </thead>
                            <tbody>
                              {patient.vitals.map((v, i) => (
                                <tr key={`${v.date}-${i}`} className="border-b last:border-b-0 hover:bg-gray-50">
                                  <td className="py-2.5 px-3 font-medium">{v.date}</td>
                                  <td className="py-2.5 px-3">{v.bp}</td>
                                  <td className="py-2.5 px-3">{v.pulse} уд/мин</td>
                                  <td className="py-2.5 px-3">{v.temp}°C</td>
                                  <td className="py-2.5 px-3">{v.weight} кг</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <h3 className="text-md font-medium mb-2">Динамика показателей</h3>
                          <div className="h-60 bg-white rounded-md border p-4 flex items-center justify-center text-gray-400">
                            График показателей (заглушка)
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Данные о показателях отсутствуют.</p>
                    )}
                  </CardContent>
                </Card>
              )}
              {activeTab === "documents" && (
                <Card className="bg-white shadow-sm rounded-lg border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                      <FileTextIcon className="h-5 w-5 text-indigo-500" />
                      Документы
                    </CardTitle>
                    <Button
                      onClick={openAddDocumentDialog}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Загрузить
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {patient.history.flatMap((e) =>
                      e.documents.map((d, i) => ({
                        name: d,
                        date: e.date,
                        type: e.type,
                        id: `${e.id || e.date}-doc-${i}`,
                      })),
                    ).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {patient.history
                          .flatMap((entry) =>
                            entry.documents.map((docName, docIdx) => ({
                              name: docName,
                              date: entry.date,
                              type: entry.type,
                              id: `${entry.id || entry.date}-doc-${docIdx}`,
                            })),
                          )
                          .map((doc) => (
                            <div
                              key={doc.id}
                              className="bg-white rounded-lg border border-gray-200 shadow p-3 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start"
                            >
                              <div className="flex justify-between items-center w-full mb-2">
                                <FileTextIcon className="h-7 w-7 text-indigo-500" />
                                <Badge variant="outline" className="text-xs">
                                  {doc.date}
                                </Badge>
                              </div>
                              <h3 className="font-medium text-sm text-gray-800 line-clamp-2 flex-grow">{doc.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{doc.type}</p>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Документы отсутствуют.</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  // --- Patient List View ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-5 shadow-lg border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Пациенты ({filteredPatients.length})</h2>
          <p className="text-sm text-gray-500">Управление пациентами и их историями болезни</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowCreatePatientDialog(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать пациента
          </Button>
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск (имя, диагноз, ID)..."
              className="pl-9 w-full sm:w-64 rounded-full bg-gray-50 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-full p-2 h-auto aspect-square bg-transparent">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={filterStatus === null ? "default" : "outline"}
          className={`rounded-full text-xs px-3 py-1.5 h-auto ${
            filterStatus === null ? "bg-blue-600 text-white" : "border-gray-300"
          }`}
          onClick={() => setFilterStatus(null)}
        >
          Все ({patients.length})
        </Button>
        {Array.from(new Set(patients.map((p) => p.status))).map((status) => {
          const color = getStatusColorName(status)
          return (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              className={`rounded-full text-xs px-3 py-1.5 h-auto ${
                filterStatus === status
                  ? `bg-${color}-500 text-white border-${color}-500`
                  : `border-${color}-300 text-${color}-700 hover:bg-${color}-50`
              }`}
              onClick={() => setFilterStatus(status as string)}
            >
              {status} ({patients.filter((p) => p.status === status).length})
            </Button>
          )
        })}
      </div>
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => {
            const color = patient.statusColor || "gray"
            return (
              <Card
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              >
                <div
                  className={`h-1.5 bg-gradient-to-r from-${color}-400 to-${color}-600 group-hover:from-${color}-500 group-hover:to-${color}-700 transition-all`}
                ></div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <Avatar className="w-12 h-12 border-2 border-white shadow">
                      <AvatarImage
                        src={
                          patient.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name) || "/placeholder.svg"}&background=random&color=fff`
                        }
                        alt={patient.name}
                      />
                      <AvatarFallback
                        className={`bg-gradient-to-br from-${color}-500 to-${color}-700 text-white font-semibold`}
                      >
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {patient.age} лет • {patient.gender}
                      </p>
                    </div>
                    <Badge className={`text-xs bg-${color}-100 text-${color}-800 border-${color}-200`}>
                      {patient.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Диагноз:</span>
                      <span className="font-medium text-gray-700 truncate ml-2 text-right">
                        {patient.lastDiagnosis}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Визит:</span>
                      <span className="font-medium text-gray-700">{patient.lastVisit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">След. прием:</span>
                      <span className="font-medium text-gray-700">{patient.nextAppointment}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-xl font-medium text-gray-800 mb-1">Пациенты не найдены</h3>
          <p className="text-sm text-gray-500 mb-4">
            Данные пациентов отсутствуют или не удалось загрузить. Попробуйте позже.
          </p>
          <Button
            onClick={() => fetchPatients()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
          >
            Повторить
          </Button>
        </div>
      )}

      {/* Comprehensive Medical History Dialog. */}
      <Dialog open={showAddHistoryDialog} onOpenChange={setShowAddHistoryDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Kasallik tarixi (Подробная история болезни)
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              console.log("Form submitted");
              addHistoryEntryHandler(); 
            }} className="space-y-6 py-4">
              {/* Основная информация */}
              <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection("basic")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Asosiy ma'lumotlar
                    </h3>
                    {expandedSections.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fish">F.I.SH</Label>
                      <Input
                        id="fish"
                        value={medicalHistory.fish}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, fish: e.target.value })}
                        placeholder="Ivanov Ivan Ivanovich"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birth-date">Bemorni tug'ilgansanasi</Label>
                      <Input
                        id="birth-date"
                        type="date"
                        value={medicalHistory.birthDate}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, birthDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Millati</Label>
                      <Input
                        id="nationality"
                        value={medicalHistory.nationality}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, nationality: e.target.value })}
                        placeholder="O'zbek"
                      />
                    </div>
                    <div>
                      <Label htmlFor="education">Ma'lumoti</Label>
                      <Textarea
                        id="education"
                        rows={2}
                        value={medicalHistory.education}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, education: e.target.value })}
                        placeholder="Oliy tibbiy"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profession">Kasbi</Label>
                      <Textarea
                        id="profession"
                        rows={2}
                        value={medicalHistory.profession}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, profession: e.target.value })}
                        placeholder="Shifokor-terapevt"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workplace">Ish joyi</Label>
                      <Textarea
                        id="workplace"
                        rows={2}
                        value={medicalHistory.workplace}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, workplace: e.target.value })}
                        placeholder="Shahar kasalxonasi №1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="work-position">Ish joyidagi vazifasi</Label>
                      <Textarea
                        id="work-position"
                        rows={2}
                        value={medicalHistory.workPosition}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, workPosition: e.target.value })}
                        placeholder="Bo'lim mudiri"
                      />
                    </div>
                    <div>
                      <Label htmlFor="home-address">Uy manzili</Label>
                      <Input
                        id="home-address"
                        value={medicalHistory.homeAddress}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, homeAddress: e.target.value })}
                        placeholder="Toshkent sh., Navoiy ko'ch., 15-uy"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visit-date">
                        Kelgan vaqti <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="visit-date"
                        type="date"
                        value={medicalHistory.visitDate}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, visitDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="main-complaints">
                      Kelgan vaqtdagi shikoyatlari <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="main-complaints"
                      rows={4}
                      value={medicalHistory.mainComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, mainComplaints: e.target.value })}
                      placeholder="Bemorning kelgan vaqtdagi asosiy shikoyatlari..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="systemic-diseases">Bemorning asosiy tizimli kasalliklari</Label>
                    <Textarea
                      id="systemic-diseases"
                      rows={4}
                      value={medicalHistory.systemicDiseases}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, systemicDiseases: e.target.value })}
                                           placeholder="Bemorning asosiy tizimli kasalliklari (agar mavjud bo'lsa)..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Nafas tizimi */}
              <Collapsible open={expandedSections.respiratory} onOpenChange={() => toggleSection("respiratory")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Nafas tizimi
                    </h3>
                    {expandedSections.respiratory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="respiratory-complaints">Umumiy shikoyatlar</Label>
                    <Textarea
                      id="respiratory-complaints"
                      rows={2}
                      value={medicalHistory.respiratoryComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, respiratoryComplaints: e.target.value })}
                      placeholder="Umumiy nafas olish holati..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cough">Yo'tal</Label>
                      <Input
                        id="cough"
                        value={medicalHistory.cough}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, cough: e.target.value })}
                        placeholder="Yo'tal holati..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="sputum">Balg'am</Label>
                      <Input
                        id="sputum"
                        value={medicalHistory.sputum}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, sputum: e.target.value })}
                        placeholder="Balg'am xususiyatlari..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="hemoptysis">Qon tuflash</Label>
                      <Input
                        id="hemoptysis"
                        value={medicalHistory.hemoptysis}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, hemoptysis: e.target.value })}
                        placeholder="Qon chiqish holati..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="chest-pain">Ko'krak qafasidagi og'riq</Label>
                      <Input
                        id="chest-pain"
                        value={medicalHistory.chestPain}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, chestPain: e.target.value })}
                        placeholder="Og'riq xususiyatlari..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="dyspnea">Nafas qisishi</Label>
                      <Input
                        id="dyspnea"
                        value={medicalHistory.dyspnea}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, dyspnea: e.target.value })}
                        placeholder="Nafas qisilishi holati..."
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Yurak-qon aylanishi tizimi */}
              <Collapsible open={expandedSections.cardiovascular} onOpenChange={() => toggleSection("cardiovascular")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                      Yurak-qon aylanishi tizimi
                    </h3>
                    {expandedSections.cardiovascular ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="cardiovascular-complaints">Umumiy shikoyatlar</Label>
                    <Textarea
                      id="cardiovascular-complaints"
                      rows={2}
                      value={medicalHistory.cardiovascularComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, cardiovascularComplaints: e.target.value })}
                      placeholder="Umumiy yurak holati..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="heart-pain">Yurak sohasidagi og'riq</Label>
                      <Input
                        id="heart-pain"
                        value={medicalHistory.heartPain}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, heartPain: e.target.value })}
                        placeholder="Og'riq xususiyatlari..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="heart-rhythm">Yurak urishining o'zgarishi</Label>
                      <Input
                        id="heart-rhythm"
                        value={medicalHistory.heartRhythm}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, heartRhythm: e.target.value })}
                        placeholder="Urish o'zgarishi..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="palpitations">Yurak urishini bemor his qilishi</Label>
                      <Input
                        id="palpitations"
                        value={medicalHistory.palpitations}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, palpitations: e.target.value })}
                        placeholder="His qilish holati..."
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Hazm tizimi */}
              <Collapsible open={expandedSections.digestive} onOpenChange={() => toggleSection("digestive")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Hazm tizimi
                    </h3>
                    {expandedSections.digestive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="digestive-complaints">Umumiy shikoyatlar</Label>
                    <Textarea
                      id="digestive-complaints"
                      rows={2}
                      value={medicalHistory.digestiveComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, digestiveComplaints: e.target.value })}
                      placeholder="Umumiy hazm holati..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vomiting">Qusish</Label>
                      <Input
                        id="vomiting"
                        value={medicalHistory.vomiting}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, vomiting: e.target.value })}
                        placeholder="Qusish holati..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="abdominal-pain">Qorin og'riqi</Label>
                      <Input
                        id="abdominal-pain"
                        value={medicalHistory.abdominalPain}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, abdominalPain: e.target.value })}
                        placeholder="Og'riq xususiyatlari..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="epigastric-pain">To'sh osti va boshqa sohalarda og'riq</Label>
                      <Input
                        id="epigastric-pain"
                        value={medicalHistory.epigastricPain}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, epigastricPain: e.target.value })}
                        placeholder="Og'riq joylashuvi..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="bowel-movements">Ich kelishining o'zgarishi</Label>
                      <Input
                        id="bowel-movements"
                        value={medicalHistory.bowelMovements}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, bowelMovements: e.target.value })}
                        placeholder="Ich o'zgarishi..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="anal-symptoms">Anus sohasidagi simptomlar</Label>
                      <Input
                        id="anal-symptoms"
                        value={medicalHistory.analSymptoms}
                        onChange={(e) => setMedicalHistory({ ...medicalHistory, analSymptoms: e.target.value })}
                        placeholder="Anusdagi alomatlar..."
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Siydik ajratish tizimi */}
              <Collapsible open={expandedSections.urinary} onOpenChange={() => toggleSection("urinary")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Siydik ajratish tizimi
                    </h3>
                    {expandedSections.urinary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="urinary-complaints">Siydik ajratish bilan bog'liq shikoyatlar</Label>
                    <Textarea
                      id="urinary-complaints"
                      rows={3}
                      value={medicalHistory.urinaryComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, urinaryComplaints: e.target.value })}
                      placeholder="Siydik ajratish, og'riq, yonish..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Endokrin tizimi */}
              <Collapsible open={expandedSections.endocrine} onOpenChange={() => toggleSection("endocrine")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Endokrin tizimi
                    </h3>
                    {expandedSections.endocrine ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="endocrine-complaints">Endokrin tizim bilan bog'liq shikoyatlar</Label>
                    <Textarea
                      id="endocrine-complaints"
                      rows={3}
                      value={medicalHistory.endocrineComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, endocrineComplaints: e.target.value })}
                      placeholder="Shakar diabeti, tiroid, boshqa endokrin kasalliklar..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Tayanch harakat tizimi */}
              <Collapsible open={expandedSections.musculoskeletal} onOpenChange={() => toggleSection("musculoskeletal")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Tayanch harakat tizimi
                    </h3>
                    {expandedSections.musculoskeletal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="musculoskeletal-complaints">Tayanch harakat tizimi bilan bog'liq shikoyatlar</Label>
                    <Textarea
                      id="musculoskeletal-complaints"
                      rows={3}
                      value={medicalHistory.musculoskeletalComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, musculoskeletalComplaints: e.target.value })}
                      placeholder="Bog'lamlar, mushaklar, suyaklar bilan bog'liq muammolar..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Asab tizimi */}
              <Collapsible open={expandedSections.nervous} onOpenChange={() => toggleSection("nervous")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Asab tizimi
                    </h3>
                    {expandedSections.nervous ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="nervous-complaints">Asab tizimi bilan bog'liq shikoyatlar</Label>
                    <Textarea
                      id="nervous-complaints"
                      rows={3}
                      value={medicalHistory.nervousSystemComplaints}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, nervousSystemComplaints: e.target.value })}
                      placeholder="Bosh og'riqi, bosh aylanishi, uyqu muammolari..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Doktor tavsiyalari */}
              <div>
                <Label htmlFor="doctor-recommendations">Doktor tavsiyalari</Label>
                <Textarea
                  id="doctor-recommendations"
                  rows={4}
                  value={medicalHistory.doctorRecommendations}
                  onChange={(e) => setMedicalHistory({ ...medicalHistory, doctorRecommendations: e.target.value })}
                  placeholder="Doktorning qo'shimcha tavsiyalari..."
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddHistoryDialog}>
              Bekor qilish
            </Button>
            <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Medication Dialog */}
      <Dialog open={showAddMedicationDialog} onOpenChange={setShowAddMedicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Добавить медикамент</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="med-name">Название</Label>
              <Input
                id="med-name"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                placeholder="Например, Метформин"
              />
            </div>
            <div>
              <Label htmlFor="med-dosage">Дозировка</Label>
              <Input
                id="med-dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                placeholder="Например, 500 мг"
              />
            </div>
            <div>
              <Label htmlFor="med-frequency">Частота</Label>
              <Input
                id="med-frequency"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                placeholder="Например, 2 раза в день"
              />
            </div>
            <div>
              <Label htmlFor="med-time">Время приема</Label>
              <Input
                id="med-time"
                value={newMedication.time}
                onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                placeholder="Например, Утром и вечером"
              />
            </div>
            <div>
              <Label htmlFor="med-refill">Рецепт до</Label>
              <Input
                id="med-refill"
                type="date"
                value={newMedication.refill}
                onChange={(e) => setNewMedication({ ...newMedication, refill: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddMedicationDialog}>
              Отмена
            </Button>
            <Button onClick={addMedicationHandler} className="bg-blue-600 text-white hover:bg-blue-700">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vitals Dialog */}
      <Dialog open={showAddVitalsDialog} onOpenChange={setShowAddVitalsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Добавить показатели</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="vitals-date">Дата</Label>
              <Input
                id="vitals-date"
                type="date"
                value={newVitals.date}
                onChange={(e) => setNewVitals({ ...newVitals, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="vitals-bp">Давление</Label>
              <Input
                id="vitals-bp"
                value={newVitals.bp}
                onChange={(e) => setNewVitals({ ...newVitals, bp: e.target.value })}
                placeholder="Например, 135/85"
              />
            </div>
            <div>
              <Label htmlFor="vitals-pulse">Пульс</Label>
              <Input
                id="vitals-pulse"
                value={newVitals.pulse}
                onChange={(e) => setNewVitals({ ...newVitals, pulse: e.target.value })}
                placeholder="Например, 72"
              />
            </div>
            <div>
              <Label htmlFor="vitals-temp">Температура</Label>
              <Input
                id="vitals-temp"
                value={newVitals.temp}
                onChange={(e) => setNewVitals({ ...newVitals, temp: e.target.value })}
                placeholder="Например, 36.6"
              />
            </div>
            <div>
              <Label htmlFor="vitals-weight">Вес</Label>
              <Input
                id="vitals-weight"
                value={newVitals.weight}
                onChange={(e) => setNewVitals({ ...newVitals, weight: e.target.value })}
                placeholder="Например, 82"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddVitalsDialog}>
              Отмена
            </Button>
            <Button onClick={addVitalsHandler} className="bg-red-600 text-white hover:bg-red-700">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Загрузить документ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="doc-name">Название</Label>
              <Input
                id="doc-name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                placeholder="Например, Анализ крови"
              />
            </div>
            <div>
              <Label htmlFor="doc-type">Тип</Label>
              <Input
                id="doc-type"
                value={newDocument.type}
                onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
                placeholder="Например, Анализ"
              />
            </div>
            <div>
              <Label htmlFor="doc-file">Файл</Label>
              <Input
                id="doc-file"
                type="file"
                onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files?.[0] || null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddDocumentDialog}>
              Отмена
            </Button>
            <Button onClick={addDocumentHandler} className="bg-indigo-600 text-white hover:bg-indigo-700">
              Загрузить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Patient Dialog */}
      <Dialog open={showCreatePatientDialog} onOpenChange={setShowCreatePatientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Создать пациента</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="new-fish">F.I.SH</Label>
              <Input
                id="new-fish"
                value={newPatient.fish}
                onChange={(e) => setNewPatient({ ...newPatient, fish: e.target.value })}
                placeholder="Ivanov Ivan Ivanovich"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-passport-series">Pasport seriyasi</Label>
                <Input
                  id="new-passport-series"
                  value={newPatient.passportSeries}
                  onChange={(e) => setNewPatient({ ...newPatient, passportSeries: e.target.value })}
                  placeholder="AA"
                />
              </div>
              <div>
                <Label htmlFor="new-passport-number">Pasport raqami</Label>
                <Input
                  id="new-passport-number"
                  value={newPatient.passportNumber}
                  onChange={(e) => setNewPatient({ ...newPatient, passportNumber: e.target.value })}
                  placeholder="1234567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-phone">Telefon raqami</Label>
              <Input
                id="new-phone"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div>
              <Label htmlFor="new-email">Elektron pochta</Label>
              <Input
                id="new-email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>
            <div>
              <Label htmlFor="new-birth-date">Tug'ilgan sana</Label>
              <Input
                id="new-birth-date"
                type="date"
                value={newPatient.birthDate}
                onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-gender">Jinsi</Label>
              <select
                id="new-gender"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="Мужской">Мужской</option>
                <option value="Женский">Женский</option>
              </select>
            </div>
            <div>
              <Label htmlFor="new-blood-type">Qon guruhi</Label>
              <select
                id="new-blood-type"
                value={newPatient.bloodType}
                onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="A(II) Rh+">A(II) Rh+</option>
                <option value="A(II) Rh-">A(II) Rh-</option>
                <option value="B(III) Rh+">B(III) Rh+</option>
                <option value="B(III) Rh-">B(III) Rh-</option>
                <option value="AB(IV) Rh+">AB(IV) Rh+</option>
                <option value="AB(IV) Rh-">AB(IV) Rh-</option>
                <option value="O(I) Rh+">O(I) Rh+</option>
                <option value="O(I) Rh-">O(I) Rh-</option>
              </select>
            </div>
            <div>
              <Label htmlFor="new-address">Manzil</Label>
              <Input
                id="new-address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                placeholder="Toshkent sh., Chilonzor, 15-uy"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePatientDialog(false)}>
              Bekor qilish
            </Button>
            <Button onClick={createPatientHandler} className="bg-green-600 text-white hover:bg-green-700">
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}