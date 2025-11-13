"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  FileText,
  Globe,
  CalendarDays,
  UserCheck,
  Plus,
  X as XIcon,
} from "lucide-react";

interface PersonalInfoProps {
  isEditing: boolean;
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  userProfile: any;
  openLanguageModal: () => void;
}

export default function PersonalInfo({
  isEditing,
  formData,
  handleInputChange,
  userProfile,
  openLanguageModal,
}: PersonalInfoProps) {
  const handleLanguageToggle = (language: string) => {
    const updatedLanguages = formData.languages?.includes(language)
      ? formData.languages.filter((lang: string) => lang !== language)
      : [...(formData.languages || []), language];
    handleInputChange("languages", updatedLanguages);
  };

  const safeValue = (value?: string) =>
    value && value.trim() ? value : "Не указано";

  const viewLanguages =
    (isEditing ? formData.languages : userProfile.languages) || [];

  const StatusPill = () => (
    <span
      className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
        isEditing
          ? "bg-amber-50 text-amber-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isEditing ? "Режим редактирования" : "Сохранено"}
    </span>
  );

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <CardContent className="p-5 lg:p-6">
        {/* ШАПКА */}
        <div className="flex flex-col gap-2 pb-4 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Личная информация
              </h2>
              <p className="text-[11px] text-slate-500">
                Основные данные профиля врача
              </p>
            </div>
          </div>
          <StatusPill />
        </div>

        {/* КОНТЕНТ */}
        <div className="mt-4 space-y-5">
          {/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
          <Section
            title="Основная информация"
            description="Используется в списках врачей и в карточке профиля."
          >
            <Row
              label="Полное имя"
              icon={<UserCheck className="w-3.5 h-3.5 text-slate-400" />}
            >
              {isEditing ? (
                <LineInput
                  value={formData.full_name || ""}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  placeholder="ФИО полностью"
                />
              ) : (
                <LineValue>{safeValue(userProfile.full_name)}</LineValue>
              )}
            </Row>

            <Row
              label="Email"
              icon={<Mail className="w-3.5 h-3.5 text-slate-400" />}
            >
              {isEditing ? (
                <LineInput
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="doctor@example.com"
                />
              ) : (
                <LineValue>{safeValue(userProfile.email)}</LineValue>
              )}
            </Row>

            <Row
              label="Дата рождения"
              icon={<CalendarDays className="w-3.5 h-3.5 text-slate-400" />}
            >
              {isEditing ? (
                <LineInput
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={(e) =>
                    handleInputChange("date_of_birth", e.target.value)
                  }
                />
              ) : (
                <LineValue>{safeValue(userProfile.date_of_birth)}</LineValue>
              )}
            </Row>

            <Row
              label="Пол"
              icon={<User className="w-3.5 h-3.5 text-slate-400" />}
              last
            >
              {isEditing ? (
                <LineSelect
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                />
              ) : (
                <LineValue>{safeValue(userProfile.gender)}</LineValue>
              )}
            </Row>
          </Section>

          {/* БИОГРАФИЯ */}
          <Section
            title="Биография"
            description="Кратко опишите опыт, специализацию и подход к пациентам."
          >
            <Row
              label="О себе"
              icon={<FileText className="w-3.5 h-3.5 text-slate-400" />}
              last
            >
              {isEditing ? (
                <BlockTextarea
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Например: стаж, клиника, ключевые направления, подход к лечению..."
                />
              ) : (
                <BlockValue>
                  {userProfile.bio ? (
                    userProfile.bio
                  ) : (
                    <span className="text-slate-400">
                      Биография не заполнена.
                    </span>
                  )}
                </BlockValue>
              )}
            </Row>
          </Section>

          {/* ЯЗЫКИ */}
          <Section
            title="Языки общения"
            description="Языки, на которых вы принимаете пациентов."
          >
            <Row
              label="Языки"
              icon={<Globe className="w-3.5 h-3.5 text-slate-400" />}
              last
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {viewLanguages.map((lang: string) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-800"
                  >
                    {lang}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleLanguageToggle(lang)}
                        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-slate-200"
                      >
                        <XIcon className="w-3 h-3 text-slate-500" />
                      </button>
                    )}
                  </span>
                ))}

                {isEditing && (
                  <button
                    type="button"
                    onClick={openLanguageModal}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}

                {!isEditing && viewLanguages.length === 0 && (
                  <span className="text-xs text-slate-400">
                    Языки не указаны.
                  </span>
                )}
              </div>
            </Row>
          </Section>
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== СЕКЦИЯ / РЯД ===== */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-slate-50/40 border border-slate-100">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
        )}
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </section>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="px-4 py-2.5 text-sm">
      <div className="grid gap-2.5 md:grid-cols-12 md:items-center">
        {/* ЛЕЙБЛ */}
        <div className="md:col-span-4 flex items-start gap-2">
          {icon && (
            <span className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-md bg-white text-slate-500 border border-slate-100">
              {icon}
            </span>
          )}
          <span className="text-[11px] font-medium text-slate-500 mt-[2px]">
            {label}
          </span>
        </div>
        {/* ПОЛЕ */}
        <div className="md:col-span-8">{children}</div>
      </div>
    </div>
  );
}

/* ===== ПОЛЯ ===== */

function LineValue({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs md:text-sm font-medium text-slate-900">{children}</p>
  );
}

const LineInput = (props: React.ComponentProps<typeof Input>) => (
  <Input
    {...props}
    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
  />
);

const LineSelect = (props: React.ComponentProps<"select">) => (
  <select
    {...props}
    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs md:text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
  >
    <option value="">Не выбрано</option>
    <option value="Мужской">Мужской</option>
    <option value="Женский">Женский</option>
  </select>
);

const BlockTextarea = (props: React.ComponentProps<typeof Textarea>) => (
  <Textarea
    {...props}
    rows={3}
    className="w-full resize-none rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
  />
);

function BlockValue({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs md:text-sm text-slate-800 leading-relaxed">
      {children}
    </div>
  );
}
