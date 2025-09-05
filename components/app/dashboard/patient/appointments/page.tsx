"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, MapPin, Phone, Video, MessageCircle, Plus, Search, Filter, Stethoscope, CheckCircle, XCircle, AlertCircle } from "lucide-react"

import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export default function PatientAppointmentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    // Check if user is authenticated and is a patient
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

  // Mock data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctor: {
        name: "Доктор Джонсон",
        specialty: "Терапевт",
        avatar: "/placeholder.svg",
        initials: "DJ"
      },
      date: "Завтра",
      time: "15:00 - 15:30",
      location: "Москва, ул. Тверская, 15",
      type: "Очный прием",
      status: "confirmed",
      price: "3000 ₽"
    },
    {
      id: 2,
      doctor: {
        name: "Доктор Петров",
        specialty: "Кардиолог",
        avatar: "/placeholder.svg",
        initials: "DP"
      },
      date: "Пятница",
      time: "10:00 - 10:45",
      location: "Москва, ул. Арбат, 25",
      type: "Видеоконсультация",
      status: "pending",
      price: "4500 ₽"
    }
  ]

  const pastAppointments = [
    {
      id: 3,
      doctor: {
        name: "Доктор Иванова",
        specialty: "Невролог",
        avatar: "/placeholder.svg",
        initials: "ДИ"
      },
      date: "15.05.2024",
      time: "14:00 - 14:45",
      location: "Москва, ул. Покровка, 8",
      type: "Очный прием",
      status: "completed",
      price: "3800 ₽"
    },
    {
      id: 4,
      doctor: {
        name: "Доктор Сидоров",
        specialty: "Офтальмолог",
        avatar: "/placeholder.svg",
        initials: "ДС"
      },
      date: "03.04.2024",
      time: "11:00 - 11:30",
      location: "Москва, ул. Мясницкая, 12",
      type: "Очный прием",
      status: "completed",
      price: "3500 ₽"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Подтверждено</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Ожидает подтверждения</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Завершено</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Отменено</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Неизвестно</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Мои Записи</h1>
          <p className="text-gray-600">Управление записями на прием к врачам</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-200/50">
          <Plus className="w-4 h-4 mr-2" />
          Записаться на прием
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по врачу, специальности или дате..."
            className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-md rounded-xl h-12"
          />
        </div>
        <Button variant="outline" className="rounded-xl px-6">
          <Filter className="w-4 h-4 mr-2" />
          Фильтры
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === "upcoming"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Предстоящие ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === "past"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Прошедшие ({pastAppointments.length})
        </button>
      </div>

      {/* Appointments List */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                      <AvatarImage src={appointment.doctor.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-semibold">
                        {appointment.doctor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{appointment.doctor.name}</h3>
                        <p className="text-indigo-600 font-medium">{appointment.doctor.specialty}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{appointment.type}</span>
                        <span className="text-lg font-bold text-indigo-600 ml-2">{appointment.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(appointment.status)}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Phone className="w-4 h-4 mr-1" />
                        Звонок
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Video className="w-4 h-4 mr-1" />
                        Видео
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Чат
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50">
                      Отменить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "past" && (
        <div className="space-y-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                      <AvatarImage src={appointment.doctor.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-semibold">
                        {appointment.doctor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{appointment.doctor.name}</h3>
                        <p className="text-indigo-600 font-medium">{appointment.doctor.specialty}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{appointment.type}</span>
                        <span className="text-lg font-bold text-indigo-600 ml-2">{appointment.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(appointment.status)}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Написать отзыв
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Calendar className="w-4 h-4 mr-1" />
                        Записаться снова
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Stethoscope className="w-5 h-5" />
            Быстрые Действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 rounded-xl bg-white hover:bg-indigo-50 border-indigo-200">
              <div className="text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <span className="text-sm font-medium">Записаться на прием</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16 rounded-xl bg-white hover:bg-indigo-50 border-indigo-200">
              <div className="text-center">
                <Video className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <span className="text-sm font-medium">Онлайн консультация</span>
              </div>
            </Button>
            <Button variant="outline" className="h-16 rounded-xl bg-white hover:bg-indigo-50 border-indigo-200">
              <div className="text-center">
                <MessageCircle className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <span className="text-sm font-medium">Написать врачу</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
