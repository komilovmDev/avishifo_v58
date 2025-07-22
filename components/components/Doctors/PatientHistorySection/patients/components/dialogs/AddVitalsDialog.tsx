// /app/patients/components/dialogs/AddVitalsDialog.tsx
"use client"

import { NewVitalsForm } from "../../types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddVitalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newVitals: NewVitalsForm;
  setNewVitals: (form: NewVitalsForm) => void;
  onSubmit: () => void;
}

export function AddVitalsDialog({ open, onOpenChange, newVitals, setNewVitals, onSubmit }: AddVitalsDialogProps) {
  
  const handleInputChange = (field: keyof NewVitalsForm, value: string) => {
    setNewVitals({ ...newVitals, [field]: value });
  };

  const isSubmitDisabled = !newVitals.date || !newVitals.bp || !newVitals.pulse;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Добавить показатели</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="v-date">Дата</Label>
            <Input id="v-date" type="date" value={newVitals.date} onChange={(e) => handleInputChange('date', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-bp">Давление</Label>
              <Input id="v-bp" placeholder="120/80" value={newVitals.bp} onChange={(e) => handleInputChange('bp', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="v-pulse">Пульс (уд/мин)</Label>
              <Input id="v-pulse" placeholder="70" value={newVitals.pulse} onChange={(e) => handleInputChange('pulse', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-temp">Температура (°C)</Label>
              <Input id="v-temp" placeholder="36.6" value={newVitals.temp} onChange={(e) => handleInputChange('temp', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="v-weight">Вес (кг)</Label>
              <Input id="v-weight" placeholder="70.5" value={newVitals.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled} className="bg-red-600 hover:bg-red-700">Добавить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}