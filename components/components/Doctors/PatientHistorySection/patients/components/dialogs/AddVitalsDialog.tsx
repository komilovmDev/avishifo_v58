// /app/patients/components/dialogs/AddVitalsDialog.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddVitalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVitalSign: (vitalSignData: any) => Promise<void>;
}

export function AddVitalsDialog({ open, onOpenChange, onAddVitalSign }: AddVitalsDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().toTimeString().slice(0, 5), // Current time in HH:MM format
    bp_systolic: '',
    bp_diastolic: '',
    pulse: '',
    temp: '',
    weight: '',
    height: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update date and time when dialog opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5)
      }));
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      alert('Пожалуйста, выберите дату');
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time into ISO string
      const dateTimeString = `${formData.date}T${formData.time}:00Z`;
      const vitalSignData = {
        ...formData,
        dateTime: dateTimeString
      };
      
      await onAddVitalSign(vitalSignData);
      // Reset form but keep date and time
      setFormData(prev => ({
        ...prev,
        bp_systolic: '',
        bp_diastolic: '',
        pulse: '',
        temp: '',
        weight: '',
        height: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        notes: ''
      }));
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding vital sign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !formData.date || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Добавить показатели здоровья</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-date">Дата измерения</Label>
              <Input 
                id="v-date" 
                type="date" 
                value={formData.date} 
                onChange={(e) => handleInputChange('date', e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="v-time">Время измерения</Label>
              <Input 
                id="v-time" 
                type="time" 
                value={formData.time} 
                onChange={(e) => handleInputChange('time', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-bp-systolic">Систолическое давление (мм рт.ст.)</Label>
              <Input 
                id="v-bp-systolic" 
                type="number" 
                placeholder="120" 
                value={formData.bp_systolic} 
                onChange={(e) => handleInputChange('bp_systolic', e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="v-bp-diastolic">Диастолическое давление (мм рт.ст.)</Label>
              <Input 
                id="v-bp-diastolic" 
                type="number" 
                placeholder="80" 
                value={formData.bp_diastolic} 
                onChange={(e) => handleInputChange('bp_diastolic', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-pulse">Пульс (уд/мин)</Label>
              <Input 
                id="v-pulse" 
                type="number" 
                placeholder="70" 
                value={formData.pulse} 
                onChange={(e) => handleInputChange('pulse', e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="v-temp">Температура (°C)</Label>
              <Input 
                id="v-temp" 
                type="number" 
                step="0.1" 
                placeholder="36.6" 
                value={formData.temp} 
                onChange={(e) => handleInputChange('temp', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-weight">Вес (кг)</Label>
              <Input 
                id="v-weight" 
                type="number" 
                step="0.1" 
                placeholder="70.5" 
                value={formData.weight} 
                onChange={(e) => handleInputChange('weight', e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="v-height">Рост (см)</Label>
              <Input 
                id="v-height" 
                type="number" 
                placeholder="175" 
                value={formData.height} 
                onChange={(e) => handleInputChange('height', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v-respiratory">Частота дыхания (вдохов/мин)</Label>
              <Input 
                id="v-respiratory" 
                type="number" 
                placeholder="16" 
                value={formData.respiratory_rate} 
                onChange={(e) => handleInputChange('respiratory_rate', e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="v-oxygen">Сатурация кислорода (%)</Label>
              <Input 
                id="v-oxygen" 
                type="number" 
                placeholder="98" 
                value={formData.oxygen_saturation} 
                onChange={(e) => handleInputChange('oxygen_saturation', e.target.value)} 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="v-notes">Примечания</Label>
            <Input 
              id="v-notes" 
              placeholder="Дополнительные заметки..." 
              value={formData.notes} 
              onChange={(e) => handleInputChange('notes', e.target.value)} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitDisabled} 
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Добавление...' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}