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

  // Main content area - no sidebar needed since layout provides it
  // This component now only shows the dashboard overview content
  return (
    <div className="w-full">
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
      <div className="relative mt-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск по записям, лекарствам, врачам..."
          className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-md rounded-xl h-12"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
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
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl mt-8">
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
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl mt-8">
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
