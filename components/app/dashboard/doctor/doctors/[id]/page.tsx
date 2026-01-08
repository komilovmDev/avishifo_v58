"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Stethoscope, MapPin, Star, Phone, Mail, Calendar, 
  Clock, GraduationCap, Users, MessageCircle, Eye,
  X, Building, TrendingUp, CheckCircle, ArrowLeft, Heart
} from "lucide-react"
import axios from "axios"
import Link from "next/link"

import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

// Type definitions
interface Doctor {
  id: number
  uuid?: string
  full_name: string
  first_name: string
  last_name: string
  specialization: string
  specialty?: string
  specializations?: string[]
  experience: string
  years_of_experience?: number
  education: string
  location: string
  bio: string
  languages: string
  languages_spoken?: string[]
  certifications: string
  phone: string
  work_phone?: string
  email: string
  work_email?: string
  address: string
  working_hours: string
  consultation_fee: string
  availability: string
  rating: number
  total_reviews: number
  reviews_count?: number
  total_patients: number
  patients_accepted_count?: number
  monthly_consultations: number
  consultations_count?: number
  profile_picture: string | null
  user?: {
    profile_picture?: string
    first_name?: string
    last_name?: string
    email?: string
    phone_number?: string
  }
  is_recommended?: boolean
}

export default function DoctorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const doctorId = params?.id as string
  
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not provided")
      setLoading(false)
      return
    }

    const fetchDoctor = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("accessToken")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await axios.get(`${API_CONFIG.ENDPOINTS.DOCTOR_DETAIL(doctorId)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Transform backend data to frontend format
        const doctorData = response.data
        const user = doctorData.user || {}
        const firstName = user.first_name || ''
        const lastName = user.last_name || ''
        const fullName = user.full_name || `${firstName} ${lastName}`.trim() || 'Имя не указано'
        
        let profilePicture = null
        if (user.profile_picture) {
          if (typeof user.profile_picture === 'string') {
            profilePicture = user.profile_picture.startsWith('http') 
              ? user.profile_picture 
              : `${API_BASE_URL}${user.profile_picture}`
          } else if (user.profile_picture.url) {
            profilePicture = user.profile_picture.url.startsWith('http')
              ? user.profile_picture.url
              : `${API_BASE_URL}${user.profile_picture.url}`
          }
        }

        const specialtyLabel = doctorData.specialty_label || doctorData.specialty || 'Специализация не указана'
        
        const transformedDoctor: Doctor = {
          id: doctorData.id,
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          specialization: specialtyLabel,
          specialty: doctorData.specialty,
          specializations: doctorData.specializations?.map((spec: any) => {
            if (typeof spec === 'string') return spec
            if (spec && typeof spec === 'object' && spec.label) return spec.label
            return spec
          }) || [],
          experience: doctorData.years_of_experience 
            ? `${doctorData.years_of_experience} лет` 
            : (doctorData.experience_years_text || 'Опыт не указан'),
          years_of_experience: doctorData.years_of_experience || 0,
          education: doctorData.education || 'Образование не указано',
          location: doctorData.region && doctorData.country 
            ? `${doctorData.region}, ${doctorData.country}` 
            : (doctorData.country || 'Местоположение не указано'),
          bio: doctorData.bio || '',
          languages: Array.isArray(doctorData.languages_spoken) 
            ? doctorData.languages_spoken.join(', ') 
            : (doctorData.languages_spoken || 'Языки не указаны'),
          languages_spoken: Array.isArray(doctorData.languages_spoken) ? doctorData.languages_spoken : [],
          certifications: typeof doctorData.certifications === 'string' 
            ? doctorData.certifications 
            : (Array.isArray(doctorData.certifications) ? doctorData.certifications.join(', ') : 'Сертификаты не указаны'),
          phone: doctorData.work_phone || user.phone_number || 'Телефон не указан',
          work_phone: doctorData.work_phone,
          email: doctorData.work_email || user.email || 'Email не указан',
          work_email: doctorData.work_email,
          address: doctorData.address || 'Адрес не указан',
          working_hours: doctorData.working_hours || 'Рабочие часы не указаны',
          consultation_fee: doctorData.consultation_fee 
            ? `${Number(doctorData.consultation_fee).toLocaleString('ru-RU')} сум`
            : 'Стоимость не указана',
          availability: doctorData.availability || doctorData.availability_status || 'Доступность не указана',
          rating: Number(doctorData.rating) || 0,
          total_reviews: doctorData.reviews_count || doctorData.total_reviews || 0,
          reviews_count: doctorData.reviews_count,
          total_patients: doctorData.patients_accepted_count || doctorData.total_patients || 0,
          patients_accepted_count: doctorData.patients_accepted_count,
          monthly_consultations: doctorData.consultations_count || doctorData.monthly_consultations || 0,
          consultations_count: doctorData.consultations_count,
          profile_picture: profilePicture,
          user: user,
          is_recommended: false
        }

        setDoctor(transformedDoctor)
      } catch (error: any) {
        console.error("Error fetching doctor:", error)
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken")
          router.push("/login")
        } else {
          setError(error.response?.data?.message || "Не удалось загрузить информацию о враче")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId, router])

  const handleAppointment = (doctor: Doctor) => {
    console.log("Записаться на прием к:", doctor.full_name)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDoctorForChat', JSON.stringify({
        id: doctor.id,
        name: doctor.full_name,
        phone: doctor.phone,
        email: doctor.email
      }))
      router.push('/dashboard/doctor/chat')
    }
  }

  const handleSendMessage = (doctor: Doctor) => {
    console.log("Написать сообщение:", doctor.full_name)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDoctorForChat', JSON.stringify({
        id: doctor.id,
        name: doctor.full_name,
        phone: doctor.phone,
        email: doctor.email
      }))
      router.push('/dashboard/doctor/chat')
    }
  }

  const handleShowReviews = () => {
    setShowReviews(true)
  }

  const closeReviews = () => {
    setShowReviews(false)
  }

  const getMockReviews = (doctorId: number) => {
    const reviews = [
      {
        id: 1,
        user_name: "Ахмад Умаров",
        rating: 5,
        comment: "Отличный врач! Очень внимательный и профессиональный. Помог решить мою проблему со здоровьем.",
        date: "2024-01-15",
        avatar: null
      },
      {
        id: 2,
        user_name: "Мария Петрова",
        rating: 4,
        comment: "Хороший специалист, но немного долго ждала на приеме. В целом довольна лечением.",
        date: "2024-01-10",
        avatar: null
      },
      {
        id: 3,
        user_name: "Сергей Иванов",
        rating: 5,
        comment: "Профессионал своего дела! Очень грамотно поставил диагноз и назначил лечение.",
        date: "2024-01-05",
        avatar: null
      },
      {
        id: 4,
        user_name: "Ольга Сидорова",
        rating: 5,
        comment: "Замечательный доктор! Всегда находит время для пациента, объясняет все доступно.",
        date: "2024-01-01",
        avatar: null
      }
    ]
    return reviews
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка информации о враче...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h2>
          <p className="text-gray-600 mb-4">{error || "Врач не найден"}</p>
          <Button onClick={() => router.push('/dashboard/doctor/doctors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к списку врачей
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/doctor/doctors')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к списку врачей
          </Button>
        </div>

        {/* Doctor Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-blue-200">
              <AvatarImage src={doctor.profile_picture || undefined} />
              <AvatarFallback className="bg-blue-500 text-white text-3xl font-bold">
                {doctor.first_name?.[0]}{doctor.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {doctor.full_name}
              </h1>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-lg">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialization && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {doctor.specialization}
                      </Badge>
                    )}
                    {doctor.specializations && doctor.specializations.map((spec: string, idx: number) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-700 border-purple-200">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  {doctor.experience}
                </Badge>
                {doctor.is_recommended && (
                  <Badge className="bg-red-100 text-red-700 border-red-200 px-4 py-2 text-lg">
                    <Heart className="w-5 h-5 mr-2" />
                    Рекомендуемый
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-xl font-bold text-gray-700">
                    {doctor.rating}
                  </span>
                  <span className="text-gray-500">({doctor.total_reviews} отзывов)</span>
                </div>
              </div>
              {doctor.bio && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {doctor.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-700 mb-1">{doctor.total_patients}</p>
              <p className="text-blue-600 font-medium">Пациенты</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">{doctor.monthly_consultations}</p>
              <p className="text-green-600 font-medium">Консультации</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-700 mb-1">{doctor.rating}</p>
              <p className="text-purple-600 font-medium">Рейтинг</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-700 mb-1">{doctor.total_reviews}</p>
              <p className="text-orange-600 font-medium">Отзывы</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <GraduationCap className="w-6 h-6" />
                  Образование и опыт
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Образование</label>
                  <p className="text-gray-900">{doctor.education}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Опыт работы</label>
                  <p className="text-gray-900">{doctor.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Сертификаты</label>
                  <p className="text-gray-900">{doctor.certifications}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Языки</label>
                  <p className="text-gray-900">{doctor.languages}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <Calendar className="w-6 h-6" />
                  Рабочий график
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Рабочие часы</label>
                  <p className="text-gray-900">{doctor.working_hours}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Доступность</label>
                  <p className="text-gray-900">{doctor.availability}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Стоимость консультации</label>
                  <p className="text-2xl font-bold text-green-600">{doctor.consultation_fee}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <MapPin className="w-6 h-6" />
                  Контактная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Телефон</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <a href={`tel:${doctor.phone}`} className="text-purple-600 hover:text-purple-700 font-medium">
                      {doctor.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <a href={`mailto:${doctor.email}`} className="text-purple-600 hover:text-purple-700 font-medium">
                      {doctor.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Адрес</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-900">{doctor.address}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Местоположение</label>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-900">{doctor.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <MessageCircle className="w-6 h-6" />
                  Действия
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAppointment(doctor)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Записаться на прием
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-green-300 text-green-600 hover:bg-green-50"
                  onClick={() => handleSendMessage(doctor)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Написать сообщение
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={handleShowReviews}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Посмотреть отзывы
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        {showReviews && (
          <Card className="mt-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Отзывы о {doctor.full_name}</CardTitle>
                  <p className="text-gray-600 mt-1">Оценки и комментарии пациентов</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeReviews}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Overall Rating */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">{doctor.rating}</div>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mt-1">{doctor.total_reviews} отзывов</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Общая оценка</h3>
                    <p className="text-gray-600">
                      Пациенты высоко оценивают профессионализм и качество лечения {doctor.first_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {getMockReviews(doctor.id).map((review) => (
                  <Card key={review.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {review.user_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user_name}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${
                                    star <= review.rating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {getMockReviews(doctor.id).length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">Пока нет отзывов</p>
                  <p className="text-gray-600">Будьте первым, кто оставит отзыв о {doctor.first_name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

