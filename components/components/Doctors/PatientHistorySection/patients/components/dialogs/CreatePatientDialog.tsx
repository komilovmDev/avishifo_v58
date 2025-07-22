// /app/patients/components/dialogs/CreatePatientDialog.tsx
"use client"

import { NewPatientForm } from "../../types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface CreatePatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPatient: NewPatientForm;
  setNewPatient: (form: NewPatientForm) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function CreatePatientDialog({
  open,
  onOpenChange,
  newPatient,
  setNewPatient,
  onSubmit,
  isLoading,
}: CreatePatientDialogProps) {

  const handleInputChange = (field: keyof NewPatientForm, value: string) => {
    setNewPatient({ ...newPatient, [field]: value });
  };

  const isSubmitDisabled = isLoading || !newPatient.fish || !newPatient.passportSeries || !newPatient.passportNumber;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Создать нового пациента</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Required Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
              Обязательные поля <span className="text-red-500">*</span>
            </h3>

            <div>
              <Label htmlFor="patient-fish" className="text-sm font-medium">
                FISH (Фамилия Имя Отчество) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="patient-fish"
                placeholder="Иванов Иван Иванович"
                value={newPatient.fish}
                onChange={(e) => handleInputChange('fish', e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passport-series" className="text-sm font-medium">
                  Серия паспорта <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="passport-series"
                  placeholder="AA"
                  value={newPatient.passportSeries}
                  onChange={(e) => handleInputChange('passportSeries', e.target.value.toUpperCase())}
                  maxLength={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="passport-number" className="text-sm font-medium">
                  Номер паспорта <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="passport-number"
                  placeholder="1234567"
                  value={newPatient.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value.replace(/\D/g, ''))}
                  maxLength={7}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Дополнительная информация</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient-birthDate" className="text-sm font-medium">Дата рождения</Label>
                <Input
                  id="patient-birthDate" type="date"
                  value={newPatient.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="patient-gender" className="text-sm font-medium">Пол</Label>
                <select
                  id="patient-gender"
                  value={newPatient.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Мужской">Мужской</option>
                  <option value="Женский">Женский</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient-phone" className="text-sm font-medium">Телефон</Label>
                <Input
                  id="patient-phone" placeholder="+7 (900) 123-45-67"
                  value={newPatient.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="patient-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="patient-email" type="email" placeholder="patient@example.com"
                  value={newPatient.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="patient-blood-type" className="text-sm font-medium">Группа крови</Label>
              <select
                id="patient-blood-type"
                value={newPatient.bloodType}
                onChange={(e) => handleInputChange('bloodType', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A(II) Rh+">A(II) Rh+</option>
                <option value="A(II) Rh-">A(II) Rh-</option>
                <option value="B(III) Rh+">B(III) Rh+</option>
                <option value="B(III) Rh-">B(III) Rh-</option>
                <option value="AB(IV) Rh+">AB(IV) Rh+</option>
                <option value="AB(IV) Rh-">AB(IV) Rh-</option>
                <option value="O(I) Rh+">O(I) Rh+</option>
                <option value="O(I) Rh-">O(I) Rh-</option>
              </select>
            </div>

            <div>
              <Label htmlFor="patient-address" className="text-sm font-medium">Адрес</Label>
              <Textarea
                id="patient-address" rows={2} placeholder="г. Москва, ул. Ленина, д. 10, кв. 15"
                value={newPatient.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">Отмена</Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6">
            {isLoading ? "Создание..." : <><Plus className="w-4 h-4 mr-2" /> Создать</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}