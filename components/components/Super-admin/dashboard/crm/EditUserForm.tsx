// src/components/dashboard/crm/EditUserForm.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { AnyUserType, UserRoleType } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Add Dialog components if this form is meant to be in a dialog
// import { DialogFooter, DialogClose } from "@/components/ui/dialog";

interface EditUserFormProps {
  user: AnyUserType | null;
  type: UserRoleType;
  onEditUser?: (userId: number, formData: any) => void; // Callback for when user is edited
  // onFormClose?: () => void; // If used in a dialog
}

export function EditUserForm({ user, type, onEditUser /*, onFormClose*/ }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "", // For admin
    specialty: "", // For doctor
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: (user as any).role || "", // Cast to any to access role/specialty conditionally
        specialty: (user as any).specialty || "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && onEditUser) {
      console.log("Editing user:", user.id, formData);
      onEditUser(user.id, formData);
    }
    // if (onFormClose) onFormClose(); // Close dialog after submit
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor={`edit-name-${type}-${user.id}`}>Имя</Label>
        <Input
          id={`edit-name-${type}-${user.id}`}
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor={`edit-email-${type}-${user.id}`}>Email</Label>
        <Input
          id={`edit-email-${type}-${user.id}`}
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      {type === "admin" && (
        <div>
          <Label htmlFor={`edit-role-${type}-${user.id}`}>Роль</Label>
          <Input // Consider using Select for consistency if roles are predefined
            id={`edit-role-${type}-${user.id}`}
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
          />
        </div>
      )}

      {type === "doctor" && (
        <div>
          <Label htmlFor={`edit-specialty-${type}-${user.id}`}>Специальность</Label>
          <Input // Consider using Select for consistency
            id={`edit-specialty-${type}-${user.id}`}
            value={formData.specialty}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, specialty: e.target.value }))
            }
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Сохранить изменения
      </Button>
      {/* Example for dialog:
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
        <Button type="submit">Сохранить</Button>
      </DialogFooter>
      */}
    </form>
  );
}
