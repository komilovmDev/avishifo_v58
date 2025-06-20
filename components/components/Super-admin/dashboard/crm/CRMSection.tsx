// src/components/dashboard/crm/CRMSection.tsx
"use client";

import { useState } from "react";
import type {
  ViewMode,
  UserStatsType,
  AdminUserType,
  DoctorUserType,
  PatientUserType,
  UserRoleType
} from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, List } from "lucide-react";
import { UserStatsCard } from "./UserStatsCard";
import { CRMOverviewTab } from "./CRMOverviewTab";
import { UserManagementTable } from "./UserManagementTable";

// Initial Data (can be fetched from API)
const initialStats: UserStatsType = {
  totalUsers: 2847,
  admins: 12,
  doctors: 45,
  patients: 2790,
  activeToday: 156,
  newThisWeek: 23,
  premiumUsers: 89,
  blockedUsers: 3,
};

const initialAdminsList: AdminUserType[] = [
    { id: 1, name: "Иван Петров", role: "Главный Админ", lastActive: "2 мин назад", status: "online", email: "ivan@medpro.ru", blocked: false },
    { id: 2, name: "Мария Сидорова", role: "Модератор", lastActive: "15 мин назад", status: "online", email: "maria@medpro.ru", blocked: false },
    { id: 3, name: "Алексей Козлов", role: "Техподдержка", lastActive: "1 час назад", status: "away", email: "alex@medpro.ru", blocked: false },
    { id: 4, name: "Елена Волкова", role: "Аналитик", lastActive: "3 часа назад", status: "offline", email: "elena@medpro.ru", blocked: false },
];
const initialDoctorsList: DoctorUserType[] = [
    { id: 1, name: "Др. Анна Смирнова", specialty: "Кардиолог", patients: 45, rating: 4.9, status: "online", email: "anna@medpro.ru", blocked: false },
    { id: 2, name: "Др. Михаил Попов", specialty: "Терапевт", patients: 67, rating: 4.8, status: "online", email: "mikhail@medpro.ru", blocked: false },
    { id: 3, name: "Др. Ольга Новикова", specialty: "Невролог", patients: 32, rating: 4.7, status: "away", email: "olga@medpro.ru", blocked: false },
    { id: 4, name: "Др. Сергей Лебедев", specialty: "Психиатр", patients: 28, rating: 4.9, status: "offline", email: "sergey@medpro.ru", blocked: false },
];
const initialPatientsList: PatientUserType[] = [
    { id: 1, name: "Анна Иванова", age: 32, lastVisit: "Сегодня", status: "active", plan: "Premium", email: "anna.i@email.ru", blocked: false },
    { id: 2, name: "Петр Сидоров", age: 45, lastVisit: "Вчера", status: "active", plan: "Basic", email: "petr@email.ru", blocked: false },
    { id: 3, name: "Мария Козлова", age: 28, lastVisit: "3 дня назад", status: "inactive", plan: "Premium", email: "maria.k@email.ru", blocked: false },
    { id: 4, name: "Дмитрий Волков", age: 52, lastVisit: "1 неделю назад", status: "inactive", plan: "Basic", email: "dmitry@email.ru", blocked: false },
];


interface CRMSectionProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
}

export function CRMSection({
  viewMode,
  setViewMode,
  searchQuery,
}: CRMSectionProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  // const [sortBy, setSortBy] = useState("name"); // SortBy not fully implemented in original

  const [stats, setStats] = useState<UserStatsType>(initialStats);
  const [adminsList, setAdminsList] = useState<AdminUserType[]>(initialAdminsList);
  const [doctorsList, setDoctorsList] = useState<DoctorUserType[]>(initialDoctorsList);
  const [patientsList, setPatientsList] = useState<PatientUserType[]>(initialPatientsList);

  const blockUser = (type: UserRoleType, id: number) => {
    const listUpdater = (prevList: any[]) =>
      prevList.map((user) =>
        user.id === id ? { ...user, blocked: !user.blocked } : user
      );

    if (type === "admin") setAdminsList(listUpdater);
    else if (type === "doctor") setDoctorsList(listUpdater);
    else if (type === "patient") setPatientsList(listUpdater);
    // Update blockedUsers count in stats
    const user = (type === 'admin' ? adminsList : type === 'doctor' ? doctorsList : patientsList).find(u => u.id === id);
    if (user) {
        setStats(prev => ({...prev, blockedUsers: user.blocked ? prev.blockedUsers -1 : prev.blockedUsers + 1}))
    }
  };

  const deleteUser = (type: UserRoleType, id: number) => {
    const listUpdater = (prevList: any[]) => prevList.filter((user) => user.id !== id);

    if (type === "admin") {
      setAdminsList(listUpdater);
      setStats((prev) => ({ ...prev, admins: prev.admins - 1, totalUsers: prev.totalUsers - 1 }));
    } else if (type === "doctor") {
      setDoctorsList(listUpdater);
      setStats((prev) => ({ ...prev, doctors: prev.doctors - 1, totalUsers: prev.totalUsers - 1 }));
    } else if (type === "patient") {
      setPatientsList(listUpdater);
      setStats((prev) => ({ ...prev, patients: prev.patients - 1, totalUsers: prev.totalUsers - 1 }));
    }
  };

  const addUser = (type: UserRoleType, formData: any) => {
    const newUser = {
        id: Date.now(), // simple unique ID
        ...formData,
        status: type === 'patient' ? 'active' : 'online', // Default status
        blocked: false,
        // Add type-specific defaults if not in formData
        ...(type === 'admin' && { lastActive: 'Только что'}),
        ...(type === 'doctor' && { patients: 0, rating: 0}),
        ...(type === 'patient' && { age: formData.age || 0, lastVisit: 'Недавно', plan: formData.plan || 'Basic'}),
    };

    if (type === 'admin') {
        setAdminsList(prev => [newUser as AdminUserType, ...prev]);
        setStats(prev => ({ ...prev, admins: prev.admins + 1, totalUsers: prev.totalUsers + 1}));
    } else if (type === 'doctor') {
        setDoctorsList(prev => [newUser as DoctorUserType, ...prev]);
        setStats(prev => ({ ...prev, doctors: prev.doctors + 1, totalUsers: prev.totalUsers + 1}));
    } else if (type === 'patient') {
        setPatientsList(prev => [newUser as PatientUserType, ...prev]);
        setStats(prev => ({ ...prev, patients: prev.patients + 1, totalUsers: prev.totalUsers + 1}));
    }
    console.log(`Added new ${type}:`, newUser);
  };

  const editUser = (type: UserRoleType, userId: number, formData: any) => {
    const listUpdater = (prevList: any[]) =>
      prevList.map(user => user.id === userId ? {...user, ...formData} : user);

    if (type === 'admin') setAdminsList(listUpdater);
    else if (type === 'doctor') setDoctorsList(listUpdater);
    else if (type === 'patient') setPatientsList(listUpdater);

    console.log(`Edited ${type} (ID: ${userId}):`, formData);
  };


  const filteredData = (data: any[]) => {
    return data.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = item.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || emailMatch;

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "blocked" && item.blocked) ||
        (filterStatus === "active" && !item.blocked);
      return matchesSearch && matchesFilter;
    });
  };

  const statsEntries = Object.entries(stats);
  const statColors = [
    "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    "from-green-50 to-green-100 border-green-200 text-green-700",
    "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700",
    "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
    "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700",
    "from-red-50 to-red-100 border-red-200 text-red-700",
  ];
  const statLabels: Record<keyof UserStatsType, string> = {
    totalUsers: "Всего пользователей",
    admins: "Администраторы",
    doctors: "Доктора",
    patients: "Пациенты",
    activeToday: "Активны сегодня",
    newThisWeek: "Новые за неделю",
    premiumUsers: "Premium",
    blockedUsers: "Заблокированы",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800">
          Управление Пользователями
        </h3>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="blocked">Заблокированные</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={`${
              viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-500"
            } w-8 h-8 lg:w-10 lg:h-10`}
          >
            <Grid3X3 className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={`${
              viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-500"
            } w-8 h-8 lg:w-10 lg:h-10`}
          >
            <List className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 lg:gap-4">
        {statsEntries.map(([key, value], index) => (
          <UserStatsCard
            key={key}
            label={statLabels[key as keyof UserStatsType]}
            value={value}
            colorClasses={statColors[index % statColors.length]}
          />
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="admins">Админы ({stats.admins})</TabsTrigger>
          <TabsTrigger value="doctors">Доктора ({stats.doctors})</TabsTrigger>
          <TabsTrigger value="patients">Пациенты ({stats.patients})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CRMOverviewTab
            adminsList={adminsList}
            doctorsList={doctorsList}
            patientsList={patientsList}
          />
        </TabsContent>

        <TabsContent value="admins">
          <UserManagementTable
            data={filteredData(adminsList)}
            type="admin"
            onBlock={blockUser}
            onDelete={deleteUser}
            onAddUser={addUser}
            onEditUser={editUser}
          />
        </TabsContent>

        <TabsContent value="doctors">
          <UserManagementTable
            data={filteredData(doctorsList)}
            type="doctor"
            onBlock={blockUser}
            onDelete={deleteUser}
            onAddUser={addUser}
            onEditUser={editUser}
          />
        </TabsContent>

        <TabsContent value="patients">
          <UserManagementTable
            data={filteredData(patientsList)}
            type="patient"
            onBlock={blockUser}
            onDelete={deleteUser}
            onAddUser={addUser}
            onEditUser={editUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
