// /app/patients/components/PatientCard.tsx
"use client"

import { Patient } from "../types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Trash2, Archive, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface PatientCardProps {
  patient: Patient
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
  onArchive?: (id: string) => void
}

// Карта для безопасной работы с динамическими классами Tailwind CSS
const colorStyles: { [key: string]: { bg: string, text: string, border: string, gradientFrom: string, gradientTo: string } } = {
  amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', gradientFrom: 'from-amber-400', gradientTo: 'to-amber-600' },
  green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', gradientFrom: 'from-green-400', gradientTo: 'to-green-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', gradientFrom: 'from-blue-400', gradientTo: 'to-blue-600' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', gradientFrom: 'from-gray-400', gradientTo: 'to-gray-600' },
};

export function PatientCard({ patient, onSelect, onDelete, onArchive }: PatientCardProps) {
  const color = colorStyles[patient.statusColor] || colorStyles.gray;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(patient.id);
    }
    setShowDeleteDialog(false);
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(patient.id);
    }
    setShowArchiveDialog(false);
  };

  return (
    <>
      <Card className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all overflow-hidden group">
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
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${color.bg} ${color.text} ${color.border}`}>
                {patient.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(patient.id);
                    }}
                    className="cursor-pointer"
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Просмотреть детали
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowArchiveDialog(true);
                    }}
                    className="cursor-pointer text-orange-600 focus:text-orange-600"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Архивировать
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить пациента?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить пациента <strong>{patient.name}</strong>? 
              Это действие нельзя отменить. Все данные пациента будут безвозвратно удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Архивировать пациента?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите архивировать пациента <strong>{patient.name}</strong>? 
              Пациент будет перемещен в архив, но данные сохранятся. Вы сможете восстановить его позже.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleArchive}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Архивировать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}