// /app/patients/components/tabs/HistoryTab.tsx
"use client"

import { Patient, HistoryEntry } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Plus, FileTextIcon, Edit } from "lucide-react"

interface HistoryTabProps {
  patient: Patient;
  onOpenAddHistoryDialog: () => void;
  onOpenEditHistoryDialog: (entry: HistoryEntry) => void;
  onRefreshHistory: () => void;
}

export function HistoryTab({ patient, onOpenAddHistoryDialog, onOpenEditHistoryDialog, onRefreshHistory }: HistoryTabProps) {
  return (
    <Card className="bg-white shadow-sm rounded-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
          <History className="h-5 w-5 text-green-500" /> История болезни
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={onRefreshHistory} 
            variant="outline" 
            className="border-gray-300 hover:bg-gray-50"
          >
            <History className="w-4 h-4 mr-2" /> Yangilash
          </Button>
          <Button onClick={onOpenAddHistoryDialog} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> Добавить
          </Button>
        </div>
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
                        {entry.date === new Date().toLocaleDateString("ru-RU") && (
                          <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                            Yangilangan
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Врач: {entry.doctor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="mt-1 sm:mt-0 bg-green-100 text-green-800 self-start sm:self-auto px-2.5 py-1">
                        {entry.diagnosis}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenEditHistoryDialog(entry)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Tahrirlash"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="p-3 bg-gray-50 rounded-md my-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans">{entry.notes}</pre>
                    </div>
                  )}
                                     {entry.documents.length > 0 ? (
                     <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                       <div className="flex items-center gap-2 mb-2">
                         <FileTextIcon className="w-4 h-4 text-blue-600" />
                         <span className="text-sm font-medium text-blue-800">Biriktirilgan fayllar ({entry.documents.length}):</span>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {entry.documents.map((doc, idx) => {
                           // Extract filename from full path/URL
                           const fileName = doc.includes('/') ? doc.split('/').pop() || doc : doc;
                           const displayName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
                           
                           return (
                             <Badge 
                               key={idx} 
                               variant="outline" 
                               className="bg-white text-blue-700 border-blue-300 cursor-pointer hover:bg-blue-100 hover:border-blue-400 text-xs px-3 py-1.5 transition-colors"
                               title={`Yuklab olish: ${fileName}`}
                               onClick={() => {
                                 // Handle file download/access
                                 if (doc.startsWith('http')) {
                                   window.open(doc, '_blank');
                                 } else {
                                   // For local files, you might want to trigger a download
                                   const link = document.createElement('a');
                                   link.href = doc;
                                   link.download = fileName;
                                   link.click();
                                 }
                               }}
                             >
                               <FileTextIcon className="w-3 h-3 mr-1.5" />
                               {displayName}
                             </Badge>
                           );
                         })}
                       </div>
                     </div>
                   ) : (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Biriktirilgan fayllar yo'q</span>
                      </div>
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