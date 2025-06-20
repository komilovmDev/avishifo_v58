// src/components/dashboard/requests/RequestsMonitoringSection.tsx
"use client";

import { useState } from "react";
import type { RequestEntryType } from "@/types/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestStatsCard } from "./RequestStatsCard";
import { RequestsTable } from "./RequestsTable";

const initialRequests: RequestEntryType[] = [
  { id: 1, user: "Анна Иванова", type: "Запись к врачу", description: "Запись на консультацию кардиолога", status: "pending", priority: "medium", time: "2 часа назад", assignedTo: "Др. Смирнова" },
  { id: 2, user: "Петр Сидоров", type: "Техподдержка", description: "Проблема с доступом к личному кабинету", status: "in-progress", priority: "high", time: "1 час назад", assignedTo: "Техподдержка" },
  { id: 3, user: "Мария Козлова", type: "Жалоба", description: "Некорректная работа системы оплаты", status: "resolved", priority: "low", time: "3 часа назад", assignedTo: "Администратор" },
  { id: 4, user: "Др. Петров", type: "Запрос данных", description: "Экспорт статистики пациентов", status: "pending", priority: "medium", time: "30 мин назад", assignedTo: "Не назначен" },
];

type RequestStatusFilter = "all" | RequestEntryType['status'];
type RequestPriorityFilter = "all" | RequestEntryType['priority'];


export function RequestsMonitoringSection() {
  const [requests, setRequests] = useState<RequestEntryType[]>(initialRequests);
  const [filterStatus, setFilterStatus] = useState<RequestStatusFilter>("all");
  const [filterPriority, setFilterPriority] = useState<RequestPriorityFilter>("all");

  const updateRequestStatus = (id: number, newStatus: RequestEntryType['status']) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const assignRequest = (id: number, assignee: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, assignedTo: assignee } : req
      )
    );
  };

  const filteredRequests = requests.filter((req) => {
    const statusMatch = filterStatus === "all" || req.status === filterStatus;
    const priorityMatch = filterPriority === "all" || req.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const statsValues = {
      pending: requests.filter((r) => r.status === "pending").length,
      inProgress: requests.filter((r) => r.status === "in-progress").length,
      resolved: requests.filter((r) => r.status === "resolved").length,
      highPriority: requests.filter((r) => r.priority === "high").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800">
          Мониторинг Запросов
        </h3>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as RequestStatusFilter)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидание</SelectItem>
              <SelectItem value="in-progress">В работе</SelectItem>
              <SelectItem value="resolved">Решено</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as RequestPriorityFilter)}>
            <SelectTrigger className="w-36"> {/* Adjusted width */}
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все приоритеты</SelectItem>
              <SelectItem value="high">Высокий</SelectItem>
              <SelectItem value="medium">Средний</SelectItem>
              <SelectItem value="low">Низкий</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Request Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RequestStatsCard value={statsValues.pending} label="Ожидают" gradientClasses="from-yellow-50 to-yellow-100 border-yellow-200" textColorClass="text-yellow-700" labelColorClass="text-yellow-600"/>
        <RequestStatsCard value={statsValues.inProgress} label="В работе" gradientClasses="from-blue-50 to-blue-100 border-blue-200" textColorClass="text-blue-700" labelColorClass="text-blue-600"/>
        <RequestStatsCard value={statsValues.resolved} label="Решено" gradientClasses="from-green-50 to-green-100 border-green-200" textColorClass="text-green-700" labelColorClass="text-green-600"/>
        <RequestStatsCard value={statsValues.highPriority} label="Высокий приоритет" gradientClasses="from-red-50 to-red-100 border-red-200" textColorClass="text-red-700" labelColorClass="text-red-600"/>
      </div>

      <RequestsTable
        requests={filteredRequests}
        onUpdateRequestStatus={updateRequestStatus}
        onAssignRequest={assignRequest}
      />
    </div>
  );
}
