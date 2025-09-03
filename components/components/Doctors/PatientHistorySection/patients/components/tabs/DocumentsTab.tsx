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
  // Merge documents from history and from localStorage (with data URL for download)
  const fromHistory = patient.history.flatMap(entry =>
    entry.documents.map((docName, docIdx) => ({
      name: docName,
      date: entry.date,
      type: entry.type,
      id: `${entry.id || entry.date}-doc-${docIdx}`,
      url: null as string | null,
    }))
  );

  let fromLocal: { name: string; date: string; type: string; id: string; url: string | null }[] = []
  try {
    const raw = localStorage.getItem("avishifo_patient_docs")
    if (raw) {
      const map = JSON.parse(raw)
      const list = Array.isArray(map[patient.id]) ? map[patient.id] : []
      fromLocal = list.map((d: any, idx: number) => ({
        name: d.name,
        date: d.date,
        type: d.type,
        id: `local-${idx}-${d.name}`,
        url: d.url || null,
      }))
    }
  } catch {}

  const allDocuments = [...fromLocal, ...fromHistory]

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
              <div key={doc.id} className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-center w-full p-3 border-b">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileTextIcon className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                    <h3 className="font-medium text-sm text-gray-800 truncate" title={doc.name}>{doc.name}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs whitespace-nowrap ml-2">{doc.date}</Badge>
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500 line-clamp-1" title={doc.type}>{doc.type}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      if (doc.url) {
                        const a = document.createElement('a')
                        a.href = doc.url
                        a.download = doc.name
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                      } else {
                        // If no data URL, try to open name as URL (for server-hosted) or ignore
                        try {
                          const u = new URL(doc.name)
                          window.open(String(u), '_blank')
                        } catch {
                          alert('Файл недоступен для скачивания')
                        }
                      }
                    }}
                  >
                    Скачать
                  </Button>
                </div>
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