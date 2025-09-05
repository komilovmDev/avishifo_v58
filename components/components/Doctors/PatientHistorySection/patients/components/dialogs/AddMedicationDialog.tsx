"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddMedicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedication: (medicationData: any) => void;
}

export function AddMedicationDialog({ isOpen, onClose, onAddMedication }: AddMedicationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    instructions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.frequency || !formData.startDate) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    onAddMedication({
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      time: formData.startDate,
      refill: formData.endDate || null,
      instructions: formData.instructions
    });

    // Reset form
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      instructions: ""
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить лекарство</DialogTitle>
          <DialogDescription>
            Введите информацию о новом лекарстве для пациента
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Например, Аспирин"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Дозировка *
              </Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => handleChange("dosage", e.target.value)}
                className="col-span-3"
                placeholder="Например, 500мг"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Частота *
              </Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => handleChange("frequency", e.target.value)}
                className="col-span-3"
                placeholder="Например, 2 раза в день"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Начало *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Конец
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructions" className="text-right">
                Инструкции
              </Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
                className="col-span-3"
                placeholder="Дополнительные инструкции по приему"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600">
              Добавить лекарство
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}