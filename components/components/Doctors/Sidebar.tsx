"use client"
import { ChevronRight, Activity, LogOut, HelpCircle, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

interface SidebarProps {
  sidebarItems: SidebarItem[]
  activeSection: string
  setActiveSection: (sectionId: string) => void
  onLogout: () => void
}

export function Sidebar({ sidebarItems, activeSection, setActiveSection, onLogout }: SidebarProps) {
  return (
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
                className={`w-full justify-start h-12 text-sm font-medium ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:opacity-95`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                } transition-all duration-200 rounded-xl group`}
                onClick={() => {
                  setActiveSection(item.id)
                }}
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
              onClick={onLogout}
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
  )
}
