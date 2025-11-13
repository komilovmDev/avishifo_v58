"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Stethoscope,
  Clock3,
  GraduationCap,
  Award,
  Shield,
  Zap,
  Plus,
  X as XIcon,
} from "lucide-react";
import React from "react";

// Типизация пропсов для компонента
interface ProfessionalInfoProps {
  isEditing: boolean;
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  userProfile: any;
  openSpecializationModal: () => void;
}

// Ряд в режиме просмотра
const InfoRow = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-b-0">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    {children ? (
      <div className="flex-1 text-right">{children}</div>
    ) : (
      <p className="flex-1 text-right text-sm font-medium text-slate-900">
        {value && value.trim() ? (
          value
        ) : (
          <span className="text-slate-400 font-normal">Не указано</span>
        )}
      </p>
    )}
  </div>
);

export default function ProfessionalInfo({
  isEditing,
  formData,
  handleInputChange,
  userProfile,
  openSpecializationModal,
}: ProfessionalInfoProps) {
  const specs: string[] = formData.specializations || [];
  const statusText = isEditing ? "Режим редактирования" : "Просмотр";
  const statusClasses = isEditing
    ? "bg-amber-25 border-amber-100 text-amber-700"
    : "bg-emerald-25 border-emerald-100 text-emerald-700";

  const handleSpecializationToggle = (spec: string) => {
    const exists = specs.includes(spec);
    const updatedSpecs = exists
      ? specs.filter((s) => s !== spec)
      : [...specs, spec];
    handleInputChange("specializations", updatedSpecs);
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100/80 shadow-sm">
      {/* градиентная линия сверху */}
      <div className="absolute inset-x-0 top-0 h-[3px] " />

      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Профессиональная информация
            </CardTitle>
            <p className="text-[11px] text-slate-500">
              Данные о специализации, опыте и лицензиях
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${statusClasses}`}
        >
          {statusText}
        </span>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0">
        {isEditing ? (
          // ---------- РЕЖИМ РЕДАКТИРОВАНИЯ ----------
          <div className="space-y-5">
            {/* Специализация */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Специализации
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {specs.length > 0 &&
                  specs.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-900 border border-emerald-100"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleSpecializationToggle(spec)}
                        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-emerald-100"
                      >
                        <XIcon className="w-3 h-3 text-emerald-700" />
                      </button>
                    </span>
                  ))}

                <button
                  type="button"
                  onClick={openSpecializationModal}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 bg-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Укажите направления, по которым вы ведёте приём.
              </p>
            </div>

            {/* Опыт + Образование */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Опыт работы (лет)
                </label>
                <Input
                  type="number"
                  className="h-9 bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
                  value={formData.years_experience || ""}
                  onChange={(e) =>
                    handleInputChange("years_experience", e.target.value)
                  }
                  placeholder="Например: 10"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Образование
                </label>
                <Input
                  className="h-9 bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
                  value={formData.education || ""}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  placeholder="Название ВУЗа, год окончания"
                />
              </div>
            </div>

            {/* Сертификаты */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Сертификаты и достижения
              </label>
              <Textarea
                className="min-h-[96px] bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
                value={formData.certifications || ""}
                onChange={(e) =>
                  handleInputChange("certifications", e.target.value)
                }
                rows={4}
                placeholder={
                  "Перечислите ваши сертификаты, каждый с новой строки…"
                }
              />
            </div>

            {/* Лицензия + Страхование */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Медицинская лицензия
                </label>
                <Input
                  className="h-9 bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
                  value={formData.medical_license || ""}
                  onChange={(e) =>
                    handleInputChange("medical_license", e.target.value)
                  }
                  placeholder="Номер и срок действия лицензии"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Страхование
                </label>
                <Input
                  className="h-9 bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
                  value={formData.insurance || ""}
                  onChange={(e) =>
                    handleInputChange("insurance", e.target.value)
                  }
                  placeholder="Название страховой компании"
                />
              </div>
            </div>
          </div>
        ) : (
          // ---------- РЕЖИМ ПРОСМОТРА ----------
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100/80 bg-slate-50/40 divide-y divide-slate-100/80">
              <InfoRow label="Специализации">
                <div className="flex flex-wrap justify-end gap-1.5">
                  {userProfile.specializations?.length > 0 ? (
                    userProfile.specializations.map((spec: string) => (
                      <span
                        key={spec}
                        className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-900 border border-emerald-100"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-normal text-slate-400">
                      Не указано
                    </span>
                  )}
                </div>
              </InfoRow>

              <InfoRow
                label="Опыт работы"
                value={
                  userProfile.years_experience
                    ? `${userProfile.years_experience} лет`
                    : undefined
                }
              />

              <InfoRow label="Образование" value={userProfile.education} />

              <InfoRow
                label="Медицинская лицензия"
                value={userProfile.medical_license}
              />

              <InfoRow label="Страхование" value={userProfile.insurance} />
            </div>

            {/* Сертификаты */}
            <div className="pt-1">
              <p className="mb-1.5 text-xs font-semibold text-slate-500">
                Сертификаты и достижения
              </p>
              <p className="text-sm leading-relaxed text-slate-800 bg-slate-50/60 border border-slate-100/80 rounded-lg px-3 py-3 whitespace-pre-wrap">
                {userProfile.certifications || "Сертификаты не указаны."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
