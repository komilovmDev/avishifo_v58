// /app/patients/components/PatientListView.tsx
"use client"

import { Patient } from "../types"
import { PatientCard } from "./PatientCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"

interface PatientListViewProps {
  patients: Patient[];
  allPatients: Patient[]; // Нужен для подсчета в фильтрах
  searchQuery: string;
  filterStatus: string | null;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: string | null) => void;
  onSelectPatient: (id: string) => void;
  onOpenCreateDialog: () => void;
  onRefresh: () => void;
  onDeletePatient?: (id: string) => void;
  onArchivePatient?: (id: string) => void;
  onUnarchivePatient?: (id: string) => void;
}

const colorStyles: { [key: string]: { active: string, inactive: string } } = {
  amber: { active: 'bg-amber-500 text-white border-amber-500', inactive: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
  green: { active: 'bg-green-500 text-white border-green-500', inactive: 'border-green-300 text-green-700 hover:bg-green-50' },
  blue: { active: 'bg-blue-500 text-white border-blue-500', inactive: 'border-blue-300 text-blue-700 hover:bg-blue-50' },
  gray: { active: 'bg-gray-500 text-white border-gray-500', inactive: 'border-gray-300 text-gray-700 hover:bg-gray-50' },
};

export function PatientListView({
  patients,
  allPatients,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onSelectPatient,
  onOpenCreateDialog,
  onRefresh,
  onDeletePatient,
  onArchivePatient,
  onUnarchivePatient
}: PatientListViewProps) {

  const uniqueStatuses = Array.from(new Set(allPatients.map((p) => p.status)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-5 shadow-lg border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Пациенты ({patients.length})</h2>
          <p className="text-sm text-gray-500">Управление пациентами и их историями болезни</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button onClick={onOpenCreateDialog} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" /> Создать пациента
          </Button>
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск (имя, диагноз, ID)..."
              className="pl-9 w-full sm:w-64 rounded-full bg-gray-50 border-gray-300"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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
          className={`rounded-full text-xs px-3 py-1.5 h-auto ${filterStatus === null ? "bg-blue-600 text-white" : "border-gray-300"}`}
          onClick={() => onFilterChange(null)}
        >
          Все ({allPatients.length})
        </Button>
        {uniqueStatuses.map((status) => {
          const patientWithStatus = allPatients.find(p => p.status === status);
          const colorName = patientWithStatus?.statusColor || 'gray';
          const styles = colorStyles[colorName] || colorStyles.gray;
          const isActive = filterStatus === status;
          return (
            <Button
              key={status}
              variant={isActive ? "default" : "outline"}
              className={`rounded-full text-xs px-3 py-1.5 h-auto ${isActive ? styles.active : styles.inactive}`}
              onClick={() => onFilterChange(status)}
            >
              {status} ({allPatients.filter((p) => p.status === status).length})
            </Button>
          )
        })}
      </div>
      
      {patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {patients.map((patient) => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onSelect={onSelectPatient}
              onDelete={onDeletePatient}
              onArchive={onArchivePatient}
              onUnarchive={onUnarchivePatient}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-xl font-medium text-gray-800 mb-1">Пациенты не найдены</h3>
          <p className="text-sm text-gray-500 mb-4">По вашему запросу ничего не найдено. Попробуйте изменить фильтры.</p>
          <Button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
            Сбросить и обновить
          </Button>
        </div>
      )}
    </div>
  )
}