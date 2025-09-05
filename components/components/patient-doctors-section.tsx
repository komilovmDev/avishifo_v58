"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronRight,
  Calendar,
  MessageCircle,
  User,
  Star,
  Clock,
  Award,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Video,
  Languages,
  GraduationCap,
  Shield,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import { API_CONFIG } from "../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

// Интерфейсы для API
interface DoctorApiType {
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

interface SpecialtyApiType {
  value: string
  label: string
}

// Интерфейсы для компонента
interface Doctor {
  id: number
  name: string
  specialty: string
  rating: string
  reviews: number
  available: boolean
  experience: string
  price: string
  nextSlot: string
  specializations: string[]
  avatar: string | null
  category: string
  bio?: string
  education?: string
  certifications?: string
  hospital?: {
    name: string
    address?: string
  }
  contact?: {
    phone?: string
    email?: string
    work_phone?: string
    work_email?: string
  }
  schedule?: {
    days: string[]
    start_time: string
    end_time: string
    online_consultations: boolean
    languages: string[]
  }
  reviews_data?: {
    total_reviews: number
    average_rating: number
    recent_reviews: Array<{
      id: number
      patient_name: string
      rating: number
      comment: string
      date: string
      verified_patient: boolean
    }>
    rating_breakdown: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
  analytics?: {
    total_patients: number
    total_consultations: number
    satisfaction_rate: number
  }
}

interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  doctorsCount: number
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

// Doctor Profile Modal Component
const DoctorProfileModal = ({
  doctor,
  isOpen,
  onClose,
  onBookAppointment,
}: {
  doctor: Doctor | null
  isOpen: boolean
  onClose: () => void
  onBookAppointment: (doctor: Doctor) => void
}) => {
  if (!doctor) return null

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50/50">
        <DialogHeader className="pb-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">Профиль врача</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={doctor.avatar || "/placeholder.svg?height=128&width=128&query=doctor"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>

                <p className="text-lg text-gray-600 mb-3">{doctor.specialty}</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    <Building2 className="w-3 h-3 mr-1" />
                    {doctor.hospital?.name || "Клиника"}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {doctor.experience}
                  </Badge>
                  {doctor.available && (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Доступен
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div className="flex">{renderStars(Number.parseFloat(doctor.rating))}</div>
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-gray-500">({doctor.reviews} отзывов)</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Стоимость консультации</p>
                        <p className="font-bold text-blue-900">{doctor.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700">Ближайшая запись</p>
                        <p className="font-bold text-green-900">{doctor.nextSlot}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={() => onBookAppointment(doctor)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  disabled={!doctor.available}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Записаться на прием
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Написать сообщение
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs with detailed information */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">О враче</TabsTrigger>
              <TabsTrigger value="schedule">График</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              <TabsTrigger value="contact">Контакты</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 mt-6">
              {/* Bio */}
              {doctor.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />О враче
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Специализации
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                      Образование
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {doctor.education || "Информация об образовании не указана"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      Сертификаты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {doctor.certifications || "Информация о сертификатах не указана"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Statistics */}
              {doctor.analytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      Статистика
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{doctor.analytics.total_patients}</div>
                        <div className="text-sm text-blue-700">Всего пациентов</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{doctor.analytics.total_consultations}</div>
                        <div className="text-sm text-green-700">Консультаций</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{doctor.analytics.satisfaction_rate}%</div>
                        <div className="text-sm text-purple-700">Удовлетворенность</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    График работы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {doctor.schedule ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Дни приема
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {doctor.schedule.days.map((day) => (
                              <Badge
                                key={day}
                                variant="outline"
                                className="bg-purple-50 border-purple-200 text-purple-700"
                              >
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Время работы
                          </h4>
                          <p className="text-lg font-medium">
                            {doctor.schedule.start_time} - {doctor.schedule.end_time}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Онлайн консультации
                          </h4>
                          <Badge
                            className={
                              doctor.schedule.online_consultations
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {doctor.schedule.online_consultations ? "Доступны" : "Недоступны"}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Languages className="w-4 h-4" />
                            Языки приема
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {doctor.schedule.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>График работы не указан</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 mt-6">
              {doctor.reviews_data ? (
                <div className="space-y-6">
                  {/* Rating Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Общий рейтинг
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 mb-2">
                            {doctor.reviews_data.average_rating.toFixed(1)}
                          </div>
                          <div className="flex justify-center mb-2">
                            {renderStars(doctor.reviews_data.average_rating)}
                          </div>
                          <p className="text-gray-600">На основе {doctor.reviews_data.total_reviews} отзывов</p>
                        </div>

                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = doctor.reviews_data?.rating_breakdown[rating] || 0
                            const total = doctor.reviews_data?.total_reviews || 1
                            const percentage = Math.round((count / total) * 100)

                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <span className="w-3 text-sm">{rating}</span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="w-8 text-xs text-gray-500">{count}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        Последние отзывы
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {doctor.reviews_data.recent_reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-l-4 border-l-amber-400 pl-4 py-3 bg-gray-50 rounded-r-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.patient_name}</span>
                              {review.verified_patient && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Проверен
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Отзывы пока отсутствуют</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      Контактная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {doctor.contact?.phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Телефон</p>
                          <p className="font-medium">{doctor.contact.phone}</p>
                        </div>
                      </div>
                    )}

                    {doctor.contact?.email && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{doctor.contact.email}</p>
                        </div>
                      </div>
                    )}

                    {doctor.hospital && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Building2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Место работы</p>
                          <p className="font-medium">{doctor.hospital.name}</p>
                          {doctor.hospital.address && (
                            <p className="text-sm text-gray-500">{doctor.hospital.address}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      Рабочие контакты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {doctor.contact?.work_phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Phone className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Рабочий телефон</p>
                          <p className="font-medium">{doctor.contact.work_phone}</p>
                        </div>
                      </div>
                    )}

                    {doctor.contact?.work_email && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Mail className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Рабочий email</p>
                          <p className="font-medium">{doctor.contact.work_email}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">Доступность</p>
                      <Badge className={doctor.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {doctor.available ? "Доступен для записи" : "Недоступен"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Обновим компонент PatientDoctorsSection, чтобы он принимал userProfile
export default function PatientDoctorsSection({ userProfile }: { userProfile?: any }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showDoctorProfile, setShowDoctorProfile] = useState(false)
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

  // Маппинг специальностей из API к иконкам и цветам
  const getSpecialtyConfig = (specialtyKey: string) => {
    const specialtyConfigs: Record<string, { icon: React.ReactNode; color: string; description: string }> = {
      // Терапевтические специальности
      internal_medicine: {
        icon: <span className="text-4xl">🩺</span>,
        color: "from-blue-500 to-indigo-500",
        description: "Диагностика и лечение внутренних болезней",
      },
      cardiology: {
        icon: <span className="text-4xl">❤️</span>,
        color: "from-red-500 to-pink-500",
        description: "Заболевания сердца и сосудов",
      },
      endocrinology: {
        icon: <span className="text-4xl">🧬</span>,
        color: "from-purple-500 to-violet-500",
        description: "Гормональные нарушения и эндокринная система",
      },
      pulmonology: {
        icon: <span className="text-4xl">🫁</span>,
        color: "from-cyan-500 to-blue-500",
        description: "Заболевания легких и дыхательной системы",
      },
      gastroenterology: {
        icon: <span className="text-4xl">🍎</span>,
        color: "from-green-500 to-emerald-500",
        description: "Заболевания желудочно-кишечного тракта",
      },
      nephrology: {
        icon: <span className="text-4xl">🫘</span>,
        color: "from-teal-500 to-cyan-500",
        description: "Заболевания почек и мочевыделительной системы",
      },
      hematology: {
        icon: <span className="text-4xl">🩸</span>,
        color: "from-red-600 to-rose-500",
        description: "Заболевания крови и кроветворных органов",
      },
      rheumatology: {
        icon: <span className="text-4xl">🦴</span>,
        color: "from-orange-500 to-amber-500",
        description: "Заболевания суставов и соединительной ткани",
      },
      allergy_immunology: {
        icon: <span className="text-4xl">🤧</span>,
        color: "from-yellow-500 to-orange-500",
        description: "Аллергические реакции и иммунные нарушения",
      },
      infectious_diseases: {
        icon: <span className="text-4xl">🦠</span>,
        color: "from-red-500 to-orange-500",
        description: "Инфекционные и паразитарные заболевания",
      },

      // Хирургические специальности
      general_surgery: {
        icon: <span className="text-4xl">🔪</span>,
        color: "from-gray-500 to-slate-500",
        description: "Общие хирургические вмешательства",
      },
      cardiovascular_surgery: {
        icon: <span className="text-4xl">💓</span>,
        color: "from-red-600 to-pink-600",
        description: "Операции на сердце и сосудах",
      },
      neurosurgery: {
        icon: <span className="text-4xl">🧠</span>,
        color: "from-purple-600 to-indigo-600",
        description: "Операции на головном и спинном мозге",
      },
      orthopedics_traumatology: {
        icon: <span className="text-4xl">🦴</span>,
        color: "from-amber-500 to-orange-600",
        description: "Травмы и заболевания опорно-двигательного аппарата",
      },
      urology: {
        icon: <span className="text-4xl">🫘</span>,
        color: "from-blue-600 to-cyan-600",
        description: "Заболевания мочеполовой системы",
      },
      plastic_surgery: {
        icon: <span className="text-4xl">✨</span>,
        color: "from-pink-500 to-rose-500",
        description: "Пластическая и реконструктивная хирургия",
      },
      pediatric_surgery: {
        icon: <span className="text-4xl">👶</span>,
        color: "from-green-400 to-emerald-500",
        description: "Хирургические операции у детей",
      },
      oncological_surgery: {
        icon: <span className="text-4xl">🎗️</span>,
        color: "from-purple-500 to-pink-500",
        description: "Хирургическое лечение онкологических заболеваний",
      },
      thoracic_surgery: {
        icon: <span className="text-4xl">🫁</span>,
        color: "from-slate-500 to-gray-600",
        description: "Операции на органах грудной клетки",
      },
      maxillofacial_surgery: {
        icon: <span className="text-4xl">😷</span>,
        color: "from-indigo-500 to-purple-500",
        description: "Операции на лице и челюстях",
      },

      // Специализированные направления
      obstetrics_gynecology: {
        icon: <span className="text-4xl">👩‍⚕️</span>,
        color: "from-pink-400 to-rose-400",
        description: "Женское здоровье, беременность и роды",
      },
      pediatrics: {
        icon: <span className="text-4xl">👶</span>,
        color: "from-yellow-400 to-orange-400",
        description: "Детская медицина и здоровье",
      },
      neurology: {
        icon: <span className="text-4xl">🧠</span>,
        color: "from-purple-500 to-indigo-500",
        description: "Заболевания нервной системы",
      },
      psychiatry: {
        icon: <span className="text-4xl">🧘</span>,
        color: "from-teal-500 to-cyan-500",
        description: "Психическое здоровье и расстройства",
      },
      dermatovenereology: {
        icon: <span className="text-4xl">🔬</span>,
        color: "from-green-500 to-emerald-500",
        description: "Заболевания кожи и венерические болезни",
      },
      ophthalmology: {
        icon: <span className="text-4xl">👁️</span>,
        color: "from-indigo-500 to-violet-500",
        description: "Заболевания глаз и зрения",
      },
      otolaryngology: {
        icon: <span className="text-4xl">👂</span>,
        color: "from-orange-500 to-red-500",
        description: "ЛОР-заболевания (ухо, горло, нос)",
      },
      dentistry: {
        icon: <span className="text-4xl">🦷</span>,
        color: "from-cyan-500 to-blue-500",
        description: "Лечение зубов и полости рта",
      },

      // Диагностические специальности
      radiology: {
        icon: <span className="text-4xl">📡</span>,
        color: "from-gray-600 to-slate-600",
        description: "Лучевая диагностика и рентгенология",
      },
      ultrasound_diagnostics: {
        icon: <span className="text-4xl">📊</span>,
        color: "from-blue-400 to-cyan-400",
        description: "Ультразвуковая диагностика",
      },
      laboratory_diagnostics: {
        icon: <span className="text-4xl">🧪</span>,
        color: "from-green-600 to-teal-600",
        description: "Лабораторные исследования и анализы",
      },
      pathomorphology: {
        icon: <span className="text-4xl">🔬</span>,
        color: "from-purple-600 to-violet-600",
        description: "Патологическая анатомия и гистология",
      },
      functional_diagnostics: {
        icon: <span className="text-4xl">📈</span>,
        color: "from-indigo-400 to-blue-500",
        description: "Функциональная диагностика органов",
      },

      // Специализированные направления
      medical_genetics: {
        icon: <span className="text-4xl">🧬</span>,
        color: "from-violet-500 to-purple-600",
        description: "Генетические заболевания и консультирование",
      },
      medical_rehabilitation: {
        icon: <span className="text-4xl">🏃‍♂️</span>,
        color: "from-emerald-500 to-green-600",
        description: "Восстановительная медицина и реабилитация",
      },
      geriatrics: {
        icon: <span className="text-4xl">👴</span>,
        color: "from-amber-600 to-orange-600",
        description: "Медицина пожилого возраста",
      },
      palliative_care: {
        icon: <span className="text-4xl">🕊️</span>,
        color: "from-slate-400 to-gray-500",
        description: "Паллиативная помощь и уход",
      },
      sports_medicine: {
        icon: <span className="text-4xl">⚽</span>,
        color: "from-green-500 to-lime-500",
        description: "Спортивная медицина и травмы спортсменов",
      },
      clinical_oncology: {
        icon: <span className="text-4xl">🎗️</span>,
        color: "from-pink-600 to-rose-600",
        description: "Клиническая онкология и химиотерапия",
      },
      medical_cybernetics_ai: {
        icon: <span className="text-4xl">🤖</span>,
        color: "from-cyan-600 to-blue-700",
        description: "Медицинская кибернетика и ИИ",
      },
      transplantology: {
        icon: <span className="text-4xl">🫀</span>,
        color: "from-red-700 to-pink-700",
        description: "Трансплантация органов и тканей",
      },
      reproductive_medicine: {
        icon: <span className="text-4xl">👶</span>,
        color: "from-rose-400 to-pink-500",
        description: "Репродуктивная медицина и ЭКО",
      },
    }

    return (
      specialtyConfigs[specialtyKey] || {
        icon: <span className="text-4xl">🩺</span>,
        color: "from-gray-500 to-slate-500",
        description: "Медицинская специальность",
      }
    )
  }

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken") || userProfile?.token || ""
    }
    return null
  }

  // API request helper
  const apiRequest = async (url: string, options: any = {}) => {
    const token = getAuthToken()
    try {
      return axios({
        url: `${API_BASE_URL}${url}`,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  // Получение специализаций для врача
  const getDoctorSpecializations = (specialty: string): string[] => {
    const specializations: Record<string, string[]> = {
      internal_medicine: ["Общая терапия", "Профилактика", "Диагностика", "Лечение простудных заболеваний"],
      cardiology: ["Ишемическая болезнь", "Аритмии", "Гипертония", "Сердечная недостаточность"],
      endocrinology: ["Диабет", "Щитовидная железа", "Гормональные нарушения", "Ожирение"],
      pulmonology: ["Астма", "Бронхит", "Пневмония", "ХОБЛ"],
      gastroenterology: ["Гастрит", "Язвенная болезнь", "Колит", "Панкреатит"],
      nephrology: ["Почечная недостаточность", "Гломерулонефрит", "Мочекаменная болезнь"],
      hematology: ["Анемия", "Лейкемия", "Тромбоцитопения", "Нарушения свертываемости"],
      rheumatology: ["Артрит", "Артроз", "Ревматизм", "Подагра"],
      allergy_immunology: ["Аллергические реакции", "Астма", "Дерматит", "Иммунодефицит"],
      infectious_diseases: ["Вирусные инфекции", "Бактериальные инфекции", "Паразитозы"],

      general_surgery: ["Общая хирургия", "Лапароскопия", "Травматология", "Пластическая хирургия"],
      cardiovascular_surgery: ["Операции на сердце", "Сосудистая хирургия", "Кардиостимуляторы"],
      neurosurgery: ["Операции на мозге", "Спинальная хирургия", "Нейроонкология"],
      orthopedics_traumatology: ["Переломы", "Эндопротезирование", "Артроскопия", "Спортивные травмы"],
      urology: ["Мочекаменная болезнь", "Простатит", "Онкоурология", "Детская урология"],
      plastic_surgery: ["Эстетическая хирургия", "Реконструктивная хирургия", "Микрохирургия"],
      pediatric_surgery: ["Детская хирургия", "Врожденные пороки", "Минимально инвазивная хирургия"],
      oncological_surgery: ["Онкохирургия", "Удаление опухолей", "Реконструктивная онкология"],
      thoracic_surgery: ["Операции на легких", "Торакоскопия", "Онкоторакальная хирургия"],
      maxillofacial_surgery: ["Челюстно-лицевая хирургия", "Имплантология", "Реконструкция лица"],

      obstetrics_gynecology: ["Беременность", "Роды", "Гинекологические заболевания", "Планирование семьи"],
      pediatrics: ["Детские болезни", "Вакцинация", "Развитие", "Детское питание"],
      neurology: ["Головные боли", "Эпилепсия", "Инсульт", "Неврозы", "Рассеянный склероз"],
      psychiatry: ["Депрессия", "Тревожность", "Психотерапия", "Биполярное расстройство"],
      dermatovenereology: ["Акне", "Аллергии", "Экзема", "Псориаз", "Венерические болезни"],
      ophthalmology: ["Катаракта", "Глаукома", "Коррекция зрения", "Воспалительные заболевания глаз"],
      otolaryngology: ["ЛОР-заболевания", "Синуситы", "Отиты", "Тонзиллиты"],
      dentistry: ["Лечение кариеса", "Протезирование", "Имплантация", "Ортодонтия", "Отбеливание"],

      radiology: ["Рентгенография", "КТ", "МРТ", "Интервенционная радиология"],
      ultrasound_diagnostics: ["УЗИ органов", "Допплерография", "Эхокардиография"],
      laboratory_diagnostics: ["Клинические анализы", "Биохимия", "Микробиология", "Иммунология"],
      pathomorphology: ["Гистологические исследования", "Цитология", "Биопсия"],
      functional_diagnostics: ["ЭКГ", "ЭЭГ", "Спирометрия", "Холтер"],

      medical_genetics: ["Генетическое консультирование", "Наследственные заболевания", "Пренатальная диагностика"],
      medical_rehabilitation: ["Физиотерапия", "ЛФК", "Массаж", "Реабилитация после травм"],
      geriatrics: ["Гериатрия", "Деменция", "Остеопороз", "Полиморбидность"],
      palliative_care: ["Паллиативная помощь", "Обезболивание", "Психологическая поддержка"],
      sports_medicine: ["Спортивные травмы", "Допинг-контроль", "Функциональная диагностика"],
      clinical_oncology: ["Химиотерапия", "Лучевая терапия", "Иммунотерапия", "Таргетная терапия"],
      medical_cybernetics_ai: ["ИИ в диагностике", "Телемедицина", "Цифровое здравоохранение"],
      transplantology: ["Трансплантация органов", "Иммуносупрессия", "Донорство"],
      reproductive_medicine: ["ЭКО", "Бесплодие", "Гормональная терапия", "Андрология"],
    }

    return specializations[specialty] || ["Общая практика"]
  }

  // Получение ближайшего слота для записи
  const getNextAvailableSlot = (index: number): string => {
    const slots = [
      "Сегодня 16:00",
      "Завтра 10:30",
      "Понедельник 14:00",
      "Вторник 09:15",
      "Среда 17:30",
      "Четверг 11:45",
      "Пятница 13:20",
      "Суббота 12:00",
    ]
    return slots[index % slots.length]
  }

  // Получение списка специальностей с API
  const fetchSpecialties = async (): Promise<SpecialtyApiType[]> => {
    try {
      // Попробуем получить специальности из отдельного endpoint
      const response = await apiRequest("/api/doctors/specialties/")

      // Handle different response formats
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data
      } else if (Array.isArray(response.data)) {
        return response.data
      } else {
        console.log("Specialties response format not recognized:", response.data)
        return []
      }
    } catch (error) {
      console.log("Specialties endpoint not available, will extract from doctors data")
      return []
    }
  }

  // Преобразование данных API в формат компонента
  const transformDoctorData = (apiDoctors: DoctorApiType[]): Doctor[] => {
    return apiDoctors.map((doctor, index) => {
      // Генерируем отзывы на основе рейтинга (чем выше рейтинг, тем больше отзывов)
      const rating = Number.parseFloat(doctor.rating) || 4.5
      const reviewsCount = Math.floor(50 + rating * 20)

      // Получаем специализации для этой категории
      const specializations = getDoctorSpecializations(doctor.specialty)

      // Форматируем имя врача
      const fullName = doctor.user.full_name || `${doctor.user.first_name} ${doctor.user.last_name}`
      const formattedName = fullName.startsWith("Доктор") ? fullName : `Доктор ${fullName}`

      // Добавляем mock данные для профиля
      const mockProfileData = {
        bio: `Опытный ${doctor.specialty} с ${doctor.years_of_experience} летним стажем. Специализируюсь на современных методах диагностики и лечения. Постоянно повышаю квалификацию, участвую в медицинских конференциях и семинарах.`,
        contact: {
          phone: doctor.user.phone_number,
          email: doctor.user.email,
          work_phone: "+998 71 123-45-67",
          work_email: `${doctor.user.username}@clinic.uz`,
        },
        schedule: {
          days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"],
          start_time: "09:00",
          end_time: "18:00",
          online_consultations: true,
          languages: ["Русский", "Узбекский", "Английский"],
        },
        reviews_data: {
          total_reviews: reviewsCount,
          average_rating: rating,
          recent_reviews: [
            {
              id: 1,
              patient_name: "Анна К.",
              rating: 5,
              comment: "Отличный врач! Очень внимательный и профессиональный подход.",
              date: "2024-01-15",
              verified_patient: true,
            },
            {
              id: 2,
              patient_name: "Михаил С.",
              rating: 5,
              comment: "Быстро поставил диагноз, лечение помогло. Очень доволен!",
              date: "2024-01-12",
              verified_patient: true,
            },
            {
              id: 3,
              patient_name: "Елена В.",
              rating: 4,
              comment: "Хороший врач, грамотная консультация и правильное лечение.",
              date: "2024-01-10",
              verified_patient: true,
            },
          ],
          rating_breakdown: {
            5: Math.floor(reviewsCount * 0.7),
            4: Math.floor(reviewsCount * 0.2),
            3: Math.floor(reviewsCount * 0.07),
            2: Math.floor(reviewsCount * 0.02),
            1: Math.floor(reviewsCount * 0.01),
          },
        },
        analytics: {
          total_patients: Math.floor(200 + rating * 50),
          total_consultations: Math.floor(500 + rating * 100),
          satisfaction_rate: Math.floor(85 + rating * 3),
        },
      }

      return {
        id: doctor.id,
        name: formattedName,
        specialty: doctor.specialty, // Используем ключ специальности
        rating: rating.toFixed(1),
        reviews: reviewsCount,
        available: doctor.is_available,
        experience: `${doctor.years_of_experience} лет`,
        price: `${doctor.consultation_fee || "3000"} ₽`,
        nextSlot: getNextAvailableSlot(index),
        specializations: specializations,
        avatar: doctor.user.profile_picture,
        category: doctor.specialty, // Используем specialty как category
        ...mockProfileData,
      }
    })
  }

  // Создание категорий на основе данных врачей
  const createCategoriesFromDoctors = (doctors: Doctor[], specialties: SpecialtyApiType[] = []) => {
    // Подсчитываем количество врачей в каждой категории
    const doctorsByCategory: Record<string, number> = {}
    const uniqueSpecialties = new Set<string>()

    doctors.forEach((doctor) => {
      uniqueSpecialties.add(doctor.category)
      doctorsByCategory[doctor.category] = (doctorsByCategory[doctor.category] || 0) + 1
    })

    // Если у нас есть данные о специальностях с API, используем их
    const specialtyLabels: Record<string, string> = {}
    if (Array.isArray(specialties)) {
      specialties.forEach((specialty) => {
        specialtyLabels[specialty.value] = specialty.label
      })
    }

    // Создаем категории
    const categories: Category[] = []

    // Добавляем все специальности из бэкенда (даже если нет врачей)
    if (Array.isArray(specialties) && specialties.length > 0) {
      specialties.forEach((specialty) => {
        const config = getSpecialtyConfig(specialty.value)
        categories.push({
          id: specialty.value,
          name: specialty.label,
          description: config.description,
          icon: config.icon,
          color: config.color,
          doctorsCount: doctorsByCategory[specialty.value] || 0,
        })
      })
    } else {
      // Если нет данных о специальностях, создаем категории на основе врачей
      Array.from(uniqueSpecialties).forEach((specialty) => {
        const config = getSpecialtyConfig(specialty)
        categories.push({
          id: specialty,
          name: specialtyLabels[specialty] || specialty.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          description: config.description,
          icon: config.icon,
          color: config.color,
          doctorsCount: doctorsByCategory[specialty] || 0,
        })
      })
    }

    return categories
  }

  // Получение списка врачей из API
  const fetchDoctors = async () => {
    try {
      setLoading(true)

      // Получаем специальности и врачей параллельно
      const [specialtiesResponse, doctorsResponse] = await Promise.allSettled([
        fetchSpecialties(),
        apiRequest("/api/doctors/"),
      ])

      let specialties: SpecialtyApiType[] = []
      if (specialtiesResponse.status === "fulfilled" && Array.isArray(specialtiesResponse.value)) {
        specialties = specialtiesResponse.value
      } else if (
        specialtiesResponse.status === "fulfilled" &&
        specialtiesResponse.value?.data &&
        Array.isArray(specialtiesResponse.value.data)
      ) {
        // Handle case where API returns {data: [...]} format
        specialties = specialtiesResponse.value.data
      }

      if (doctorsResponse.status === "fulfilled") {
        console.log("Doctors API response:", doctorsResponse.value.data)

        // Получаем данные
        const doctorsData = doctorsResponse.value.data.results || doctorsResponse.value.data

        if (Array.isArray(doctorsData)) {
          // Преобразуем данные в формат компонента
          const transformedDoctors = transformDoctorData(doctorsData)
          setDoctors(transformedDoctors)

          // Создаем категории на основе данных врачей и специальностей
          const categoriesWithCount = createCategoriesFromDoctors(transformedDoctors, specialties)
          setCategories(categoriesWithCount)

          if (doctorsData.length > 0) {
            toast({
              title: "Успешно",
              description: `Загружено ${doctorsData.length} докторов`,
            })
          } else {
            // Если API вернул пустой список, создаем тестовые данные
            createMockData()
          }
        } else {
          console.error("Doctors data is not an array:", doctorsData)
          createMockData()
        }
      } else {
        // Если API не работает, создаем тестовые данные
        createMockData()
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
      // Если API не работает, создаем тестовые данные
      createMockData()
    } finally {
      setLoading(false)
    }
  }

  // Создание тестовых данных, если API не работает
  const createMockData = () => {
    const mockDoctors: Doctor[] = [
      {
        id: 1,
        name: "Доктор Иванов Алексей",
        specialty: "internal_medicine",
        rating: "4.9",
        reviews: 127,
        available: true,
        experience: "15 лет",
        price: "3000 ₽",
        nextSlot: "Сегодня 16:00",
        specializations: ["Общая терапия", "Профилактика", "Диагностика", "Лечение простудных заболеваний"],
        avatar: null,
        category: "internal_medicine",
        bio: "Опытный терапевт с 15-летним стажем. Специализируюсь на диагностике и лечении внутренних болезней.",
        education: "ТГМИ им. Абу Али ибн Сино, 2009 год\nИнтернатура по терапии, 2010 год",
        certifications: "Сертификат специалиста по терапии\nКурсы повышения квалификации по кардиологии",
        contact: {
          phone: "+998 90 123-45-67",
          email: "ivanov@clinic.uz",
          work_phone: "+998 71 123-45-67",
          work_email: "a.ivanov@clinic.uz",
        },
        schedule: {
          days: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"],
          start_time: "09:00",
          end_time: "18:00",
          online_consultations: true,
          languages: ["Русский", "Узбекский"],
        },
        reviews_data: {
          total_reviews: 127,
          average_rating: 4.9,
          recent_reviews: [
            {
              id: 1,
              patient_name: "Анна К.",
              rating: 5,
              comment: "Отличный врач! Очень внимательный и профессиональный подход.",
              date: "2024-01-15",
              verified_patient: true,
            },
          ],
          rating_breakdown: { 5: 98, 4: 22, 3: 5, 2: 1, 1: 1 },
        },
        analytics: {
          total_patients: 450,
          total_consultations: 890,
          satisfaction_rate: 98,
        },
      },
      // Добавьте больше mock данных по необходимости
    ]

    setDoctors(mockDoctors)

    // Создаем категории с тестовыми данными
    const categoriesWithCount = createCategoriesFromDoctors(mockDoctors)
    setCategories(categoriesWithCount)

    toast({
      title: "Внимание",
      description: "Используются тестовые данные, так как API недоступен",
      variant: "warning",
    })
  }

  // Создание новой записи к врачу
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

      const selectedDoctorInfo = doctors.find((d) => d.id === newAppointment.doctor)
      const doctorName = selectedDoctorInfo ? selectedDoctorInfo.name : "выбранному врачу"

      console.log("Отправляемые данные:", newAppointment)

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
      } catch (error: any) {
        console.error("API Error details:", error.response?.data)

        if (error.response?.data?.doctor && Array.isArray(error.response.data.doctor)) {
          const doctorError = error.response.data.doctor[0]
          if (doctorError.includes("Invalid pk") && doctorError.includes("object does not exist")) {
            toast({
              title: "Ошибка с выбором доктора",
              description: "Выбранный доктор недоступен или был удален. Пожалуйста, выберите другого доктора.",
              variant: "destructive",
            })
            fetchDoctors()
            return
          }
        }

        throw error
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

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchDoctors()
  }, [])

  // Фильтрация врачей по поисковому запросу или категории
  const getFilteredDoctors = () => {
    if (selectedCategory) {
      return doctors.filter((doctor) => doctor.category === selectedCategory)
    } else if (searchQuery) {
      return doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specializations.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
    return doctors
  }

  const filteredDoctors = getFilteredDoctors()

  // Отображение загрузки
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-2 text-lg">Загрузка врачей...</span>
      </div>
    )
  }

  // Отображение деталей выбранной категории
  if (selectedCategory) {
    const category = categories.find((cat) => cat.id === selectedCategory)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedCategory(null)} className="rounded-xl">
              ← Назад к категориям
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{category?.name}</h1>
              <p className="text-gray-600">{category?.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => {
            const doctorCategory = categories.find((cat) => cat.id === doctor.category)
            return (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                doctorCategory={doctorCategory}
                onBookAppointment={(doctor) => {
                  setSelectedDoctor(doctor)
                  setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
                  setShowNewAppointmentDialog(true)
                }}
                onViewProfile={(doctor) => {
                  setSelectedDoctor(doctor)
                  setShowDoctorProfile(true)
                }}
              />
            )
          })}
        </div>

        {/* Doctor Profile Modal */}
        <DoctorProfileModal
          doctor={selectedDoctor}
          isOpen={showDoctorProfile}
          onClose={() => {
            setShowDoctorProfile(false)
            setSelectedDoctor(null)
          }}
          onBookAppointment={(doctor) => {
            setShowDoctorProfile(false)
            setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
            setShowNewAppointmentDialog(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Наши Врачи</h1>
          <p className="text-gray-600">Выберите специалиста для консультации</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск врачей по имени или специальности..."
          className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-md rounded-xl h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!searchQuery ? (
        <>
          {/* Categories */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Специализации</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                if (category.doctorsCount === 0) return null

                return (
                  <Card
                    key={category.id}
                    className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className={`h-1 bg-gradient-to-r ${category.color}`}></div>
                    <CardContent className="p-4 relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div>{category.icon}</div>
                          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            {category.doctorsCount} врачей
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Доступно врачей: {category.doctorsCount}</span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Featured Doctors */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Рекомендуемые Врачи</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors
                .sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
                .slice(0, 3)
                .map((doctor) => {
                  const category = categories.find((cat) => cat.id === doctor.category)
                  return (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      doctorCategory={category}
                      recommended
                      onBookAppointment={(doctor) => {
                        setSelectedDoctor(doctor)
                        setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
                        setShowNewAppointmentDialog(true)
                      }}
                      onViewProfile={(doctor) => {
                        setSelectedDoctor(doctor)
                        setShowDoctorProfile(true)
                      }}
                    />
                  )
                })}
            </div>
          </div>
        </>
      ) : (
        /* Search Results */
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Результаты поиска ({filteredDoctors.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor) => {
              const category = categories.find((cat) => cat.id === doctor.category)
              return (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  doctorCategory={category}
                  onBookAppointment={(doctor) => {
                    setSelectedDoctor(doctor)
                    setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
                    setShowNewAppointmentDialog(true)
                  }}
                  onViewProfile={(doctor) => {
                    setSelectedDoctor(doctor)
                    setShowDoctorProfile(true)
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={showDoctorProfile}
        onClose={() => {
          setShowDoctorProfile(false)
          setSelectedDoctor(null)
        }}
        onBookAppointment={(doctor) => {
          setShowDoctorProfile(false)
          setNewAppointment((prev) => ({ ...prev, doctor: doctor.id }))
          setShowNewAppointmentDialog(true)
        }}
      />

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
        <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white to-gray-50/50 border-gray-200/50 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {selectedDoctor ? `Запись к ${selectedDoctor.name}` : "Новая Запись"}
              </DialogTitle>
            </div>
            {selectedDoctor && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                    <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-violet-500 text-white font-bold">
                      {selectedDoctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-indigo-800">{selectedDoctor.name}</h4>
                    <p className="text-indigo-600">
                      {categories.find((c) => c.id === selectedDoctor.category)?.name || selectedDoctor.specialty}
                    </p>
                    <p className="text-sm text-indigo-500">Опыт: {selectedDoctor.experience}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-6 pt-6">
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

// Doctor Card Component
function DoctorCard({
  doctor,
  doctorCategory,
  recommended = false,
  onBookAppointment,
  onViewProfile,
}: {
  doctor: Doctor
  doctorCategory?: Category
  recommended?: boolean
  onBookAppointment: (doctor: Doctor) => void
  onViewProfile: (doctor: Doctor) => void
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/30 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className={`h-1 bg-gradient-to-r ${doctorCategory?.color}`}></div>
      <CardContent className="p-4">
        {recommended && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Рекомендуемый
            </Badge>
          </div>
        )}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
            <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
            <AvatarFallback className={`bg-gradient-to-r ${doctorCategory?.color} text-white text-sm`}>
              {doctor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-600">{doctorCategory?.name || doctor.specialty}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="text-xs font-medium">{doctor.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({doctor.reviews})</span>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${doctor.available ? "bg-green-500" : "bg-gray-400"}`}></div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Опыт:</span>
            <span className="font-medium">{doctor.experience}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Стоимость:</span>
            <span className="font-bold text-indigo-600">{doctor.price}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Ближайший:</span>
            <span className={`font-medium ${doctor.available ? "text-green-600" : "text-gray-500"}`}>
              {doctor.nextSlot}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {doctor.specializations.slice(0, 3).map((spec, index) => (
              <Badge key={index} className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs px-2 py-0">
                {spec}
              </Badge>
            ))}
            {doctor.specializations.length > 3 && (
              <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs px-2 py-0">
                +{doctor.specializations.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className={`flex-1 rounded-lg shadow-sm text-sm h-8 ${
              doctor.available
                ? `bg-gradient-to-r ${doctorCategory?.color} hover:opacity-90 text-white`
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!doctor.available}
            onClick={() => {
              if (doctor.available) {
                onBookAppointment(doctor)
              }
            }}
          >
            <Calendar className="w-3 h-3 mr-1" />
            Записаться
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0" onClick={() => onViewProfile(doctor)}>
            <User className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg h-8 w-8 p-0"
            onClick={() => {
              // Открываем чат с врачом
              window.location.href = `/messages?doctor=${doctor.id}`
            }}
          >
            <MessageCircle className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
