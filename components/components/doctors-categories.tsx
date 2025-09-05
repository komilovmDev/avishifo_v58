"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ChevronRight, Calendar, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

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
}

interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  doctorsCount: number
}

export default function DoctorsCategories() {
  const [searchQuery, setSearchQuery] = useState("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Определение категорий с иконками и цветами
  const categoryDefinitions = [
    {
      id: "therapist",
      name: "Терапевт",
      description: "Общая медицина и первичная диагностика",
      icon: <span className="text-4xl">🩺</span>,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "cardiologist",
      name: "Кардиолог",
      description: "Заболевания сердца и сосудов",
      icon: <span className="text-4xl">❤️</span>,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "neurologist",
      name: "Невролог",
      description: "Заболевания нервной системы",
      icon: <span className="text-4xl">🧠</span>,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "dermatologist",
      name: "Дерматолог",
      description: "Заболевания кожи",
      icon: <span className="text-4xl">🔬</span>,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "pediatrician",
      name: "Педиатр",
      description: "Детская медицина",
      icon: <span className="text-4xl">👶</span>,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "psychiatrist",
      name: "Психиатр",
      description: "Психическое здоровье",
      icon: <span className="text-4xl">🧘</span>,
      color: "from-teal-500 to-cyan-500",
    },
  ]

  // Маппинг специальностей из API к нашим категориям
  const specialtyToCategory: Record<string, string> = {
    general: "therapist",
    cardiology: "cardiologist",
    neurology: "neurologist",
    dermatology: "dermatologist",
    pediatrics: "pediatrician",
    psychiatry: "psychiatrist",
    // Добавьте другие маппинги по мере необходимости
  }

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

  // Получение специализаций для врача
  const getDoctorSpecializations = (specialty: string): string[] => {
    const specializations: Record<string, string[]> = {
      therapist: ["Общая терапия", "Профилактика", "Диагностика"],
      cardiologist: ["Ишемическая болезнь", "Аритмии", "Гипертония"],
      neurologist: ["Головные боли", "Эпилепсия", "Инсульт"],
      dermatologist: ["Акне", "Аллергии", "Экзема"],
      pediatrician: ["Детские болезни", "Вакцинация", "Развитие"],
      psychiatrist: ["Депрессия", "Тревожность", "Психотерапия"],
    }

    const category = specialtyToCategory[specialty] || specialty
    return specializations[category] || ["Общая практика"]
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
    ]
    return slots[index % slots.length]
  }

  // Преобразование данных API в формат компонента
  const transformDoctorData = (apiDoctors: DoctorApiType[]): Doctor[] => {
    return apiDoctors.map((doctor, index) => {
      // Определяем категорию на основе специальности
      const category = specialtyToCategory[doctor.specialty] || "therapist"

      // Генерируем отзывы на основе рейтинга (чем выше рейтинг, тем больше отзывов)
      const rating = Number.parseFloat(doctor.rating) || 4.5
      const reviewsCount = Math.floor(50 + rating * 20)

      // Получаем специализации для этой категории
      const specializations = getDoctorSpecializations(doctor.specialty)

      // Форматируем имя врача
      const fullName = doctor.user.full_name || `${doctor.user.first_name} ${doctor.user.last_name}`
      const formattedName = fullName.startsWith("Доктор") ? fullName : `Доктор ${fullName}`

      return {
        id: doctor.id,
        name: formattedName,
        specialty: categoryDefinitions.find((cat) => cat.id === category)?.name || "Врач",
        rating: rating.toFixed(1),
        reviews: reviewsCount,
        available: doctor.is_available,
        experience: `${doctor.years_of_experience} лет`,
        price: `${doctor.consultation_fee || "3000"} ₽`,
        nextSlot: getNextAvailableSlot(index),
        specializations: specializations,
        avatar: doctor.user.profile_picture,
        category: category,
      }
    })
  }

  // Получение списка врачей из API
  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await apiRequest("/api/doctors/")
      console.log("Doctors API response:", response.data)

      // Получаем данные
      const doctorsData = response.data.results || response.data

      // Преобразуем данные в формат компонента
      const transformedDoctors = transformDoctorData(doctorsData)
      setDoctors(transformedDoctors)

      // Обновляем категории с количеством врачей
      const doctorsByCategory: Record<string, number> = {}

      // Подсчитываем количество врачей в каждой категории
      transformedDoctors.forEach((doctor) => {
        doctorsByCategory[doctor.category] = (doctorsByCategory[doctor.category] || 0) + 1
      })

      // Создаем категории с количеством врачей
      const categoriesWithCount = categoryDefinitions.map((category) => ({
        ...category,
        doctorsCount: doctorsByCategory[category.id] || 0,
      }))

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
        specialty: "Терапевт",
        rating: "4.9",
        reviews: 127,
        available: true,
        experience: "15 лет",
        price: "3000 ₽",
        nextSlot: "Сегодня 16:00",
        specializations: ["Общая терапия", "Профилактика", "Диагностика"],
        avatar: null,
        category: "therapist",
      },
      {
        id: 2,
        name: "Доктор Петрова Елена",
        specialty: "Кардиолог",
        rating: "4.8",
        reviews: 89,
        available: true,
        experience: "12 лет",
        price: "4500 ₽",
        nextSlot: "Завтра 10:30",
        specializations: ["Ишемическая болезнь", "Аритмии", "Гипертония"],
        avatar: null,
        category: "cardiologist",
      },
      {
        id: 3,
        name: "Доктор Смирнов Михаил",
        specialty: "Невролог",
        rating: "4.9",
        reviews: 156,
        available: true,
        experience: "18 лет",
        price: "4000 ₽",
        nextSlot: "Понедельник 14:00",
        specializations: ["Головные боли", "Эпилепсия", "Инсульт"],
        avatar: null,
        category: "neurologist",
      },
      {
        id: 4,
        name: "Доктор Козлова Анна",
        specialty: "Дерматолог",
        rating: "4.7",
        reviews: 78,
        available: true,
        experience: "10 лет",
        price: "3500 ₽",
        nextSlot: "Вторник 09:15",
        specializations: ["Акне", "Аллергии", "Экзема"],
        avatar: null,
        category: "dermatologist",
      },
      {
        id: 5,
        name: "Доктор Соколов Дмитрий",
        specialty: "Педиатр",
        rating: "4.8",
        reviews: 112,
        available: true,
        experience: "14 лет",
        price: "3800 ₽",
        nextSlot: "Среда 17:30",
        specializations: ["Детские болезни", "Вакцинация", "Развитие"],
        avatar: null,
        category: "pediatrician",
      },
      {
        id: 6,
        name: "Доктор Морозова Ольга",
        specialty: "Психиатр",
        rating: "4.9",
        reviews: 94,
        available: true,
        experience: "16 лет",
        price: "5000 ₽",
        nextSlot: "Четверг 11:45",
        specializations: ["Депрессия", "Тревожность", "Психотерапия"],
        avatar: null,
        category: "psychiatrist",
      },
    ]

    setDoctors(mockDoctors)

    // Создаем категории с количеством врачей
    const doctorsByCategory: Record<string, number> = {
      therapist: 8,
      cardiologist: 5,
      neurologist: 4,
      dermatologist: 3,
      pediatrician: 6,
      psychiatrist: 4,
    }

    const categoriesWithCount = categoryDefinitions.map((category) => ({
      ...category,
      doctorsCount: doctorsByCategory[category.id] || 0,
    }))

    setCategories(categoriesWithCount)

    toast({
      title: "Внимание",
      description: "Используются тестовые данные, так как API недоступен",
      variant: "warning",
    })
  }

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchDoctors()
  }, [])

  // Фильтрация врачей по поисковому запросу
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Отображение загрузки
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-2 text-lg">Загрузка врачей...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Наши Врачи</h1>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Специализации</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories
                .filter((category) => category.doctorsCount > 0) // Показываем только категории с врачами
                .map((category) => (
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
                          <div>{category.icon}</div>
                          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            {category.doctorsCount} врачей
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Доступно врачей: {category.doctorsCount}</span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Featured Doctors */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Рекомендуемые Врачи</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors
                .sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating)) // Сортировка по рейтингу
                .slice(0, 3) // Берем только первые 3
                .map((doctor) => {
                  const category = categories.find((cat) => cat.id === doctor.category)
                  return (
                    <Card
                      key={doctor.id}
                      className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className={`h-1 bg-gradient-to-r ${category?.color}`}></div>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                            <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                            <AvatarFallback className={`bg-gradient-to-r ${category?.color} text-white text-sm`}>
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
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500 text-sm">★</span>
                                <span className="text-xs font-medium">{doctor.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">({doctor.reviews})</span>
                            </div>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${doctor.available ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
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
                            {doctor.specializations.slice(0, 2).map((spec, index) => (
                              <Badge
                                key={index}
                                className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs px-2 py-0"
                              >
                                {spec}
                              </Badge>
                            ))}
                            {doctor.specializations.length > 2 && (
                              <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs px-2 py-0">
                                +{doctor.specializations.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className={`flex-1 rounded-lg shadow-sm text-sm h-8 ${
                              doctor.available
                                ? `bg-gradient-to-r ${category?.color} hover:opacity-90 text-white`
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={!doctor.available}
                            onClick={() => {
                              toast({
                                title: "Запись к врачу",
                                description: `Вы выбрали врача ${doctor.name}`,
                              })
                            }}
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Записаться
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0">
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        </>
      ) : (
        /* Search Results */
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Результаты поиска ({filteredDoctors.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => {
              const category = categories.find((cat) => cat.id === doctor.category)
              return (
                <Card
                  key={doctor.id}
                  className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className={`h-1 bg-gradient-to-r ${category?.color}`}></div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                        <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback className={`bg-gradient-to-r ${category?.color} text-white text-sm`}>
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
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-xs font-medium">{doctor.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({doctor.reviews})</span>
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${doctor.available ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
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
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className={`flex-1 rounded-lg shadow-sm text-sm h-8 ${
                          doctor.available
                            ? `bg-gradient-to-r ${category?.color} hover:opacity-90 text-white`
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!doctor.available}
                        onClick={() => {
                          toast({
                            title: "Запись к врачу",
                            description: `Вы выбрали врача ${doctor.name}`,
                          })
                        }}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Записаться
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0">
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
