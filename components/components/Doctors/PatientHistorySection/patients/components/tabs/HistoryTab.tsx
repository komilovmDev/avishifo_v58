// /app/patients/components/tabs/HistoryTab.tsx
"use client"

import { Patient } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Plus, FileTextIcon } from "lucide-react"

interface HistoryTabProps {
  patient: Patient;
  onOpenAddHistoryDialog: () => void;
}

export function HistoryTab({ patient, onOpenAddHistoryDialog }: HistoryTabProps) {
  return (
    <Card className="bg-white shadow-sm rounded-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
          <History className="h-5 w-5 text-green-500" /> История болезни
        </CardTitle>
        <Button onClick={onOpenAddHistoryDialog} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Добавить
        </Button>
      </CardHeader>
      <CardContent>
        {patient.history.length > 0 ? (
          <div className="space-y-5">
            {patient.history.map((entry) => (
              <div key={entry.id || entry.date} className="relative pl-7">
                <div className="absolute left-0 top-1.5 h-full border-l-2 border-gray-200 last:hidden"></div>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white -left-[7px]"></div>
                <div className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-md font-semibold text-gray-800">{entry.date}</span>
                        <Badge variant="secondary">{entry.type}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Врач: {entry.doctor}</p>
                    </div>
                    <Badge className="mt-1 sm:mt-0 bg-green-100 text-green-800 self-start sm:self-auto px-2.5 py-1">
                      {entry.diagnosis}
                    </Badge>
                  </div>
                  {entry.notes && (
                    <div className="p-3 bg-gray-50 rounded-md my-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans">{entry.notes}</pre>
                    </div>
                  )}
                  {entry.documents.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Документы:</span>
                      {entry.documents.map((doc, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 cursor-pointer hover:bg-blue-100 text-xs">
                          <FileTextIcon className="w-3 h-3 mr-1" />{doc}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">История болезни пуста.</p>
        )}
      </CardContent>
    </Card>
  );
}