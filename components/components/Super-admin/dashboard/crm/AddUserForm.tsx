// src/components/dashboard/crm/AddUserForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import type { UserRoleType } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Add Dialog components if this form is meant to be in a dialog
// import { DialogFooter, DialogClose } from "@/components/ui/dialog";


interface AddUserFormProps {
  type: UserRoleType;
  onAddUser?: (formData: any) => void; // Callback for when user is added
  // onFormClose?: () => void; // If used in a dialog
}

export function AddUserForm({ type, onAddUser /*, onFormClose*/ }: AddUserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "", // For admin
    specialty: "", // For doctor
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding user:", formData);
    if (onAddUser) {
      onAddUser(formData); // Pass the actual form data
    }
    // if (onFormClose) onFormClose(); // Close dialog after submit
    // Reset form or handle success
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor={`add-name-${type}`}>Имя</Label>
        <Input
          id={`add-name-${type}`}
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor={`add-email-${type}`}>Email</Label>
        <Input
          id={`add-email-${type}`}
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>

      {type === "admin" && (
        <div>
          <Label htmlFor={`add-role-${type}`}>Роль</Label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger id={`add-role-${type}`}>
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="moderator">Модератор</SelectItem>
              <SelectItem value="support">Техподдержка</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {type === "doctor" && (
        <div>
          <Label htmlFor={`add-specialty-${type}`}>Специальность</Label>
          <Select
            value={formData.specialty}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, specialty: value }))
            }
          >
            <SelectTrigger id={`add-specialty-${type}`}>
              <SelectValue placeholder="Выберите специальность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiologist">Кардиолог</SelectItem>
              <SelectItem value="therapist">Терапевт</SelectItem>
              <SelectItem value="neurologist">Невролог</SelectItem>
              <SelectItem value="psychiatrist">Психиатр</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor={`add-phone-${type}`}>Телефон</Label>
        <Input
          id={`add-phone-${type}`}
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>

      <Button type="submit" className="w-full">
        Добавить пользователя
      </Button>
       {/* Example for dialog:
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
        <Button type="submit">Добавить</Button>
      </DialogFooter>
      */}
    </form>
  );
}
