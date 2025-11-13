"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock4, CalendarDays, DollarSign, Plus } from "lucide-react";
import React from "react";

// Типизация пропсов для компонента
interface ScheduleInfoProps {
  isEditing: boolean;
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  userProfile: any;
  openWorkingHoursModal: () => void;
  openAvailabilityModal: () => void;
}

// Ряд в режиме просмотра
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-b-0">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="flex-1 text-right text-sm font-medium text-slate-900">
      {value && value.trim() ? (
        value
      ) : (
        <span className="text-slate-400 font-normal">Не указано</span>
      )}
    </p>
  </div>
);

export default function ScheduleInfo({
  isEditing,
  formData,
  handleInputChange,
  userProfile,
  openWorkingHoursModal,
  openAvailabilityModal,
}: ScheduleInfoProps) {
  const statusText = isEditing ? "Режим редактирования" : "Просмотр";
  const statusClasses = isEditing
    ? "bg-amber-25 border-amber-100 text-amber-700"
    : "bg-emerald-25 border-emerald-100 text-emerald-700";

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100/80 shadow-sm">
      {/* градиент сверху */}
      <div className="absolute inset-x-0 top-0 h-[3px] " />

      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Рабочий график
            </CardTitle>
            <p className="text-[11px] text-slate-500">
              Часы приёма, дни доступности и стоимость консультации
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${statusClasses}`}
        >
          {statusText}
        </span>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0 space-y-5">
        {isEditing ? (
          // ---------- РЕЖИМ РЕДАКТИРОВАНИЯ ----------
          <div className="space-y-5">
            {/* Рабочие часы */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Рабочие часы
              </label>
              {formData.working_hours && (
                <div className="mb-2 rounded-xl border border-purple-100 bg-purple-50/60 px-3 py-2">
                  <p className="text-sm font-medium text-purple-900">
                    {formData.working_hours}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={openWorkingHoursModal}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white py-2.5 text-sm font-medium text-purple-700 transition-colors hover:border-purple-400 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4" />
                {formData.working_hours
                  ? "Изменить часы работы"
                  : "Выбрать часы работы"}
              </button>
              <p className="mt-1 text-[11px] text-slate-400">
                Укажите интервал, когда вы принимаете пациентов.
              </p>
            </div>

            {/* Доступность */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Доступность
              </label>
              {formData.availability && (
                <div className="mb-2 rounded-xl border border-purple-100 bg-purple-50/60 px-3 py-2">
                  <p className="text-sm font-medium text-purple-900">
                    {formData.availability}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={openAvailabilityModal}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white py-2.5 text-sm font-medium text-purple-700 transition-colors hover:border-purple-400 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4" />
                {formData.availability
                  ? "Изменить доступность"
                  : "Выбрать доступность"}
              </button>
              <p className="mt-1 text-[11px] text-slate-400">
                Например: будни, только утро, дежурства и т.п.
              </p>
            </div>

            {/* Стоимость консультации */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Стоимость консультации
              </label>
              <Input
                value={formData.consultation_fee || ""}
                onChange={(e) =>
                  handleInputChange("consultation_fee", e.target.value)
                }
                placeholder="Например: 150,000 сум"
                className="h-9 bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-100"
              />
            </div>
          </div>
        ) : (
          // ---------- РЕЖИМ ПРОСМОТРА ----------
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100/80 bg-slate-50/40 divide-y divide-slate-100/80">
              <InfoRow label="Рабочие часы" value={userProfile.working_hours} />
              <InfoRow label="Доступность" value={userProfile.availability} />
              <InfoRow
                label="Стоимость консультации"
                value={userProfile.consultation_fee}
              />
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
