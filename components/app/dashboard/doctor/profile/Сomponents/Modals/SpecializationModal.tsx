"use client";

import React, { useState, useMemo } from "react";
import { Stethoscope, X as XIcon, Check, Search } from "lucide-react";

// Типизация пропсов для компонента
interface SpecializationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSpecializations: string[];
  selectedSpecializations: string[];
  onSpecializationToggle: (specialization: string) => void;
  onClear: () => void;
}

export default function SpecializationModal({
  isOpen,
  onClose,
  availableSpecializations,
  selectedSpecializations,
  onSpecializationToggle,
  onClear,
}: SpecializationModalProps) {
  // Внутреннее состояние для поискового запроса
  const [specializationSearch, setSpecializationSearch] = useState("");

  // Фильтруем специализации с использованием useMemo для кэширования
  const filteredSpecializations = useMemo(() => {
    if (!specializationSearch) {
      return availableSpecializations;
    }
    return availableSpecializations.filter((spec) =>
      spec.toLowerCase().includes(specializationSearch.toLowerCase())
    );
  }, [availableSpecializations, specializationSearch]);

  // Не рендерим компонент, если он закрыт
  if (!isOpen) {
    return null;
  }

  const handleClearAndClose = () => {
    onClear();
    onClose();
  };

  return (
    // Оверлей
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
    >
      {/* Контейнер модального окна */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
      >
        {/* Шапка */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Выбор специализаций
              </h2>
              <p className="text-green-100 text-sm">
                Выбрано: {selectedSpecializations.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <XIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Поиск */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск специализации..."
              value={specializationSearch}
              onChange={(e) => setSpecializationSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
            />
          </div>
        </div>

        {/* Тело (список специализаций) */}
        <div className="p-6 overflow-y-auto">
          {filteredSpecializations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSpecializations.map((specialization) => {
                const isSelected =
                  selectedSpecializations.includes(specialization);
                return (
                  <button
                    key={specialization}
                    type="button"
                    onClick={() => onSpecializationToggle(specialization)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white stroke-[3px]" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-green-800" : "text-gray-700"
                        }`}
                      >
                        {specialization}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">
                Специализации не найдены
              </p>
              <p className="text-gray-400 text-sm">
                Попробуйте изменить поисковый запрос.
              </p>
            </div>
          )}
        </div>

        {/* Подвал */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-sm text-gray-600">
            Всего доступно:{" "}
            <span className="font-medium text-gray-900">
              {availableSpecializations.length}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClearAndClose}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Очистить все
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
