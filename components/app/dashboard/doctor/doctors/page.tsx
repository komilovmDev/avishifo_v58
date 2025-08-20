"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, Stethoscope, MapPin, Star, Phone, Mail, Calendar, 
  Clock, GraduationCap, Award, Users, MessageCircle, Eye,
  X, Building, Globe, Shield, Zap, TrendingUp, CheckCircle,
  ArrowLeft, Home, Heart, UserCheck, ChevronRight, Brain,
  Activity, Baby, Scissors
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"

const API_BASE_URL = "https://new.avishifo.uz"

// Type definitions
interface Doctor {
  id: number
  full_name: string
  first_name: string
  last_name: string
  specialization: string
  experience: string
  education: string
  location: string
  bio: string
  languages: string
  certifications: string
  phone: string
  email: string
  address: string
  working_hours: string
  consultation_fee: string
  availability: string
  rating: number
  total_reviews: number
  total_patients: number
  monthly_consultations: number
  profile_picture: string | null
  is_recommended?: boolean
}

type DoctorsByCategory = Record<string, Doctor[]>

// Mock data for doctors by categories
const MOCK_DOCTORS_BY_CATEGORY: DoctorsByCategory = {
  "Кардиология": [
    {
      id: 1,
      full_name: "Доктор Ахмедов Алишер",
      first_name: "Алишер",
      last_name: "Ахмедов",
      specialization: "Кардиолог",
      experience: "15 лет",
      education: "Ташкентский медицинский университет",
      location: "Ташкент, Узбекистан",
      bio: "Опытный кардиолог с 15-летним стажем работы. Специализируюсь на лечении сердечно-сосудистых заболеваний.",
      languages: "Узбекский, Русский, Английский",
      certifications: "Сертификат кардиолога, Европейское общество кардиологов",
      phone: "+998 90 123 45 67",
      email: "alisher.ahmedov@example.com",
      address: "ул. Навои, 15, Ташкент, Узбекистан",
      working_hours: "9:00-18:00",
      consultation_fee: "150,000 сум",
      availability: "Понедельник - Пятница",
      rating: 4.9,
      total_reviews: 156,
      total_patients: 127,
      monthly_consultations: 89,
      profile_picture: null,
      is_recommended: true
    },
    {
      id: 2,
      full_name: "Доктор Каримова Фарида",
      first_name: "Фарида",
      last_name: "Каримова",
      specialization: "Кардиолог",
      experience: "12 лет",
      education: "Самаркандский медицинский институт",
      location: "Самарканд, Узбекистан",
      bio: "Специалист по кардиологии с опытом работы в ведущих клиниках. Эксперт по эхокардиографии.",
      languages: "Узбекский, Русский",
      certifications: "Сертификат по эхокардиографии",
      phone: "+998 91 234 56 78",
      email: "farida.karimova@example.com",
      address: "ул. Регистан, 25, Самарканд, Узбекистан",
      working_hours: "8:00-17:00",
      consultation_fee: "120,000 сум",
      availability: "Понедельник - Суббота",
      rating: 4.8,
      total_reviews: 98,
      total_patients: 89,
      monthly_consultations: 67,
      profile_picture: null
    }
  ],
  "Неврология": [
    {
      id: 3,
      full_name: "Доктор Усманов Рашид",
      first_name: "Рашид",
      last_name: "Усманов",
      specialization: "Невролог",
      experience: "18 лет",
      education: "Ташкентский педиатрический медицинский институт",
      location: "Ташкент, Узбекистан",
      bio: "Ведущий невролог с обширным опытом в лечении неврологических заболеваний. Специалист по инсультам.",
      languages: "Узбекский, Русский, Английский, Немецкий",
      certifications: "Сертификат невролога, Европейская ассоциация неврологов",
      phone: "+998 90 345 67 89",
      email: "rashid.usmanov@example.com",
      address: "ул. Чиланзар, 45, Ташкент, Узбекистан",
      working_hours: "9:00-19:00",
      consultation_fee: "180,000 сум",
      availability: "Понедельник - Пятница",
      rating: 4.9,
      total_reviews: 203,
      total_patients: 189,
      monthly_consultations: 112,
      profile_picture: null,
      is_recommended: true
    }
  ],
  "Педиатрия": [
    {
      id: 4,
      full_name: "Доктор Нурматова Дильфуза",
      first_name: "Дильфуза",
      last_name: "Нурматова",
      specialization: "Педиатр",
      experience: "10 лет",
      education: "Ташкентский педиатрический медицинский институт",
      location: "Ташкент, Узбекистан",
      bio: "Детский врач с большим опытом работы. Специализируюсь на лечении детей от 0 до 18 лет.",
      languages: "Узбекский, Русский",
      certifications: "Сертификат педиатра",
      phone: "+998 90 456 78 90",
      email: "dilfuza.nurmatova@example.com",
      address: "ул. Юнусабад, 78, Ташкент, Узбекистан",
      working_hours: "8:00-16:00",
      consultation_fee: "100,000 сум",
      availability: "Понедельник - Суббота",
      rating: 4.7,
      total_reviews: 145,
      total_patients: 234,
      monthly_consultations: 156,
      profile_picture: null,
      is_recommended: true
    }
  ],
  "Хирургия": [
    {
      id: 5,
      full_name: "Доктор Рахимов Шухрат",
      first_name: "Шухрат",
      last_name: "Рахимов",
      specialization: "Хирург",
      experience: "20 лет",
      education: "Ташкентский медицинский университет",
      location: "Ташкент, Узбекистан",
      bio: "Опытный хирург с обширной практикой. Специализируюсь на общей и сосудистой хирургии.",
      languages: "Узбекский, Русский, Английский",
      certifications: "Сертификат хирурга, Американская ассоциация хирургов",
      phone: "+998 90 567 89 01",
      email: "shukhurat.rakhimov@example.com",
      address: "ул. Сергели, 12, Ташкент, Узбекистан",
      working_hours: "8:00-18:00",
      consultation_fee: "200,000 сум",
      availability: "Понедельник - Пятница",
      rating: 4.8,
      total_reviews: 167,
      total_patients: 145,
      monthly_consultations: 78,
      profile_picture: null
    }
  ]
}

export default function DoctorsPage() {
  const router = useRouter()
  const [doctorsByCategory, setDoctorsByCategory] = useState<DoctorsByCategory>(MOCK_DOCTORS_BY_CATEGORY)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'info', message: string } | null>(null)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    // In real app, fetch doctors from API
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (token) {
        const response = await axios.get(`${API_BASE_URL}/api/doctors/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Group doctors by specialization
        const grouped = groupDoctorsBySpecialization(response.data)
        setDoctorsByCategory(grouped)
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
      // Use mock data if API fails
    } finally {
      setIsLoading(false)
    }
  }

  const groupDoctorsBySpecialization = (doctors: Doctor[]): DoctorsByCategory => {
    const grouped: DoctorsByCategory = {}
    doctors.forEach(doctor => {
      const spec = doctor.specialization || "Другое"
      if (!grouped[spec]) {
        grouped[spec] = []
      }
      grouped[spec].push(doctor)
    })
    return grouped
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    
    // Recently viewed doctors ga qo'shish
    const recentlyViewed = localStorage.getItem('recentlyViewedDoctors')
    let viewedIds: number[] = []
    
    if (recentlyViewed) {
      try {
        viewedIds = JSON.parse(recentlyViewed)
      } catch (error) {
        console.error("Error parsing recently viewed doctors:", error)
        viewedIds = []
      }
    }
    
    // Doctor ID ni boshiga qo'shish (agar allaqachon bor bo'lsa, uni olib tashlash)
    viewedIds = viewedIds.filter(id => id !== doctor.id)
    viewedIds.unshift(doctor.id)
    
    // Faqat oxirgi 10 ta doctor ni saqlash
    viewedIds = viewedIds.slice(0, 10)
    
    localStorage.setItem('recentlyViewedDoctors', JSON.stringify(viewedIds))
  }

  const closeDoctorModal = () => {
    setSelectedDoctor(null)
  }

  const handleAppointment = (doctor: Doctor) => {
    // Telefon qilish uchun chat page ga o'tish
    console.log("Записаться на прием к:", doctor.full_name)
    
    // Doctor ma'lumotlarini localStorage ga saqlash (chat page da telefon qilish uchun)
    localStorage.setItem('selectedDoctorForChat', JSON.stringify({
      id: doctor.id,
      name: doctor.full_name,
      specialization: doctor.specialization,
      profile_picture: doctor.profile_picture,
      action: 'call' // Telefon qilish uchun belgi
    }))
    
    // Chat page ga o'tish
    router.push('/dashboard/doctor/chat')
  }

  const handleSendMessage = (doctor: Doctor) => {
    // SMS yuborish uchun chat page ga o'tish
    console.log("Отправить сообщение:", doctor.full_name)
    
    // Doctor ma'lumotlarini localStorage ga saqlash (chat page da SMS yuborish uchun)
    localStorage.setItem('selectedDoctorForChat', JSON.stringify({
      id: doctor.id,
      name: doctor.full_name,
      specialization: doctor.specialization,
      profile_picture: doctor.profile_picture,
      action: 'message' // SMS yuborish uchun belgi
    }))
    
    // Chat page ga o'tish
    router.push('/dashboard/doctor/chat')
  }

  const handleShowReviews = () => {
    setShowReviews(true)
  }

  const closeReviews = () => {
    setShowReviews(false)
  }

  // Mock reviews data
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

  // Get recently viewed doctors (last 3 viewed)
  const getRecentlyViewedDoctors = () => {
    // localStorage dan recently viewed doctors ni olish
    const recentlyViewed = localStorage.getItem('recentlyViewedDoctors')
    if (recentlyViewed) {
      try {
        const viewedIds = JSON.parse(recentlyViewed)
        const viewedDoctors = Object.values(doctorsByCategory)
          .flat()
          .filter(doctor => viewedIds.includes(doctor.id))
          .slice(0, 3) // Show max 3 recently viewed doctors
        
        return viewedDoctors
      } catch (error) {
        console.error("Error parsing recently viewed doctors:", error)
      }
    }
    
    // Agar hech qanday recently viewed yo'q bo'lsa, default 3 ta doctor ko'rsatish
    return Object.values(doctorsByCategory)
      .flat()
      .slice(0, 3)
  }

  // Get doctors for selected category
  const categoryDoctors = selectedCategory ? doctorsByCategory[selectedCategory] || [] : []

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        {/* <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/dashboard/doctor" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Home className="w-4 h-4" />
            Главная
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Врачи</span>
        </div> */}

        {/* Header */}
        {/* <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/doctor">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Врачи</h1>
              <p className="text-gray-600">Найдите и выберите врача по специализации</p>
            </div>
          </div>
        </div> */}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Поиск врачей по имени, специализации или местоположению..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {!selectedCategory ? (
          <>
                         {/* Categories Section */}
             <div className="bg-white rounded-lg shadow-sm border p-6">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Специализации</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Object.entries(doctorsByCategory).map(([category, doctors]) => {
                   // Har bir kategoriya uchun alohida ikonka va rang
                   let icon, description, gradientStyle, iconBgStyle, iconColor
                   
                   switch(category) {
                     case "Кардиология":
                       icon = Heart
                       description = "Заболевания сердца и сосудов"
                       gradientStyle = "linear-gradient(to right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconColor = "text-white"
                       break
                     case "Неврология":
                       icon = Brain
                       description = "Заболевания нервной системы"
                       gradientStyle = "linear-gradient(to right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconColor = "text-white"
                       break
                     case "Педиатрия":
                       icon = Baby
                       description = "Здоровье детей и подростков"
                       gradientStyle = "linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconColor = "text-white"
                       break
                     case "Хирургия":
                       icon = Scissors
                       description = "Оперативное лечение заболеваний"
                       gradientStyle = "linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconColor = "text-white"
                       break
                     default:
                       icon = Stethoscope
                       description = "Общая медицина и первичная диагностика"
                       gradientStyle = "linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconColor = "text-white"
                   }
                   
                   return (
                     <Card 
                       key={category} 
                       className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300 group relative overflow-hidden"
                       onClick={() => handleCategoryClick(category)}
                     >
                       {/* Gradient border at top */}
                       <div className="absolute top-0 left-0 right-0 h-2" style={{ background: gradientStyle }}></div>
                       
                       <CardContent className="p-6">
                         {/* Doctor count badge - top right */}
                         <div className="absolute top-4 right-4 z-10">
                           <Badge className="px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-gray-700 border border-gray-200 shadow-sm">
                             {doctors.length} {doctors.length === 1 ? 'врач' : 'врачей'}
                           </Badge>
                         </div>
                         
                         <div className="flex items-start gap-4">
                           {/* Icon on the left side */}
                           <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: iconBgStyle }}>
                             {React.createElement(icon, { className: `w-6 h-6 ${iconColor}` })}
                           </div>
                           
                           {/* Content on the right side */}
                           <div className="flex-1 min-w-0">
                             <h3 className="text-xl font-semibold mb-2 text-gray-900">{category}</h3>
                             <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
                             
                             {/* Bottom info */}
                             <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                               <span className="text-sm text-gray-500">Доступно врачей: {doctors.length}</span>
                               <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                             </div>
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   )
                 })}
               </div>
             </div>

                         {/* Recently Viewed Doctors Section */}
             <div className="bg-white rounded-lg shadow-sm border p-6">
               <div className="flex items-center gap-3 mb-6">
                 <Clock className="w-8 h-8 text-blue-500" />
                 <h2 className="text-2xl font-bold text-gray-900">Недавно просмотренные врачи</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {getRecentlyViewedDoctors().map((doctor) => (
                   <Card 
                     key={doctor.id} 
                     className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
                     onClick={() => handleDoctorClick(doctor)}
                   >
                     <CardContent className="p-6">
                       <div className="flex items-start gap-4">
                         <Avatar className="w-16 h-16 border-2 border-blue-200">
                           <AvatarImage src={doctor.profile_picture || undefined} />
                           <AvatarFallback className="bg-blue-500 text-white text-lg font-bold">
                             {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                           </AvatarFallback>
                         </Avatar>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-2">
                             <h3 className="text-lg font-semibold text-gray-900 truncate">
                               {doctor.full_name}
                             </h3>
                             <Clock className="w-4 h-4 text-blue-500" />
                           </div>
                           <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-3">
                             {doctor.specialization}
                           </Badge>
                           <div className="space-y-2 text-sm text-gray-600">
                             <div className="flex items-center gap-2">
                               <MapPin className="w-4 h-4 text-gray-400" />
                               <span className="truncate">{doctor.location}</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <Star className="w-4 h-4 text-yellow-400 fill-current" />
                               <span>{doctor.rating} ({doctor.total_reviews} отзывов)</span>
                             </div>
                           </div>
                         </div>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-gray-100">
                         <div className="flex items-center justify-between text-sm mb-3">
                           <span className="text-gray-500">Консультация:</span>
                           <span className="font-semibold text-green-600">{doctor.consultation_fee}</span>
                         </div>
                         <Button 
                           variant="outline" 
                           className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                           onClick={(e) => {
                             e.stopPropagation()
                             handleDoctorClick(doctor)
                           }}
                         >
                           <Eye className="w-4 h-4 mr-2" />
                           Подробнее
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </div>
          </>
        ) : (
          /* Category Doctors Section */
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToCategories}
                className="text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к категориям
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCategory}</h2>
                <p className="text-gray-600">{categoryDoctors.length} врачей в этой специализации</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryDoctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
                  onClick={() => handleDoctorClick(doctor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-blue-200">
                        <AvatarImage src={doctor.profile_picture || undefined} />
                        <AvatarFallback className="bg-blue-500 text-white text-lg font-bold">
                          {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                          {doctor.full_name}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-3">
                          {doctor.specialization}
                        </Badge>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{doctor.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{doctor.experience}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{doctor.rating} ({doctor.total_reviews} отзывов)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Консультация:</span>
                        <span className="font-semibold text-green-600">{doctor.consultation_fee}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-3 border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDoctorClick(doctor)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Подробнее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Detail Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Информация о враче</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeDoctorModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {/* Doctor Header */}
                <div className="flex items-start gap-6 mb-8">
                  <Avatar className="w-24 h-24 border-4 border-blue-200">
                    <AvatarImage src={selectedDoctor.profile_picture || undefined} />
                    <AvatarFallback className="bg-blue-500 text-white text-3xl font-bold">
                      {selectedDoctor.first_name?.[0]}{selectedDoctor.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {selectedDoctor.full_name}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-lg">
                        <Stethoscope className="w-5 h-5 mr-2" />
                        {selectedDoctor.specialization}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-lg">
                        <Clock className="w-5 h-5 mr-2" />
                        {selectedDoctor.experience}
                      </Badge>
                      {selectedDoctor.is_recommended && (
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
                          {selectedDoctor.rating}
                        </span>
                        <span className="text-gray-500">({selectedDoctor.total_reviews} отзывов)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {selectedDoctor.bio}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-700 mb-1">{selectedDoctor.total_patients}</p>
                      <p className="text-blue-600 font-medium">Пациенты</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-green-700 mb-1">{selectedDoctor.monthly_consultations}</p>
                      <p className="text-green-600 font-medium">Консультации</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-purple-700 mb-1">{selectedDoctor.rating}</p>
                      <p className="text-purple-600 font-medium">Рейтинг</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-orange-600" />
                      </div>
                      <p className="text-3xl font-bold text-orange-700 mb-1">{selectedDoctor.total_reviews}</p>
                      <p className="text-orange-600 font-medium">Отзывы</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                          <p className="text-gray-900">{selectedDoctor.education}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Опыт работы</label>
                          <p className="text-gray-900">{selectedDoctor.experience}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Сертификаты</label>
                          <p className="text-gray-900">{selectedDoctor.certifications}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Языки</label>
                          <p className="text-gray-900">{selectedDoctor.languages}</p>
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
                          <p className="text-gray-900">{selectedDoctor.working_hours}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Доступность</label>
                          <p className="text-gray-900">{selectedDoctor.availability}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Стоимость консультации</label>
                          <p className="text-2xl font-bold text-green-600">{selectedDoctor.consultation_fee}</p>
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
                            <a href={`tel:${selectedDoctor.phone}`} className="text-purple-600 hover:text-purple-700 font-medium">
                              {selectedDoctor.phone}
                            </a>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-600" />
                            <a href={`mailto:${selectedDoctor.email}`} className="text-purple-600 hover:text-purple-700 font-medium">
                              {selectedDoctor.email}
                            </a>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Адрес</label>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-900">{selectedDoctor.address}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Местоположение</label>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-900">{selectedDoctor.location}</span>
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
                           onClick={() => handleAppointment(selectedDoctor)}
                         >
                           <Phone className="w-4 h-4 mr-2" />
                           Записаться на прием
                         </Button>
                         <Button 
                           variant="outline" 
                           className="w-full border-green-300 text-green-600 hover:bg-green-50"
                           onClick={() => handleSendMessage(selectedDoctor)}
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
              </div>
            </div>
          </div>
                 )}

         {/* Reviews Modal */}
         {showReviews && selectedDoctor && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
             <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
               <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <h2 className="text-2xl font-bold text-gray-900">Отзывы о {selectedDoctor.full_name}</h2>
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
               </div>

               <div className="p-6">
                 {/* Overall Rating */}
                 <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                   <div className="flex items-center gap-4">
                     <div className="text-center">
                       <div className="text-4xl font-bold text-blue-600">{selectedDoctor.rating}</div>
                       <div className="flex items-center gap-1 mt-2">
                         {[1, 2, 3, 4, 5].map((star) => (
                           <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                         ))}
                       </div>
                       <p className="text-gray-600 mt-1">{selectedDoctor.total_reviews} отзывов</p>
                     </div>
                     <div className="flex-1">
                       <h3 className="text-lg font-semibold text-gray-900 mb-2">Общая оценка</h3>
                       <p className="text-gray-600">
                         Пациенты высоко оценивают профессионализм и качество лечения {selectedDoctor.first_name}
                       </p>
                     </div>
                   </div>
                 </div>

                 {/* Reviews List */}
                 <div className="space-y-4">
                   {getMockReviews(selectedDoctor.id).map((review) => (
                     <Card key={review.id} className="border border-gray-200">
                       <CardContent className="p-6">
                         <div className="flex items-start gap-4">
                           <Avatar className="w-12 h-12">
                             <AvatarImage src={review.avatar || undefined} />
                             <AvatarFallback className="bg-blue-500 text-white text-sm font-bold">
                               {review.user_name.split(' ').map(n => n[0]).join('')}
                             </AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                               <div className="flex items-center gap-1">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <Star 
                                     key={star} 
                                     className={`w-4 h-4 ${
                                       star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                     }`} 
                                   />
                                 ))}
                               </div>
                               <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                 {review.rating}/5
                               </Badge>
                             </div>
                             <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                             <p className="text-sm text-gray-500">{review.date}</p>
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>

                 {/* No Reviews Message */}
                 {getMockReviews(selectedDoctor.id).length === 0 && (
                   <div className="text-center py-8">
                     <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                     <h3 className="text-lg font-medium text-gray-900 mb-2">Отзывов пока нет</h3>
                     <p className="text-gray-600">Будьте первым, кто оставит отзыв о {selectedDoctor.first_name}</p>
                   </div>
                 )}
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   )
 }
