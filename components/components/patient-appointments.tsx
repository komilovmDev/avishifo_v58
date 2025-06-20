"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Calendar,
  Phone,
  Mail,
  XCircle,
  MessageSquare,
  Search,
  ChevronDown,
  Send,
  RefreshCw,
  Plus,
  Star,
  CalendarDays,
  ChevronRight,
  Award,
  Heart,
  Stethoscope,
  Brain,
  Bone,
  Baby,
  Activity,
  Scissors,
  AmbulanceIcon as FirstAid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

const API_BASE_URL = "https://new.avishifo.uz"

interface DoctorType {
  id: number
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    full_name: string
    phone_number: string
    profile_picture: string | null
  }
  doctor_id: string
  specialty: string
  license_number: string
  hospital: {
    id: number
    name: string
  }
  years_of_experience: number
  education: string
  certifications: string
  consultation_fee: string
  is_available: boolean
  rating: string
  created_at: string
  updated_at: string
}

interface AppointmentType {
  id: number
  patient_name: string
  patient_age: number | null
  patient_phone: string
  patient_email: string
  doctor_name: string
  requested_date: string
  requested_time: string
  reason: string
  description: string
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled"
  priority: "low" | "normal" | "high" | "urgent"
  patient_history_notes: string
  confirmed_at: string | null
  rejected_at: string | null
  rejection_reason: string
  created_at: string
  updated_at: string
}

interface NewAppointmentType {
  doctor: number
  requested_date: string
  requested_time: string
  reason: string
  description: string
  priority: "low" | "normal" | "high" | "urgent"
  patient_phone: string
  patient_email: string
  patient_history_notes: string
}

interface SpecialtyType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  doctorsCount: number
}

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState("my-appointments")
  const [doctorsViewMode, setDoctorsViewMode] = useState<"list" | "categories" | "recommended">("categories")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [doctors, setDoctors] = useState<DoctorType[]>([])
  const [recommendedDoctors, setRecommendedDoctors] = useState<DoctorType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null)
  const [newAppointment, setNewAppointment] = useState<NewAppointmentType>({
    doctor: 0,
    requested_date: "",
    requested_time: "",
    reason: "",
    description: "",
    priority: "normal",
    patient_phone: "",
    patient_email: "",
    patient_history_notes: "",
  })
  const { toast } = useToast()

  // Определение специальностей с иконками и цветами
  const specialties: SpecialtyType[] = [
    {
      id: "cardiology",
      name: "Кардиология",
      description: "Заболевания сердца и сосудов",
      icon: <Heart className="w-7 h-7 text-white" />,
      color: "from-red-500 to-pink-500",
      doctorsCount: 0,
    },
    {
      id: "dermatology",
      name: "Дерматология",
      description: "Заболевания кожи",
      icon: <Activity className="w-7 h-7 text-white" />,
      color: "from-green-500 to-emerald-500",
      doctorsCount: 0,
    },
    {
      id: "neurology",
      name: "Неврология",
      description: "Заболевания нервной системы",
      icon: <Brain className="w-7 h-7 text-white" />,
      color: "from-purple-500 to-indigo-500",
      doctorsCount: 0,
    },
    {
      id: "orthopedics",
      name: "Ортопедия",
      description: "Заболевания опорно-двигательного аппарата",
      icon: <Bone className="w-7 h-7 text-white" />,
      color: "from-blue-500 to-cyan-500",
      doctorsCount: 0,
    },
    {
      id: "pediatrics",
      name: "Педиатрия",
      description: "Детская медицина",
      icon: <Baby className="w-7 h-7 text-white" />,
      color: "from-yellow-500 to-orange-500",
      doctorsCount: 0,
    },
    {
      id: "psychiatry",
      name: "Психиатрия",
      description: "Психическое здоровье",
      icon: <Brain className="w-7 h-7 text-white" />,
      color: "from-teal-500 to-cyan-500",
      doctorsCount: 0,
    },
    {
      id: "radiology",
      name: "Радиология",
      description: "Диагностика с помощью визуализации",
      icon: <Activity className="w-7 h-7 text-white" />,
      color: "from-violet-500 to-purple-500",
      doctorsCount: 0,
    },
    {
      id: "surgery",
      name: "Хирургия",
      description: "Хирургические вмешательства",
      icon: <Scissors className="w-7 h-7 text-white" />,
      color: "from-pink-500 to-rose-500",
      doctorsCount: 0,
    },
    {
      id: "general",
      name: "Общая медицина",
      description: "Терапия и общая практика",
      icon: <FirstAid className="w-7 h-7 text-white" />,
      color: "from-blue-500 to-indigo-500",
      doctorsCount: 0,
    },
  ]

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("accessToken")
  }

  // API request helper
  const apiRequest = async (url: string, options: any = {}) => {
    const token = getAuthToken()
    return axios({
      url: `${API_BASE_URL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })
  }

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await apiRequest("/api/appointments/appointments/")
      setAppointments(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить записи",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Обновим функцию fetchDoctors для обработки специальностей и рекомендуемых врачей
  const fetchDoctors = async () => {
    try {
      setLoading(true)
      // Правильный URL согласно вашему бэкенду
      const response = await apiRequest("/api/doctors/")
      console.log("Doctors API response:", response.data)

      // Получаем данные и добавляем в консоль подробную информацию о каждом докторе
      const doctorsData = response.data.results || response.data
      console.log(
        "Doctors data details:",
        doctorsData.map((d) => ({
          id: d.id,
          name: d.user?.full_name || "Unnamed",
          specialty: d.specialty,
        })),
      )

      // Устанавливаем полученных докторов в состояние
      setDoctors(doctorsData)

      // Обновляем количество докторов по специальностям
      const updatedSpecialties = [...specialties]
      doctorsData.forEach((doctor) => {
        const specialtyIndex = updatedSpecialties.findIndex((s) => s.id === doctor.specialty)
        if (specialtyIndex !== -1) {
          updatedSpecialties[specialtyIndex].doctorsCount++
        }
      })

      // Выбираем рекомендуемых врачей (с наивысшим рейтингом)
      const sortedDoctors = [...doctorsData].sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
      setRecommendedDoctors(sortedDoctors.slice(0, 3))

      if (doctorsData.length > 0) {
        toast({
          title: "Успешно",
          description: `Загружено ${doctorsData.length} докторов`,
        })
      } else {
        toast({
          title: "Внимание",
          description: "Список докторов пуст. Обратитесь к администратору.",
          variant: "warning",
        })
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список докторов",
        variant: "destructive",
      })

      // Если API не работает, используем пустой список
      setDoctors([])
      setRecommendedDoctors([])
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [])

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchAppointments(), fetchDoctors()])
    setRefreshing(false)
    toast({
      title: "Обновлено",
      description: "Данные успешно обновлены",
    })
  }

  // Create new appointment
  const handleCreateAppointment = async () => {
    try {
      if (
        !newAppointment.doctor ||
        !newAppointment.requested_date ||
        !newAppointment.requested_time ||
        !newAppointment.reason
      ) {
        toast({
          title: "Ошибка",
          description: "Заполните все обязательные поля",
          variant: "destructive",
        })
        return
      }

      // Получаем информацию о выбранном докторе для отображения в уведомлении
      const selectedDoctorInfo = doctors.find((d) => d.id === newAppointment.doctor)
      const doctorName = selectedDoctorInfo ? selectedDoctorInfo.user.full_name : "выбранному врачу"

      console.log("Отправляемые данные:", {
        ...newAppointment,
        doctor_id: newAppointment.doctor, // Логируем ID доктора
      })

      try {
        await apiRequest("/api/appointments/appointments/", {
          method: "POST",
          data: newAppointment,
        })

        toast({
          title: "Успешно",
          description: `Запись к ${doctorName} создана и отправлена на рассмотрение`,
        })

        setShowNewAppointmentDialog(false)
        setNewAppointment({
          doctor: 0,
          requested_date: "",
          requested_time: "",
          reason: "",
          description: "",
          priority: "normal",
          patient_phone: "",
          patient_email: "",
          patient_history_notes: "",
        })
        setSelectedDoctor(null)
        await fetchAppointments()
      } catch (error: any) {
        console.error("API Error details:", error.response?.data)

        // Проверяем специфическую ошибку с докторами
        if (error.response?.data?.doctor && Array.isArray(error.response.data.doctor)) {
          const doctorError = error.response.data.doctor[0]
          if (doctorError.includes("Invalid pk") && doctorError.includes("object does not exist")) {
            toast({
              title: "Ошибка с выбором доктора",
              description: "Выбранный доктор недоступен или был удален. Пожалуйста, выберите другого доктора.",
              variant: "destructive",
            })
            // Обновим список докторов
            fetchDoctors()
            return
          }
        }

        throw error // пробрасываем ошибку дальше если это другая ошибка
      }
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать запись. Пожалуйста, попробуйте еще раз позже.",
        variant: "destructive",
      })
    }
  }

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await apiRequest(`/api/appointments/appointments/${appointmentId}/`, {
        method: "PATCH",
        data: { status: "cancelled" },
      })

      toast({
        title: "Успешно",
        description: "Запись отменена",
      })

      await fetchAppointments()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось отменить запись",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает"
      case "confirmed":
        return "Подтверждено"
      case "rejected":
        return "Отклонено"
      case "completed":
        return "Завершено"
      case "cancelled":
        return "Отменено"
      default:
        return status
    }
  }

  const getSpecialtyLabel = (specialty: string) => {
    const specialtyMap: { [key: string]: string } = {
      cardiology: "Кардиология",
      dermatology: "Дерматология",
      neurology: "Неврология",
      orthopedics: "Ортопедия",
      pediatrics: "Педиатрия",
      psychiatry: "Психиатрия",
      radiology: "Радиология",
      surgery: "Хирургия",
      general: "Общая медицина",
    }
    return specialtyMap[specialty] || specialty
  }

  const getSpecialtyIcon = (specialty: string) => {
    const found = specialties.find((s) => s.id === specialty)
    return found ? found.icon : <Stethoscope className="w-7 h-7 text-white" />
  }

  const getSpecialtyColor = (specialty: string) => {
    const found = specialties.find((s) => s.id === specialty)
    return found ? found.color : "from-blue-500 to-indigo-500"
  }

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSpecialtyLabel(doctor.specialty).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const doctorsByCategory = selectedCategory
    ? doctors.filter((doctor) => doctor.specialty === selectedCategory)
    : doctors

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Загрузка записей...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Записи на Прием
            </h2>
            <p className="text-gray-500 text-lg">Управление вашими записями к врачам</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="h-12 rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Обновить
          </Button>
          <Button
            onClick={() => setShowNewAppointmentDialog(true)}
            className="h-12 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-md shadow-indigo-200/50 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Новая Запись
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск записей или врачей..."
          className="pl-12 w-full h-12 rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full h-14 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-2 shadow-inner">
          <TabsTrigger
            value="my-appointments"
            className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 transition-all duration-200"
          >
            Мои Записи ({filteredAppointments.length})
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 transition-all duration-200"
          >
            Врачи ({filteredDoctors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-appointments" className="mt-8">
          <div className="space-y-6">
            {filteredAppointments.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200/50 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">Записей не найдено</h3>
                  <p className="text-gray-500 text-lg mb-6">У вас пока нет записей к врачам</p>
                  <Button
                    onClick={() => setShowNewAppointmentDialog(true)}
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-md shadow-indigo-200/50 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать Запись
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="doctors" className="mt-8">
          {/* Doctors View Mode Selector */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Наши Врачи</h2>
            <div className="flex gap-2">
              <Button
                variant={doctorsViewMode === "categories" ? "default" : "outline"}
                size="sm"
                onClick={() => setDoctorsViewMode("categories")}
                className="rounded-lg"
              >
                Специализации
              </Button>
              <Button
                variant={doctorsViewMode === "recommended" ? "default" : "outline"}
                size="sm"
                onClick={() => setDoctorsViewMode("recommended")}
                className="rounded-lg"
              >
                Рекомендуемые
              </Button>
              <Button
                variant={doctorsViewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setDoctorsViewMode("list")}
                className="rounded-lg"
              >
                Все врачи
              </Button>
            </div>
          </div>

          {/* Categories View */}
          {doctorsViewMode === "categories" && !selectedCategory && (
            <div>
              <p className="text-gray-600 mb-6">Выберите специалиста для консультации</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialties.map((category) => {
                  // Подсчитываем количество докторов для каждой специальности
                  const doctorsCount = doctors.filter((doctor) => doctor.specialty === category.id).length
                  if (doctorsCount === 0) return null // Не показываем категории без докторов

                  return (
                    <Card
                      key={category.id}
                      className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className={`h-1 bg-gradient-to-r ${category.color}`}></div>
                      <CardContent className="p-6 relative">
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                        ></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                            >
                              {category.icon}
                            </div>
                            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              {doctorsCount} врачей
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{category.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Доступно врачей: {doctorsCount}</span>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Selected Category View */}
          {doctorsViewMode === "categories" && selectedCategory && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" onClick={() => setSelectedCategory(null)} className="rounded-xl">
                  ← Назад к категориям
                </Button>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{getSpecialtyLabel(selectedCategory)}</h3>
                  <p className="text-gray-600">{specialties.find((s) => s.id === selectedCategory)?.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctorsByCategory.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">Врачи не найдены</h3>
                    <p className="text-gray-500 text-lg mb-6">В данной категории нет доступных врачей</p>
                    <Button onClick={() => setSelectedCategory(null)} variant="outline" className="rounded-xl">
                      Вернуться к категориям
                    </Button>
                  </div>
                ) : (
                  doctorsByCategory.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      getSpecialtyLabel={getSpecialtyLabel}
                      getSpecialtyColor={getSpecialtyColor}
                      onBookAppointment={(doctor) => {
                        setSelectedDoctor(doctor)
                        setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
                        setShowNewAppointmentDialog(true)
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Recommended Doctors View */}
          {doctorsViewMode === "recommended" && (
            <div>
              <p className="text-gray-600 mb-6">Врачи с наивысшим рейтингом и отзывами</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedDoctors.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">Рекомендации недоступны</h3>
                    <p className="text-gray-500 text-lg mb-6">Пока нет рекомендуемых врачей</p>
                    <Button onClick={handleRefresh} variant="outline" className="rounded-xl">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Обновить
                    </Button>
                  </div>
                ) : (
                  recommendedDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      getSpecialtyLabel={getSpecialtyLabel}
                      getSpecialtyColor={getSpecialtyColor}
                      onBookAppointment={(doctor) => {
                        setSelectedDoctor(doctor)
                        setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
                        setShowNewAppointmentDialog(true)
                      }}
                      recommended
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* All Doctors List View */}
          {doctorsViewMode === "list" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">Врачи не найдены</h3>
                  <p className="text-gray-500 text-lg mb-6">Попробуйте обновить данные</p>
                  <Button onClick={handleRefresh} variant="outline" className="rounded-xl">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Обновить
                  </Button>
                </div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    getSpecialtyLabel={getSpecialtyLabel}
                    getSpecialtyColor={getSpecialtyColor}
                    onBookAppointment={(doctor) => {
                      setSelectedDoctor(doctor)
                      setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
                      setShowNewAppointmentDialog(true)
                    }}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
        <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white to-gray-50/50 border-gray-200/50 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {selectedDoctor ? `Запись к ${selectedDoctor.user.full_name}` : "Новая Запись"}
              </DialogTitle>
            </div>
            {selectedDoctor && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                    <AvatarImage src={selectedDoctor.user.profile_picture || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-violet-500 text-white font-bold">
                      {selectedDoctor.user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-indigo-800">{selectedDoctor.user.full_name}</h4>
                    <p className="text-indigo-600">{getSpecialtyLabel(selectedDoctor.specialty)}</p>
                    <p className="text-sm text-indigo-500">Опыт: {selectedDoctor.years_of_experience} лет</p>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-6 pt-6">
            {!selectedDoctor && (
              <div>
                <Label htmlFor="doctor" className="text-sm font-bold text-gray-700 mb-3 block">
                  Выберите врача *
                </Label>
                <Select
                  value={newAppointment.doctor.toString()}
                  onValueChange={(value) => {
                    const doctorId = Number.parseInt(value)
                    setNewAppointment((prev) => ({ ...prev, doctor: doctorId }))
                    setSelectedDoctor(doctors.find((d) => d.id === doctorId) || null)
                  }}
                >
                  <SelectTrigger className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                    <SelectValue placeholder="Выберите врача" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{doctor.user.full_name}</span>
                          <span className="text-gray-500">- {getSpecialtyLabel(doctor.specialty)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-bold text-gray-700 mb-3 block">
                  Дата *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.requested_date}
                  onChange={(e) => setNewAppointment((prev) => ({ ...prev, requested_date: e.target.value }))}
                  className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-bold text-gray-700 mb-3 block">
                  Время *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newAppointment.requested_time}
                  onChange={(e) => setNewAppointment((prev) => ({ ...prev, requested_time: e.target.value }))}
                  className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason" className="text-sm font-bold text-gray-700 mb-3 block">
                Причина обращения *
              </Label>
              <Input
                id="reason"
                placeholder="Например: Плановый осмотр, консультация..."
                value={newAppointment.reason}
                onChange={(e) => setNewAppointment((prev) => ({ ...prev, reason: e.target.value }))}
                className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-bold text-gray-700 mb-3 block">
                Описание симптомов
              </Label>
              <Textarea
                id="description"
                placeholder="Опишите ваши симптомы или вопросы..."
                value={newAppointment.description}
                onChange={(e) => setNewAppointment((prev) => ({ ...prev, description: e.target.value }))}
                className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority" className="text-sm font-bold text-gray-700 mb-3 block">
                  Приоритет
                </Label>
                <Select
                  value={newAppointment.priority}
                  onValueChange={(value: "low" | "normal" | "high" | "urgent") =>
                    setNewAppointment((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="normal">Обычный</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="urgent">Срочный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-bold text-gray-700 mb-3 block">
                  Телефон для связи
                </Label>
                <Input
                  id="phone"
                  placeholder="+7 (900) 123-45-67"
                  value={newAppointment.patient_phone}
                  onChange={(e) => setNewAppointment((prev) => ({ ...prev, patient_phone: e.target.value }))}
                  className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-bold text-gray-700 mb-3 block">
                Email для уведомлений
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={newAppointment.patient_email}
                onChange={(e) => setNewAppointment((prev) => ({ ...prev, patient_email: e.target.value }))}
                className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="history" className="text-sm font-bold text-gray-700 mb-3 block">
                Дополнительная информация
              </Label>
              <Textarea
                id="history"
                placeholder="Расскажите о предыдущих обращениях, аллергиях, принимаемых лекарствах..."
                value={newAppointment.patient_history_notes}
                onChange={(e) => setNewAppointment((prev) => ({ ...prev, patient_history_notes: e.target.value }))}
                className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewAppointmentDialog(false)
                  setSelectedDoctor(null)
                  setNewAppointment({
                    doctor: 0,
                    requested_date: "",
                    requested_time: "",
                    reason: "",
                    description: "",
                    priority: "normal",
                    patient_phone: "",
                    patient_email: "",
                    patient_history_notes: "",
                  })
                }}
                className="rounded-xl border-gray-200/50 hover:bg-gray-50/80 transition-all duration-200"
              >
                Отмена
              </Button>
              <Button
                onClick={handleCreateAppointment}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg hover:shadow-xl rounded-xl transition-all duration-200"
              >
                <Send className="w-4 h-4 mr-2" />
                Отправить Запрос
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AppointmentCard({
  appointment,
  onCancel,
  getStatusColor,
  getStatusLabel,
}: {
  appointment: AppointmentType
  onCancel: (id: number) => void
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
}) {
  const [showDetails, setShowDetails] = useState(false)

  const format = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`)
    return {
      date: appointmentDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: appointmentDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const formatted = format(appointment.requested_date, appointment.requested_time)

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/30 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div
        className={`h-1 ${appointment.status === "confirmed" ? "bg-green-500" : appointment.status === "rejected" ? "bg-red-500" : "bg-yellow-500"}`}
      ></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-violet-500 text-white font-bold">
                {appointment.doctor_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">
                {appointment.doctor_name}
              </h3>
              <p className="text-gray-600">{appointment.reason}</p>
              <div className="flex items-center gap-2 mt-1">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {formatted.date} в {formatted.time}
                </span>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(appointment.status)} font-medium px-3 py-1 rounded-full`}>
            {getStatusLabel(appointment.status)}
          </Badge>
        </div>

        {appointment.description && (
          <div className="mb-4 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-700">{appointment.description}</p>
          </div>
        )}

        {appointment.rejection_reason && (
          <div className="mb-4 p-3 bg-red-50/80 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Причина отклонения:</span>
            </div>
            <p className="text-sm text-red-600">{appointment.rejection_reason}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {appointment.patient_phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{appointment.patient_phone}</span>
              </div>
            )}
            {appointment.patient_email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{appointment.patient_email}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="rounded-xl border-gray-200/50 hover:bg-gray-50/80 transition-all duration-200"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              Детали
            </Button>
            {appointment.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(appointment.id)}
                className="rounded-xl border-red-200/50 text-red-600 hover:bg-red-50/80 transition-all duration-200"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Отменить
              </Button>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Приоритет:</span>
                <Badge
                  className={`ml-2 ${
                    appointment.priority === "urgent"
                      ? "bg-red-100 text-red-700"
                      : appointment.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {appointment.priority === "urgent"
                    ? "Срочный"
                    : appointment.priority === "high"
                      ? "Высокий"
                      : appointment.priority === "normal"
                        ? "Обычный"
                        : "Низкий"}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-700">Создано:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(appointment.created_at).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
            {appointment.patient_history_notes && (
              <div>
                <span className="font-medium text-gray-700 block mb-1">Дополнительная информация:</span>
                <p className="text-sm text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  {appointment.patient_history_notes}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DoctorCard({
  doctor,
  getSpecialtyLabel,
  getSpecialtyColor,
  onBookAppointment,
  recommended = false,
}: {
  doctor: DoctorType
  getSpecialtyLabel: (specialty: string) => string
  getSpecialtyColor: (specialty: string) => string
  onBookAppointment: (doctor: DoctorType) => void
  recommended?: boolean
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/30 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className={`h-1 bg-gradient-to-r ${getSpecialtyColor(doctor.specialty)}`}></div>
      <CardContent className="p-6">
        {recommended && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Рекомендуемый
            </Badge>
          </div>
        )}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
            <AvatarImage src={doctor.user.profile_picture || "/placeholder.svg"} />
            <AvatarFallback
              className={`bg-gradient-to-br ${getSpecialtyColor(doctor.specialty)} text-white font-bold text-lg`}
            >
              {doctor.user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">
              {doctor.user.full_name}
            </h3>
            <p className="text-gray-600 font-medium">{getSpecialtyLabel(doctor.specialty)}</p>
            <p className="text-sm text-gray-500">Опыт: {doctor.years_of_experience} лет</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{Number(doctor.rating).toFixed(1)}</span>
            </div>
          </div>
          {doctor.is_available && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
        </div>

        <div className="space-y-2 mb-4">
          {doctor.user.phone_number && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{doctor.user.phone_number}</span>
            </div>
          )}
          {doctor.user.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{doctor.user.email}</span>
            </div>
          )}
          {doctor.consultation_fee && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Стоимость: {doctor.consultation_fee} ₽</span>
            </div>
          )}
          {doctor.hospital && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Клиника: {doctor.hospital.name}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              console.log(`Выбран доктор: ID=${doctor.id}, Имя=${doctor.user.full_name}`)
              onBookAppointment(doctor)
            }}
            disabled={!doctor.is_available}
            className={`flex-1 rounded-xl shadow-md transition-all duration-200 ${
              doctor.is_available
                ? `bg-gradient-to-r ${getSpecialtyColor(doctor.specialty)} hover:opacity-90 text-white`
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {doctor.is_available ? "Записаться" : "Недоступен"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-gray-200/50 hover:bg-gray-50/80 transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
