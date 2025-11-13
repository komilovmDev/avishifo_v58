"use client";

import { User, Stethoscope, Calendar, Phone } from "lucide-react";
import React from "react";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const navItems = [
  { id: "personal", label: "Личная информация", icon: User },
  {
    id: "professional",
    label: "Профессиональная информация",
    icon: Stethoscope,
  },
  { id: "schedule", label: "Рабочий график", icon: Calendar },
  { id: "contact", label: "Контактная информация", icon: Phone },
];

export default function NavigationTabs({
  activeTab,
  setActiveTab,
}: NavigationTabsProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100/80 shadow-sm p-3">
      {/* тонкая градиентная линия сверху, как у других карточек */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500" />

      <div className="mb-2 px-1 pt-1">
        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          Профиль врача
        </p>
        <p className="text-xs text-slate-400">
          Быстрый переход между разделами
        </p>
      </div>

      <ul className="mt-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* Цветная вертикальная полоска для активного таба */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-sky-500 via-indigo-500 to-violet-500" />
                )}

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-slate-100">
                  <IconComponent
                    className={`w-4 h-4 ${
                      isActive ? "text-indigo-600" : "text-slate-400"
                    }`}
                  />
                </div>

                <span className="font-medium truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
