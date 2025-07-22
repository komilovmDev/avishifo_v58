// /app/patients/components/dialogs/AddMedicationDialog.tsx
"use client"

import { NewMedicationForm } from "../../types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newMedication: NewMedicationForm;
  setNewMedication: (form: NewMedicationForm) => void;
  onSubmit: () => void;
}

export function AddMedicationDialog({ open, onOpenChange, newMedication, setNewMedication, onSubmit }: AddMedicationDialogProps) {
  
  const handleInputChange = (field: keyof NewMedicationForm, value: string) => {
    setNewMedication({ ...newMedication, [field]: value });
  };
  
  const isSubmitDisabled = !newMedication.name || !newMedication.dosage || !newMedication.frequency;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Добавить лекарство</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="m-name">Название</Label>
            <Input id="m-name" value={newMedication.name} onChange={(e) => handleInputChange('name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m-dosage">Дозировка</Label>
              <Input id="m-dosage" value={newMedication.dosage} onChange={(e) => handleInputChange('dosage', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="m-freq">Частота</Label>
              <Input id="m-freq" value={newMedication.frequency} onChange={(e) => handleInputChange('frequency', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m-time">Время приема</Label>
              <Input id="m-time" value={newMedication.time} onChange={(e) => handleInputChange('time', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="m-refill">Рецепт до</Label>
              <Input id="m-refill" type="date" value={newMedication.refill} onChange={(e) => handleInputChange('refill', e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled} className="bg-blue-600 hover:bg-blue-700">Добавить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}