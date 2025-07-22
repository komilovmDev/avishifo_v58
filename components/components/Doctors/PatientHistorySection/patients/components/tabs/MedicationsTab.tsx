// /app/patients/components/tabs/MedicationsTab.tsx
"use client"

import { Patient } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, Plus } from "lucide-react"

interface MedicationsTabProps {
  patient: Patient;
  onOpenAddMedicationDialog: () => void;
}

export function MedicationsTab({ patient, onOpenAddMedicationDialog }: MedicationsTabProps) {
  return (
    <Card className="bg-white shadow-sm rounded-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
          <Pill className="h-5 w-5 text-blue-500" /> Лекарства
        </CardTitle>
        <Button onClick={onOpenAddMedicationDialog} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Добавить
        </Button>
      </CardHeader>
      <CardContent>
        {patient.medications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {patient.medications.map((med, i) => (
              <div key={`${med.name}-${i}`} className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3">
                  <h3 className="font-semibold text-white text-md">{med.name}</h3>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div><p className="text-xs text-gray-500">Дозировка</p><p className="font-medium">{med.dosage}</p></div>
                    <div><p className="text-xs text-gray-500">Частота</p><p className="font-medium">{med.frequency}</p></div>
                  </div>
                  <div><p className="text-xs text-gray-500">Время приема</p><p className="font-medium">{med.time}</p></div>
                  <div><p className="text-xs text-gray-500">Рецепт до</p><Badge variant="outline" className="mt-0.5">{med.refill}</Badge></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Список лекарств пуст.</p>
        )}
      </CardContent>
    </Card>
  );
}