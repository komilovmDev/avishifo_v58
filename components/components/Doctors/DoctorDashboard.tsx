// components/doctor-dashboard.tsx
"use client"

import { ProfileSection } from "./ProfileSection"
import Link from "next/link"

interface DoctorDashboardProps {
  onLogout: () => void
}

export function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Панель управления доктора</h1>
        <p className="text-gray-600 mt-2">Добро пожаловать в вашу панель управления</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/doctor/profile" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Профиль</h3>
            <p className="text-gray-600 mb-4">Управляйте вашим профилем и настройками</p>
            <div className="text-sm text-gray-500">100% заполнен</div>
          </div>
        </Link>
        
        <Link href="/dashboard/doctor/doctors" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Врачи</h3>
            <p className="text-gray-600 mb-4">Просматривайте врачей по специализациям</p>
            <div className="text-sm text-gray-500">Доступно категорий: 4</div>
          </div>
        </Link>
        
        <Link href="/dashboard/doctor/patients" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Пациенты</h3>
            <p className="text-gray-600 mb-4">Просматривайте историю и записи пациентов</p>
            <div className="text-sm text-gray-500">Активных: 12</div>
          </div>
        </Link>
        
        <Link href="/dashboard/doctor/appointments" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Записи</h3>
            <p className="text-gray-600 mb-4">Управляйте записями на прием</p>
            <div className="text-sm text-gray-500">Сегодня: 8</div>
          </div>
        </Link>
        
        <Link href="/dashboard/doctor/ai" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Авишифо</h3>
            <p className="text-gray-600 mb-4">Искусственный интеллект для диагностики</p>
            <div className="text-sm text-gray-500">Доступно</div>
          </div>
        </Link>

        <Link href="/dashboard/doctor/ai" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Forma</h3>
            <p className="text-gray-600 mb-4">Интеллектуальная медицинская анкета (Avi_form)</p>
            <div className="text-sm text-gray-500">Бета</div>
          </div>
        </Link>
        
        <Link href="/dashboard/doctor/chat" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Чат</h3>
            <p className="text-gray-600 mb-4">Общайтесь с пациентами и коллегами</p>
            <div className="text-sm text-gray-500">Новых: 3</div>
          </div>
        </Link>
        
        <Link href="/dashboard/doctor/who-standards" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Стандарты ВОЗ</h3>
            <p className="text-gray-600 mb-4">Актуальные медицинские стандарты</p>
            <div className="text-sm text-gray-500">Обновлено</div>
          </div>
        </Link>
      </div>
    </div>
  )
}