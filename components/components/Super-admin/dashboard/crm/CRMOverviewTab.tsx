// src/components/dashboard/crm/CRMOverviewTab.tsx
"use client";

import type { AdminUserType, DoctorUserType, PatientUserType } from "@/types/dashboard";
import { UserListCard } from "./UserListCard";
import { Shield, Users, Activity } from "lucide-react";

interface CRMOverviewTabProps {
  adminsList: AdminUserType[];
  doctorsList: DoctorUserType[];
  patientsList: PatientUserType[];
}

export function CRMOverviewTab({ adminsList, doctorsList, patientsList }: CRMOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UserListCard
        title="Последние Администраторы"
        Icon={Shield}
        iconColor="text-purple-500"
        users={adminsList}
        userType="admin"
      />
      <UserListCard
        title="Топ Доктора"
        Icon={Users}
        iconColor="text-green-500"
        users={doctorsList}
        userType="doctor"
      />
      <UserListCard
        title="Активные Пациенты"
        Icon={Activity}
        iconColor="text-cyan-500"
        users={patientsList}
        userType="patient"
      />
    </div>
  );
}
