// /app/patients/components/tabs/VitalsTab.tsx
"use client"

import { Patient } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Plus } from "lucide-react"

interface VitalsTabProps {
  patient: Patient;
  onOpenAddVitalsDialog: () => void;
}

export function VitalsTab({ patient, onOpenAddVitalsDialog }: VitalsTabProps) {
  return (
    <Card className="bg-white shadow-sm rounded-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
          <Activity className="h-5 w-5 text-red-500" /> Показатели здоровья
        </CardTitle>
        <Button onClick={onOpenAddVitalsDialog} className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Добавить
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
  );
}