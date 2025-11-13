"use client";

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, AlertCircle, Globe, MapPin } from "lucide-react";
import React from "react";

// Типизация пропсов
interface ContactInfoProps {
  isEditing: boolean;
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  userProfile: any;
}

export default function ContactInfo({
  isEditing,
  formData,
  handleInputChange,
  userProfile,
}: ContactInfoProps) {
  const statusText = isEditing ? "Режим редактирования" : "Просмотр";
  const statusClasses = isEditing
    ? "bg-amber-25 border-amber-100 text-amber-700"
    : "bg-emerald-25 border-emerald-100 text-emerald-700";

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100/80 shadow-sm">
      {/* градиентная линия сверху */}
      <div className="absolute inset-x-0 top-0 h-[3px] " />

      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Контактная информация
            </CardTitle>
            <p className="text-[11px] text-slate-500">
              Телефон, экстрный контакт и адрес приёма
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
        {/* Телефон + Экстренный контакт */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Телефон
            </label>
            {isEditing ? (
              <Input
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+998 XX XXX XX XX"
                className="h-9 w-full bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
              />
            ) : (
              <div className="rounded-lg border border-slate-100/80 bg-slate-50/60 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-900">
                  {userProfile.phone || (
                    <span className="font-normal text-slate-400">
                      Не указано
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Экстренный контакт
            </label>
            {isEditing ? (
              <Input
                value={formData.emergency_contact || ""}
                onChange={(e) =>
                  handleInputChange("emergency_contact", e.target.value)
                }
                placeholder="Имя и номер телефона"
                className="h-9 w-full bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-100"
              />
            ) : (
              <div className="rounded-lg border border-slate-100/80 bg-slate-50/60 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-900">
                  {userProfile.emergency_contact || (
                    <span className="font-normal text-slate-400">
                      Не указано
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Страна / Регион / Город */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Страна */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Страна
            </label>
            {isEditing ? (
              <select
                value={formData.country || ""}
                onChange={(e) => {
                  handleInputChange("country", e.target.value);
                  handleInputChange("region", "");
                  handleInputChange("district", "");
                }}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 text-sm text-slate-900 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-100"
              >
                <option value="">Выберите страну</option>
                <option value="Узбекистан">Узбекистан</option>
                <option value="Россия">Россия</option>
                <option value="Казахстан">Казахстан</option>
              </select>
            ) : (
              <div className="rounded-lg border border-slate-100/80 bg-slate-50/60 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-900">
                  {userProfile.country || (
                    <span className="font-normal text-slate-400">
                      Не указано
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Область / Регион */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Область / Регион
            </label>
            {isEditing ? (
              <select
                value={formData.region || ""}
                onChange={(e) => {
                  handleInputChange("region", e.target.value);
                  handleInputChange("district", "");
                }}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 text-sm text-slate-900 disabled:bg-slate-100/80 disabled:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-100"
                disabled={!formData.country}
              >
                <option value="">Сначала выберите страну</option>

                {formData.country === "Узбекистан" && (
                  <>
                    <option value="Республика Каракалпакстан">
                      Республика Каракалпакстан
                    </option>
                    <option value="Андижанская область">
                      Андижанская область
                    </option>
                    <option value="Бухарская область">Бухарская область</option>
                    <option value="Джизакская область">
                      Джизакская область
                    </option>
                    <option value="Кашкадарьинская область">
                      Кашкадарьинская область
                    </option>
                    <option value="Навоийская область">
                      Навоийская область
                    </option>
                    <option value="Наманганская область">
                      Наманганская область
                    </option>
                    <option value="Самаркандская область">
                      Самаркандская область
                    </option>
                    <option value="Сурхандарьинская область">
                      Сурхандарьинская область
                    </option>
                    <option value="Сырдарьинская область">
                      Сырдарьинская область
                    </option>
                    <option value="Ташкентская область">
                      Ташкентская область
                    </option>
                    <option value="Ферганская область">
                      Ферганская область
                    </option>
                    <option value="Хорезмская область">
                      Хорезмская область
                    </option>
                    <option value="Город Ташкент">Город Ташкент</option>
                  </>
                )}

                {formData.country === "Россия" && (
                  <>
                    <option value="Московская область">
                      Московская область
                    </option>
                    <option value="Ленинградская область">
                      Ленинградская область
                    </option>
                    <option value="Краснодарский край">
                      Краснодарский край
                    </option>
                    <option value="Город Москва">Город Москва</option>
                    <option value="Город Санкт-Петербург">
                      Город Санкт-Петербург
                    </option>
                  </>
                )}

                {formData.country === "Казахстан" && (
                  <>
                    <option value="Алматинская область">
                      Алматинская область
                    </option>
                    <option value="Город Алматы">Город Алматы</option>
                    <option value="Город Астана">Город Астана</option>
                  </>
                )}
              </select>
            ) : (
              <div className="rounded-lg border border-slate-100/80 bg-slate-50/60 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-900">
                  {userProfile.region || (
                    <span className="font-normal text-slate-400">
                      Не указано
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Город / Район */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Город / Район
            </label>
            {isEditing ? (
              <select
                value={formData.district || ""}
                onChange={(e) => handleInputChange("district", e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 text-sm text-slate-900 disabled:bg-slate-100/80 disabled:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-100"
                disabled={!formData.region}
              >
                <option value="">Сначала выберите область</option>

                {formData.region === "Город Ташкент" && (
                  <>
                    <option value="Бектемирский район">
                      Бектемирский район
                    </option>
                    <option value="Мирзо-Улугбекский район">
                      Мирзо-Улугбекский район
                    </option>
                    <option value="Мирабадский район">Мирабадский район</option>
                    <option value="Олмазорский район">Олмазорский район</option>
                    <option value="Сергелийский район">
                      Сергелийский район
                    </option>
                    <option value="Учтепинский район">Учтепинский район</option>
                    <option value="Чиланзарский район">
                      Чиланзарский район
                    </option>
                    <option value="Шайхантахурский район">
                      Шайхантахурский район
                    </option>
                    <option value="Юнусабадский район">
                      Юнусабадский район
                    </option>
                    <option value="Яккасарайский район">
                      Яккасарайский район
                    </option>
                    <option value="Яшнабадский район">Яшнабадский район</option>
                    <option value="Янгихаётский район">
                      Янгихаётский район
                    </option>
                  </>
                )}

                {formData.region === "Самаркандская область" && (
                  <>
                    <option value="Город Самарканд">Город Самарканд</option>
                    <option value="Город Каттакурган">Город Каттакурган</option>
                    <option value="Акдарьинский район">
                      Акдарьинский район
                    </option>
                    <option value="Булунгурский район">
                      Булунгурский район
                    </option>
                  </>
                )}
              </select>
            ) : (
              <div className="rounded-lg border border-slate-100/80 bg-slate-50/60 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-900">
                  {userProfile.district || (
                    <span className="font-normal text-slate-400">
                      Не указано
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Адрес */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Улица, дом
          </label>
          {isEditing ? (
            <Input
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Например: ул. Амира Темура, 15"
              className="h-9 w-full bg-slate-50/60 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
            />
          ) : (
            <div className="rounded-lg border border-slate-100/80 bg-slate-50/60 px-3 py-2.5">
              <p className="text-sm font-medium text-slate-900">
                {userProfile.address || (
                  <span className="font-normal text-slate-400">Не указано</span>
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
