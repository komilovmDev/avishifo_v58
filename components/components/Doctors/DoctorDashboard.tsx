// components/doctor-dashboard.tsx
"use client"

import { useState } from "react"
import { Brain, FileText, History, MessageCircle, CalendarIcon, User } from "lucide-react"

import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { AiChatSection } from "./AiChatSection"
import { PsychologicalTestSection } from "./PsychologicalTestSection"
import { WHOStandardsSection } from "./WHOStandardsSection"
import { ChatSection } from "./ChatSection"
import { PatientHistorySection } from "./PatientHistorySection/PatientHistorySection"
import { AppointmentsManagementSection } from "./appointments-management"
import { ProfileSection } from "./ProfileSection" // Import the new ProfileSection

// Define sidebar items here or import if they are used elsewhere
const sidebarItems = [
  {
    id: "profile",
    label: "Профиль",
    icon: User,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "ai-chat",
    label: "ИИ Авишифо",
    icon: Brain,
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "psychological-test",
    label: "Психологический Тест",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "who-standards",
    label: "Стандарты ВОЗ",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "patient-history",
    label: "История Пациентов",
    icon: History,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "appointments",
    label: "Записи пациентов",
    icon: CalendarIcon,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "chat",
    label: "Чат",
    icon: MessageCircle,
    color: "from-orange-500 to-red-500",
  },
]

interface DoctorDashboardProps {
  onLogout: () => void
}

export function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  const [activeSection, setActiveSection] = useState("profile") // Changed default to profile

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
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "ai-chat" && <AiChatSection />}
          {activeSection === "psychological-test" && <PsychologicalTestSection />}
          {activeSection === "who-standards" && <WHOStandardsSection />}
          {activeSection === "patient-history" && <PatientHistorySection />}
          {activeSection === "appointments" && <AppointmentsManagementSection />}
          {activeSection === "chat" && <ChatSection />}
        </main>
      </div>
    </div>
  )
}
