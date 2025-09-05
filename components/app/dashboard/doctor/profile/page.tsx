"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, Award, Clock, Star, 
  Edit3, Save, X, Stethoscope, Building, BarChart3, MessageCircle, LogOut, 
  Activity, Users, FileText, Eye, Plus, Trash2, Heart, Globe, Languages,
  Shield, Zap, TrendingUp, AlertCircle, CheckCircle, Clock3, DollarSign,
  UserCheck, CalendarDays, Clock4, Search, Check, X as XIcon, Camera
} from "lucide-react"

// API Configuration - Updated with correct endpoints
import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

// Updated API endpoints based on backend structure
const DOCTOR_PROFILE_API = `${API_BASE_URL}/api/doctors/profile/`
const DOCTOR_PROFILE_PAGE_API = `${API_BASE_URL}/api/doctors/profile/page/`
const DOCTOR_PROFILE_STATS_API = `${API_BASE_URL}/api/doctors/profile/stats/`
const DOCTOR_PROFILE_OPTIONS_API = `${API_BASE_URL}/api/doctors/profile/options/`
const DOCTOR_PROFILE_FIELDS_API = `${API_BASE_URL}/api/doctors/profile/fields-info/`
const DOCTOR_SPECIALTIES_API = `${API_BASE_URL}/api/doctors/specialties/`
const DOCTOR_SPECIALTIES_STATS_API = `${API_BASE_URL}/api/doctors/specialties/stats/`

// Authentication helper function
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken")
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken")
  return !!token
}

// Default doctor data structure
const DEFAULT_DOCTOR_DATA = {
  full_name: "",
  first_name: "",
  last_name: "",
  profile_picture: null,
  email: "",
  phone: "",
  specialization: "Врач",
  experience: "Опыт не указан",
  education: "",
  location: "Адрес не указан",
  country: "",
  region: "",
  district: "",
  bio: "",
  languages: [],
  certifications: "",
  date_of_birth: null,
  gender: "",
  address: "",
  emergency_contact: "",
  medical_license: "",
  insurance: "",
  working_hours: "",
  consultation_fee: "Не указано",
  availability: "",
  total_patients: 0,
  monthly_consultations: 0,
  rating: "4.9",
  total_reviews: 0,
  years_experience: 0,
  completed_treatments: 0,
  active_patients: 0,
  monthly_income: 0,
  languages_spoken: [],
  specializations: [],
  awards: [],
  research_papers: 0,
  conferences_attended: 0
}

export default function DoctorProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState(DEFAULT_DOCTOR_DATA)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: [],
    experience: "",
    education: "",
    location: "",
    bio: "",
    languages: [],
    certifications: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    country: "",
    region: "",
    district: "",
    emergencyContact: "",
    medicalLicense: "",
    insurance: "",
    workingHours: "",
    consultationFee: "",
    availability: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [languageSearch, setLanguageSearch] = useState("")
  const [isSpecializationModalOpen, setIsSpecializationModalOpen] = useState(false)
  const [specializationSearch, setSpecializationSearch] = useState("")
  const [isWorkingHoursModalOpen, setIsWorkingHoursModalOpen] = useState(false)
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
  const [availableLanguages, setAvailableLanguages] = useState([])
  const [availableSpecializations, setAvailableSpecializations] = useState([])
  const [availableWorkingHours, setAvailableWorkingHours] = useState([])
  const [availableAvailability, setAvailableAvailability] = useState([])

  // Load available options from backend
  useEffect(() => {
    loadProfileOptions()
  }, [])

  // Load doctor profile data
  useEffect(() => {
    checkAuth()
  }, [])

  // Monitor userProfile changes
  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      console.log("📱 userProfile state обновлен:")
      console.log("  - Полный объект:", userProfile)
      console.log("  - Тип данных:", typeof userProfile)
      console.log("  - Количество ключей:", Object.keys(userProfile).length)
      console.log("  - Доступные ключи:", Object.keys(userProfile))
    }
  }, [userProfile])

  const loadProfileOptions = async () => {
    try {
      if (!isAuthenticated()) return

      // Load languages, working hours, and availability from profile options API
      const response = await axios.get(DOCTOR_PROFILE_OPTIONS_API, {
        headers: getAuthHeaders()
      })
      
      if (response.data.success) {
        const options = response.data.data
        setAvailableLanguages(options.languages || [])
        setAvailableWorkingHours(options.working_hours || [])
        setAvailableAvailability(options.availability || [])
        console.log("✅ Profile options loaded successfully")
      }
    } catch (error) {
      console.error("❌ Error loading profile options:", error)
      // Fallback to default options if API fails
      setAvailableLanguages([
        "Узбекский", "Русский", "Казахский", "Киргизский", "Таджикский", "Туркменский",
        "Китайский", "Корейский", "Японский", "Вьетнамский", "Тайский", "Малайский",
        "Индонезийский", "Филиппинский", "Бенгальский", "Хинди", "Урду", "Персидский",
        "Арабский", "Турецкий", "Азербайджанский", "Грузинский", "Армянский",
        "Английский", "Немецкий", "Французский", "Испанский", "Итальянский", "Португальский",
        "Голландский", "Шведский", "Норвежский", "Датский", "Финский", "Польский",
        "Чешский", "Словацкий", "Венгерский", "Румынский", "Болгарский", "Сербский",
        "Хорватский", "Словенский", "Македонский", "Албанский", "Греческий",
        "Иврит", "Амхарский", "Суахили", "Зулу", "Африкаанс", "Хауса", "Йоруба"
      ])
      setAvailableWorkingHours([
        "9:00-18:00", "8:00-17:00", "10:00-19:00", "9:00-17:00", "8:00-18:00",
        "10:00-18:00", "9:00-16:00", "8:00-16:00", "10:00-16:00", "24/7",
        "По вызову", "Гибкий график"
      ])
      setAvailableAvailability([
        "Понедельник - Пятница", "Пн-Пт", "Понедельник - Суббота", "Пн-Сб",
        "Ежедневно", "По будням", "По выходным", "По записи", "Экстренные случаи",
        "24/7", "Гибкий график"
      ])
    }

    // Load specialties from backend API separately
    try {
      console.log("🔄 Loading specialties from:", DOCTOR_SPECIALTIES_API)
      const specialtiesResponse = await axios.get(DOCTOR_SPECIALTIES_API)
      console.log("📡 Specialties API response:", specialtiesResponse.data)
      
      if (specialtiesResponse.data.success) {
        const backendSpecialties = specialtiesResponse.data.data.map(spec => spec.label)
        setAvailableSpecializations(backendSpecialties)
        console.log("✅ Specialties loaded from backend:", backendSpecialties)
        console.log("✅ Total specialties count:", backendSpecialties.length)
      } else {
        console.warn("⚠️ Backend specialties API returned no data")
        setAvailableSpecializations([])
      }
    } catch (error) {
      console.error("❌ Error loading specialties from backend:", error)
      console.error("❌ Error details:", error.response?.data || error.message)
      setAvailableSpecializations([])
    }
  }

  const checkAuth = async () => {
    if (!isAuthenticated()) {
      console.log("🔒 No access token found - redirecting to login")
      router.push("/login")
      return
    }

    try {
      setIsProfileLoading(true)
      setProfileError(null)
      
      // Load profile data from the main profile page API
      const response = await axios.get(DOCTOR_PROFILE_PAGE_API, {
        headers: getAuthHeaders()
      })
      
      if (response.data.success) {
        const doctorData = response.data.data
        setUserProfile(doctorData)
        updateFormDataFromProfile(doctorData)
        console.log("✅ Профиль доктора успешно загружен")
        console.log("📊 Полные данные профиля:", doctorData)
      } else {
        throw new Error(response.data.message || "Failed to load profile")
      }
    } catch (error) {
      console.error("❌ Error fetching doctor profile:", error)
      
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken")
        alert("🔒 Сессия истекла. Пожалуйста, войдите в систему снова.")
        router.push("/login")
      } else if (error.response?.status === 404) {
        setProfileError("Профиль доктора не найден. Возможно, нужно создать профиль.")
      } else {
        setProfileError(`Ошибка загрузки профиля: ${error.response?.data?.message || error.message}`)
      }
    } finally {
      setIsProfileLoading(false)
    }
  }

  const updateFormDataFromProfile = (profileData) => {
    console.log("🔄 Обновление formData из профиля:", profileData)
    setFormData({
      fullName: profileData.full_name || `${profileData.first_name} ${profileData.last_name}` || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
      specialization: profileData.specializations ? 
        (Array.isArray(profileData.specializations) ? profileData.specializations : []) : [],
      experience: profileData.experience || "",
      education: profileData.education || "",
      location: profileData.location || "",
      bio: profileData.bio || "",
      languages: profileData.languages ? 
        (Array.isArray(profileData.languages) ? profileData.languages : []) : [],
      certifications: profileData.certifications || "",
      dateOfBirth: profileData.date_of_birth || "",
      gender: profileData.gender || "",
      address: profileData.address || "",
      country: profileData.country || "",
      region: profileData.region || "",
      district: profileData.district || "",
      emergencyContact: profileData.emergency_contact || "",
      medicalLicense: profileData.medical_license || "",
      insurance: profileData.insurance || "",
      workingHours: profileData.working_hours || "",
      consultationFee: profileData.consultation_fee || "",
      availability: profileData.availability || ""
    })
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }))
  }

  const handleSave = async () => {
    if (!isAuthenticated()) {
      alert("🔒 Пожалуйста, войдите в систему для сохранения профиля")
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      // Prepare data for backend using the correct API format
      const updateData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: formData.experience,
        education: formData.education,
        bio: formData.bio,
        languages: formData.languages,
        certifications: formData.certifications,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        country: formData.country,
        region: formData.region,
        district: formData.district,
        emergency_contact: formData.emergencyContact,
        medical_license: formData.medicalLicense,
        insurance: formData.insurance,
        working_hours: formData.workingHours,
        consultation_fee: formData.consultationFee,
        availability: formData.availability
      }

      console.log("📤 Sending update data:", updateData)

      // Send PATCH request to update profile using the profile page API
      const response = await axios.patch(DOCTOR_PROFILE_PAGE_API, updateData, {
        headers: getAuthHeaders()
      })
      
      if (response.data.success) {
        const updatedProfile = response.data.data
        setUserProfile(updatedProfile)
        updateFormDataFromProfile(updatedProfile)
        alert("✅ Профиль успешно обновлен!")
        setIsEditing(false)
        console.log("✅ Profile updated successfully:", updatedProfile)
      } else {
        throw new Error(response.data.message || "Ошибка обновления профиля")
      }
      
    } catch (error: any) {
      console.error("❌ Error updating profile:", error)
      
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken")
        alert("🔒 Сессия истекла. Пожалуйста, войдите в систему снова.")
        router.push("/login")
      } else if (error.response?.status === 403) {
        alert("❌ Нет прав для обновления профиля")
      } else if (error.response?.status === 404) {
        alert("❌ Профиль не найден. Возможно, нужно создать профиль.")
      } else if (error.response?.status >= 500) {
        alert("🔧 Ошибка сервера. Попробуйте позже.")
      } else {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           error.message || 
                           "Неизвестная ошибка"
        alert(`❌ Ошибка: ${errorMessage}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    updateFormDataFromProfile(userProfile)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userType")
    localStorage.removeItem("user")
    
    alert("🚪 Вы вышли из системы")
    router.push("/login")
  }

  const filteredLanguages = availableLanguages.filter(lang => 
    lang.toLowerCase().includes(languageSearch.toLowerCase())
  )

  const filteredSpecializations = availableSpecializations.filter(spec => 
    spec.toLowerCase().includes(specializationSearch.toLowerCase())
  )

  const allWorkingHours = availableWorkingHours.length > 0 ? availableWorkingHours : [
    "9:00-18:00",
    "8:00-17:00",
    "10:00-19:00",
    "9:00-17:00",
    "8:00-18:00",
    "10:00-18:00",
    "9:00-16:00",
    "8:00-16:00",
    "10:00-16:00",
    "24/7",
    "По вызову",
    "Гибкий график"
  ]

  const allAvailability = availableAvailability.length > 0 ? availableAvailability : [
    "Понедельник - Пятница",
    "Пн-Пт",
    "Понедельник - Суббота",
    "Пн-Сб",
    "Ежедневно",
    "По будням",
    "По выходным",
    "По записи",
    "Экстренные случаи",
    "24/7",
    "Гибкий график"
  ]

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // Create a preview URL for immediate display
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          // Update the profile picture immediately for preview
          setUserProfile(prev => ({
            ...prev,
            profile_picture: result
          }))
        }
        reader.readAsDataURL(file)
        
        // Upload file to server
        const formData = new FormData()
        formData.append('profile_picture', file)
        
        console.log("📸 Uploading profile picture:", file.name)
        
        // Upload to server using the profile page API
        const uploadResponse = await axios.patch(DOCTOR_PROFILE_PAGE_API, formData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        })
        
        if (uploadResponse.data.success) {
          console.log("✅ Profile picture uploaded successfully")
          // Update profile with server response
          if (uploadResponse.data.data?.profile_picture) {
            setUserProfile(prev => ({
              ...prev,
              profile_picture: uploadResponse.data.data.profile_picture
            }))
          }
          // Also refresh the profile to get updated data
          checkAuth()
        } else {
          throw new Error(uploadResponse.data.message || "Upload failed")
        }
      } catch (error) {
        console.error("❌ Error uploading profile picture:", error)
        // Show error message to user
        alert("❌ Profil rasmini yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.")
        
        // Revert to previous profile picture
        checkAuth()
      }
    }
  }

  // Show loading state
  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Загрузка профиля доктора...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">{profileError}</p>
          <Button onClick={() => checkAuth()} className="bg-blue-600 hover:bg-blue-700">
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className={`w-20 h-20 border-4 ${isEditing ? 'border-blue-200 cursor-pointer hover:border-blue-400' : 'border-gray-200'} transition-colors`}>
                    <AvatarImage 
                      src={
                        userProfile.profile_picture 
                          ? userProfile.profile_picture.startsWith('http') 
                            ? userProfile.profile_picture 
                                                          : `${API_CONFIG.BASE_URL}${userProfile.profile_picture}`
                          : "/placeholder.svg"
                      } 
                      alt="Profile Picture"
                    />
                    <AvatarFallback className="bg-blue-500 text-white text-2xl font-bold">
                      {(userProfile.first_name?.[0] || "") + (userProfile.last_name?.[0] || "") || "Д"}
                    </AvatarFallback>
                  </Avatar>
                  

                  
                  {/* Camera icon only shows when editing */}
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="profile-picture-input" className="cursor-pointer">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </label>
                      <input
                        id="profile-picture-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userProfile.full_name || `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || "Доктор"}
                  </h1>
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {userProfile.experience || `${userProfile.years_experience || 0} лет`}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-gray-600 font-medium">{userProfile.rating || "0.0"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Адрес:</span>
                    <span>{userProfile.country || ''} {userProfile.region || ''}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-700 px-6">
                      {isLoading ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="px-6">
                      Отмена
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 px-6">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                )}

                <Button variant="outline" onClick={handleLogout} className="px-6">
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-700 mb-1">{userProfile.total_patients || userProfile.active_patients || 0}</p>
              <p className="text-blue-600 font-medium">Пациенты</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">{userProfile.monthly_consultations || 0}</p>
              <p className="text-green-600 font-medium">Консультации</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-700 mb-1">{userProfile.rating || "0.0"}</p>
              <p className="text-purple-600 font-medium">Рейтинг</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-700 mb-1">{userProfile.consultation_fee || "Не указано"}</p>
              <p className="text-orange-600 font-medium">Стоимость консультации</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <User className="w-6 h-6" />
                  Личная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Полное имя
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.full_name || `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || formData.fullName || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        type="email"
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.email || formData.email || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Биография
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full border-gray-300 focus:border-blue-500"
                      placeholder="Расскажите о себе, опыте и специализации..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 leading-relaxed">{userProfile.bio || formData.bio || "Биография не указана"}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Языки
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Selected Languages Display */}
                      {formData.languages.length > 0 && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Выбранные языки ({formData.languages.length})
                            </h4>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, languages: [] }))}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Очистить все
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.languages.map((language) => (
                              <span
                                key={language}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                {language}
                                <button
                                  type="button"
                                  onClick={() => handleLanguageToggle(language)}
                                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Language Selector Button */}
                      <button
                        type="button"
                        onClick={() => setIsLanguageModalOpen(true)}
                        className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-blue-700 group-hover:text-blue-800">
                              {formData.languages.length === 0 ? "Выбрать языки" : "Добавить языки"}
                            </p>
                            <p className="text-sm text-blue-500">
                              {formData.languages.length === 0 
                                ? "Нажмите чтобы выбрать языки" 
                                : `${formData.languages.length} языков выбрано`
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                      {(userProfile.languages && userProfile.languages.length > 0) || (formData.languages && formData.languages.length > 0) ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Языки ({(userProfile.languages || formData.languages || []).length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(userProfile.languages || userProfile.languages_spoken || formData.languages || []).map((language) => (
                              <span
                                key={language}
                                className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                              >
                                {language}
                              </span>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-gray-500">
                          <Globe className="w-5 h-5" />
                          <span className="font-medium">Языки не указаны</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-orange-600" />
                      Дата рождения
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        type="date"
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.date_of_birth || formData.dateOfBirth || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-600" />
                      Пол
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.gender || ""}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Выберите пол</option>
                        <option value="Мужской">Мужской</option>
                        <option value="Женский">Женский</option>
                      </select>
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.gender || formData.gender || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Info */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <Building className="w-6 h-6" />
                  Профессиональная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    Специализация
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Selected Specialization Display */}
                      {formData.specialization && formData.specialization.length > 0 && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Выбранные специализации ({formData.specialization.length})
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleInputChange("specialization", [])}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Очистить все
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.specialization.map((spec) => (
                              <span
                                key={spec}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                {spec}
                                <button
                                  type="button"
                                  onClick={() => handleInputChange("specialization", formData.specialization.filter(s => s !== spec))}
                                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Specialization Selector Button */}
                      <button
                        type="button"
                        onClick={() => setIsSpecializationModalOpen(true)}
                        className="w-full p-4 border-2 border-dashed border-green-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-green-700 group-hover:text-green-800">
                              {formData.specialization && formData.specialization.length > 0 ? "Изменить специализации" : "Выбрать специализации"}
                            </p>
                            <p className="text-sm text-green-500">
                              {formData.specialization && formData.specialization.length > 0
                                ? `${formData.specialization.length} специализаций выбрано` 
                                : "Нажмите чтобы выбрать специализации"
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      {(userProfile.specializations && userProfile.specializations.length > 0) || (formData.specialization && formData.specialization.length > 0) ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">Специализации ({(userProfile.specializations || formData.specialization || []).length})</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(userProfile.specializations || formData.specialization || []).map((spec) => (
                              <span
                                key={spec}
                                className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-gray-500">
                          <Stethoscope className="w-5 h-5" />
                          <span className="font-medium">Специализации не указаны</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Clock3 className="w-4 h-4 text-green-600" />
                      Опыт работы
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.experience || userProfile.years_experience || formData.experience || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                      Образование
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.education}
                        onChange={(e) => handleInputChange("education", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.education || formData.education || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                </div>



                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-600" />
                    Сертификаты
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={formData.certifications}
                      onChange={(e) => handleInputChange("certifications", e.target.value)}
                      rows={3}
                      className="w-full border-gray-300 focus:border-blue-500"
                      placeholder="Укажите все сертификаты и достижения..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700">{userProfile.certifications || formData.certifications || "Не указано"}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      Медицинская лицензия
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.medicalLicense}
                        onChange={(e) => handleInputChange("medicalLicense", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.medical_license || formData.medicalLicense || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      Страхование
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.insurance}
                        onChange={(e) => handleInputChange("insurance", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.insurance || formData.insurance || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <Calendar className="w-6 h-6" />
                  Рабочий график
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <Clock4 className="w-4 h-4 text-purple-600" />
                    Рабочие часы
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Selected Working Hours Display */}
                      {formData.workingHours && (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Выбранные часы работы
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleInputChange("workingHours", "")}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Очистить
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                              <Clock4 className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="font-medium text-purple-800">
                              {formData.workingHours}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Working Hours Selector Button */}
                      <button
                        type="button"
                        onClick={() => setIsWorkingHoursModalOpen(true)}
                        className="w-full p-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-purple-700 group-hover:text-purple-800">
                              {formData.workingHours ? "Изменить часы работы" : "Выбрать часы работы"}
                            </p>
                            <p className="text-sm text-purple-500">
                              {formData.workingHours 
                                ? "Нажмите чтобы изменить" 
                                : "Нажмите чтобы выбрать часы работы"
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      {(userProfile.working_hours || formData.workingHours) ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                            <Clock4 className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-700">Рабочие часы</p>
                            <p className="font-medium text-purple-800">{userProfile.working_hours || formData.workingHours}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-gray-500">
                          <Clock4 className="w-5 h-5" />
                          <span className="font-medium">Часы работы не указаны</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-purple-600" />
                    Доступность
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Selected Availability Display */}
                      {formData.availability && (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Выбранная доступность
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleInputChange("availability", "")}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Очистить
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                              <CalendarDays className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="font-medium text-purple-800">
                              {formData.availability}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Availability Selector Button */}
                      <button
                        type="button"
                        onClick={() => setIsAvailabilityModalOpen(true)}
                        className="w-full p-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-purple-700 group-hover:text-purple-800">
                              {formData.availability ? "Изменить доступность" : "Выбрать доступность"}
                            </p>
                            <p className="text-sm text-purple-500">
                              {formData.availability 
                                ? "Нажмите чтобы изменить" 
                                : "Нажмите чтобы выбрать доступность"
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      {(userProfile.availability || formData.availability) ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-700">Доступность</p>
                            <p className="font-medium text-purple-800">{userProfile.availability || formData.availability}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-gray-500">
                          <CalendarDays className="w-5 h-5" />
                          <span className="font-medium">Доступность не указана</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Стоимость консультации
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.consultationFee}
                      onChange={(e) => handleInputChange("consultationFee", e.target.value)}
                      className="w-full border-gray-300 focus:border-blue-500"
                      placeholder="Например: 150,000 сум"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-orange-700">Стоимость консультации</p>
                            <p className="text-2xl font-bold text-orange-800">{formData.consultationFee || userProfile.consultation_fee || "Не указано"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Phone className="w-6 h-6" />
                  Контактная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600" />
                      Телефон
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.phone || userProfile.phone_number || formData.phone || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Экстренный контакт
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.emergency_contact || formData.emergencyContact || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      Страна
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.country || ""}
                        onChange={(e) => {
                          handleInputChange("country", e.target.value)
                          handleInputChange("region", "")
                          handleInputChange("district", "")
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Выберите страну</option>
                        <option value="Узбекистан">Узбекистан</option>
                        <option value="Россия">Россия</option>
                        <option value="Казахстан">Казахстан</option>
                      </select>
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.country || formData.country || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Область
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.region || ""}
                        onChange={(e) => {
                          handleInputChange("region", e.target.value)
                          handleInputChange("district", "")
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={!formData.country}
                      >
                        <option value="">Выберите область</option>
                        {formData.country === "Узбекистан" && (
                          <>
                            <option value="Республика Каракалпакстан">Республика Каракалпакстан</option>
                            <option value="Андижанская область">Андижанская область</option>
                            <option value="Бухарская область">Бухарская область</option>
                            <option value="Джизакская область">Джизакская область</option>
                            <option value="Кашкадарьинская область">Кашкадарьинская область</option>
                            <option value="Навоийская область">Навоийская область</option>
                            <option value="Наманганская область">Наманганская область</option>
                            <option value="Самаркандская область">Самаркандская область</option>
                            <option value="Сурхандарьинская область">Сурхандарьинская область</option>
                            <option value="Сырдарьинская область">Сырдарьинская область</option>
                            <option value="Ташкентская область">Ташкентская область</option>
                            <option value="Ферганская область">Ферганская область</option>
                            <option value="Хорезмская область">Хорезмская область</option>
                            <option value="Город Ташкент">Город Ташкент</option>
                          </>
                        )}
                        {formData.country === "Россия" && (
                          <>
                            <optgroup label="Центральный федеральный округ">
                              <option value="Белгородская область">Белгородская область</option>
                              <option value="Брянская область">Брянская область</option>
                              <option value="Владимирская область">Владимирская область</option>
                              <option value="Воронежская область">Воронежская область</option>
                              <option value="Ивановская область">Ивановская область</option>
                              <option value="Калужская область">Калужская область</option>
                              <option value="Костромская область">Костромская область</option>
                              <option value="Курская область">Курская область</option>
                              <option value="Липецкая область">Липецкая область</option>
                              <option value="Московская область">Московская область</option>
                              <option value="Орловская область">Орловская область</option>
                              <option value="Рязанская область">Рязанская область</option>
                              <option value="Смоленская область">Смоленская область</option>
                              <option value="Тамбовская область">Тамбовская область</option>
                              <option value="Тверская область">Тверская область</option>
                              <option value="Тульская область">Тульская область</option>
                              <option value="Ярославская область">Ярославская область</option>
                              <option value="Город Москва">Город Москва</option>
                            </optgroup>
                            <optgroup label="Северо-Западный федеральный округ">
                              <option value="Архангельская область">Архангельская область</option>
                              <option value="Вологодская область">Вологодская область</option>
                              <option value="Калининградская область">Калининградская область</option>
                              <option value="Ленинградская область">Ленинградская область</option>
                              <option value="Мурманская область">Мурманская область</option>
                              <option value="Новгородская область">Новгородская область</option>
                              <option value="Псковская область">Псковская область</option>
                              <option value="Город Санкт-Петербург">Город Санкт-Петербург</option>
                              <option value="Республика Карелия">Республика Карелия</option>
                              <option value="Республика Коми">Республика Коми</option>
                              <option value="Ненецкий автономный округ">Ненецкий автономный округ</option>
                            </optgroup>
                            <optgroup label="Южный федеральный округ">
                              <option value="Астраханская область">Астраханская область</option>
                              <option value="Волгоградская область">Волгоградская область</option>
                              <option value="Ростовская область">Ростовская область</option>
                              <option value="Краснодарский край">Краснодарский край</option>
                              <option value="Республика Адыгея">Республика Адыгея</option>
                              <option value="Республика Калмыкия">Республика Калмыкия</option>
                              <option value="Республика Крым">Республика Крым</option>
                              <option value="Город Севастополь">Город Севастополь</option>
                            </optgroup>
                            <optgroup label="Северо-Кавказский федеральный округ">
                              <option value="Республика Дагестан">Республика Дагестан</option>
                              <option value="Республика Ингушетия">Республика Ингушетия</option>
                              <option value="Кабардино-Балкарская Республика">Кабардино-Балкарская Республика</option>
                              <option value="Карачаево-Черкесская Республика">Карачаево-Черкесская Республика</option>
                              <option value="Республика Северная Осетия — Алания">Республика Северная Осетия — Алания</option>
                              <option value="Чеченская Республика">Чеченская Республика</option>
                              <option value="Ставропольский край">Ставропольский край</option>
                            </optgroup>
                            <optgroup label="Приволжский федеральный округ">
                              <option value="Кировская область">Кировская область</option>
                              <option value="Нижегородская область">Нижегородская область</option>
                              <option value="Оренбургская область">Оренбургская область</option>
                              <option value="Пензенская область">Пензенская область</option>
                              <option value="Пермский край">Пермский край</option>
                              <option value="Самарская область">Самарская область</option>
                              <option value="Саратовская область">Саратовская область</option>
                              <option value="Ульяновская область">Ульяновская область</option>
                              <option value="Республика Башкортостан">Республика Башкортостан</option>
                              <option value="Республика Марий Эл">Республика Марий Эл</option>
                              <option value="Республика Мордовия">Республика Мордовия</option>
                              <option value="Республика Татарстан">Республика Татарстан</option>
                              <option value="Удмуртская Республика">Удмуртская Республика</option>
                              <option value="Чувашская Республика">Чувашская Республика</option>
                            </optgroup>
                            <optgroup label="Уральский федеральный округ">
                              <option value="Курганская область">Курганская область</option>
                              <option value="Свердловская область">Свердловская область</option>
                              <option value="Тюменская область">Тюменская область</option>
                              <option value="Челябинская область">Челябинская область</option>
                            </optgroup>
                            <optgroup label="Сибирский федеральный округ">
                              <option value="Республика Алтай">Республика Алтай</option>
                              <option value="Республика Бурятия">Республика Бурятия</option>
                              <option value="Республика Тыва">Республика Тыва</option>
                              <option value="Республика Хакасия">Республика Хакасия</option>
                              <option value="Алтайский край">Алтайский край</option>
                              <option value="Забайкальский край">Забайкальский край</option>
                              <option value="Красноярский край">Красноярский край</option>
                              <option value="Иркутская область">Иркутская область</option>
                              <option value="Кемеровская область">Кемеровская область</option>
                              <option value="Новосибирская область">Новосибирская область</option>
                              <option value="Омская область">Омская область</option>
                              <option value="Томская область">Томская область</option>
                            </optgroup>
                            <optgroup label="Дальневосточный федеральный округ">
                              <option value="Республика Саха (Якутия)">Республика Саха (Якутия)</option>
                              <option value="Камчатский край">Камчатский край</option>
                              <option value="Приморский край">Приморский край</option>
                              <option value="Хабаровский край">Хабаровский край</option>
                              <option value="Амурская область">Амурская область</option>
                              <option value="Магаданская область">Магаданская область</option>
                              <option value="Сахалинская область">Сахалинская область</option>
                              <option value="Еврейская автономная область">Еврейская автономная область</option>
                              <option value="Чукотский автономный округ">Чукотский автономный округ</option>
                            </optgroup>
                          </>
                        )}
                        {formData.country === "Казахстан" && (
                          <>
                            <optgroup label="Области">
                              <option value="Акмолинская область">Акмолинская область</option>
                              <option value="Актюбинская область">Актюбинская область</option>
                              <option value="Алматинская область">Алматинская область</option>
                              <option value="Атырауская область">Атырауская область</option>
                              <option value="Восточно-Казахстанская область">Восточно-Казахстанская область</option>
                              <option value="Жамбылская область">Жамбылская область</option>
                              <option value="Западно-Казахстанская область">Западно-Казахстанская область</option>
                              <option value="Карагандинская область">Карагандинская область</option>
                              <option value="Костанайская область">Костанайская область</option>
                              <option value="Кызылординская область">Кызылординская область</option>
                              <option value="Мангистауская область">Мангистауская область</option>
                              <option value="Павлодарская область">Павлодарская область</option>
                              <option value="Северо-Казахстанская область">Северо-Казахстанская область</option>
                              <option value="Южно-Казахстанская область">Южно-Казахстанская область</option>
                            </optgroup>
                            <optgroup label="Города республиканского значения">
                              <option value="Город Алматы">Город Алматы</option>
                              <option value="Город Астана">Город Астана</option>
                              <option value="Город Шымкент">Город Шымкент</option>
                            </optgroup>
                          </>
                        )}
                      </select>
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.region || formData.region || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      Район
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.district || ""}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={!formData.region}
                      >
                        <option value="">Выберите район</option>
                        {formData.country === "Узбекистан" && formData.region === "Республика Каракалпакстан" && (
                          <>
                            <option value="Район Амударьинский">Район Амударьинский</option>
                            <option value="Район Берунийский">Район Берунийский</option>
                            <option value="Район Канлыкульский">Район Канлыкульский</option>
                            <option value="Район Кегейлийский">Район Кегейлийский</option>
                            <option value="Район Кунградский">Район Кунградский</option>
                            <option value="Район Муйнакский">Район Муйнакский</option>
                            <option value="Район Нукусский">Район Нукусский</option>
                            <option value="Район Тахтакупырский">Район Тахтакупырский</option>
                            <option value="Район Тахиятаский">Район Тахиятаский</option>
                            <option value="Район Ходжейлийский">Район Ходжейлийский</option>
                            <option value="Район Чимбайский">Район Чимбайский</option>
                            <option value="Район Шуманайский">Район Шуманайский</option>
                            <option value="Район Элликкалинский">Район Элликкалинский</option>
                            <option value="Город Нукус">Город Нукус</option>
                            <option value="Город Муйнак">Город Муйнак</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Андижанская область" && (
                          <>
                            <option value="Район Андижанский">Район Андижанский</option>
                            <option value="Район Асакинский">Район Асакинский</option>
                            <option value="Район Балыкчинский">Район Балыкчинский</option>
                            <option value="Район Бозский">Район Бозский</option>
                            <option value="Район Булокбошинский">Район Булокбошинский</option>
                            <option value="Район Джалақудукский">Район Джалақудукский</option>
                            <option value="Район Избасканский">Район Избасканский</option>
                            <option value="Район Куганский">Район Куганский</option>
                            <option value="Район Кургантепинский">Район Кургантепинский</option>
                            <option value="Район Мархаматский">Район Мархаматский</option>
                            <option value="Район Олтинкульский">Район Олтинкульский</option>
                            <option value="Район Пахтаабадский">Район Пахтаабадский</option>
                            <option value="Район Улугнорский">Район Улугнорский</option>
                            <option value="Район Ходжаабадский">Район Ходжаабадский</option>
                            <option value="Район Шахрихонский">Район Шахрихонский</option>
                            <option value="Город Андижан">Город Андижан</option>
                            <option value="Город Асака">Город Асака</option>
                            <option value="Город Ханабад">Город Ханабад</option>
                            <option value="Город Шахрихон">Город Шахрихон</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Бухарская область" && (
                          <>
                            <option value="Район Алатский">Район Алатский</option>
                            <option value="Район Бухарский">Район Бухарский</option>
                            <option value="Район Вабкентский">Район Вабкентский</option>
                            <option value="Район Гиждуванский">Район Гиждуванский</option>
                            <option value="Район Жондорский">Район Жондорский</option>
                            <option value="Район Каракульский">Район Каракульский</option>
                            <option value="Район Каганский">Район Каганский</option>
                            <option value="Район Кизилтепинский">Район Кизилтепинский</option>
                            <option value="Район Пешкунский">Район Пешкунский</option>
                            <option value="Район Ромитанский">Район Ромитанский</option>
                            <option value="Район Шафирканский">Район Шафирканский</option>
                            <option value="Город Бухара">Город Бухара</option>
                            <option value="Город Каган">Город Каган</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Джизакская область" && (
                          <>
                            <option value="Район Арнасайский">Район Арнасайский</option>
                            <option value="Район Бахмальский">Район Бахмальский</option>
                            <option value="Район Галлиаральский">Район Галлиаральский</option>
                            <option value="Район Дустликский">Район Дустликский</option>
                            <option value="Район Зааминский">Район Зааминский</option>
                            <option value="Район Зафаробадский">Район Зафаробадский</option>
                            <option value="Район Мирабадский">Район Мирабадский</option>
                            <option value="Район Пахтакорский">Район Пахтакорский</option>
                            <option value="Район Фаришский">Район Фаришский</option>
                            <option value="Район Форишский">Район Форишский</option>
                            <option value="Район Янгикишлакский">Район Янгикишлакский</option>
                            <option value="Город Джизак">Город Джизак</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Кашкадарьинская область" && (
                          <>
                            <option value="Район Гузарский">Район Гузарский</option>
                            <option value="Район Дехканабадский">Район Дехканабадский</option>
                            <option value="Район Касанский">Район Касанский</option>
                            <option value="Район Китабский">Район Китабский</option>
                            <option value="Район Косонский">Район Косонский</option>
                            <option value="Район Миришкорский">Район Миришкорский</option>
                            <option value="Район Мубарекский">Район Мубарекский</option>
                            <option value="Район Нишанский">Район Нишанский</option>
                            <option value="Район Шахрисабзский">Район Шахрисабзский</option>
                            <option value="Район Чиракчинский">Район Чиракчинский</option>
                            <option value="Район Яккабагский">Район Яккабагский</option>
                            <option value="Город Карши">Город Карши</option>
                            <option value="Город Шахрисабз">Город Шахрисабз</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Навоийская область" && (
                          <>
                            <option value="Район Карманинский">Район Карманинский</option>
                            <option value="Район Канимехский">Район Канимехский</option>
                            <option value="Район Кызылтепинский">Район Кызылтепинский</option>
                            <option value="Район Навбахорский">Район Навбахорский</option>
                            <option value="Район Нуратинский">Район Нуратинский</option>
                            <option value="Район Томдиский">Район Томдиский</option>
                            <option value="Район Учкудукский">Район Учкудукский</option>
                            <option value="Район Хатирчинский">Район Хатирчинский</option>
                            <option value="Город Навои">Город Навои</option>
                            <option value="Город Зарафшан">Город Зарафшан</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Наманганская область" && (
                          <>
                            <option value="Район Наманганский">Район Наманганский</option>
                            <option value="Район Касансайский">Район Касансайский</option>
                            <option value="Район Мингбулакский">Район Мингбулакский</option>
                            <option value="Район Нарынский">Район Нарынский</option>
                            <option value="Район Попский">Район Попский</option>
                            <option value="Район Туракурганский">Район Туракурганский</option>
                            <option value="Район Учкурганский">Район Учкурганский</option>
                            <option value="Район Чартакский">Район Чартакский</option>
                            <option value="Район Чустский">Район Чустский</option>
                            <option value="Район Янгиюльский">Район Янгиюльский</option>
                            <option value="Город Наманган">Город Наманган</option>
                            <option value="Город Чуст">Город Чуст</option>
                            <option value="Город Учкурган">Город Учкурган</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Самаркандская область" && (
                          <>
                            <option value="Район Булунгурский">Район Булунгурский</option>
                            <option value="Район Джомбойский">Район Джомбойский</option>
                            <option value="Район Иштыханский">Район Иштыханский</option>
                            <option value="Район Каттакурганский">Район Каттакурганский</option>
                            <option value="Район Нарпайский">Район Нарпайский</option>
                            <option value="Район Пайарыкский">Район Пайарыкский</option>
                            <option value="Район Пахтачинский">Район Пахтачинский</option>
                            <option value="Район Самаркандский">Район Самаркандский</option>
                            <option value="Район Тайлакский">Район Тайлакский</option>
                            <option value="Район Ургутский">Район Ургутский</option>
                            <option value="Район Акдарьинский">Район Акдарьинский</option>
                            <option value="Город Самарканд">Город Самарканд</option>
                            <option value="Город Каттакурган">Город Каттакурган</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Сурхандарьинская область" && (
                          <>
                            <option value="Район Ангорский">Район Ангорский</option>
                            <option value="Район Бандихонский">Район Бандихонский</option>
                            <option value="Район Джаркурганский">Район Джаркурганский</option>
                            <option value="Район Денауский">Район Денауский</option>
                            <option value="Район Кизирикский">Район Кизирикский</option>
                            <option value="Район Кумкурганский">Район Кумкурганский</option>
                            <option value="Район Музрабадский">Район Музрабадский</option>
                            <option value="Район Сариасийский">Район Сариасийский</option>
                            <option value="Район Термезский">Район Термезский</option>
                            <option value="Район Узунский">Район Узунский</option>
                            <option value="Район Шерабадский">Район Шерабадский</option>
                            <option value="Район Шурчинский">Район Шурчинский</option>
                            <option value="Город Термез">Город Термез</option>
                            <option value="Город Денов">Город Денов</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Сырдарьинская область" && (
                          <>
                            <option value="Район Акалтынский">Район Акалтынский</option>
                            <option value="Район Байотский">Район Байотский</option>
                            <option value="Район Гулистанский">Район Гулистанский</option>
                            <option value="Район Мирзаабадский">Район Мирзаабадский</option>
                            <option value="Район Сардобинский">Район Сардобинский</option>
                            <option value="Район Хавастский">Район Хавастский</option>
                            <option value="Район Янгиерский">Район Янгиерский</option>
                            <option value="Город Гулистан">Город Гулистан</option>
                            <option value="Город Ширан">Город Ширан</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Ташкентская область" && (
                          <>
                            <option value="Район Аккурганский">Район Аккурганский</option>
                            <option value="Район Алмалыкский">Район Алмалыкский</option>
                            <option value="Район Ангренский">Район Ангренский</option>
                            <option value="Район Ахангаранский">Район Ахангаранский</option>
                            <option value="Район Бекабадский">Район Бекабадский</option>
                            <option value="Район Бостанлыкский">Район Бостанлыкский</option>
                            <option value="Район Букинский">Район Букинский</option>
                            <option value="Район Зангиатинский">Район Зангиатинский</option>
                            <option value="Район Кибрайский">Район Кибрайский</option>
                            <option value="Район Паркентский">Район Паркентский</option>
                            <option value="Район Пскентский">Район Пскентский</option>
                            <option value="Район Уртачирчикский">Район Уртачирчикский</option>
                            <option value="Район Чиназский">Район Чиназский</option>
                            <option value="Район Янгиюльский">Район Янгиюльский</option>
                            <option value="Город Чирчик">Город Чирчик</option>
                            <option value="Город Ангрен">Город Ангрен</option>
                            <option value="Город Алмалык">Город Алмалык</option>
                            <option value="Город Бекабад">Город Бекабад</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Ферганская область" && (
                          <>
                            <option value="Район Алтыарыкский">Район Алтыарыкский</option>
                            <option value="Район Багдадский">Район Багдадский</option>
                            <option value="Район Бешарыкский">Район Бешарыкский</option>
                            <option value="Район Булакбашинский">Район Булакбашинский</option>
                            <option value="Район Куштепинский">Район Куштепинский</option>
                            <option value="Район Риштанский">Район Риштанский</option>
                            <option value="Район Сохский">Район Сохский</option>
                            <option value="Район Ташлакский">Район Ташлакский</option>
                            <option value="Район Узбекистанский">Район Узбекистанский</option>
                            <option value="Район Фуркатский">Район Фуркатский</option>
                            <option value="Район Язъяванский">Район Язъяванский</option>
                            <option value="Город Фергана">Город Фергана</option>
                            <option value="Город Коканд">Город Коканд</option>
                            <option value="Город Маргилан">Город Маргилан</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Хорезмская область" && (
                          <>
                            <option value="Район Богатский">Район Богатский</option>
                            <option value="Район Гурленский">Район Гурленский</option>
                            <option value="Район Кошкупырский">Район Кошкупырский</option>
                            <option value="Район Ургенчский">Район Ургенчский</option>
                            <option value="Район Хазараспский">Район Хазараспский</option>
                            <option value="Район Ханкинский">Район Ханкинский</option>
                            <option value="Район Шаватский">Район Шаватский</option>
                            <option value="Район Янгиарыкский">Район Янгиарыкский</option>
                            <option value="Район Янгиуллинский">Район Янгиуллинский</option>
                            <option value="Город Ургенч">Город Ургенч</option>
                            <option value="Город Хива">Город Хива</option>
                          </>
                        )}
                        {formData.country === "Узбекистан" && formData.region === "Город Ташкент" && (
                          <>
                            <option value="Город Ташкент">Город Ташкент</option>
                            <option value="Район Бектемирский">Район Бектемирский</option>
                            <option value="Район Мирзо-Улугбекский">Район Мирзо-Улугбекский</option>
                            <option value="Район Мирободский">Район Мирободский</option>
                            <option value="Район Олмазорский">Район Олмазорский</option>
                            <option value="Район Сергели">Район Сергели</option>
                            <option value="Район Учтепинский">Район Учтепинский</option>
                            <option value="Район Чиланзарский">Район Чиланзарский</option>
                            <option value="Район Шайхантохурский">Район Шайхантохурский</option>
                            <option value="Район Юнусабадский">Район Юнусабадский</option>
                            <option value="Район Яшнабадский">Район Яшнабадский</option>
                            <option value="Район Яккасарайский">Район Яккасарайский</option>
                            <option value="Район Янгихаётский">Район Янгихаётский</option>
                          </>
                        )}
                        {formData.country === "Россия" && formData.region === "Московская область" && (
                          <>
                            <option value="Район Балашихинский">Район Балашихинский</option>
                            <option value="Район Домодедовский">Район Домодедовский</option>
                            <option value="Район Красногорский">Район Красногорский</option>
                            <option value="Район Люберецкий">Район Люберецкий</option>
                            <option value="Район Одинцовский">Район Одинцовский</option>
                            <option value="Район Подольский">Район Подольский</option>
                            <option value="Район Мытищинский">Район Мытищинский</option>
                            <option value="Район Серпуховский">Район Серпуховский</option>
                            <option value="Район Химкинский">Район Химкинский</option>
                            <option value="Район Щёлковский">Район Щёлковский</option>
                            <option value="Город Балашиха">Город Балашиха</option>
                            <option value="Город Видное">Город Видное</option>
                            <option value="Город Домодедо">Город Домодедо</option>
                            <option value="Город Королёв">Город Королёв</option>
                            <option value="Город Красногорск">Город Красногорск</option>
                            <option value="Город Люберцы">Город Люберцы</option>
                            <option value="Город Мытищи">Город Мытищи</option>
                            <option value="Город Одинцово">Город Одинцово</option>
                            <option value="Город Подольск">Город Подольск</option>
                            <option value="Город Реутов">Город Реутов</option>
                            <option value="Город Серпухов">Город Серпухов</option>
                            <option value="Город Химки">Город Химки</option>
                            <option value="Город Электросталь">Город Электросталь</option>
                          </>
                        )}
                        {formData.country === "Россия" && formData.region === "Город Москва" && (
                          <>
                            <option value="Центральный административный округ">Центральный административный округ</option>
                            <option value="Северный административный округ">Северный административный округ</option>
                            <option value="Северо-Восточный административный округ">Северо-Восточный административный округ</option>
                            <option value="Восточный административный округ">Восточный административный округ</option>
                            <option value="Юго-Восточный административный округ">Юго-Восточный административный округ</option>
                            <option value="Южный административный округ">Южный административный округ</option>
                            <option value="Юго-Западный административный округ">Юго-Западный административный округ</option>
                            <option value="Западный административный округ">Западный административный округ</option>
                            <option value="Северо-Западный административный округ">Северо-Западный административный округ</option>
                            <option value="Зеленоградский административный округ">Зеленоградский административный округ</option>
                            <option value="Троицкий административный округ">Троицкий административный округ</option>
                            <option value="Новомосковский административный округ">Новомосковский административный округ</option>
                          </>
                        )}
                        {formData.country === "Россия" && formData.region === "Город Санкт-Петербург" && (
                          <>
                            <option value="Адмиралтейский район">Адмиралтейский район</option>
                            <option value="Василеостровский район">Василеостровский район</option>
                            <option value="Выборгский район">Выборгский район</option>
                            <option value="Калининский район">Калининский район</option>
                            <option value="Кировский район">Кировский район</option>
                            <option value="Колпинский район">Колпинский район</option>
                            <option value="Красногвардейский район">Красногвардейский район</option>
                            <option value="Красносельский район">Красносельский район</option>
                            <option value="Кронштадтский район">Кронштадтский район</option>
                            <option value="Курортный район">Курортный район</option>
                            <option value="Московский район">Московский район</option>
                            <option value="Невский район">Невский район</option>
                            <option value="Петроградский район">Петроградский район</option>
                            <option value="Петродворцовый район">Петродворцовый район</option>
                            <option value="Приморский район">Приморский район</option>
                            <option value="Пушкинский район">Пушкинский район</option>
                            <option value="Фрунзенский район">Фрунзенский район</option>
                            <option value="Центральный район">Центральный район</option>
                          </>
                        )}
                        {formData.country === "Россия" && formData.region === "Ленинградская область" && (
                          <>
                            <option value="Всеволожский район">Всеволожский район</option>
                            <option value="Гатчинский район">Гатчинский район</option>
                            <option value="Кингисеппский район">Кингисеппский район</option>
                            <option value="Киришский район">Киришский район</option>
                            <option value="Кировский район">Кировский район</option>
                            <option value="Лодейнопольский район">Лодейнопольский район</option>
                            <option value="Ломоносовский район">Ломоносовский район</option>
                            <option value="Лужский район">Лужский район</option>
                            <option value="Подпорожский район">Подпорожский район</option>
                            <option value="Приозерский район">Приозерский район</option>
                            <option value="Сланцевский район">Сланцевский район</option>
                            <option value="Тихвинский район">Тихвинский район</option>
                            <option value="Тосненский район">Тосненский район</option>
                            <option value="Волховский район">Волховский район</option>
                            <option value="Бокситогорский район">Бокситогорский район</option>
                            <option value="Выборгский район">Выборгский район</option>
                            <option value="Волосовский район">Волосовский район</option>
                          </>
                        )}
                        {formData.country === "Россия" && formData.region === "Краснодарский край" && (
                          <>
                            <option value="Абинский район">Абинский район</option>
                            <option value="Анапский район">Анапский район</option>
                            <option value="Апшеронский район">Апшеронский район</option>
                            <option value="Белоглинский район">Белоглинский район</option>
                            <option value="Белореченский район">Белореченский район</option>
                            <option value="Брюховецкий район">Брюховецкий район</option>
                            <option value="Выселковский район">Выселковский район</option>
                            <option value="Гулькевичский район">Гулькевичский район</option>
                            <option value="Динской район">Динской район</option>
                            <option value="Ейский район">Ейский район</option>
                            <option value="Кавказский район">Кавказский район</option>
                            <option value="Калининский район">Калининский район</option>
                            <option value="Каневской район">Каневской район</option>
                            <option value="Кореновский район">Кореновский район</option>
                            <option value="Красноармейский район">Красноармейский район</option>
                            <option value="Крыловский район">Крыловский район</option>
                            <option value="Крымский район">Крымский район</option>
                            <option value="Курганинский район">Курганинский район</option>
                            <option value="Кущёвский район">Кущёвский район</option>
                            <option value="Лабинский район">Лабинский район</option>
                            <option value="Ленинградский район">Ленинградский район</option>
                            <option value="Мостовский район">Мостовский район</option>
                            <option value="Новокубанский район">Новокубанский район</option>
                            <option value="Новопокровский район">Новопокровский район</option>
                            <option value="Отрадненский район">Отрадненский район</option>
                            <option value="Павловский район">Павловский район</option>
                            <option value="Приморско-Ахтарский район">Приморско-Ахтарский район</option>
                            <option value="Северский район">Северский район</option>
                            <option value="Славянский район">Славянский район</option>
                            <option value="Староминский район">Староминский район</option>
                            <option value="Тбилисский район">Тбилисский район</option>
                            <option value="Темрюкский район">Темрюкский район</option>
                            <option value="Тимашёвский район">Тимашёвский район</option>
                            <option value="Тихорецкий район">Тихорецкий район</option>
                            <option value="Туапсинский район">Туапсинский район</option>
                            <option value="Успенский район">Успенский район</option>
                            <option value="Усть-Лабинский район">Усть-Лабинский район</option>
                            <option value="Щербиновский район">Щербиновский район</option>
                            <option value="Город Краснодар">Город Краснодар</option>
                            <option value="Город Сочи">Город Сочи</option>
                            <option value="Город Новороссийск">Город Новороссийск</option>
                            <option value="Город Армавир">Город Армавир</option>
                            <option value="Город Ейск">Город Ейск</option>
                            <option value="Город Кропоткин">Город Кропоткин</option>
                            <option value="Город Крымск">Город Крымск</option>
                            <option value="Город Лабинск">Город Лабинск</option>
                            <option value="Город Славянск-на-Кубани">Город Славянск-на-Кубани</option>
                            <option value="Город Тихорецк">Город Тихорецк</option>
                            <option value="Город Туапсе">Город Туапсе</option>
                          </>
                        )}
                        {formData.country === "Казахстан" && formData.region === "Алматинская область" && (
                          <>
                            <option value="Алмалинский район">Алмалинский район</option>
                            <option value="Алтайский район">Алтайский район</option>
                            <option value="Балхашский район">Балхашский район</option>
                            <option value="Енбекшиказахский район">Енбекшиказахский район</option>
                            <option value="Ескельдинский район">Ескельдинский район</option>
                            <option value="Жамбылский район">Жамбылский район</option>
                            <option value="Илийский район">Илийский район</option>
                            <option value="Карасайский район">Карасайский район</option>
                            <option value="Кегенский район">Кегенский район</option>
                            <option value="Кербулакский район">Кербулакский район</option>
                            <option value="Коксуский район">Коксуский район</option>
                            <option value="Панфиловский район">Панфиловский район</option>
                            <option value="Райымбекский район">Райымбекский район</option>
                            <option value="Саркандский район">Саркандский район</option>
                            <option value="Талгарский район">Талгарский район</option>
                            <option value="Уйгурский район">Уйгурский район</option>
                            <option value="Уйгурский район">Уйгурский район</option>
                            <option value="Город Талдыкорган">Город Талдыкорган</option>
                            <option value="Город Капчагай">Город Капчагай</option>
                            <option value="Город Текели">Город Текели</option>
                            <option value="Город Ушарал">Город Ушарал</option>
                            <option value="Город Уштобе">Город Уштобе</option>
                          </>
                        )}
                        {formData.country === "Казахстан" && formData.region === "Город Алматы" && (
                          <>
                            <option value="Алмалинский район">Алмалинский район</option>
                            <option value="Ауэзовский район">Ауэзовский район</option>
                            <option value="Бостандыкский район">Бостандыкский район</option>
                            <option value="Жетысуский район">Жетысуский район</option>
                            <option value="Медеуский район">Медеуский район</option>
                            <option value="Наурызбайский район">Наурызбайский район</option>
                            <option value="Турксибский район">Турксибский район</option>
                            <option value="Город Алматы">Город Алматы</option>
                          </>
                        )}
                        {formData.country === "Казахстан" && formData.region === "Город Астана" && (
                          <>
                            <option value="Алматинский район">Алматинский район</option>
                            <option value="Байконурский район">Байконурский район</option>
                            <option value="Есильский район">Есильский район</option>
                            <option value="Сарыаркинский район">Сарыаркинский район</option>
                            <option value="Город Астана">Город Астана</option>
                          </>
                        )}




















                      </select>
                    ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{userProfile.district || formData.district || "Не указано"}</p>
                    </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Улица и дом
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full border-gray-300 focus:border-blue-500"
                      placeholder="Улица Марифатчи, дом 15"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{formData.address || userProfile.address || "Не указано"}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
                        {/* Workplace Info */}
                        <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100">
                <CardTitle className="flex items-center gap-3 text-teal-800">
                  <Building className="w-6 h-6" />
                  Место работы
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                                 {/* Yandex Maps */}
                 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                   <div className="p-4 bg-blue-50 border-b border-gray-200">
                     <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                       <MapPin className="w-5 h-5" />
                       Местоположение клиники
                     </h4>
                   </div>
                   <div className="h-64 bg-gray-100 relative">
                     <iframe
                       src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor"
                       width="100%"
                       height="100%"
                       frameBorder="0"
                       title="Yandex Maps - Местоположение клиники"
                       className="w-full h-full"
                     ></iframe>
                     <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs text-gray-600 shadow-sm">
                       Yandex Maps
                     </div>
                   </div>
                   <div className="p-4 bg-gray-50 border-t border-gray-200">
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-600">ул. Навои, 15, Ташкент</span>
                       <button className="text-blue-600 hover:text-blue-700 font-medium">
                         Открыть в картах →
                       </button>
                     </div>
                   </div>
                 </div>

                {/* Workplace Details */}
                {/* <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Building className="w-4 h-4 text-teal-600" />
                      Название клиники
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.location || "Медицинский центр 'Здоровье'"}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                        placeholder="Введите название клиники"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700 font-medium">{formData.location || "Медицинский центр 'Здоровье'"}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      Полный адрес
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={formData.address || "ул. Навои, 15, Ташкент, Узбекистан"}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        rows={2}
                        className="w-full border-gray-300 focus:border-blue-500"
                        placeholder="Введите полный адрес клиники"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700">{formData.address || "ул. Навои, 15, Ташкент, Узбекистан"}</p>
                      </div>
                    )}
                  </div>

                                     <div>
                     <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                       <Phone className="w-4 h-4 text-blue-600" />
                       Телефон клиники
                     </label>
                     {isEditing ? (
                       <Input
                         value={formData.phone || "+998 71 123 45 67"}
                         onChange={(e) => handleInputChange("phone", e.target.value)}
                         className="w-full border-gray-300 focus:border-blue-500"
                         placeholder="Введите телефон клиники"
                       />
                     ) : (
                       <div className="p-3 bg-gray-50 rounded-lg border">
                         <p className="text-gray-700 font-medium">{formData.phone || "+998 71 123 45 67"}</p>
                       </div>
                     )}
                   </div>

                   <div>
                     <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                       <Mail className="w-4 h-4 text-green-600" />
                       Email клиники
                     </label>
                     {isEditing ? (
                       <Input
                         value={formData.email || "info@zdorovie.uz"}
                         onChange={(e) => handleInputChange("email", e.target.value)}
                         type="email"
                         className="w-full border-gray-300 focus:border-blue-500"
                         placeholder="Введите email клиники"
                       />
                     ) : (
                       <div className="p-3 bg-gray-50 rounded-lg border">
                         <p className="text-gray-700 font-medium">{formData.email || "info@zdorovie.uz"}</p>
                       </div>
                     )}
                   </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      Режим работы клиники
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.workingHours || "Пн-Пт: 8:00-20:00, Сб: 9:00-18:00, Вс: 10:00-16:00"}
                        onChange={(e) => handleInputChange("workingHours", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                        placeholder="Введите режим работы"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700">{formData.workingHours || "Пн-Пт: 8:00-20:00, Сб: 9:00-18:00, Вс: 10:00-16:00"}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      Веб-сайт клиники
                    </label>
                    {isEditing ? (
                      <Input
                        value="https://zdorovie.uz"
                        className="w-full border-gray-300 focus:border-blue-500"
                        placeholder="Введите веб-сайт клиники"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700 font-medium">https://zdorovie.uz</p>
                      </div>
                    )}
                  </div>
                </div> */}
              </CardContent>
            </Card>
            {/* Quick Stats */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                <CardTitle className="flex items-center gap-3 text-indigo-800">
                  <TrendingUp className="w-6 h-6" />
                  Быстрая статистика
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Активные пациенты</span>
                  </div>
                  <span className="font-bold text-blue-600">{userProfile.active_patients || userProfile.patients_accepted_count || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Завершенные курсы</span>
                  </div>
                  <span className="font-bold text-green-600">{userProfile.completed_treatments || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Исследования</span>
                  </div>
                  <span className="font-bold text-purple-600">{userProfile.research_papers || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Конференции</span>
                  </div>
                  <span className="font-bold text-orange-600">{userProfile.conferences_attended || 0}</span>
                </div>
              </CardContent>
            </Card>



            {/* Reviews */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                <CardTitle className="flex items-center gap-3 text-yellow-800">
                  <MessageCircle className="w-6 h-6" />
                  Отзывы пациентов
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { name: "Пациент А.", rating: 5, comment: "Отличный врач, очень внимательный и профессиональный!", avatar: "П" },
                    { name: "Пациент М.", rating: 5, comment: "Рекомендую всем, очень доволен лечением.", avatar: "М" }
                  ].map((review, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-500 text-white font-medium text-sm">
                            {review.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 text-sm">{review.name}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chart Placeholder */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
                <CardTitle className="flex items-center gap-3 text-pink-800">
                  <BarChart3 className="w-6 h-6" />
                  График пациентов
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Январь</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">75%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Февраль</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Март</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">60%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Апрель</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '90%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">90%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Выбор языков</h2>
                    <p className="text-blue-100 text-sm">
                      {formData.languages.length} языков выбрано
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск языков..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>

            {/* Languages Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredLanguages.map((language) => {
                  const isSelected = formData.languages.includes(language)
                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-medium text-left ${
                          isSelected ? 'text-blue-800' : 'text-gray-700'
                        }`}>
                          {language}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {filteredLanguages.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Языки не найдены</p>
                  <p className="text-gray-400">Попробуйте другой поисковый запрос</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Всего языков: <span className="font-medium">{availableLanguages.length}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, languages: [] }))}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Очистить все
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLanguageModalOpen(false)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Готово
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specialization Selection Modal */}
      {isSpecializationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Выбор специализаций</h2>
                    <p className="text-green-100 text-sm">
                      {formData.specialization && formData.specialization.length > 0 ? `${formData.specialization.length} специализаций выбрано` : "Специализации не выбраны"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSpecializationModalOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск специализации..."
                  value={specializationSearch}
                  onChange={(e) => setSpecializationSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                />
              </div>
            </div>

            {/* Specializations Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {availableSpecializations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Загрузка специализаций...</p>
                  <p className="text-gray-400">Пожалуйста, подождите</p>
                  <div className="mt-4 text-sm text-gray-400">
                    <p>Debug: availableSpecializations.length = {availableSpecializations.length}</p>
                    <p>Debug: filteredSpecializations.length = {filteredSpecializations.length}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSpecializations.map((specialization) => {
                    const isSelected = formData.specialization && formData.specialization.includes(specialization)
                    return (
                      <button
                        key={specialization}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            // Remove specialization
                            handleInputChange("specialization", formData.specialization.filter(spec => spec !== specialization))
                          } else {
                            // Add specialization
                            handleInputChange("specialization", [...(formData.specialization || []), specialization])
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`font-medium text-left ${
                            isSelected ? 'text-green-800' : 'text-gray-700'
                          }`}>
                            {specialization}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
              
              {availableSpecializations.length > 0 && filteredSpecializations.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Специализации не найдены</p>
                  <p className="text-gray-400">Попробуйте другой поисковый запрос</p>
                </div>
              )}
              
              {/* Debug Information */}
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
                <p><strong>Debug Info:</strong></p>
                <p>availableSpecializations: {availableSpecializations.length} items</p>
                <p>filteredSpecializations: {filteredSpecializations.length} items</p>
                <p>specializationSearch: "{specializationSearch}"</p>
                <p>API URL: {DOCTOR_SPECIALTIES_API}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Всего специализаций: <span className="font-medium">{availableSpecializations.length}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("specialization", [])
                      setIsSpecializationModalOpen(false)
                    }}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Очистить все
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSpecializationModalOpen(false)}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Готово
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Working Hours Selection Modal */}
      {isWorkingHoursModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock4 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Выбор рабочих часов</h2>
                    <p className="text-purple-100 text-sm">
                      {formData.workingHours ? "1 вариант выбран" : "Часы работы не выбраны"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWorkingHoursModalOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Working Hours Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allWorkingHours.map((hours) => {
                  const isSelected = formData.workingHours === hours
                  return (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => {
                        handleInputChange("workingHours", hours)
                        setIsWorkingHoursModalOpen(false)
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-md'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-medium text-left ${
                          isSelected ? 'text-purple-800' : 'text-gray-700'
                        }`}>
                          {hours}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Всего вариантов: <span className="font-medium">{allWorkingHours.length}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("workingHours", "")
                      setIsWorkingHoursModalOpen(false)
                    }}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Очистить
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWorkingHoursModalOpen(false)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Готово
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Availability Selection Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Выбор доступности</h2>
                    <p className="text-purple-100 text-sm">
                      {formData.availability ? "1 вариант выбран" : "Доступность не выбрана"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAvailabilityModalOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Availability Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allAvailability.map((availability) => {
                  const isSelected = formData.availability === availability
                  return (
                    <button
                      key={availability}
                      type="button"
                      onClick={() => {
                        handleInputChange("availability", availability)
                        setIsAvailabilityModalOpen(false)
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-md'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-medium text-left ${
                          isSelected ? 'text-purple-800' : 'text-gray-700'
                        }`}>
                          {availability}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Всего вариантов: <span className="font-medium">{allAvailability.length}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("availability", "")
                      setIsAvailabilityModalOpen(false)
                    }}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Очистить
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAvailabilityModalOpen(false)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Готово
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
