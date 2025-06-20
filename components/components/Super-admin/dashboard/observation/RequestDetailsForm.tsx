// src/components/dashboard/requests/RequestDetailsForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import type { RequestEntryType } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { DialogFooter, DialogClose } from "@/components/ui/dialog";


interface RequestDetailsFormProps {
  request: RequestEntryType;
  onAssign: (id: number, assignee: string) => void;
  onSave?: (id: number, assignee: string, notes: string) => void; // Enhanced save
  // onFormClose?: () => void;
}

export function RequestDetailsForm({ request, onAssign, onSave /*, onFormClose*/ }: RequestDetailsFormProps) {
  const [assignee, setAssignee] = useState(request.assignedTo);
  const [notes, setNotes] = useState(""); // Assuming notes are temporary or fetched separately

  const handleSave = () => {
    onAssign(request.id, assignee); // Original functionality
    if (onSave) {
        onSave(request.id, assignee, notes);
    }
    console.log("Saving request details:", request.id, assignee, notes);
    // if (onFormClose) onFormClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Пользователь</Label>
        <p className="text-sm text-gray-600">{request.user}</p>
      </div>
      <div>
        <Label>Тип запроса</Label>
        <p className="text-sm text-gray-600">{request.type}</p>
      </div>
      <div>
        <Label>Описание</Label>
        <p className="text-sm text-gray-600">{request.description}</p>
      </div>
      <div>
        <Label htmlFor={`assignee-${request.id}`}>Назначить</Label>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger id={`assignee-${request.id}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Не назначен">Не назначен</SelectItem>
            <SelectItem value="Др. Смирнова">Др. Смирнова</SelectItem>
            <SelectItem value="Техподдержка">Техподдержка</SelectItem>
            <SelectItem value="Администратор">Администратор</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor={`notes-${request.id}`}>Заметки</Label>
        <Textarea
          id={`notes-${request.id}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Добавить заметку..."
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Сохранить
        </Button>
        <Button variant="outline" className="flex-1">
          Отправить уведомление
        </Button>
      </div>
      {/*
      <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={handleSave}>Сохранить</Button>
      </DialogFooter>
      */}
    </div>
  );
}
