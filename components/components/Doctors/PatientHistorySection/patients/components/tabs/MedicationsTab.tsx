// /app/patients/components/tabs/MedicationsTab.tsx
"use client"

import { Patient } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { API_CONFIG } from "@/config/api"
import { AddMedicationDialog } from "../dialogs/AddMedicationDialog"

interface MedicationsTabProps {
  patient: Patient;
  onOpenAddMedicationDialog: () => void;
  onAddMedication?: (medicationData: any) => void;
  onDeleteMedication?: (medicationId: string) => void;
}

interface BackendMedication {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  instructions?: string;
}

export function MedicationsTab({ patient, onOpenAddMedicationDialog, onAddMedication, onDeleteMedication }: MedicationsTabProps) {
  const [backendMedications, setBackendMedications] = useState<BackendMedication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Load medications from backend
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch(API_CONFIG.ENDPOINTS.MEDICATIONS, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Backend medications response:", data);
          
          // Handle Django REST Framework pagination format
          let medications = [];
          if (data.results && Array.isArray(data.results)) {
            // Paginated response
            medications = data.results;
          } else if (Array.isArray(data)) {
            // Direct array response
            medications = data;
          } else {
            console.warn("Unexpected medications data format:", data);
            setBackendMedications([]);
            return;
          }
          
          // Filter medications for this patient
          console.log("All medications from backend:", medications);
          console.log("Patient ID:", patient.id, "Type:", typeof patient.id);
          
          // Get patient's medical record ID
          const patientMedicalRecordId = patient.medicalRecords?.[0]?.id;
          console.log("Patient medical record ID:", patientMedicalRecordId);
          
          const patientMedications = medications.filter((med: any) => {
            const medRecordId = med.medical_record;
            const currentPatientId = parseInt(patient.id);
            
            console.log(`Medication ${med.id}:`, {
              medRecordId,
              currentPatientId,
              patientMedicalRecordId,
              medicalRecord: med.medical_record
            });
            
            // Check by medical_record_id - only show if patient has medical record
            if (patientMedicalRecordId && medRecordId) {
              return medRecordId === patientMedicalRecordId;
            }
            
            // If patient has no medical record, show no medications
            return false;
          });
          
          console.log("Filtered medications for patient:", patientMedications);
          setBackendMedications(patientMedications);
        } else {
          console.error("Failed to fetch medications:", response.status);
          setBackendMedications([]);
        }
      } catch (error) {
        console.error("Error loading medications from backend:", error);
        setBackendMedications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [patient.id]);

  // Combine patient medications with backend medications
  const allMedications = [
    ...patient.medications.map(med => ({ ...med, id: med.id || `local-${med.name}` })),
    ...backendMedications.map(med => ({
      id: med.id,
      name: med.medication_name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.start_date,
      refill: med.end_date || 'Не указано'
    }))
  ];

  // Function to refresh medications from backend
  const refreshMedications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(API_CONFIG.ENDPOINTS.MEDICATIONS, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Refresh medications response:", data);
        
        // Handle Django REST Framework pagination format
        let medications = [];
        if (data.results && Array.isArray(data.results)) {
          // Paginated response
          medications = data.results;
        } else if (Array.isArray(data)) {
          // Direct array response
          medications = data;
        } else {
          console.warn("Unexpected refresh medications data format:", data);
          setBackendMedications([]);
          return;
        }
        
        // Filter medications for this patient
        console.log("Refresh - All medications from backend:", medications);
        console.log("Refresh - Patient ID:", patient.id, "Type:", typeof patient.id);
        
        // Get patient's medical record ID
        const patientMedicalRecordId = patient.medicalRecords?.[0]?.id;
        console.log("Refresh - Patient medical record ID:", patientMedicalRecordId);
        
        const patientMedications = medications.filter((med: any) => {
          const medRecordId = med.medical_record;
          const currentPatientId = parseInt(patient.id);
          
          console.log(`Refresh - Medication ${med.id}:`, {
            medRecordId,
            currentPatientId,
            patientMedicalRecordId,
            medicalRecord: med.medical_record
          });
          
          // Check by medical_record_id - only show if patient has medical record
          if (patientMedicalRecordId && medRecordId) {
            return medRecordId === patientMedicalRecordId;
          }
          
          // If patient has no medical record, show no medications
          return false;
        });
        
        console.log("Refresh - Filtered medications for patient:", patientMedications);
        setBackendMedications(patientMedications);
      } else {
        console.error("Failed to refresh medications:", response.status);
        setBackendMedications([]);
      }
    } catch (error) {
      console.error("Error refreshing medications:", error);
      setBackendMedications([]);
    }
  };

  // Handle adding medication
  const handleAddMedication = async (medicationData: any) => {
    console.log("MedicationsTab: handleAddMedication called with:", medicationData);
    if (onAddMedication) {
      console.log("MedicationsTab: Calling onAddMedication...");
      await onAddMedication(medicationData);
      console.log("MedicationsTab: onAddMedication completed, refreshing...");
      // Refresh medications from backend after adding
      await refreshMedications();
      console.log("MedicationsTab: refreshMedications completed");
    } else {
      console.log("MedicationsTab: onAddMedication is not provided");
    }
  };
  return (
    <Card className="bg-white shadow-sm rounded-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
          <Pill className="h-5 w-5 text-blue-500" /> Лекарства
        </CardTitle>
        <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Добавить
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Загрузка лекарств...</p>
        ) : allMedications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allMedications.map((med, i) => (
              <div key={`${med.name}-${i}`} className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 flex justify-between items-center">
                  <h3 className="font-semibold text-white text-md">{med.name}</h3>
                  {onDeleteMedication && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const medicationId = String(med.id);
                        await onDeleteMedication(medicationId);
                        // Refresh medications from backend after deletion
                        if (!medicationId.startsWith('local-')) {
                          await refreshMedications();
                        }
                      }}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
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
      
      <AddMedicationDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddMedication={handleAddMedication}
      />
    </Card>
  );
}