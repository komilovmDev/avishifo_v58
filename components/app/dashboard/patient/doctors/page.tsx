"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Stethoscope, Heart, Droplets, Brain, ChevronRight, User, Eye, ArrowLeft, Phone, Video, MessageCircle, Star, MapPin, Clock, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"

import { API_CONFIG } from "../../../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export default function PatientDoctorsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState(null)
  const [currentView, setCurrentView] = useState("specializations") // "specializations" or "doctors"
  const [doctorsInCategory, setDoctorsInCategory] = useState([])

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

  // Mock data for specializations
  const specializations = [
    {
      id: 1,
      name: "Терапия (внутренние болезни)",
      description: "Диагностика и лечение внутренних болезней",
      icon: Stethoscope,
      doctorCount: 2,
      iconColor: "from-blue-500 to-purple-500",
      isHighlighted: true
    },
    {
      id: 2,
      name: "Кардиология",
      description: "Заболевания сердца и сосудов",
      icon: Heart,
      doctorCount: 1,
      iconColor: "from-pink-500 to-red-500"
    },
    {
      id: 3,
      name: "Гематология",
      description: "Заболевания крови и кроветворных органов",
      icon: Droplets,
      doctorCount: 2,
      iconColor: "from-pink-500 to-red-500"
    },
    {
      id: 4,
      name: "Нейрохирургия",
      description: "Операции на головном и спинном мозге",
      icon: Brain,
      doctorCount: 1,
      iconColor: "from-pink-500 to-purple-500"
    },
    {
      id: 5,
      name: "Неврология",
      description: "Заболевания нервной системы",
      icon: Brain,
      doctorCount: 1,
      iconColor: "from-pink-500 to-purple-500"
    },
    {
      id: 6,
      name: "Офтальмология",
      description: "Заболевания глаз и зрения",
      icon: Eye,
      doctorCount: 1,
      iconColor: "from-blue-500 to-cyan-500"
    }
  ]

  // Mock data for doctors in each specialization
  const doctorsBySpecialization = {
    1: [ // Терапия
      {
        id: 1,
        name: "Доктор Akbar Tugayevich",
        specialty: "Терапевт",
        rating: 4.9,
        experience: "12 лет",
        location: "Ташкент, ул. Навои, 15",
        availability: "Сегодня 15:00",
        avatar: "/placeholder.svg",
        isOnline: true,
        languages: ["Узбекский", "Русский"],
        price: "150,000 сум",
        education: "Ташкентский медицинский университет",
        certifications: ["Сертификат терапевта", "Сертификат семейного врача"]
      },
      {
        id: 2,
        name: "Доктор Elena Petrovna",
        specialty: "Терапевт",
        rating: 4.8,
        experience: "18 лет",
        location: "Ташкент, ул. Амира Темура, 25",
        availability: "Завтра 10:00",
        avatar: "/placeholder.svg",
        isOnline: false,
        languages: ["Русский", "Узбекский", "Английский"],
        price: "180,000 сум",
        education: "Московский медицинский университет",
        certifications: ["Сертификат терапевта", "Сертификат кардиолога"]
      }
    ],
    2: [ // Кардиология
      {
        id: 3,
        name: "Доктор Kali Linux",
        specialty: "Кардиолог",
        rating: 4.8,
        experience: "15 лет",
        location: "Ташкент, ул. Чиланзар, 8",
        availability: "Пятница 14:00",
        avatar: "/placeholder.svg",
        isOnline: false,
        languages: ["Узбекский", "Русский"],
        price: "250,000 сум",
        education: "Ташкентский медицинский университет",
        certifications: ["Сертификат кардиолога", "Сертификат ЭКГ"]
      }
    ],
    3: [ // Гематология
      {
        id: 4,
        name: "Доктор Sarah Johnson",
        specialty: "Гематолог",
        rating: 4.7,
        experience: "20 лет",
        location: "Ташкент, ул. Мирзо Улугбека, 12",
        availability: "Среда 16:00",
        avatar: "/placeholder.svg",
        isOnline: true,
        languages: ["Английский", "Узбекский"],
        price: "300,000 сум",
        education: "Гарвардский медицинский университет",
        certifications: ["Сертификат гематолога", "Сертификат онколога"]
      },
      {
        id: 5,
        name: "Доктор Ахмад Расулов",
        specialty: "Гематолог",
        rating: 4.6,
        experience: "14 лет",
        location: "Ташкент, ул. Шайхонтохур, 30",
        availability: "Вторник 11:00",
        avatar: "/placeholder.svg",
        isOnline: false,
        languages: ["Узбекский", "Русский"],
        price: "280,000 сум",
        education: "Ташкентский медицинский университет",
        certifications: ["Сертификат гематолога"]
      }
    ],
    4: [ // Нейрохирургия
      {
        id: 6,
        name: "Доктор Михаил Иванов",
        specialty: "Нейрохирург",
        rating: 4.9,
        experience: "25 лет",
        location: "Ташкент, ул. Сергели, 45",
        availability: "Понедельник 9:00",
        avatar: "/placeholder.svg",
        isOnline: true,
        languages: ["Русский", "Узбекский"],
        price: "500,000 сум",
        education: "Московский медицинский университет",
        certifications: ["Сертификат нейрохирурга", "Сертификат спинальной хирургии"]
      }
    ],
    5: [ // Неврология
      {
        id: 7,
        name: "Доктор Rasulbek Palankas",
        specialty: "Невролог",
        rating: 4.7,
        experience: "10 лет",
        location: "Ташкент, ул. Юнусабад, 22",
        availability: "Сегодня 18:00",
        avatar: "/placeholder.svg",
        isOnline: true,
        languages: ["Узбекский", "Русский"],
        price: "220,000 сум",
        education: "Ташкентский медицинский университет",
        certifications: ["Сертификат невролога", "Сертификат ЭЭГ"]
      }
    ],
    6: [ // Офтальмология
      {
        id: 8,
        name: "Доктор Анна Сидорова",
        specialty: "Офтальмолог",
        rating: 4.8,
        experience: "16 лет",
        location: "Ташкент, ул. Чиланзар, 18",
        availability: "Четверг 13:00",
        avatar: "/placeholder.svg",
        isOnline: false,
        languages: ["Русский", "Узбекский"],
        price: "200,000 сум",
        education: "Санкт-Петербургский медицинский университет",
        certifications: ["Сертификат офтальмолога", "Сертификат лазерной хирургии"]
      }
    ]
  }

  // Mock data for recommended doctors
  const recommendedDoctors = [
    {
      id: 1,
      name: "Доктор Akbar Tugayevich",
      specialty: "Терапевт",
      avatar: "/placeholder.svg",
      initials: "AT",
      isOnline: true,
      rating: 4.9,
      experience: "12 лет"
    },
    {
      id: 2,
      name: "Доктор Kali Linux",
      specialty: "Кардиолог",
      avatar: "/placeholder.svg",
      initials: "KL",
      isOnline: false,
      rating: 4.8,
      experience: "15 лет"
    },
    {
      id: 3,
      name: "Доктор Rasulbek Palankas",
      specialty: "Невролог",
      avatar: "/placeholder.svg",
      initials: "RP",
      isOnline: true,
      rating: 4.7,
      experience: "10 лет"
    }
  ]

  // Filter specializations based on search
  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle specialization click - enter category
  const handleSpecializationClick = (specialization) => {
    setSelectedSpecialization(specialization)
    setDoctorsInCategory(doctorsBySpecialization[specialization.id] || [])
    setCurrentView("doctors")
  }

  // Go back to specializations view
  const handleBackToSpecializations = () => {
    setCurrentView("specializations")
    setSelectedSpecialization(null)
    setDoctorsInCategory([])
  }

  // Handle doctor actions
  const handleDoctorAction = (action, doctor) => {
    switch (action) {
      case 'appointment':
        console.log("Book appointment with:", doctor.name)
        // Add appointment booking logic
        break
      case 'chat':
        console.log("Start chat with:", doctor.name)
        // Add chat logic
        break
      case 'profile':
        console.log("View profile of:", doctor.name)
        // Add profile view logic
        break
      case 'call':
        console.log("Call doctor:", doctor.name)
        // Add call logic
        break
      case 'video':
        console.log("Video call with:", doctor.name)
        // Add video call logic
        break
      default:
        break
    }
  }

  // Render specializations view
  const renderSpecializationsView = () => (
    <>
      {/* Specializations Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Специализации</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecializations.map((specialization) => (
            <Card 
              key={specialization.id} 
              className={`bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                specialization.isHighlighted ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSpecializationClick(specialization)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${specialization.iconColor} rounded-xl flex items-center justify-center shadow-lg`}>
                    <specialization.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                    {specialization.doctorCount} врачей
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    {specialization.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {specialization.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Доступно врачей: {specialization.doctorCount}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Doctors Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Рекомендуемые Врачи</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedDoctors.map((doctor) => (
            <Card key={doctor.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-semibold">
                      {doctor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                      {doctor.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-indigo-600 font-medium">{doctor.specialty}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <span>★ {doctor.rating}</span>
                      <span>•</span>
                      <span>{doctor.experience}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-lg"
                    onClick={() => handleDoctorAction('appointment', doctor)}
                  >
                    Записаться
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-lg"
                    onClick={() => handleDoctorAction('chat', doctor)}
                  >
                    Чат
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-2 text-indigo-600 hover:text-indigo-700"
                  onClick={() => handleDoctorAction('profile', doctor)}
                >
                  Посмотреть профиль →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )

  // Render doctors in category view
  const renderDoctorsInCategoryView = () => (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={handleBackToSpecializations}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedSpecialization?.name}
          </h1>
          <p className="text-gray-600">{selectedSpecialization?.description}</p>
        </div>
      </div>

      {/* Doctors in this category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctorsInCategory.map((doctor) => (
          <Card key={doctor.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-semibold">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-800">{doctor.name}</CardTitle>
                    <p className="text-indigo-600 font-medium">{doctor.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{doctor.rating}</span>
                      <span className="text-sm text-gray-500">({doctor.experience})</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${doctor.isOnline ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {doctor.isOnline ? 'Онлайн' : 'Офлайн'}
                  </Badge>
                  <p className="text-lg font-bold text-indigo-600">{doctor.price}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-green-600 font-medium">{doctor.availability}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>{doctor.languages.join(', ')}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Образование:</strong> {doctor.education}</p>
                  <p><strong>Сертификаты:</strong> {doctor.certifications.join(', ')}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 rounded-lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Звонок
                </Button>
                <Button variant="outline" className="flex-1 rounded-lg">
                  <Video className="w-4 h-4 mr-2" />
                  Видео
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Чат
                </Button>
              </div>

              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md shadow-green-200/50 rounded-lg">
                <Calendar className="w-4 h-4 mr-2" />
                Записаться на прием
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No doctors message */}
      {doctorsInCategory.length === 0 && (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Врачи не найдены
            </h3>
            <p className="text-gray-500 mb-4">
              В данной специализации пока нет доступных врачей
            </p>
            <Button 
              variant="outline" 
              onClick={handleBackToSpecializations}
            >
              Вернуться к специализациям
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Наши Врачи</h1>
          <p className="text-gray-600">Выберите специалиста для консультации</p>
        </div>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
          <Stethoscope className="w-4 h-4 mr-1" />
          Рекомендуемый
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={currentView === "specializations" ? "Поиск врачей по имени или специальности..." : "Поиск врачей в категории..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-md rounded-xl h-12"
        />
      </div>

      {/* Render appropriate view */}
      {currentView === "specializations" ? renderSpecializationsView() : renderDoctorsInCategoryView()}

      {/* Quick Actions - only show in specializations view */}
      {currentView === "specializations" && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">Не нашли нужного специалиста?</h3>
              <p className="text-indigo-600 mb-4">Оставьте заявку, и мы подберем для вас подходящего врача</p>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-200/50">
                <Stethoscope className="w-4 h-4 mr-2" />
                Оставить заявку
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
