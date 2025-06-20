// components/PatientHistorySection/PatientHistorySection.tsx

"use client";

import React, { useState } from "react"; // Ensure React is imported if not implicitly available
import {
  Search,
  ChevronRight,
  Activity,
  Calendar,
  X,
  Info,
  Phone,
  Mail,
  MapPin,
  User,
  Pill,
  Filter,
  FileTextIcon,
  MessageCircleIcon,
  Plus,
  History, // CRITICAL: Ensure this is the Lucide icon and not shadowed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Added for consistency in dialog structure
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"; // For patient detail view

// --- Type Definitions (as previously provided) ---
interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  refill: string;
}
interface VitalSign {
  date: string;
  bp: string;
  pulse: string;
  temp: string;
  weight: string;
}
interface HistoryEntry {
  id?: string;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  documents: string[];
} // Added optional id for key
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  status: string;
  statusColor: string;
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
interface NewHistoryEntryForm {
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  documents: string[];
}
interface NewMedicationForm {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  refill: string;
}
interface NewVitalsForm {
  date: string;
  bp: string;
  pulse: string;
  temp: string;
  weight: string;
}
interface NewDocumentForm {
  name: string;
  type: string;
  file: File | null;
}

// --- Logging for Debugging ---
console.log(
  "PatientHistorySection: Lucide History icon type:",
  typeof History,
  History
);

export function PatientHistorySection() {
  console.log("PatientHistorySection rendering or re-rendering"); // For checking render cycles

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [showAddHistoryDialog, setShowAddHistoryDialog] = useState(false);
  const [showAddMedicationDialog, setShowAddMedicationDialog] = useState(false);
  const [showAddVitalsDialog, setShowAddVitalsDialog] = useState(false);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);

  const [newHistoryEntry, setNewHistoryEntry] = useState<NewHistoryEntryForm>({
    date: "",
    type: "",
    doctor: "",
    diagnosis: "",
    notes: "",
    documents: [],
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

  const [patients, setPatients] = useState<Patient[]>([
    // Sample data (ensure avatar paths are correct or use a placeholder service)
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
  ]);

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(searchLower) ||
      patient.lastDiagnosis.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower);
    const matchesFilter = !filterStatus || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColorName = (status: string): string => {
    const patientWithStatus = patients.find((p) => p.status === status);
    return patientWithStatus?.statusColor || "gray";
  };

  const addHistoryEntryHandler = () => {
    if (
      !selectedPatientId ||
      !newHistoryEntry.date ||
      !newHistoryEntry.type ||
      !newHistoryEntry.diagnosis
    ) {
      alert("Пожалуйста, заполните дату, тип визита и диагноз.");
      return;
    }
    const newEntryWithId: HistoryEntry = {
      ...newHistoryEntry,
      id: `hist-${Date.now()}`,
    };
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === selectedPatientId
          ? { ...p, history: [newEntryWithId, ...p.history] }
          : p
      )
    );
    setNewHistoryEntry({
      date: "",
      type: "",
      doctor: "",
      diagnosis: "",
      notes: "",
      documents: [],
    });
    setShowAddHistoryDialog(false);
  };

  const addMedicationHandler = () => {
    if (
      !selectedPatientId ||
      !newMedication.name ||
      !newMedication.dosage ||
      !newMedication.frequency
    ) {
      alert(
        "Пожалуйста, заполните название препарата, дозировку и частоту приема."
      );
      return;
    }
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === selectedPatientId
          ? {
              ...p,
              medications: [
                ...p.medications,
                { ...newMedication } as Medication,
              ],
            }
          : p
      )
    );
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      refill: "",
    });
    setShowAddMedicationDialog(false);
  };

  const addVitalsHandler = () => {
    if (
      !selectedPatientId ||
      !newVitals.date ||
      !newVitals.bp ||
      !newVitals.pulse
    ) {
      alert("Пожалуйста, заполните дату, АД и пульс.");
      return;
    }
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === selectedPatientId
          ? { ...p, vitals: [{ ...newVitals } as VitalSign, ...p.vitals] }
          : p
      )
    );
    setNewVitals({ date: "", bp: "", pulse: "", temp: "", weight: "" });
    setShowAddVitalsDialog(false);
  };

  const addDocumentHandler = () => {
    if (!selectedPatientId || !newDocument.name || !newDocument.file) {
      alert("Укажите название документа и выберите файл.");
      return;
    }
    const newDocEntry: HistoryEntry = {
      id: `doc-hist-${Date.now()}`,
      date: new Date().toLocaleDateString("ru-RU"),
      type: "Загруженный документ",
      doctor: "Текущий врач",
      diagnosis: newDocument.type || "Доп. документ",
      notes: `Загружен: ${newDocument.name}`,
      documents: [newDocument.file.name],
    };
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === selectedPatientId
          ? { ...p, history: [newDocEntry, ...p.history] }
          : p
      )
    );
    setNewDocument({ name: "", type: "", file: null });
    setShowAddDocumentDialog(false);
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // --- Patient Detail View ---
  if (selectedPatient) {
    const patient = selectedPatient;
    const color = patient.statusColor || "gray";

    // CRITICAL: Check how History is used here
    const historyIconForOverview = (
      <History className="h-5 w-5 text-green-500" />
    );
    const historyIconForHistoryTab = (
      <History className="h-5 w-5 text-green-500" />
    );

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
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      patient.name
                    )}&background=random&color=fff`
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
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {patient.name}
                </h2>
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
                className="flex gap-2 w-full md:w-auto"
                onClick={() => setSelectedPatientId(null)}
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
                {[
                  "overview",
                  "history",
                  "medications",
                  "vitals",
                  "documents",
                ].map((tabId) => (
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
                          <p className="text-xs text-gray-500">
                            Текущий диагноз
                          </p>
                          <p className="font-medium">{patient.lastDiagnosis}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Дата визита</p>
                          <p className="font-medium">
                            {patient.history[0]?.date || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Аллергии
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.length ? (
                            patient.allergies.map((a, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200"
                              >
                                {a}
                              </Badge>
                            ))
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Не выявлено
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Хронические заболевания
                        </p>
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
                              <p className="text-xs text-gray-500 mb-1">
                                {v.label}
                              </p>
                              <p className="text-xl font-bold text-gray-800">
                                {v.value}{" "}
                                <span className="text-sm font-normal">
                                  {v.unit}
                                </span>
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
                              <th className="py-2 px-3 text-left font-medium text-gray-500">
                                Препарат
                              </th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">
                                Дозировка
                              </th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">
                                Частота
                              </th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">
                                Время
                              </th>
                              <th className="py-2 px-3 text-left font-medium text-gray-500">
                                Рецепт до
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {patient.medications.map((med, i) => (
                              <tr
                                key={`${med.name}-${i}`}
                                className="border-b last:border-b-0 hover:bg-gray-50"
                              >
                                <td className="py-2.5 px-3">{med.name}</td>
                                <td className="py-2.5 px-3">{med.dosage}</td>
                                <td className="py-2.5 px-3">{med.frequency}</td>
                                <td className="py-2.5 px-3">{med.time}</td>
                                <td className="py-2.5 px-3">
                                  <Badge variant="secondary">
                                    {med.refill}
                                  </Badge>
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
                          {historyIconForOverview} Последние записи (
                          {patient.history.slice(0, 2).length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {patient.history.slice(0, 2).map((entry) => (
                          <div
                            key={entry.id || entry.date}
                            className="relative pl-7 pb-1 last:pb-0"
                          >
                            <div className="absolute left-0 top-1.5 h-full border-l-2 border-gray-200"></div>
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white -left-[7px]`}
                            ></div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">
                                    {entry.date}
                                  </span>
                                  <Badge variant="outline">{entry.type}</Badge>
                                </div>
                                <Badge
                                  className={`mt-1 sm:mt-0 bg-green-100 text-green-800 self-start sm:self-auto`}
                                >
                                  {entry.diagnosis}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">
                                {entry.notes}
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                  Врач: {entry.doctor}
                                </span>
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
                          onClick={() => setShowAddHistoryDialog(true)}
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
                      onClick={() => setShowAddHistoryDialog(true)}
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
                          <div
                            key={entry.id || entry.date}
                            className="relative pl-7"
                          >
                            <div className="absolute left-0 top-1.5 h-full border-l-2 border-gray-200 last:hidden"></div>
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white -left-[7px]`}
                            ></div>
                            <div className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-md font-semibold text-gray-800">
                                      {entry.date}
                                    </span>
                                    <Badge variant="secondary">
                                      {entry.type}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Врач: {entry.doctor}
                                  </p>
                                </div>
                                <Badge
                                  className={`mt-1 sm:mt-0 bg-green-100 text-green-800 self-start sm:self-auto px-2.5 py-1`}
                                >
                                  {entry.diagnosis}
                                </Badge>
                              </div>
                              {entry.notes && (
                                <div className="p-3 bg-gray-50 rounded-md my-2 text-sm text-gray-700">
                                  {entry.notes}
                                </div>
                              )}
                              {entry.documents.length > 0 && (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-medium text-gray-500">
                                    Документы:
                                  </span>
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
                      <p className="text-center text-gray-500 py-8">
                        История болезни пуста.
                      </p>
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
                      onClick={() => setShowAddMedicationDialog(true)}
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
                              <h3 className="font-semibold text-white text-md">
                                {med.name}
                              </h3>
                            </div>
                            <div className="p-4 space-y-2 text-sm">
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Дозировка
                                  </p>
                                  <p className="font-medium">{med.dosage}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Частота
                                  </p>
                                  <p className="font-medium">{med.frequency}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Время приема
                                </p>
                                <p className="font-medium">{med.time}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Рецепт до
                                </p>
                                <Badge variant="outline" className="mt-0.5">
                                  {med.refill}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        Список лекарств пуст.
                      </p>
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
                      onClick={() => setShowAddVitalsDialog(true)}
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
                                <th className="py-2 px-3 text-left font-medium text-gray-500">
                                  Дата
                                </th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">
                                  Давление
                                </th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">
                                  Пульс
                                </th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">
                                  Темп.
                                </th>
                                <th className="py-2 px-3 text-left font-medium text-gray-500">
                                  Вес
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {patient.vitals.map((v, i) => (
                                <tr
                                  key={`${v.date}-${i}`}
                                  className="border-b last:border-b-0 hover:bg-gray-50"
                                >
                                  <td className="py-2.5 px-3 font-medium">
                                    {v.date}
                                  </td>
                                  <td className="py-2.5 px-3">{v.bp}</td>
                                  <td className="py-2.5 px-3">
                                    {v.pulse} уд/мин
                                  </td>
                                  <td className="py-2.5 px-3">{v.temp}°C</td>
                                  <td className="py-2.5 px-3">{v.weight} кг</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <h3 className="text-md font-medium mb-2">
                            Динамика показателей
                          </h3>
                          <div className="h-60 bg-white rounded-md border p-4 flex items-center justify-center text-gray-400">
                            График показателей (заглушка)
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        Данные о показателях отсутствуют.
                      </p>
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
                      onClick={() => setShowAddDocumentDialog(true)}
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
                      }))
                    ).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {patient.history
                          .flatMap((entry) =>
                            entry.documents.map((docName, docIdx) => ({
                              name: docName,
                              date: entry.date,
                              type: entry.type,
                              id: `${entry.id || entry.date}-doc-${docIdx}`,
                            }))
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
                              <h3 className="font-medium text-sm text-gray-800 line-clamp-2 flex-grow">
                                {doc.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {doc.type}
                              </p>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        Документы отсутствуют.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // --- Patient List View ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-5 shadow-lg border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Пациенты ({filteredPatients.length})
          </h2>
          <p className="text-sm text-gray-500">
            Управление пациентами и их историями болезни
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск (имя, диагноз, ID)..."
              className="pl-9 w-full sm:w-64 rounded-full bg-gray-50 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="rounded-full p-2 h-auto aspect-square"
          >
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
          const color = getStatusColorName(status);
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
          );
        })}
      </div>
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => {
            const color = patient.statusColor || "gray";
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
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            patient.name
                          )}&background=random&color=fff`
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
                    <Badge
                      className={`text-xs bg-${color}-100 text-${color}-800 border-${color}-200`}
                    >
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
                      <span className="font-medium text-gray-700">
                        {patient.lastVisit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">След. прием:</span>
                      <span className="font-medium text-gray-700">
                        {patient.nextAppointment}
                      </span>
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
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-xl font-medium text-gray-800 mb-1">
            Пациенты не найдены
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Попробуйте изменить параметры поиска или сбросить фильтры.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setFilterStatus(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
          >
            Сбросить фильтры
          </Button>
        </div>
      )}
      {/* Dialogs */}
      <Dialog
        open={showAddHistoryDialog}
        onOpenChange={setShowAddHistoryDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Добавить запись в историю</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="h-date">Дата</Label>
                <Input
                  id="h-date"
                  type="date"
                  value={newHistoryEntry.date}
                  onChange={(e) =>
                    setNewHistoryEntry({
                      ...newHistoryEntry,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="h-type">Тип визита</Label>
                <Input
                  id="h-type"
                  value={newHistoryEntry.type}
                  onChange={(e) =>
                    setNewHistoryEntry({
                      ...newHistoryEntry,
                      type: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="h-doctor">Врач</Label>
              <Input
                id="h-doctor"
                value={newHistoryEntry.doctor}
                onChange={(e) =>
                  setNewHistoryEntry({
                    ...newHistoryEntry,
                    doctor: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="h-diag">Диагноз</Label>
              <Input
                id="h-diag"
                value={newHistoryEntry.diagnosis}
                onChange={(e) =>
                  setNewHistoryEntry({
                    ...newHistoryEntry,
                    diagnosis: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="h-notes">Заметки</Label>
              <textarea
                id="h-notes"
                rows={3}
                className="w-full p-2 border rounded-md text-sm"
                value={newHistoryEntry.notes}
                onChange={(e) =>
                  setNewHistoryEntry({
                    ...newHistoryEntry,
                    notes: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddHistoryDialog(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={addHistoryEntryHandler}
              className="bg-green-600 hover:bg-green-700"
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showAddMedicationDialog}
        onOpenChange={setShowAddMedicationDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить лекарство</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="m-name">Название</Label>
              <Input
                id="m-name"
                value={newMedication.name}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="m-dosage">Дозировка</Label>
                <Input
                  id="m-dosage"
                  value={newMedication.dosage}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      dosage: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="m-freq">Частота</Label>
                <Input
                  id="m-freq"
                  value={newMedication.frequency}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      frequency: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="m-time">Время приема</Label>
                <Input
                  id="m-time"
                  value={newMedication.time}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, time: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="m-refill">Рецепт до</Label>
                <Input
                  id="m-refill"
                  type="date"
                  value={newMedication.refill}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      refill: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMedicationDialog(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={addMedicationHandler}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddVitalsDialog} onOpenChange={setShowAddVitalsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить показатели</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="v-date">Дата</Label>
              <Input
                id="v-date"
                type="date"
                value={newVitals.date}
                onChange={(e) =>
                  setNewVitals({ ...newVitals, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="v-bp">Давление</Label>
                <Input
                  id="v-bp"
                  placeholder="120/80"
                  value={newVitals.bp}
                  onChange={(e) =>
                    setNewVitals({ ...newVitals, bp: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="v-pulse">Пульс (уд/мин)</Label>
                <Input
                  id="v-pulse"
                  placeholder="70"
                  value={newVitals.pulse}
                  onChange={(e) =>
                    setNewVitals({ ...newVitals, pulse: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="v-temp">Температура (°C)</Label>
                <Input
                  id="v-temp"
                  placeholder="36.6"
                  value={newVitals.temp}
                  onChange={(e) =>
                    setNewVitals({ ...newVitals, temp: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="v-weight">Вес (кг)</Label>
                <Input
                  id="v-weight"
                  placeholder="70.5"
                  value={newVitals.weight}
                  onChange={(e) =>
                    setNewVitals({ ...newVitals, weight: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddVitalsDialog(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={addVitalsHandler}
              className="bg-red-600 hover:bg-red-700"
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showAddDocumentDialog}
        onOpenChange={setShowAddDocumentDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Загрузить документ</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="d-name">Название документа</Label>
              <Input
                id="d-name"
                value={newDocument.name}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, name: e.target.value })
                }
                placeholder="Анализ крови от 20.07.24"
              />
            </div>
            <div>
              <Label htmlFor="d-type">Тип (необязательно)</Label>
              <Input
                id="d-type"
                value={newDocument.type}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, type: e.target.value })
                }
                placeholder="Лабораторный анализ"
              />
            </div>
            <div>
              <Label htmlFor="d-file">Файл</Label>
              <Input
                id="d-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    file: e.target.files ? e.target.files[0] : null,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDocumentDialog(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={addDocumentHandler}
              disabled={!newDocument.name || !newDocument.file}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Загрузить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
