// /app/patients/components/PatientCard.tsx
"use client"

import { Patient } from "../types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PatientCardProps {
  patient: Patient
  onSelect: (id: string) => void
}

// Карта для безопасной работы с динамическими классами Tailwind CSS
const colorStyles: { [key: string]: { bg: string, text: string, border: string, gradientFrom: string, gradientTo: string } } = {
  amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', gradientFrom: 'from-amber-400', gradientTo: 'to-amber-600' },
  green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', gradientFrom: 'from-green-400', gradientTo: 'to-green-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', gradientFrom: 'from-blue-400', gradientTo: 'to-blue-600' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', gradientFrom: 'from-gray-400', gradientTo: 'to-gray-600' },
};

export function PatientCard({ patient, onSelect }: PatientCardProps) {
  const color = colorStyles[patient.statusColor] || colorStyles.gray;

  return (
    <Card
      onClick={() => onSelect(patient.id)}
      className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
    >
      <div className={`h-1.5 bg-gradient-to-r ${color.gradientFrom} ${color.gradientTo} group-hover:from-blue-500 group-hover:to-cyan-500 transition-all`}></div>
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="w-12 h-12 border-2 border-white shadow">
            <AvatarImage
              src={patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random&color=fff`}
              alt={patient.name}
            />
            <AvatarFallback className={`bg-gradient-to-br ${color.gradientFrom} ${color.gradientTo} text-white font-semibold`}>
              {patient.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
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
          <Badge className={`text-xs ${color.bg} ${color.text} ${color.border}`}>
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
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}