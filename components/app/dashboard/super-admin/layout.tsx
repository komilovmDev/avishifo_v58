"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Shield, LogOut, HelpCircle, ChevronRight, Users, MessageSquare, Eye, BarChart3, Activity } from "lucide-react"
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
    icon: MessageSquare, 
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

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    // Check if user is authenticated and is a super-admin
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

        if (userData.user_type !== "super_admin" && userData.user_type !== "admin") {
          console.error("User is not a super-admin")
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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8 mt-12 lg:mt-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AviShifo
                </h1>
                <p className="text-sm text-gray-500">Супер Админ</p>
              </div>
            </div>
            <nav className="space-y-3">
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
            </nav>
          </div>
          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-indigo-600 flex items-center gap-2"
              >
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
