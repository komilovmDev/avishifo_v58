// components/doctor-dashboard.tsx
"use client"

import { useState } from "react"
import { Brain, FileText, History, MessageCircle, CalendarIcon, User, Stethoscope } from "lucide-react"

// Импорты компонентов общего макета
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

// Импорты компонентов для каждого раздела
import { AiChatSection } from "./AiChatSection"
import { PsychologicalTestSection } from "./PsychologicalTestSection"
import { WHOStandardsSection } from "./WHOStandardsSection"
import { ChatSection } from "./ChatSection"
import { AppointmentsManagementSection } from "./appointments-management"
import { ProfileSection } from "./ProfileSection"
import DoctorsPage from "@/app/doctors/page" // Предполагаем, что этот путь корректен для вашего проекта

// 1. УДАЛЕН импорт старого, монолитного компонента.
// import { PatientHistorySection } from "./PatientHistorySection/PatientHistorySection"

// 2. ДОБАВЛЕН импорт нового, структурированного модуля пациентов.
//    Этот файл (page.tsx) теперь является главной точкой входа для всего,
//    что связано с пациентами.
import PatientsPage from "./PatientHistorySection/patients/page"

// Определение элементов боковой панели
const sidebarItems = [
  {
    id: "profile",
    label: "Профиль",
    icon: User,
    color: "from-indigo-500 to-purple-500",
  },
  { 
    id: "doctors", 
    label: "Врачи", 
    icon: Stethoscope, 
    color: "from-emerald-500 to-teal-500" 
  },
  {
    id: "ai-chat",
    label: "AI Авишифо",
    icon: Brain,
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "appointments",
    label: "Записи пациентов",
    icon: CalendarIcon,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "patient-history",
    label: "История Пациентов",
    icon: History,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "chat",
    label: "Чат",
    icon: MessageCircle,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "who-standards",
    label: "Стандарты ВОЗ",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
  },
  // {
  //   id: "psychological-test",
  //   label: "Психологический Тест",
  //   icon: Brain,
  //   color: "from-purple-500 to-pink-500",
  // },
]

interface DoctorDashboardProps {
  onLogout: () => void
}

export function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  // Состояние для отслеживания активной секции, отображаемой в основной части
  const [activeSection, setActiveSection] = useState("profile") // По умолчанию открывается профиль

  // Находим заголовок для текущей активной секции
  const activeSectionLabel = sidebarItems.find((item) => item.id === activeSection)?.label || "Панель управления"

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar
        sidebarItems={sidebarItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col">
        <TopBar activeSectionLabel={activeSectionLabel} />

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {/* Условный рендеринг: показываем компонент, соответствующий активной секции */}
          
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "ai-chat" && <AiChatSection />}
          {activeSection === "psychological-test" && <PsychologicalTestSection />}
          {activeSection === "who-standards" && <WHOStandardsSection />}
          
          {/* 3. ИНТЕГРАЦИЯ: Старый вызов заменен на новый. */}
          {/*    Теперь при выборе "История Пациентов" будет рендериться ваш */}
          {/*    новый, полностью инкапсулированный модуль. */}
          {activeSection === "patient-history" && <PatientsPage />}
          
          {activeSection === "appointments" && <AppointmentsManagementSection />}
          {activeSection === "chat" && <ChatSection />}
          {activeSection === "doctors" && <DoctorsPage />}
        </main>
      </div>
    </div>
  )
}