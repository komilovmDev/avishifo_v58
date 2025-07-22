// /app/patients/components/tabs/OverviewTab.tsx
"use client"

import { Patient } from "../../types"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Phone, Mail, MapPin, Activity, Pill, History, Plus, FileTextIcon } from "lucide-react"

type TabId = "overview" | "history" | "medications" | "vitals" | "documents";

interface OverviewTabProps {
  patient: Patient;
  onOpenAddHistoryDialog: () => void;
  setActiveTab: (tabId: TabId) => void;
}

export function OverviewTab({ patient, onOpenAddHistoryDialog, setActiveTab }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Личная информация */}
      <Card className="xl:col-span-1 bg-white shadow-sm rounded-lg border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
            <User className="h-5 w-5 text-teal-500" /> Личная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" /> <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" /> <span>{patient.email}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> <span>{patient.address}</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Полис ОМС</p> <p>{patient.insurance}</p>
          </div>
        </CardContent>
      </Card>

      {/* Медицинская информация */}
      <Card className="xl:col-span-2 bg-white shadow-sm rounded-lg border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
            <Activity className="h-5 w-5 text-teal-500" /> Медицинская информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-xs text-gray-500">Группа крови</p><p className="font-medium">{patient.bloodType}</p></div>
            <div><p className="text-xs text-gray-500">Текущий диагноз</p><p className="font-medium">{patient.lastDiagnosis}</p></div>
            <div><p className="text-xs text-gray-500">Дата визита</p><p className="font-medium">{patient.history[0]?.date || "N/A"}</p></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Аллергии</p>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.length ? patient.allergies.map((a, i) => (
                <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">{a}</Badge>
              )) : <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Не выявлено</Badge>}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Хронические заболевания</p>
            <div className="flex flex-wrap gap-2">
              {patient.chronicConditions.length ? patient.chronicConditions.map((c, i) => (
                <Badge key={i} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{c}</Badge>
              )) : <Badge variant="outline">Не указано</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Последние показатели */}
      {patient.vitals.length > 0 && (
        <Card className="xl:col-span-3 bg-white shadow-sm rounded-lg border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
              <Activity className="h-5 w-5 text-red-500" /> Последние показатели (от {patient.vitals[0].date})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Давление", value: patient.vitals[0].bp, unit: "" },
                { label: "Пульс", value: patient.vitals[0].pulse, unit: "уд/мин" },
                { label: "Температура", value: patient.vitals[0].temp, unit: "°C" },
                { label: "Вес", value: patient.vitals[0].weight, unit: "кг" },
              ].map((v) => (
                <div key={v.label} className="p-3 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border text-center">
                  <p className="text-xs text-gray-500 mb-1">{v.label}</p>
                  <p className="text-xl font-bold text-gray-800">{v.value} <span className="text-sm font-normal">{v.unit}</span></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Текущие медикаменты */}
      {patient.medications.length > 0 && (
        <Card className="xl:col-span-3 bg-white shadow-sm rounded-lg border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
              <Pill className="h-5 w-5 text-blue-500" /> Текущие медикаменты
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Препарат</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Дозировка</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Частота</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Время</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Рецепт до</th>
                </tr>
              </thead>
              <tbody>
                {patient.medications.map((med, i) => (
                  <tr key={`${med.name}-${i}`} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3">{med.name}</td>
                    <td className="py-2.5 px-3">{med.dosage}</td>
                    <td className="py-2.5 px-3">{med.frequency}</td>
                    <td className="py-2.5 px-3">{med.time}</td>
                    <td className="py-2.5 px-3"><Badge variant="secondary">{med.refill}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Последние записи */}
      {patient.history.length > 0 && (
        <Card className="xl:col-span-3 bg-white shadow-sm rounded-lg border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
              <History className="h-5 w-5 text-green-500" /> Последние записи ({patient.history.slice(0, 2).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.history.slice(0, 2).map((entry) => (
              <div key={entry.id || entry.date} className="relative pl-7 pb-1 last:pb-0">
                <div className="absolute left-0 top-1.5 h-full border-l-2 border-gray-200"></div>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white -left-[7px]"></div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{entry.date}</span>
                      <Badge variant="outline">{entry.type}</Badge>
                    </div>
                    <Badge className="mt-1 sm:mt-0 bg-green-100 text-green-800 self-start sm:self-auto">{entry.diagnosis}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">{entry.notes}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Врач: {entry.doctor}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.documents.map((doc, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 cursor-pointer hover:bg-blue-100">
                          <FileTextIcon className="w-3 h-3 mr-1" />{doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {patient.history.length > 2 && (
              <Button variant="link" className="w-full text-blue-600" onClick={() => setActiveTab("history")}>
                Посмотреть всю историю ({patient.history.length})
              </Button>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button onClick={onOpenAddHistoryDialog} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Добавить запись
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}