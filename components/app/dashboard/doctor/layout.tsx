"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronRight, Activity, LogOut, HelpCircle, User, Stethoscope, Brain, History, CalendarIcon, MessageCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"

import { API_CONFIG } from "../../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

interface SidebarItem {
  id: string
  label: string
  icon: any
  color: string
  href: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: "profile",
    label: "Профиль",
    icon: User,
    color: "from-indigo-500 to-purple-500",
    href: "/dashboard/doctor/profile",
  },
  {
    id: "ai-chat",
    label: "AI",
    icon: Brain,
    color: "from-blue-500 to-purple-500",
    href: "/dashboard/doctor/ai",
  },
  {
    id: "doctors",
    label: "Врачи",
    icon: Stethoscope,
    color: "from-emerald-500 to-teal-500",
    href: "/under-construction",
  },
  {
    id: "appointments",
    label: "Записи пациентов",
    icon: CalendarIcon,
    color: "from-teal-500 to-cyan-500",
    href: "/under-construction",
  },
  {
    id: "patients",
    label: "История Пациентов",
    icon: History,
    color: "from-green-500 to-emerald-500",
    href: "/under-construction",
  },
  {
    id: "chat",
    label: "Чат",
    icon: MessageCircle,
    color: "from-orange-500 to-red-500",
    href: "/under-construction",
  },
  {
    id: "who-standards",
    label: "Стандарты ВОЗ",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    href: "/under-construction",
  },
]


export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("profile")

  useEffect(() => {
    // Check if user is authenticated and is a doctor
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

        if (userData.user_type !== "doctor") {
          console.error("User is not a doctor")
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
                <p className="text-sm text-gray-500">Панель Доктора</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start h-12 text-sm font-medium ${activeSection === item.id
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
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
