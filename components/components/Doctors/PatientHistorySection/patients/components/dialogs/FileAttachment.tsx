"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MedicalHistoryForm } from "../../types";
import { FileTextIcon, Paperclip, X } from "lucide-react";

interface FileAttachmentProps {
  id: string;
  field: keyof Pick<MedicalHistoryForm, 'respiratoryFiles' | 'cardiovascularFiles' | 'digestiveFiles' | 'urinaryFiles' | 'endocrineFiles' | 'musculoskeletalFiles' | 'nervousSystemFiles'>;
  files: File[] | undefined;
  onFileChange: (
    field: keyof Pick<MedicalHistoryForm, 'respiratoryFiles' | 'cardiovascularFiles' | 'digestiveFiles' | 'urinaryFiles' | 'endocrineFiles' | 'musculoskeletalFiles' | 'nervousSystemFiles'>,
    files: FileList | null
  ) => void;
  onRemoveFile: (field: keyof Pick<MedicalHistoryForm, 'respiratoryFiles' | 'cardiovascularFiles' | 'digestiveFiles' | 'urinaryFiles' | 'endocrineFiles' | 'musculoskeletalFiles' | 'nervousSystemFiles'>, index: number) => void;
}

export const FileAttachment = ({
  id,
  field,
  files,
  onFileChange,
  onRemoveFile,
}: FileAttachmentProps) => {
  return (
    <div className="pt-4 mt-4 border-t border-gray-200">
      <Label className="font-medium text-gray-600">Fayllarni biriktirish</Label>
      <div className="flex items-center gap-4 mt-2">
        <Input
          id={id}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => onFileChange(field, e.target.files)}
        />
        <Button asChild variant="outline" className="cursor-pointer">
          <Label htmlFor={id} className="flex items-center cursor-pointer m-0">
            <Paperclip className="h-4 w-4 mr-2" /> Fayl tanlash
          </Label>
        </Button>
        {(!files || files.length === 0) && (
          <span className="text-sm text-gray-500">Fayl tanlanmagan</span>
        )}
      </div>
      {files && files.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Biriktirilgan fayllar:
          </p>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md border"
            >
              <span className="truncate pr-2">
                {file.name} ({Math.round(file.size / 1024)} KB)
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-shrink-0"
                onClick={() => onRemoveFile(field, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
