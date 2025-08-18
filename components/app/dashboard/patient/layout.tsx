"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Activity, LogOut, HelpCircle, ChevronRight, User, CalendarIcon, MessageCircle, FileText, Stethoscope, Brain, History, Home, Settings, Pill, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"

const API_BASE_URL = "https://new.avishifo.uz"

interface SidebarItem {
  id: string
  label: string
  icon: any
  color: string
  href: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Главная",
    icon: Home,
    color: "from-violet-500 to-indigo-500",
    href: "/dashboard/patient"
  },
  {
    id: "medical-history",
    label: "Мед. История",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    href: "/dashboard/patient/medical-history"
  },
  {
    id: "messages",
    label: "Сообщения",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
    href: "/dashboard/patient/messages"
  },
  {
    id: "appointments",
    label: "Записи",
    icon: CalendarIcon,
    color: "from-purple-500 to-indigo-500",
    href: "/dashboard/patient/appointments"
  },
  {
    id: "health-tracker",
    label: "Трекер Здоровья",
    icon: Activity,
    color: "from-teal-500 to-cyan-500",
    href: "/dashboard/patient/health-tracker"
  },
  {
    id: "medications",
    label: "Лекарства",
    icon: Pill,
    color: "from-red-500 to-pink-500",
    href: "/dashboard/patient/medications"
  },
  {
    id: "profile",
    label: "Профиль",
    icon: User,
    color: "from-amber-500 to-orange-500",
    href: "/dashboard/patient/profile"
  },
  {
    id: "settings",
    label: "Настройки",
    icon: Settings,
    color: "from-gray-500 to-slate-500",
    href: "/dashboard/patient/settings"
  },
  {
    id: "doctors",
    label: "Врачи",
    icon: Stethoscope,
    color: "from-emerald-500 to-teal-500",
    href: "/dashboard/patient/doctors"
  },
]

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("dashboard")

  useEffect(() => {
    // Check if user is authenticated and is a patient
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/accounts/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data

        if (userData.user_type !== "patient") {
          console.error("User is not a patient")
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          router.push("/")
        }
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    // Set active section based on current pathname
    const currentItem = sidebarItems.find(item => item.href === pathname)
    if (currentItem) {
      setActiveSection(currentItem.id)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar - Fixed width and positioned on the left */}
      <div className="w-80 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-xl flex-shrink-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Logo and User Info */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  AviShifo
                </h1>
                <p className="text-sm text-gray-500">Панель пациента</p>
              </div>
            </div>

            {/* User Profile in Sidebar */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
              <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                JR
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Javohir Raximov</p>
                <p className="text-sm text-gray-500">Пациент</p>
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-white/80 shadow-sm">
                  <HelpCircle className="w-4 h-4" />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
            </div>

            {/* Doctor Status */}
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Доктор онлайн</span>
              </div>
              <p className="text-xs text-green-600 mt-1">Доступен для консультации</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-1.5 overflow-auto">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12 ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } transition-all duration-200 rounded-xl`}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
                {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-600 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>Помощь</span>
              </Button>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-400">AviShifo v2.1 © 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Takes remaining space and has proper padding */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
