// /app/patients/components/PatientDetailView.tsx
"use client"

import { useState } from "react"
import { Patient } from "../types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

// Компоненты
import { PatientDetailHeader } from "./PatientDetailHeader"
import { OverviewTab } from "./tabs/OverviewTab"
import { HistoryTab } from "./tabs/HistoryTab"
import { MedicationsTab } from "./tabs/MedicationsTab"
import { VitalsTab } from "./tabs/VitalsTab"
import { DocumentsTab } from "./tabs/DocumentsTab"

type TabId = "overview" | "history" | "medications" | "vitals" | "documents";

interface PatientDetailViewProps {
  patient: Patient;
  onClose: () => void;
  onOpenAddHistoryDialog: () => void;
  onOpenAddMedicationDialog: () => void;
  onOpenAddVitalsDialog: () => void;
  onOpenAddDocumentDialog: () => void;
}

const TABS: { id: TabId, label: string }[] = [
    { id: "overview", label: "Обзор" },
    { id: "history", label: "История болезни" },
    { id: "medications", label: "Лекарства" },
    { id: "vitals", label: "Показатели" },
    { id: "documents", label: "Документы" },
];

export function PatientDetailView({
    patient,
    onClose,
    onOpenAddHistoryDialog,
    onOpenAddMedicationDialog,
    onOpenAddVitalsDialog,
    onOpenAddDocumentDialog,
}: PatientDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab patient={patient} onOpenAddHistoryDialog={onOpenAddHistoryDialog} setActiveTab={setActiveTab} />;
      case "history":
        return <HistoryTab patient={patient} onOpenAddHistoryDialog={onOpenAddHistoryDialog} />;
      case "medications":
        return <MedicationsTab patient={patient} onOpenAddMedicationDialog={onOpenAddMedicationDialog} />;
      case "vitals":
        return <VitalsTab patient={patient} onOpenAddVitalsDialog={onOpenAddVitalsDialog} />;
      case "documents":
        return <DocumentsTab patient={patient} onOpenAddDocumentDialog={onOpenAddDocumentDialog} />;
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <PatientDetailHeader patient={patient} onClose={onClose} />

        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="overflow-x-auto">
            <div className="flex border-b border-gray-200 min-w-max px-2 pt-1">
              {TABS.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  className={`px-4 py-3 rounded-t-md text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}