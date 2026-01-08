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
  specialty?: string // Backend field
  specializations?: string[] // Multiple specializations
  experience: string
  years_of_experience?: number // Backend field
  education: string
  location: string
  bio: string
  languages: string
  languages_spoken?: string[] // Backend field
  certifications: string
  phone: string
  work_phone?: string // Backend field
  email: string
  work_email?: string // Backend field
  address: string
  working_hours: string
  consultation_fee: string
  availability: string
  rating: number
  total_reviews: number
  reviews_count?: number // Backend field
  total_patients: number
  patients_accepted_count?: number // Backend field
  monthly_consultations: number
  consultations_count?: number // Backend field
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

interface Specialty {
  value: string
  label: string
  count: number
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
  const [doctorsByCategory, setDoctorsByCategory] = useState<DoctorsByCategory>({})
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  // Removed selectedDoctor state - now using separate page
  //   // Removed selectedDoctor and showReviews - now using separate page
  // const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'info', message: string } | null>(null)
  // const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    // Check if we're in browser environment before fetching
    if (typeof window !== 'undefined') {
      // First fetch specialties, then doctors
      fetchSpecialties().then(() => {
        // After specialties are loaded, fetch doctors
        fetchDoctors()
      }).catch(() => {
        // If specialties fail, still try to fetch doctors
        fetchDoctors()
      })
    }
  }, [])

  // Fetch specialties/categories from API
  const fetchSpecialties = async (): Promise<void> => {
    setIsLoadingSpecialties(true)
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("accessToken")
        if (token) {
          // Add timestamp to prevent caching
          const url = `${API_CONFIG.ENDPOINTS.DOCTOR_SPECIALTIES}?t=${Date.now()}`
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log("Specialties API response:", response.data)
          if (response.data.success && response.data.data) {
            console.log("Fetched specialties from database:", response.data.data)
            console.log(`Total specialties: ${response.data.count}`)
            // Map to ensure we have value and label
            const mappedSpecialties = response.data.data.map((spec: any) => ({
              value: spec.value,
              label: spec.label,
              id: spec.id,
              count: spec.count || 0
            }))
            setSpecialties(mappedSpecialties)
          } else {
            console.warn("Specialties API response format unexpected:", response.data)
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching specialties:", error)
      if (error.response) {
        console.error("API Error Response:", error.response.data)
        console.error("API Error Status:", error.response.status)
      }
    } finally {
      setIsLoadingSpecialties(false)
    }
  }

  // Fetch doctors from API
  const fetchDoctors = async (specialty?: string, search?: string) => {
    setIsLoading(true)
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          console.error("No access token found")
          setIsLoading(false)
          return
        }
        
        let url = API_CONFIG.ENDPOINTS.DOCTORS
        const params = new URLSearchParams()
        
        if (specialty) {
          params.append('specialty', specialty)
        }
        if (search) {
          params.append('search', search)
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`
        }
        
        console.log("Fetching doctors from:", url)
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        console.log("Doctors API response:", response.data)
        
        // Handle different response formats
        let doctorsData = []
        if (Array.isArray(response.data)) {
          doctorsData = response.data
        } else if (response.data.results && Array.isArray(response.data.results)) {
          doctorsData = response.data.results
        } else if (response.data.data && Array.isArray(response.data.data)) {
          doctorsData = response.data.data
        } else {
          console.warn("Unexpected API response format:", response.data)
          doctorsData = []
        }
        
        console.log("Processed doctors data:", doctorsData)
        
        if (doctorsData.length === 0) {
          console.warn("No doctors found in API response")
          setAllDoctors([])
          setDoctorsByCategory({})
          return
        }
        
        // Transform backend data to frontend format - pass specialties for proper matching
        const transformedDoctors = transformDoctors(doctorsData, specialties)
        console.log("Transformed doctors:", transformedDoctors)
        console.log("Transformed doctors specializations:", transformedDoctors.map(d => ({
          id: d.id,
          name: d.full_name,
          specializations: d.specializations,
          specialty: d.specialty,
          specialization: d.specialization
        })))
        setAllDoctors(transformedDoctors)
        
        // Group doctors by specialization
        const grouped = groupDoctorsBySpecialization(transformedDoctors)
        console.log("Grouped doctors by category:", grouped)
        setDoctorsByCategory(grouped)
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error)
      if (error.response) {
        console.error("API Error Response:", error.response.data)
        console.error("API Error Status:", error.response.status)
      }
      // Use mock data if API fails
      console.log("Using mock data as fallback")
      setDoctorsByCategory(MOCK_DOCTORS_BY_CATEGORY)
    } finally {
      setIsLoading(false)
    }
  }

  // Transform backend doctor data to frontend format
  const transformDoctors = (doctors: any[], specialtiesList: Specialty[] = []): Doctor[] => {
    if (!Array.isArray(doctors) || doctors.length === 0) {
      console.warn("transformDoctors: Invalid or empty doctors array")
      return []
    }
    
    return doctors.map((doctor: any, index: number) => {
      try {
        // Handle user data - check different possible formats
        const user = doctor.user || {}
        const firstName = user.first_name || ''
        const lastName = user.last_name || ''
        const fullName = user.full_name || `${firstName} ${lastName}`.trim() || 'Имя не указано'
        
        // Handle profile picture - could be URL string or object
        let profilePicture = null
        if (user.profile_picture) {
          if (typeof user.profile_picture === 'string') {
            profilePicture = user.profile_picture.startsWith('http') 
              ? user.profile_picture 
              : `${API_CONFIG.BASE_URL}${user.profile_picture}`
          } else if (user.profile_picture.url) {
            profilePicture = user.profile_picture.url.startsWith('http')
              ? user.profile_picture.url
              : `${API_CONFIG.BASE_URL}${user.profile_picture.url}`
          }
        }
        
        // Get specialty label - backend sends specialty_label field which is the correct label
        // Priority: specialty_label > getSpecialtyLabel(specialty) > specialty (if looks like label)
        let specialtyLabel = 'Специализация не указана'
        let specialtyValue = doctor.specialty
        
        // Priority 1: Use specialty_label from backend (this is the correct label)
        if (doctor.specialty_label) {
          specialtyLabel = doctor.specialty_label
        }
        // Priority 2: Try to get label from specialties list using specialty value
        else if (specialtyValue) {
          const label = getSpecialtyLabel(specialtyValue, specialtiesList)
          if (label) {
            specialtyLabel = label
          }
        }
        // Priority 3: If specialty looks like a label (not a snake_case value and not a number), use it directly
        else if (specialtyValue && !specialtyValue.includes('_') && specialtyValue.length > 3 && !/^\d+$/.test(specialtyValue)) {
          specialtyLabel = specialtyValue
        }
        // Priority 4: Use specialty value as fallback (but this should be rare)
        else if (specialtyValue) {
          specialtyLabel = specialtyValue
        }
        
        // Handle languages
        let languagesStr = 'Языки не указаны'
        if (Array.isArray(doctor.languages_spoken)) {
          languagesStr = doctor.languages_spoken.join(', ')
        } else if (typeof doctor.languages_spoken === 'string') {
          languagesStr = doctor.languages_spoken
        }
        
        // Handle certifications
        let certificationsStr = 'Сертификаты не указаны'
        if (Array.isArray(doctor.certifications)) {
          certificationsStr = doctor.certifications.join(', ')
        } else if (typeof doctor.certifications === 'string') {
          certificationsStr = doctor.certifications
        }
        
        // Handle location
        const region = doctor.region || ''
        const country = doctor.country || 'Узбекистан'
        const location = `${region} ${country}`.trim() || 'Местоположение не указано'
        
        // Handle consultation fee
        let consultationFeeStr = 'Стоимость не указана'
        if (doctor.consultation_fee) {
          const fee = Number(doctor.consultation_fee)
          if (!isNaN(fee)) {
            consultationFeeStr = `${fee.toLocaleString('ru-RU')} сум`
          }
        }
        
        return {
          id: doctor.id || index,
          uuid: doctor.uuid || undefined,
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          specialization: specialtyLabel,
          specialty: specialtyValue || doctor.specialty,
          specializations: (() => {
            // Get specializations from backend - can be array of strings (labels) or array of objects
            if (doctor.specializations && Array.isArray(doctor.specializations) && doctor.specializations.length > 0) {
              const parsed = doctor.specializations.map((spec: any) => {
                if (typeof spec === 'string') {
                  // If it's already a label, use it
                  if (!spec.includes('_') && spec.length > 3) {
                    return spec
                  }
                  // Otherwise, try to get label from value
                  const label = getSpecialtyLabel(spec, specialtiesList)
                  return label || spec
                } else if (spec && typeof spec === 'object') {
                  // Backend returns {value, label} objects from SpecializationSerializer
                  // Always prefer label if available
                  if (spec.label) {
                    return spec.label
                  } else if (spec.value) {
                    const label = getSpecialtyLabel(spec.value, specialtiesList)
                    return label || spec.value
                  }
                  return spec
                }
                return spec
              }).filter((s: any) => s) // Remove any null/undefined values
              
              console.log(`Doctor ${doctor.id} (${fullName}) specializations:`, {
                original: doctor.specializations,
                parsed: parsed,
                specialtiesListLength: specialtiesList.length
              })
              
              return parsed.length > 0 ? parsed : (specialtyLabel ? [specialtyLabel] : [])
            }
            // Fallback: use specialty as single specialization
            const fallback = specialtyLabel ? [specialtyLabel] : []
            if (fallback.length > 0) {
              console.log(`Doctor ${doctor.id} (${fullName}) using fallback specialization:`, fallback)
            }
            return fallback
          })(),
          experience: doctor.years_of_experience ? `${doctor.years_of_experience} лет` : (doctor.experience_years_text || 'Опыт не указан'),
          years_of_experience: doctor.years_of_experience || 0,
          education: doctor.education || 'Образование не указано',
          location: location,
          bio: doctor.bio || '',
          languages: languagesStr,
          languages_spoken: Array.isArray(doctor.languages_spoken) ? doctor.languages_spoken : [],
          certifications: certificationsStr,
          phone: doctor.work_phone || user.phone_number || 'Телефон не указан',
          work_phone: doctor.work_phone,
          email: doctor.work_email || user.email || 'Email не указан',
          work_email: doctor.work_email,
          address: doctor.address || 'Адрес не указан',
          working_hours: doctor.working_hours || 'Рабочие часы не указаны',
          consultation_fee: consultationFeeStr,
          availability: doctor.availability || doctor.availability_status || 'Доступность не указана',
          rating: Number(doctor.rating) || 0,
          total_reviews: doctor.reviews_count || doctor.total_reviews || 0,
          reviews_count: doctor.reviews_count,
          total_patients: doctor.patients_accepted_count || doctor.total_patients || 0,
          patients_accepted_count: doctor.patients_accepted_count,
          monthly_consultations: doctor.consultations_count || doctor.monthly_consultations || 0,
          consultations_count: doctor.consultations_count,
          profile_picture: profilePicture,
          user: user,
          is_recommended: false
        }
      } catch (error) {
        console.error(`Error transforming doctor at index ${index}:`, error, doctor)
        return null as any
      }
    }).filter((doctor: Doctor | null) => doctor !== null) as Doctor[]
  }

  // Get specialty label from value
  const getSpecialtyLabel = (value: string, specialtiesList: Specialty[] = specialties): string | null => {
    const specialty = specialtiesList.find(s => s.value === value)
    return specialty ? specialty.label : null
  }

  // Group doctors by specialization
  const groupDoctorsBySpecialization = (doctors: Doctor[]): DoctorsByCategory => {
    const grouped: DoctorsByCategory = {}
    doctors.forEach(doctor => {
      // Use specializations if available, otherwise use specialization
      const specs = doctor.specializations && doctor.specializations.length > 0 
        ? doctor.specializations 
        : (doctor.specialization ? [doctor.specialization] : ["Другое"])
      
      specs.forEach(spec => {
        if (!grouped[spec]) {
          grouped[spec] = []
        }
        // Only add doctor once per category (avoid duplicates)
        if (!grouped[spec].find(d => d.id === doctor.id)) {
          grouped[spec].push(doctor)
        }
      })
    })
    return grouped
  }

  // Handle search - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Don't send specialty filter to backend - filter on frontend instead
      // This avoids 400 errors when specialty value doesn't match Doctor.SPECIALTIES choices
      fetchDoctors(undefined, searchTerm || undefined)
    }, 300) // Debounce search by 300ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm]) // Removed selectedCategory and specialties from dependencies to avoid re-fetching

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setSearchTerm("") // Clear search when selecting category
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSearchTerm("")
    fetchDoctors()
  }

  const handleDoctorClick = (doctor: Doctor) => {
    // Navigate to doctor detail page using UUID for security
    const doctorIdentifier = (doctor as any).uuid || doctor.id
    router.push(`/dashboard/doctor/doctors/${doctorIdentifier}`)
  }

  // Removed closeDoctorModal - now using separate page
  // const closeDoctorModal = () => {
  //   setSelectedDoctor(null)
  // }

  const handleAppointment = (doctor: Doctor) => {
    // Telefon qilish uchun chat page ga o'tish
    console.log("Записаться на прием к:", doctor.full_name)
    
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      // Doctor ma'lumotlarini localStorage ga saqlash (chat page da telefon qilish uchun)
      localStorage.setItem('selectedDoctorForChat', JSON.stringify({
        id: doctor.id,
        name: doctor.full_name,
        specialization: doctor.specialization,
        profile_picture: doctor.profile_picture,
        action: 'call' // Teleфон qilish uchun belgi
      }))
    }
    
    // Chat page ga o'tish
    router.push('/dashboard/doctor/chat')
  }

  const handleSendMessage = (doctor: Doctor) => {
    // SMS yuborish uchun chat page ga o'tish
    console.log("Отправить сообщение:", doctor.full_name)
    
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      // Doctor ma'lumotlarini localStorage ga saqlash (chat page da SMS yuborish uchun)
      localStorage.setItem('selectedDoctorForChat', JSON.stringify({
        id: doctor.id,
        name: doctor.full_name,
        specialization: doctor.specialization,
        profile_picture: doctor.profile_picture,
        action: 'message' // SMS yuborish uchun belgi
      }))
    }
    
    // Chat page ga o'tish
    router.push('/dashboard/doctor/chat')
  }

  // Removed handleShowReviews and closeReviews - now using separate page
  // const handleShowReviews = () => {
  //   setShowReviews(true)
  // }

  // const closeReviews = () => {
  //   setShowReviews(false)
  // }

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


  // Get doctors for selected category - filter on frontend
  const categoryDoctors = selectedCategory 
    ? (() => {
        const specialty = specialties.find(s => s.label === selectedCategory)
        if (!specialty) {
          // Fallback to old method
          return doctorsByCategory[selectedCategory] || []
        }
        
        // Filter doctors by specialization value or label (frontend filtering)
        const filtered = allDoctors.filter(d => {
          // Check specializations array
          if (d.specializations && Array.isArray(d.specializations) && d.specializations.length > 0) {
            return d.specializations.some((spec: any) => {
              // Handle string format (labels)
              if (typeof spec === 'string') {
                // Compare with both label and value (case-insensitive for safety)
                return spec.toLowerCase() === specialty.label.toLowerCase() || 
                       spec.toLowerCase() === specialty.value.toLowerCase() ||
                       spec === specialty.label || 
                       spec === specialty.value
              }
              // Object format should already be converted to strings in transformDoctors
              return false
            })
          }
          // Fallback: check main specialty field
          return d.specialty === specialty.value || 
                 d.specialization === specialty.label ||
                 (d.specialty && d.specialty.toLowerCase() === specialty.value.toLowerCase()) ||
                 (d.specialization && d.specialization.toLowerCase() === specialty.label.toLowerCase())
        })
        
        console.log(`Filtered doctors for "${selectedCategory}":`, {
          specialty: specialty,
          totalDoctors: allDoctors.length,
          filteredCount: filtered.length,
          filtered: filtered.map(d => ({ id: d.id, name: d.full_name, specializations: d.specializations }))
        })
        
        return filtered
      })()
    : []

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
               {isLoadingSpecialties ? (
                 <div className="flex items-center justify-center py-12">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                 </div>
               ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {specialties.length > 0 ? (
                   specialties.map((specialty) => {
                     // Find doctors for this specialization
                     const doctorsForSpecialty = allDoctors.filter(doctor => {
                       // Check if doctor has this specialization in their specializations array
                       if (doctor.specializations && Array.isArray(doctor.specializations) && doctor.specializations.length > 0) {
                         const hasMatch = doctor.specializations.some((spec: any) => {
                           // Handle string format (labels)
                           if (typeof spec === 'string') {
                             // Compare with both label and value (case-insensitive for safety)
                             const matches = spec.toLowerCase() === specialty.label.toLowerCase() || 
                                            spec.toLowerCase() === specialty.value.toLowerCase() ||
                                            spec === specialty.label || 
                                            spec === specialty.value
                             if (matches) {
                               console.log(`✓ Doctor ${doctor.id} (${doctor.full_name}) matches "${specialty.label}" via string: "${spec}"`)
                             }
                             return matches
                           }
                           // Object format should already be converted to strings in transformDoctors
                           return false
                         })
                         if (hasMatch) return true
                       }
                       // Fallback: check main specialty field
                       const fallbackMatch = doctor.specialty === specialty.value || 
                                            doctor.specialization === specialty.label ||
                                            (doctor.specialty && doctor.specialty.toLowerCase() === specialty.value.toLowerCase()) ||
                                            (doctor.specialization && doctor.specialization.toLowerCase() === specialty.label.toLowerCase())
                       if (fallbackMatch) {
                         console.log(`✓ Doctor ${doctor.id} (${doctor.full_name}) matches "${specialty.label}" via fallback: specialty="${doctor.specialty}", specialization="${doctor.specialization}"`)
                       }
                       return fallbackMatch
                     })
                     const doctorCount = doctorsForSpecialty.length
                     const category = specialty.label
                     
                     // Debug log
                     console.log(`Specialization "${category}" (${specialty.value}): ${doctorCount} doctors found`, {
                       doctors: doctorsForSpecialty.map(d => ({ id: d.id, name: d.full_name, specializations: d.specializations }))
                     })
                     
                     // Get icon and description for category
                     let icon, description, gradientStyle, iconBgStyle, iconColor
                     
                     const categoryLower = category.toLowerCase()
                     if (categoryLower.includes('кардиолог') || categoryLower.includes('сердц')) {
                       icon = Heart
                       description = "Заболевания сердца и сосудов"
                       gradientStyle = "linear-gradient(to right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('невролог') || categoryLower.includes('нервн')) {
                       icon = Brain
                       description = "Заболевания нервной системы"
                       gradientStyle = "linear-gradient(to right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('педиатр') || categoryLower.includes('детск')) {
                       icon = Baby
                       description = "Здоровье детей и подростков"
                       gradientStyle = "linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('хирург') || categoryLower.includes('оперативн')) {
                       icon = Scissors
                       description = "Оперативное лечение заболеваний"
                       gradientStyle = "linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconColor = "text-white"
                     } else {
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
                               {doctorCount} {doctorCount === 1 ? 'врач' : 'врачей'}
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
                                 <span className="text-sm text-gray-500">Доступно врачей: {doctorCount}</span>
                                 <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     )
                   })
                 ) : specialties.length > 0 ? (
                   // If no doctors but specialties exist, show empty categories
                   specialties.map((specialty) => {
                     const category = specialty.label
                     const doctorCount = 0
                     
                     // Get icon and description for category
                     let icon, description, gradientStyle, iconBgStyle, iconColor
                     
                     const categoryLower = category.toLowerCase()
                     if (categoryLower.includes('кардиолог') || categoryLower.includes('сердц')) {
                       icon = Heart
                       description = "Заболевания сердца и сосудов"
                       gradientStyle = "linear-gradient(to right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('невролог') || categoryLower.includes('нервн')) {
                       icon = Brain
                       description = "Заболевания нервной системы"
                       gradientStyle = "linear-gradient(to right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('педиатр') || categoryLower.includes('детск')) {
                       icon = Baby
                       description = "Здоровье детей и подростков"
                       gradientStyle = "linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('хирург') || categoryLower.includes('оперативн')) {
                       icon = Scissors
                       description = "Оперативное лечение заболеваний"
                       gradientStyle = "linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconColor = "text-white"
                     } else {
                       icon = Stethoscope
                       description = "Общая медицина и первичная диагностика"
                       gradientStyle = "linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconColor = "text-white"
                     }
                     
                     return (
                       <Card 
                         key={specialty.value || specialty.label} 
                         className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300 group relative overflow-hidden opacity-60"
                         onClick={() => handleCategoryClick(category)}
                       >
                         <div className="absolute top-0 left-0 right-0 h-2" style={{ background: gradientStyle }}></div>
                         <CardContent className="p-6">
                           <div className="absolute top-4 right-4 z-10">
                             <Badge className="px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-gray-700 border border-gray-200 shadow-sm">
                               0 врачей
                             </Badge>
                           </div>
                           <div className="flex items-start gap-4">
                             <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: iconBgStyle }}>
                               {React.createElement(icon, { className: `w-6 h-6 ${iconColor}` })}
                             </div>
                             <div className="flex-1 min-w-0">
                               <h3 className="text-xl font-semibold mb-2 text-gray-900">{category}</h3>
                               <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
                               <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                 <span className="text-sm text-gray-500">Доступно врачей: 0</span>
                                 <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     )
                   })
                 ) : allDoctors.length > 0 ? (
                   // If specialties not loaded but doctors exist, show them grouped by specialization
                   Object.entries(doctorsByCategory).map(([category, doctors]) => {
                     // Get icon and description for category
                     let icon, description, gradientStyle, iconBgStyle, iconColor
                     
                     const categoryLower = category.toLowerCase()
                     if (categoryLower.includes('кардиолог') || categoryLower.includes('сердц')) {
                       icon = Heart
                       description = "Заболевания сердца и сосудов"
                       gradientStyle = "linear-gradient(to right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(239, 68, 68), rgb(236, 72, 153))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('невролог') || categoryLower.includes('нервн')) {
                       icon = Brain
                       description = "Заболевания нервной системы"
                       gradientStyle = "linear-gradient(to right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(168, 85, 247), rgb(129, 140, 248))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('педиатр') || categoryLower.includes('детск')) {
                       icon = Baby
                       description = "Здоровье детей и подростков"
                       gradientStyle = "linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(6, 182, 212), rgb(59, 130, 246))"
                       iconColor = "text-white"
                     } else if (categoryLower.includes('хирург') || categoryLower.includes('оперативн')) {
                       icon = Scissors
                       description = "Оперативное лечение заболеваний"
                       gradientStyle = "linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconBgStyle = "linear-gradient(to bottom right, rgb(16, 185, 129), rgb(20, 184, 166))"
                       iconColor = "text-white"
                     } else {
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
                         <div className="absolute top-0 left-0 right-0 h-2" style={{ background: gradientStyle }}></div>
                         <CardContent className="p-6">
                           <div className="absolute top-4 right-4 z-10">
                             <Badge className="px-3 py-1 rounded-full text-xs font-medium bg-white/95 text-gray-700 border border-gray-200 shadow-sm">
                               {doctors.length} {doctors.length === 1 ? 'врач' : 'врачей'}
                             </Badge>
                           </div>
                           <div className="flex items-start gap-4">
                             <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: iconBgStyle }}>
                               {React.createElement(icon, { className: `w-6 h-6 ${iconColor}` })}
                             </div>
                             <div className="flex-1 min-w-0">
                               <h3 className="text-xl font-semibold mb-2 text-gray-900">{category}</h3>
                               <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
                               <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                 <span className="text-sm text-gray-500">Доступно врачей: {doctors.length}</span>
                                 <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     )
                   })
                 ) : (
                   <div className="text-center py-12 text-gray-500">
                     <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                     {isLoading || isLoadingSpecialties ? (
                       <p>Специализации загружаются...</p>
                     ) : (
                       <>
                         <p className="text-lg font-medium mb-2">Специализации не найдены</p>
                         <p className="text-sm">Попробуйте обновить страницу или проверьте подключение к серверу</p>
                       </>
                     )}
                   </div>
                 )}
               </div>
               )}
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
                        <div className="flex flex-wrap gap-2 mb-3">
                          {doctor.specialization && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              {doctor.specialization}
                            </Badge>
                          )}
                          {doctor.specializations && doctor.specializations.length > 0 && doctor.specializations.slice(0, 2).map((spec: string, idx: number) => (
                            <Badge key={idx} className="bg-purple-100 text-purple-700 border-purple-200">
                              {spec}
                            </Badge>
                          ))}
                          {doctor.specializations && doctor.specializations.length > 2 && (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              +{doctor.specializations.length - 2}
                            </Badge>
                          )}
                        </div>
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

        {/* Doctor Detail Modal - Removed, now using separate page at /dashboard/doctor/doctors/[id] */}
        {/* Modal code removed - see /dashboard/doctor/doctors/[id]/page.tsx */}

         {/* Reviews Modal - Removed, now using separate page */}
       </div>
     </div>
   )
 }
