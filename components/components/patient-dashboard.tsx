"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Heart,
  MessageCircle,
  Calendar,
  Activity,
  Clock,
  Pill,
  FileText,
  Phone,
  Video,
  Send,
  Lock,
  Unlock,
  Bell,
  Home,
  Settings,
  Menu,
  X,
  Target,
  Stethoscope,
  Plus,
  TrendingUp,
  AlertCircle,
  Check,
  Search,
  ChevronRight,
  BarChart3,
  FileBarChart,
  Zap,
  Sparkles,
  UserCircle,
  LogOut,
  HelpCircle,
  MoreHorizontal,
  RefreshCw,
  CheckCircle,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import PatientAppointments from "@/components/patient-appointments"
import PatientDoctorsSection from "@/components/patient-doctors-section"

// Обновим интерфейс PatientDashboardProps, чтобы он принимал данные пользователя
interface PatientDashboardProps {
  onLogout: () => void
  userData?: any // Данные пользователя из API
}

// Обновим функцию PatientDashboard, чтобы использовать данные пользователя
export default function PatientDashboard({ onLogout, userData = {} }: PatientDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [medicalHistoryAccess, setMedicalHistoryAccess] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Получаем данные пользователя при монтировании компонента, если они не переданы
  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setUserProfile(userData)
    } else {
      fetchUserProfile()
    }
  }, [userData])

  // Функция для загрузки профиля пользователя из API
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found")
        return
      }

      const response = await fetch("https://new.avishifo.uz/api/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const data = await response.json()
      setUserProfile(data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Получаем имя пользователя для отображения
  const getUserDisplayName = () => {
    if (!userProfile) return "Пользователь"

    if (userProfile.full_name) return userProfile.full_name
    if (userProfile.first_name && userProfile.last_name) return `${userProfile.first_name} ${userProfile.last_name}`
    if (userProfile.first_name) return userProfile.first_name
    if (userProfile.username) return userProfile.username

    return "Пользователь"
  }

  // Получаем инициалы пользователя для аватара
  const getUserInitials = () => {
    if (!userProfile) return "П"

    if (userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`
    }

    if (userProfile.full_name) {
      const nameParts = userProfile.full_name.split(" ")
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`
      }
      return userProfile.full_name[0]
    }

    if (userProfile.first_name) return userProfile.first_name[0]
    if (userProfile.username) return userProfile.username[0]

    return "П"
  }

  const navigationItems = [
    { id: "dashboard", label: "Главная", icon: Home, color: "from-violet-500 to-indigo-500" },
    { id: "medical-history", label: "Мед. История", icon: FileText, color: "from-blue-500 to-cyan-500" },
    { id: "messages", label: "Сообщения", icon: MessageCircle, color: "from-green-500 to-emerald-500" },
    { id: "appointments", label: "Записи", icon: Calendar, color: "from-purple-500 to-indigo-500" },
    { id: "health-tracker", label: "Трекер Здоровья", icon: Activity, color: "from-teal-500 to-cyan-500" },
    { id: "medications", label: "Лекарства", icon: Pill, color: "from-red-500 to-pink-500" },
    { id: "profile", label: "Профиль", icon: UserCircle, color: "from-amber-500 to-orange-500" },
    { id: "settings", label: "Настройки", icon: Settings, color: "from-gray-500 to-slate-500" },
    { id: "doctors", label: "Врачи", icon: Stethoscope, color: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and User Info */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Heart className="w-6 h-6 text-white" />
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
              <Avatar className="w-14 h-14 border-2 border-white shadow-md">
                {userProfile?.profile_picture ? (
                  <AvatarImage src={userProfile.profile_picture || "/placeholder.svg"} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{getUserDisplayName()}</p>
                <p className="text-sm text-gray-500">
                  {userProfile?.user_type === "patient" ? "Пациент" : "Пользователь"}
                </p>
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-white/80 shadow-sm">
                  <Bell className="w-4 h-4" />
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
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12 ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } transition-all duration-200 rounded-xl`}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
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
                onClick={onLogout}
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

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm shadow-lg rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        <main className="max-w-7xl mx-auto p-4 lg:p-8">
          {activeSection === "dashboard" && <DashboardPage userProfile={userProfile} />}
          {activeSection === "medical-history" && (
            <MedicalHistoryPage
              medicalHistoryAccess={medicalHistoryAccess}
              setMedicalHistoryAccess={setMedicalHistoryAccess}
              userProfile={userProfile}
            />
          )}
          {activeSection === "messages" && <MessagesPage userProfile={userProfile} />}
          {activeSection === "appointments" && <AppointmentsPage userProfile={userProfile} />}
          {activeSection === "health-tracker" && <HealthTrackerPage userProfile={userProfile} />}
          {activeSection === "medications" && <MedicationsPage userProfile={userProfile} />}
          {activeSection === "profile" && <ProfilePage userProfile={userProfile} />}
          {activeSection === "settings" && <SettingsPage theme={theme} setTheme={setTheme} userProfile={userProfile} />}
          {activeSection === "doctors" && <DoctorsPage userProfile={userProfile} />}
        </main>
      </div>
    </div>
  )
}

// Обновим функцию DashboardPage, чтобы использовать данные пользователя
function DashboardPage({ userProfile }: { userProfile: any }) {
  // Получаем имя пользователя для отображения
  const getUserDisplayName = () => {
    if (!userProfile) return "Пользователь"

    if (userProfile.full_name) return userProfile.full_name.split(" ")[0]
    if (userProfile.first_name) return userProfile.first_name
    if (userProfile.username) return userProfile.username

    return "Пользователь"
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-none shadow-xl overflow-hidden">
        <CardContent className="p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {getUserDisplayName()}!</h1>
              <p className="text-indigo-100 text-lg">Как вы себя чувствуете сегодня?</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск по записям, лекарствам, врачам..."
          className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-md rounded-xl h-12"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-200/50">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-800">Написать Доктору</h3>
                <p className="text-blue-600 text-sm">Доктор Джонсон доступен</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-200/50">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-purple-800">Записаться на Прием</h3>
                <p className="text-purple-600 text-sm">Сегодня 15:00 доступно</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-200/50">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">Обновить Показатели</h3>
                <p className="text-green-600 text-sm">Последнее: 2 дня назад</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Clock className="w-5 h-5 text-indigo-500" />
              Последняя Активность
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Новое сообщение от Dr. Джонсон</p>
                <p className="text-sm text-gray-500">2 часа назад</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md shadow-green-200/50">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Запись подтверждена</p>
                <p className="text-sm text-gray-500">Завтра в 15:00</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-md shadow-purple-200/50">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Напоминание о приеме лекарств</p>
                <p className="text-sm text-gray-500">Сегодня в 20:00</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              Показать все активности
            </Button>
          </CardFooter>
        </Card>

        {/* Health Summary */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Activity className="w-5 h-5 text-indigo-500" />
              Сводка Здоровья
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Давление</p>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
                </div>
                <p className="text-2xl font-bold text-teal-800">120/80</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Стабильно</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Пульс</p>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
                </div>
                <p className="text-2xl font-bold text-teal-800">72 уд/мин</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Стабильно</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Вес</p>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Стабильно</Badge>
                </div>
                <p className="text-2xl font-bold text-teal-800">58 кг</p>
                <div className="mt-2 flex items-center text-xs text-blue-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+0.5 кг за месяц</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Сон</p>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Хорошо</Badge>
                </div>
                <p className="text-2xl font-bold text-teal-800">7.5 ч</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+0.5ч к среднему</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-md shadow-teal-200/50">
                <BarChart3 className="w-4 h-4 mr-2" />
                Подробная Статистика
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Рекомендации для вас
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center mb-3 shadow-md shadow-indigo-200/50">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-indigo-800 mb-1">Повышение энергии</h3>
              <p className="text-sm text-indigo-600">Попробуйте 10-минутную утреннюю зарядку для повышения энергии</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-md shadow-amber-200/50">
                <FileBarChart className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-amber-800 mb-1">Анализы</h3>
              <p className="text-sm text-amber-600">Пора обновить общий анализ крови. Прошло 6 месяцев</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-md shadow-green-200/50">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-green-800 mb-1">Цель дня</h3>
              <p className="text-sm text-green-600">Выпейте не менее 2 литров воды сегодня</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Ближайшие Приемы
          </CardTitle>
          <Button variant="outline" size="sm" className="rounded-lg">
            <Plus className="w-4 h-4 mr-1" />
            Записаться
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-200/50">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800">Доктор Джонсон</h3>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Терапевт</Badge>
                </div>
                <p className="text-sm text-gray-600">Завтра, 15:00 - 15:30</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800">Доктор Петров</h3>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Кардиолог</Badge>
                </div>
                <p className="text-sm text-gray-600">Пятница, 10:00 - 10:45</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            Показать все записи
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function MedicalHistoryPage({
  medicalHistoryAccess,
  setMedicalHistoryAccess,
  userProfile,
}: {
  medicalHistoryAccess: boolean
  setMedicalHistoryAccess: (access: boolean) => void
  userProfile: any
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Медицинская История</h1>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${
            medicalHistoryAccess ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
          }`}
          onClick={() => setMedicalHistoryAccess(!medicalHistoryAccess)}
        >
          {medicalHistoryAccess ? (
            <>
              <Unlock className="w-4 h-4" />
              <span>Доступ Открыт</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Доступ Закрыт</span>
            </>
          )}
        </Button>
      </div>

      {!medicalHistoryAccess ? (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Доступ к медицинской истории закрыт</h2>
            <p className="text-gray-600 mb-6">
              Для просмотра вашей медицинской истории, пожалуйста, откройте доступ. Ваши данные защищены и доступны
              только вам и вашим врачам.
            </p>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-200/50"
              onClick={() => setMedicalHistoryAccess(true)}
            >
              <Unlock className="w-4 h-4 mr-2" />
              Открыть Доступ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Важная Информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <h3 className="font-medium text-red-800 mb-1">Аллергии</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-100 text-red-700 border-red-200">Пенициллин</Badge>
                    <Badge className="bg-red-100 text-red-700 border-red-200">Арахис</Badge>
                    <Badge className="bg-red-100 text-red-700 border-red-200">Пыльца</Badge>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h3 className="font-medium text-amber-800 mb-1">Хронические Заболевания</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">Астма</Badge>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">Мигрень</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                История Посещений
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-200/50 mt-1">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">Доктор Джонсон</h3>
                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Терапевт</Badge>
                      </div>
                      <span className="text-sm text-gray-500">15.05.2024</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Плановый осмотр. Жалобы на периодические головные боли и усталость.
                    </p>
                    <div className="bg-white/60 p-3 rounded-lg border border-indigo-100 text-sm">
                      <p className="font-medium text-gray-800 mb-1">Диагноз:</p>
                      <p className="text-gray-600">Переутомление, легкое обезвоживание</p>
                      <p className="font-medium text-gray-800 mt-2 mb-1">Рекомендации:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>Режим труда и отдыха</li>
                        <li>Увеличить потребление воды до 2л в день</li>
                        <li>Витаминный комплекс (назначен)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50 mt-1">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">Доктор Петров</h3>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Кардиолог</Badge>
                      </div>
                      <span className="text-sm text-gray-500">03.04.2024</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Консультация кардиолога. Жалобы на периодические боли в области сердца.
                    </p>
                    <div className="bg-white/60 p-3 rounded-lg border border-blue-100 text-sm">
                      <p className="font-medium text-gray-800 mb-1">Диагноз:</p>
                      <p className="text-gray-600">Функциональная кардиалгия</p>
                      <p className="font-medium text-gray-800 mt-2 mb-1">Рекомендации:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>ЭКГ (результаты в норме)</li>
                        <li>Снижение стрессовых нагрузок</li>
                        <li>Контроль АД</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Показать полную историю
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart className="w-5 h-5 text-indigo-500" />
                Результаты Анализов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">Общий анализ крови</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
                    </div>
                    <span className="text-sm text-gray-500">10.05.2024</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Просмотреть результаты
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">Биохимический анализ крови</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
                    </div>
                    <span className="text-sm text-gray-500">10.05.2024</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Просмотреть результаты
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">Анализ на гормоны щитовидной железы</h3>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">Небольшие отклонения</Badge>
                    </div>
                    <span className="text-sm text-gray-500">15.04.2024</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Просмотреть результаты
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Показать все анализы
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

function MessagesPage({ userProfile }: { userProfile: any }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Сообщения</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Контакты</CardTitle>
              <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск контактов..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm rounded-xl"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 cursor-pointer">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Доктор Джонсон</p>
                  <span className="text-xs text-gray-500">12:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">Как вы себя чувствуете сегодня?</p>
                  <Badge className="bg-indigo-500 text-white border-indigo-600">2</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">DP</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Доктор Петров</p>
                  <span className="text-xs text-gray-500">Вчера</span>
                </div>
                <p className="text-sm text-gray-500 truncate">Результаты анализов готовы</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  МС
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Медсестра Светлана</p>
                  <span className="text-xs text-gray-500">Пн</span>
                </div>
                <p className="text-sm text-gray-500 truncate">Напоминаем о записи на прием</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">ДИ</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Доктор Иванова</p>
                  <span className="text-xs text-gray-500">23.05</span>
                </div>
                <p className="text-sm text-gray-500 truncate">Спасибо за визит</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl lg:col-span-2">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    DJ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">Доктор Джонсон</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Онлайн</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[400px] overflow-y-auto space-y-4">
            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">Здравствуйте, Сара! Как вы себя чувствуете сегодня?</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:15</p>
              </div>
            </div>

            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[80%]">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-t-xl rounded-l-xl text-white">
                  <p>Здравствуйте, доктор! В целом хорошо, но иногда беспокоят головные боли.</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">10:17</p>
              </div>
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                  SJ
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Понимаю. Как часто возникают головные боли? Есть ли какие-то триггеры, которые их вызывают?
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:20</p>
              </div>
            </div>

            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[80%]">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-t-xl rounded-l-xl text-white">
                  <p>
                    Примерно 2-3 раза в неделю. Обычно после долгой работы за компьютером или при недостатке сна. Иногда
                    помогает обычный анальгетик, но не всегда.
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">10:22</p>
              </div>
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                  SJ
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Спасибо за информацию. Это похоже на головные боли напряжения. Я рекомендую сделать перерывы каждые
                    45 минут работы за компьютером и выполнять простые упражнения для шеи и глаз.
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:25</p>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Также важно следить за режимом сна и питьевым режимом. Как вы себя чувствуете сегодня?
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:26</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Badge className="bg-gray-100 text-gray-600 border-gray-200">Сегодня 12:30</Badge>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Здравствуйте, Сара! Как вы себя чувствуете сегодня? Помогли ли мои рекомендации?
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">12:30</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex items-center gap-2 w-full">
              <Button variant="outline" size="icon" className="rounded-full">
                <Plus className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Введите сообщение..."
                className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm rounded-xl"
              />
              <Button size="icon" className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function AppointmentsPage({ userProfile }: { userProfile: any }) {
  return <PatientAppointments />
}

function HealthTrackerPage({ userProfile }: { userProfile: any }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Трекер Здоровья</h1>

      {/* Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md shadow-red-200/50">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Пульс</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">72</span>
              <span className="text-gray-500 mb-1">уд/мин</span>
            </div>
            <div className="mt-4">
              <Progress value={72} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Давление</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">120/80</span>
              <span className="text-gray-500 mb-1">мм рт.ст.</span>
            </div>
            <div className="mt-4">
              <Progress value={80} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>90/60</span>
                <span>120/80</span>
                <span>140/90</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-green-200/50">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Стабильно</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Вес</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">58</span>
              <span className="text-gray-500 mb-1">кг</span>
            </div>
            <div className="mt-4">
              <Progress value={58} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>40</span>
                <span>60</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md shadow-amber-200/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Хорошо</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Сон</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">7.5</span>
              <span className="text-gray-500 mb-1">часов</span>
            </div>
            <div className="mt-4">
              <Progress value={75} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Charts */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Динамика Показателей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Графики здоровья будут отображаться здесь</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Цели Здоровья
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-200/50">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-gray-800">Снижение веса</h3>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">В процессе</Badge>
            </div>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Прогресс</span>
                <span className="text-sm font-medium text-indigo-600">60%</span>
              </div>
              <Progress value={60} max={100} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Цель: 55 кг</span>
              <span className="text-gray-600">Текущий: 58 кг</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-green-200/50">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-gray-800">Физическая активность</h3>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Выполнено</Badge>
            </div>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Прогресс</span>
                <span className="text-sm font-medium text-green-600">100%</span>
              </div>
              <Progress value={100} max={100} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Цель: 10,000 шагов</span>
              <span className="text-gray-600">Текущий: 12,345 шагов</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-gray-800">Водный баланс</h3>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">В процессе</Badge>
            </div>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Прогресс</span>
                <span className="text-sm font-medium text-blue-600">75%</span>
              </div>
              <Progress value={75} max={100} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Цель: 2 литра</span>
              <span className="text-gray-600">Текущий: 1.5 литра</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-200/50">
            <Plus className="w-4 h-4 mr-2" />
            Добавить Новую Цель
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function MedicationsPage({ userProfile }: { userProfile: any }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Мои Лекарства</h1>

      {/* Current Medications */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-500" />
              Текущие Лекарства
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-200/50">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Витамин D3</h3>
                  <p className="text-sm text-gray-600">2000 МЕ, 1 раз в день</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Активно</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Утром с едой</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Принято
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Омега-3</h3>
                  <p className="text-sm text-gray-600">1000 мг, 2 раза в день</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Активно</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Утром и вечером с едой</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Принято
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md shadow-amber-200/50">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Магний B6</h3>
                  <p className="text-sm text-gray-600">100 мг, 1 раз в день</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Активно</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Вечером перед сном</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Принято
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication Schedule */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Расписание Приема
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <h3 className="font-medium text-gray-800 mb-3">Сегодня</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm shadow-indigo-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Витамин D3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Принято</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm shadow-blue-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Омега-3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Принято</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm shadow-blue-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Омега-3</p>
                      <p className="text-xs text-gray-600">20:00</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    <Check className="w-3 h-3 mr-1" />
                    Принять
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm shadow-amber-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Магний B6</p>
                      <p className="text-xs text-gray-600">22:00</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    <Check className="w-3 h-3 mr-1" />
                    Принять
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">Завтра</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm shadow-indigo-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Витамин D3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200">Ожидается</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm shadow-blue-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Омега-3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200">Ожидается</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication History */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            История Приема
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Май 2024</h3>
                <Badge className="bg-green-100 text-green-700 border-green-200">98% выполнено</Badge>
              </div>
              <Progress value={98} max={100} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                Пропущен прием Магния B6 (15 мая) из-за поездки. Все остальные приемы выполнены по расписанию.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Апрель 2024</h3>
                <Badge className="bg-green-100 text-green-700 border-green-200">100% выполнено</Badge>
              </div>
              <Progress value={100} max={100} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">Все приемы лекарств выполнены по расписанию.</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Март 2024</h3>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">92% выполнено</Badge>
              </div>
              <Progress value={92} max={100} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                Пропущены приемы Витамина D3 (3, 4, 5 марта) из-за болезни. Остальные приемы выполнены по расписанию.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            Показать полную историю
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Обновим функцию ProfilePage, чтобы использовать данные пользователя
function ProfilePage({ userProfile }: { userProfile: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
  })

  // Инициализируем форму данными пользователя при их получении
  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        email: userProfile.email || "",
        phone_number: userProfile.phone_number || "",
        address: userProfile.address || "",
        date_of_birth: userProfile.date_of_birth || "",
      })
    }
  }, [userProfile])

  // Получаем имя пользователя для отображения
  const getUserDisplayName = () => {
    if (!userProfile) return "Пользователь"

    if (userProfile.full_name) return userProfile.full_name
    if (userProfile.first_name && userProfile.last_name) return `${userProfile.first_name} ${userProfile.last_name}`
    if (userProfile.first_name) return userProfile.first_name
    if (userProfile.username) return userProfile.username

    return "Пользователь"
  }

  // Получаем инициалы пользователя для аватара
  const getUserInitials = () => {
    if (!userProfile) return "П"

    if (userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`
    }

    if (userProfile.full_name) {
      const nameParts = userProfile.full_name.split(" ")
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`
      }
      return userProfile.full_name[0]
    }

    if (userProfile.first_name) return userProfile.first_name[0]
    if (userProfile.username) return userProfile.username[0]

    return "П"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found")
        return
      }

      const response = await fetch("https://new.avishifo.uz/api/accounts/profile/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Обновляем данные пользователя после успешного сохранения
      const updatedData = await response.json()
      // Здесь можно обновить userProfile, если есть функция для этого

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных профиля...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Мой Профиль</h1>

      {/* Profile Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="text-center">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl mx-auto">
                {userProfile.profile_picture ? (
                  <AvatarImage src={userProfile.profile_picture || "/placeholder.svg"} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-4xl">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="mt-4 space-y-2">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-md shadow-indigo-200/50 rounded-xl">
                  Изменить фото
                </Button>
                <Button variant="outline" className="w-full rounded-xl">
                  Удалить фото
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <Input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
                  <Input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                    disabled={!isEditing}
                  >
                    <option value="female">Женский</option>
                    <option value="male">Мужской</option>
                    <option value="other">Другой</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>

              <div className="pt-4 flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50"
                      onClick={handleSave}
                    >
                      Сохранить изменения
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={() => setIsEditing(false)}>
                      Отменить
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50"
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать профиль
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Медицинская Информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Аллергии</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-100 text-red-700 border-red-200">Пенициллин</Badge>
              <Badge className="bg-red-100 text-red-700 border-red-200">Арахис</Badge>
              <Badge className="bg-red-100 text-red-700 border-red-200">Пыльца</Badge>
              <Button variant="outline" size="sm" className="rounded-full h-6 px-3">
                <Plus className="w-3 h-3 mr-1" />
                Добавить
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Хронические заболевания</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Астма</Badge>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Мигрень</Badge>
              <Button variant="outline" size="sm" className="rounded-full h-6 px-3">
                <Plus className="w-3 h-3 mr-1" />
                Добавить
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Группа крови</h3>
            <select className="w-full md:w-1/3 p-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
              <option>A+ (II положительная)</option>
              <option>A- (II отрицательная)</option>
              <option>B+ (III положительная)</option>
              <option>B- (III отрицательная)</option>
              <option>AB+ (IV положительная)</option>
              <option>AB- (IV отрицательная)</option>
              <option>O+ (I положительная)</option>
              <option>O- (I отрицательная)</option>
            </select>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Экстренные контакты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">Джон Джонсон</p>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Муж</Badge>
                </div>
                <p className="text-sm text-gray-600">+7 (900) 987-65-43</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">Мария Смит</p>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Сестра</Badge>
                </div>
                <p className="text-sm text-gray-600">+7 (900) 111-22-33</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-2 rounded-xl">
              <Plus className="w-4 h-4 mr-1" />
              Добавить контакт
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50">
            Сохранить медицинскую информацию
          </Button>
        </CardFooter>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Настройки Приватности
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Доступ к медицинской истории</p>
              <p className="text-sm text-gray-600">Разрешить врачам видеть вашу полную медицинскую историю</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Уведомления о приеме лекарств</p>
              <p className="text-sm text-gray-600">Получать напоминания о приеме лекарств</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Анонимная статистика</p>
              <p className="text-sm text-gray-600">Разрешить использовать анонимные данные для улучшения сервиса</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Двухфакторная аутентификация</p>
              <p className="text-sm text-gray-600">Дополнительный уровень защиты для вашего аккаунта</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50">
            Сохранить настройки приватности
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function SettingsPage({
  theme,
  setTheme,
  userProfile,
}: {
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  userProfile: any
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Настройки</h1>
          <p className="text-gray-600">Управление настройками приложения</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              Общие Настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Shield className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Конфиденциальность</p>
                  <p className="text-sm text-gray-500">Управление доступом к данным</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Bell className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Уведомления</p>
                  <p className="text-sm text-gray-500">Настройка напоминаний</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Clock className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">История активности</p>
                  <p className="text-sm text-gray-500">Просмотр всех действий</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-indigo-500" />
              Аккаунт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Lock className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Изменить пароль</p>
                  <p className="text-sm text-gray-500">Обновить пароль аккаунта</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Shield className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Двухфакторная аутентификация</p>
                  <p className="text-sm text-gray-500">Дополнительная защита</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl bg-white"
              >
                <AlertCircle className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Удалить аккаунт</p>
                  <p className="text-sm text-gray-500">Безвозвратное удаление</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Preferences */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Предпочтения Приложения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Язык интерфейса</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
                  <option>Русский</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Часовой пояс</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
                  <option>GMT+3 (Москва)</option>
                  <option>GMT+0 (UTC)</option>
                  <option>GMT-5 (EST)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тема оформления</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Темная</option>
                  <option value="system">Автоматически</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Формат даты</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
                  <option>ДД.ММ.ГГГГ</option>
                  <option>ММ/ДД/ГГГГ</option>
                  <option>ГГГГ-ММ-ДД</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-md shadow-indigo-200/50 rounded-xl">
              Сохранить Настройки
            </Button>
            <Button variant="outline" className="rounded-xl">
              Сбросить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Обновленная функция DoctorsPage, которая использует PatientDoctorsSection для загрузки данных из API
function DoctorsPage({ userProfile }: { userProfile: any }) {
  return <PatientDoctorsSection userProfile={userProfile} />
}

// New Patient Appointments Section Component
function PatientAppointmentsSection() {
  return <PatientAppointments />
}
