"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, LogOut, HelpCircle } from "lucide-react"

interface NavigationProps {
  userType: "doctor" | "patient" | "super-admin"
  onLogout: () => void
}

export function Navigation({ userType, onLogout }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getNavigationItems = () => {
    switch (userType) {
      case "doctor":
        return [
          { label: "Профиль", href: "/dashboard/doctor/profile" },
          { label: "AI Авишифо", href: "/dashboard/doctor/ai-chat" },
          { label: "Записи пациентов", href: "/dashboard/doctor/appointments" },
          { label: "История Пациентов", href: "/dashboard/doctor/patients" },
          { label: "Врачи", href: "/doctors" },
        ]
      case "patient":
        return [
          { label: "Профиль", href: "/dashboard/patient/profile" },
          { label: "Мои записи", href: "/dashboard/patient/appointments" },
          { label: "Врачи", href: "/doctors" },
        ]
      case "super-admin":
        return [
          { label: "Обзор", href: "/dashboard/super-admin" },
          { label: "CRM", href: "/dashboard/super-admin/crm" },
          { label: "Чат Центр", href: "/dashboard/super-admin/chat" },
          { label: "Полное Наблюдение", href: "/dashboard/super-admin/observation" },
          { label: "Мониторинг Запросов", href: "/dashboard/super-admin/requests" },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  // Разрешаем только "Профиль" и "AI Авишифо"
  const isEnabledItem = (label: string) =>
    label === "Профиль" || label === "AI Авишифо"

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">AviShifo</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigationItems.map((item) => {
                const enabled = isEnabledItem(item.label)
                const isActive = enabled && pathname === item.href

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    className={
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }
                    onClick={() => {
                      if (enabled) {
                        router.push(item.href)
                      } else {
                        router.push("/404") // 🔗 всё остальное ведёт на 404
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert("Страница помощи в разработке.")}
              className="text-gray-500 hover:text-indigo-600"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Помощь
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
