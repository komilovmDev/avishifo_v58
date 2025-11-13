"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Edit3,
  Save,
  LogOut,
  Camera,
  User as UserIcon,
  Search,
  Heart,
  Bell,
} from "lucide-react";
import { API_CONFIG } from "@/config/api";

interface DoctorProfileHeaderProps {
  userProfile: any;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleLogout: () => void;
  handleProfilePictureChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  isLoading: boolean;
}

export default function DoctorProfileHeader({
  userProfile,
  isEditing,
  setIsEditing,
  handleSave,
  handleCancel,
  handleLogout,
  handleProfilePictureChange,
  isLoading,
}: DoctorProfileHeaderProps) {
  const [searchValue, setSearchValue] = useState("");

  const getProfilePictureUrl = () => {
    const picture = userProfile?.profile_picture;
    if (!picture) return "/placeholder.svg";
    if (picture.startsWith("http") || picture.startsWith("blob:"))
      return picture;
    return `${API_CONFIG.BASE_URL}${picture}`;
  };

  const getInitials = () => {
    const firstName = userProfile?.first_name || "";
    const lastName = userProfile?.last_name || "";
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`;
    if (userProfile?.full_name) {
      const names = userProfile.full_name.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[1][0]}`
        : `${names[0][0]}`;
    }
    return <UserIcon className="w-8 h-8" />;
  };

  const profilePictureUrl = getProfilePictureUrl();
  const avatarFallback = getInitials();

  // Заглушки для показателей (подставь реальные поля из профиля, если есть)
  const height = userProfile?.height ?? 168;
  const weight = userProfile?.weight ?? 55;
  const heartRate = userProfile?.heart_rate ?? 85;
  const temperature = userProfile?.temperature ?? 36.7;
  const spo2 = userProfile?.spo2 ?? 97;
  const pressure = userProfile?.blood_pressure ?? "120/80";

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f6f9ff] via-[#fdfefe] to-[#f4fbff] shadow-md border border-slate-100 px-6 py-5 md:px-10 md:py-7">
        {/* лёгкий фон */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 -top-20 h-56 w-56 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-stretch md:justify-between">
          {/* Левая часть: поиск + показатели */}
          <div className="flex-1 min-w-0">
            {/* Поиск */}
            <div className="mb-6">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Поиск по пациентам, анализам и событиям..."
                  className="w-full rounded-full border border-slate-200 bg-white/80 px-11 py-3 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            {/* Показатели */}
            {/* Показатели (статистика врача) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-slate-700 md:grid-cols-3">
              <Metric
                label="Пациенты"
                value={userProfile?.total_patients ?? 0}
                unit=""
              />
              <Metric
                label="Консультации"
                value={userProfile?.monthly_consultations ?? 0}
                unit="/мес"
              />
              <Metric
                label="Рейтинг"
                value={userProfile?.rating ?? "N/A"}
                unit="★"
                accent
              />
              <Metric
                label="Стоимость приема"
                value={userProfile?.consultation_fee ?? "..."}
                unit="сум"
                accent
              />
              <Metric
                label="Отзывы"
                value={userProfile?.total_reviews ?? 0}
                unit=""
              />
              <Metric
                label="Стаж"
                value={
                  userProfile?.experience_years ??
                  userProfile?.experience ??
                  "—"
                }
                unit={userProfile?.experience_years ? "лет" : ""}
              />
            </div>
          </div>

          {/* Правая часть: фото врача + кнопки */}
          <div className="mt-4 flex shrink-0 flex-col items-end justify-between md:mt-0 md:w-[280px]">
            {/* Верхние иконки */}
            <div className="mb-4 flex items-center gap-2">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="hidden rounded-full bg-sky-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-sky-500/30 hover:bg-sky-600 md:inline-flex"
                >
                  <Edit3 className="mr-2 h-3 w-3" />
                  Редактировать
                </Button>
              )}

              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600"
                  >
                    <Save className="mr-2 h-3 w-3" />
                    {isLoading ? "Сохранение..." : "Сохранить"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="rounded-full px-3 py-2 text-xs"
                  >
                    Отмена
                  </Button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 shadow-sm hover:bg-slate-50"
                  >
                    <Heart className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 shadow-sm hover:bg-slate-50"
                  >
                    <Bell className="h-4 w-4 text-slate-600" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white shadow-sm">
                      4
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 shadow-sm hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4 text-slate-600" />
                  </button>
                </>
              )}
            </div>

            {/* Фото и имя врача */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl shadow-slate-300/60">
                  <AvatarImage
                    src={profilePictureUrl}
                    alt="Фотография профиля"
                  />
                  <AvatarFallback className="bg-sky-500 text-white text-3xl font-bold">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute -bottom-1 -right-1">
                    <label
                      htmlFor="profile-picture-input"
                      className="group cursor-pointer"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white shadow-md shadow-sky-500/40 transition group-hover:scale-110 group-hover:bg-sky-700">
                        <Camera className="h-4 w-4" />
                      </div>
                    </label>
                    <input
                      id="profile-picture-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                )}
              </div>

              <div className="text-right">
                <h2 className="text-lg font-semibold text-slate-900">
                  {userProfile.full_name || "Имя не указано"}
                </h2>
                <p className="text-xs text-slate-500">
                  {userProfile.specializations?.[0] || "Врач"}
                </p>
                {userProfile.country && (
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                    {userProfile.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Маленький компонент для одной метрики
interface MetricProps {
  label: string;
  value: string | number;
  unit: string;
  accent?: boolean;
}

const Metric: React.FC<MetricProps> = ({ label, value, unit, accent }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-semibold ${
            accent ? "text-orange-500" : "text-slate-900"
          }`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500">{unit}</span>
        )}
      </div>
    </div>
  );
};
