// /app/patients/components/PatientDetailHeader.tsx
"use client"

import { Patient } from "../types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, X, MessageCircleIcon } from "lucide-react"

interface PatientDetailHeaderProps {
  patient: Patient;
  onClose: () => void;
}

const colorStyles: { [key: string]: { bg: string, text: string, border: string, ring: string } } = {
  amber: { bg: 'bg-amber-500', text: 'text-amber-800', border: 'border-amber-300', ring: 'ring-amber-500' },
  green: { bg: 'bg-green-500', text: 'text-green-800', border: 'border-green-300', ring: 'ring-green-500' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-800', border: 'border-blue-300', ring: 'ring-blue-500' },
  gray: { bg: 'bg-gray-500', text: 'text-gray-800', border: 'border-gray-300', ring: 'ring-gray-500' },
};

export function PatientDetailHeader({ patient, onClose }: PatientDetailHeaderProps) {
  const color = colorStyles[patient.statusColor] || colorStyles.gray;

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="relative shrink-0">
        <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-white shadow-md">
          <AvatarImage
            src={patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random&color=fff`}
            alt={patient.name}
          />
          <AvatarFallback className={`${color.bg} text-white text-3xl md:text-4xl font-semibold`}>
            {patient.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full ${color.bg} border-2 border-white ring-1 ${color.ring}`}></div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-x-3 gap-y-1">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">{patient.name}</h2>
          <Badge className={`bg-opacity-20 ${color.text} ${color.border} px-3 py-1 text-xs font-semibold`}>
            {patient.status}
          </Badge>
        </div>
        <p className="text-gray-500 mt-1 text-sm md:text-base">
          {patient.age} лет • {patient.gender} • {patient.bloodType}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-600 justify-center md:justify-start">
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
        <Button variant="outline" className="flex gap-2 w-full md:w-auto bg-transparent" onClick={onClose}>
          <X className="h-4 w-4" /> <span>Закрыть</span>
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-90 text-white w-full md:w-auto">
          <MessageCircleIcon className="h-4 w-4" /> <span>Сообщение</span>
        </Button>
      </div>
    </div>
  );
}