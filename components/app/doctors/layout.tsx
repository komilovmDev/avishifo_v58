"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Activity, LogOut, HelpCircle, ChevronRight, User, CalendarIcon, MessageCircle, FileText, Stethoscope, Brain, History, Shield, BarChart3, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"

import { API_CONFIG } from "../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

interface SidebarItem {
  id: string
  label: string
  icon: any
  color: string
  href: string
}

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [userType, setUserType] = useState<"doctor" | "patient" | "super-admin" | null>(null)
  const [activeSection, setActiveSection] = useState("doctors")

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await axios.get(API_CONFIG.ENDPOINTS.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data

        // Map backend user_type to frontend user types
        let userType: "doctor" | "patient" | "super-admin"

        switch (userData.user_type) {
          case "doctor":
            userType = "doctor"
            break
          case "patient":
            userType = "patient"
            break
          case "super_admin":
          case "admin":
            userType = "super-admin"
            break
          default:
            userType = "patient"
        }

        setUserType(userType)
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  const getSidebarItems = (): SidebarItem[] => {
    switch (userType) {
      case "doctor":
        return [
          {
            id: "profile",
            label: "Профиль",
            icon: User,
            color: "from-indigo-500 to-purple-500",
            href: "/dashboard/doctor/profile"
          },
          {
            id: "doctors",
            label: "Врачи",
            icon: Stethoscope,
            color: "from-emerald-500 to-teal-500",
            href: "/doctors"
          },
          {
            id: "ai-chat",
            label: "AI Авишифо",
            icon: Brain,
            color: "from-blue-500 to-purple-500",
            href: "/dashboard/doctor/ai-chat"
          },
          {
            id: "appointments",
            label: "Записи пациентов",
            icon: CalendarIcon,
            color: "from-teal-500 to-cyan-500",
            href: "/dashboard/doctor/appointments"
          },
          {
            id: "patients",
            label: "История Пациентов",
            icon: History,
            color: "from-green-500 to-emerald-500",
            href: "/dashboard/doctor/patients"
          },
          {
            id: "chat",
            label: "Чат",
            icon: MessageCircle,
            color: "from-orange-500 to-red-500",
            href: "/dashboard/doctor/chat"
          },
          {
            id: "who-standards",
            label: "Стандарты ВОЗ",
            icon: FileText,
            color: "from-blue-500 to-cyan-500",
            href: "/dashboard/doctor/who-standards"
          },
        ]
      case "patient":
        return [
          {
            id: "profile",
            label: "Профиль",
            icon: User,
            color: "from-indigo-500 to-purple-500",
            href: "/dashboard/patient/profile"
          },
          {
            id: "appointments",
            label: "Мои записи",
            icon: CalendarIcon,
            color: "from-teal-500 to-cyan-500",
            href: "/dashboard/patient/appointments"
          },
          {
            id: "doctors",
            label: "Врачи",
            icon: Stethoscope,
            color: "from-emerald-500 to-teal-500",
            href: "/doctors"
          },
          {
            id: "chat",
            label: "Чат",
            icon: MessageCircle,
            color: "from-orange-500 to-red-500",
            href: "/dashboard/patient/chat"
          },
          {
            id: "documents",
            label: "Документы",
            icon: FileText,
            color: "from-blue-500 to-cyan-500",
            href: "/dashboard/patient/documents"
          },
        ]
      case "super-admin":
        return [
          { 
            id: "overview", 
            label: "Обзор", 
            icon: BarChart3, 
            color: "from-blue-600 to-cyan-600",
            href: "/dashboard/super-admin"
          },
          { 
            id: "crm", 
            label: "CRM", 
            icon: Users, 
            color: "from-purple-600 to-pink-600",
            href: "/dashboard/super-admin/crm"
          },
          { 
            id: "chat", 
            label: "Чат Центр", 
            icon: MessageCircle, 
            color: "from-green-600 to-emerald-600",
            href: "/dashboard/super-admin/chat"
          },
          { 
            id: "observation", 
            label: "Полное Наблюдение", 
            icon: Eye, 
            color: "from-orange-600 to-red-600",
            href: "/dashboard/super-admin/observation"
          },
          { 
            id: "requests", 
            label: "Мониторинг Запросов", 
            icon: Activity, 
            color: "from-emerald-500 to-teal-500",
            href: "/dashboard/super-admin/requests"
          },
        ]
      default:
        return []
    }
  }

  const sidebarItems = getSidebarItems()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const getRoleLabel = () => {
    switch (userType) {
      case "doctor":
        return "Панель Доктора"
      case "patient":
        return "Панель Пациента"
      case "super-admin":
        return "Супер Админ"
      default:
        return "Панель управления"
    }
  }

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
        <div className="p-6 flex h-full flex-col justify-between">
          <div>
            {/* Header / Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AviShifo
                </h1>
                <p className="text-sm text-gray-500">{getRoleLabel()}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start h-12 text-sm font-medium ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:opacity-95`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                  } transition-all duration-200 rounded-xl group`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 ${activeSection === item.id ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`}
                  />
                  {item.label}
                  {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
                </Button>
              ))}
            </nav>
          </div>

          {/* Footer with Logout and Help */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm px-2 py-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm px-2 py-1.5"
                onClick={() => alert("Страница помощи в разработке.")}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Помощь</span>
              </Button>
            </div>
            <div className="text-center mt-3">
              <p className="text-xs text-gray-400">AviShifo v2.1 © 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
