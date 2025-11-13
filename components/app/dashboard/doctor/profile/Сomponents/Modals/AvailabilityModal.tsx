"use client";

import React from "react";
import { CalendarDays, X as XIcon, Check } from "lucide-react";

// Типизация пропсов для ясности и безопасности
interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableOptions: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  onClear: () => void;
}

export default function AvailabilityModal({
  isOpen,
  onClose,
  availableOptions,
  selectedOption,
  onSelect,
  onClear,
}: AvailabilityModalProps) {
  // Не рендерим компонент, если он не должен быть открыт
  if (!isOpen) {
    return null;
  }

  // Функция для очистки и закрытия модального окна
  const handleClearAndClose = () => {
    onClear();
    onClose();
  };

  return (
    // Оверлей (фон)
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
    >
      {/* Контейнер модального окна */}
      <div
        onClick={(e) => e.stopPropagation()} // Предотвращает закрытие модального окна при клике на его содержимое
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
      >
        {/* Шапка модального окна */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Выбор доступности
              </h2>
              <p className="text-purple-100 text-sm">
                {selectedOption
                  ? "Выбран 1 вариант"
                  : "Выберите вариант из списка"}
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

        {/* Тело модального окна (список опций) */}
        <div className="p-6 overflow-y-auto">
          {availableOptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableOptions.map((option) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelect(option)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-md"
                        : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-purple-500 bg-purple-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-purple-800" : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Нет доступных опций для выбора.</p>
            </div>
          )}
        </div>

        {/* Подвал модального окна */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-sm text-gray-600">
            Всего вариантов:{" "}
            <span className="font-medium text-gray-900">
              {availableOptions.length}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClearAndClose}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Очистить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
