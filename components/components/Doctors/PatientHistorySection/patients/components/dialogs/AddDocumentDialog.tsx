// /app/patients/components/dialogs/AddDocumentDialog.tsx
"use client"

import { NewDocumentForm } from "../../types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDocument: NewDocumentForm;
  setNewDocument: (form: NewDocumentForm) => void;
  onSubmit: () => void;
}

export function AddDocumentDialog({ open, onOpenChange, newDocument, setNewDocument, onSubmit }: AddDocumentDialogProps) {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewDocument({ ...newDocument, file: file });
  };

  const isSubmitDisabled = !newDocument.name || !newDocument.file;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Загрузить документ</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="d-name">Название документа</Label>
            <Input
              id="d-name"
              value={newDocument.name}
              onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
              placeholder="Анализ крови от 20.07.24"
            />
          </div>
          <div>
            <Label htmlFor="d-type">Тип (необязательно)</Label>
            <Input
              id="d-type"
              value={newDocument.type}
              onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
              placeholder="Лабораторный анализ"
            />
          </div>
          <div>
            <Label htmlFor="d-file">Файл</Label>
            <Input
              id="d-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled} className="bg-indigo-600 hover:bg-indigo-700">Загрузить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}