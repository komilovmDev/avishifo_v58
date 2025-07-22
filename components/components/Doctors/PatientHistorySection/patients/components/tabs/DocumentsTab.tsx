// /app/patients/components/tabs/DocumentsTab.tsx
"use client"

import { Patient } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileTextIcon, Plus } from "lucide-react"

interface DocumentsTabProps {
  patient: Patient;
  onOpenAddDocumentDialog: () => void;
}

export function DocumentsTab({ patient, onOpenAddDocumentDialog }: DocumentsTabProps) {
  const allDocuments = patient.history.flatMap(entry =>
    entry.documents.map((docName, docIdx) => ({
      name: docName,
      date: entry.date,
      type: entry.type,
      id: `${entry.id || entry.date}-doc-${docIdx}`,
    }))
  );

  return (
    <Card className="bg-white shadow-sm rounded-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
          <FileTextIcon className="h-5 w-5 text-indigo-500" /> Документы
        </CardTitle>
        <Button onClick={onOpenAddDocumentDialog} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Загрузить
        </Button>
      </CardHeader>
      <CardContent>
        {allDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg border border-gray-200 shadow p-3 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start">
                <div className="flex justify-between items-center w-full mb-2">
                  <FileTextIcon className="h-7 w-7 text-indigo-500" />
                  <Badge variant="outline" className="text-xs">{doc.date}</Badge>
                </div>
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 flex-grow">{doc.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{doc.type}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Документы отсутствуют.</p>
        )}
      </CardContent>
    </Card>
  );
}