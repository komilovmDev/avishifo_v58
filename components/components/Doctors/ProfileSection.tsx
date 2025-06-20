"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  Loader2,
  Stethoscope,
  Award,
  GraduationCap,
  Building2,
  FileText,
  Clock,
  Globe,
  Star,
  Activity,
  CheckCircle,
  AlertCircle,
  Users,
  MessageSquare,
  Linkedin,
  ExternalLink,
  Video,
  Info,
  Download,
  Share2,
  Printer,
  BarChart3,
  BookOpen,
  Briefcase,
  Clipboard,
  Heart,
  Sparkles,
  ThumbsUp,
  Filter,
  ChevronDown,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react"

interface DoctorProfile {
  // Basic user info
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  user_type: string
  phone_number: string
  date_of_birth: string
  address: string
  profile_picture: string
  is_verified: boolean
  date_joined: string

  // Professional info from Doctor model
  doctor_id: string
  specialty: string
  specialty_display: string
  license_number: string
  hospital: {
    id: number
    name: string
    address: string
  }
  years_of_experience: number
  education: string
  certifications: string
  consultation_fee: number
  is_available: boolean
  rating: number
  created_at: string
  updated_at: string

  // Additional fields that might come from API
  category?: string
  degree?: string
  work_email?: string
  work_phone?: string
  social_links?: {
    linkedin?: string
    research_gate?: string
    orcid?: string
  }
  schedule?: {
    days: string[]
    start_time: string
    end_time: string
    online_consultations: boolean
    languages: string[]
  }
  analytics?: {
    total_patients: number
    total_consultations: number
    monthly_patients?: number
    monthly_consultations?: number
    satisfaction_rate?: number
  }
  verification?: {
    status: string
    last_verification_date: string
    documents_uploaded: boolean
  }
  reviews?: {
    total_reviews: number
    average_rating: number
    rating_breakdown: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
    recent_reviews: Array<{
      id: number
      patient_name: string
      patient_avatar?: string
      rating: number
      comment: string
      date: string
      helpful_count?: number
      response?: {
        text: string
        date: string
      }
      tags?: string[]
      verified_patient: boolean
    }>
    monthly_reviews: number
    response_rate: number
    average_response_time: string
  }
  bio?: string
  specializations?: string[]
}

const API_BASE_URL = "https://new.avishifo.uz"

// Helper component for displaying info items consistently
const InfoItem = ({
  icon: Icon,
  label,
  children,
  htmlFor,
  tooltip,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
  htmlFor?: string
  tooltip?: string
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      <Label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </Label>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <div className="text-sm font-medium text-primary">{children}</div>
  </div>
)

// Stat card component for analytics
const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color = "blue",
}: {
  icon: React.ElementType
  label: string
  value: string | number
  change?: number
  color?: "blue" | "green" | "purple" | "amber" | "rose"
}) => {
  const colorMap = {
    blue: "from-blue-50 to-blue-100 text-blue-700 border-blue-200",
    green: "from-green-50 to-green-100 text-green-700 border-green-200",
    purple: "from-purple-50 to-purple-100 text-purple-700 border-purple-200",
    amber: "from-amber-50 to-amber-100 text-amber-700 border-amber-200",
    rose: "from-rose-50 to-rose-100 text-rose-700 border-rose-200",
  }

  return (
    <div className={`p-5 rounded-xl border bg-gradient-to-br ${colorMap[color]} flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? "+" : ""}
            {change}% за месяц
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-white/60 shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  )
}

export function ProfileSection() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    education: "",
    certifications: "",
    consultation_fee: "",
    bio: "",
  })

  useEffect(() => {
    fetchDoctorProfile()
  }, [])

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("accessToken")

      if (!token) {
        throw new Error("Токен доступа не найден. Пожалуйста, войдите в систему.")
      }

      const fetchWithAuth = (url: string, options = {}) =>
        fetch(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
        })

      // Fetch basic profile info
      const profileResponse = await fetchWithAuth(`${API_BASE_URL}/api/accounts/profile/`)
      if (!profileResponse.ok) throw new Error("Не удалось загрузить профиль пользователя")

      // Read the response only once
      const profileResponseData = await profileResponse.json()
      const profileData = profileResponseData.data || profileResponseData

      if (profileData.user_type !== "doctor") {
        throw new Error("Доступ запрещен. Этот раздел доступен только для врачей.")
      }

      // Fetch doctor-specific data
      let doctorInfo = {}
      try {
        const doctorResponse = await fetchWithAuth(`${API_BASE_URL}/api/doctors/profile/`)
        if (doctorResponse.ok) {
          const doctorResponseData = await doctorResponse.json()
          doctorInfo = doctorResponseData.data || doctorResponseData
        }
      } catch (doctorError) {
        console.warn("Could not fetch doctor-specific profile, using defaults.", doctorError)
      }

      // Mock data for enhanced design (would come from API in real implementation)
      const mockEnhancements = {
        bio: "Опытный врач с фокусом на комплексном подходе к здоровью пациента. Специализируюсь на диагностике и лечении сложных случаев. Постоянно совершенствую свои навыки через участие в международных конференциях и обучающих программах.",
        specializations: ["Кардиология", "Терапия", "Диагностика", "Профилактическая медицина", "Реабилитация"],
        analytics: {
          monthly_patients: 24,
          monthly_consultations: 42,
          satisfaction_rate: 98,
        },
      }

      const mockReviews = {
        total_reviews: 127,
        average_rating: 4.8,
        rating_breakdown: {
          5: 98,
          4: 22,
          3: 5,
          2: 1,
          1: 1,
        },
        recent_reviews: [
          {
            id: 1,
            patient_name: "Анна К.",
            patient_avatar: "/placeholder.svg?height=40&width=40",
            rating: 5,
            comment:
              "Отличный врач! Очень внимательный и профессиональный подход. Объяснил все детально, назначил эффективное лечение. Рекомендую всем!",
            date: "2024-01-15",
            helpful_count: 12,
            response: {
              text: "Спасибо за отзыв! Рад, что смог помочь. Желаю крепкого здоровья!",
              date: "2024-01-16",
            },
            tags: ["Профессионализм", "Внимательность", "Эффективность"],
            verified_patient: true,
          },
          {
            id: 2,
            patient_name: "Михаил С.",
            rating: 5,
            comment:
              "Прекрасный доктор! Быстро поставил диагноз, лечение помогло. Очень доволен качеством консультации.",
            date: "2024-01-12",
            helpful_count: 8,
            tags: ["Быстрая диагностика", "Эффективное лечение"],
            verified_patient: true,
          },
          {
            id: 3,
            patient_name: "Елена В.",
            rating: 4,
            comment:
              "Хороший врач, но пришлось долго ждать приема. В остальном все отлично - грамотная консультация и правильное лечение.",
            date: "2024-01-10",
            helpful_count: 5,
            tags: ["Профессионализм", "Долгое ожидание"],
            verified_patient: true,
          },
          {
            id: 4,
            patient_name: "Дмитрий Р.",
            rating: 5,
            comment:
              "Отличный специалист! Очень доступно объясняет, внимательно выслушивает. Результат лечения превзошел ожидания.",
            date: "2024-01-08",
            helpful_count: 15,
            response: {
              text: "Благодарю за доверие! Всегда готов помочь.",
              date: "2024-01-09",
            },
            tags: ["Доступное объяснение", "Внимательность", "Отличный результат"],
            verified_patient: true,
          },
          {
            id: 5,
            patient_name: "Ольга М.",
            rating: 5,
            comment: "Замечательный доктор! Профессиональный подход, современные методы лечения. Очень рекомендую!",
            date: "2024-01-05",
            helpful_count: 9,
            tags: ["Современные методы", "Профессионализм"],
            verified_patient: true,
          },
        ],
        monthly_reviews: 18,
        response_rate: 85,
        average_response_time: "2 часа",
      }

      // Merge profile and doctor data
      const combinedData: DoctorProfile = {
        ...profileData,
        ...doctorInfo,
        ...mockEnhancements, // Add mock data for enhanced design
        reviews: mockReviews,
        specialty_display: doctorInfo.specialty_display || doctorInfo.specialty || "Не указано",
        hospital: doctorInfo.hospital || { name: "Не указано" },
        full_name:
          profileData.full_name ||
          `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() ||
          "Не указано",
      }

      setProfile(combinedData)
      initializeEditForm(combinedData)

      if (combinedData.id) {
        loadAdditionalData(token, combinedData.id)
      }
    } catch (err) {
      console.error("Error fetching doctor profile:", err)
      setError(err instanceof Error ? err.message : "Произошла ошибка при загрузке профиля")
    } finally {
      setLoading(false)
    }
  }

  const initializeEditForm = (data: DoctorProfile) => {
    setEditForm({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      phone_number: data.phone_number || "",
      address: data.address || "",
      education: data.education || "",
      certifications: data.certifications || "",
      consultation_fee: data.consultation_fee?.toString() || "",
      bio: data.bio || "",
    })
  }

  const loadAdditionalData = async (token: string, doctorId: number) => {
    try {
      const fetchWithAuth = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } })

      const [scheduleRes, reviewsRes, analyticsRes] = await Promise.allSettled([
        fetchWithAuth(`${API_BASE_URL}/api/doctors/${doctorId}/schedule/`),
        fetchWithAuth(`${API_BASE_URL}/api/doctors/${doctorId}/reviews/`),
        fetchWithAuth(`${API_BASE_URL}/api/doctors/${doctorId}/analytics/`),
      ])

      const additionalData: Partial<DoctorProfile> = {}

      if (scheduleRes.status === "fulfilled" && scheduleRes.value.ok) {
        const scheduleData = await scheduleRes.value.json()
        additionalData.schedule = scheduleData.data || scheduleData
      }
      if (reviewsRes.status === "fulfilled" && reviewsRes.value.ok) {
        const reviewsData = await reviewsRes.value.json()
        additionalData.reviews = reviewsData.data || reviewsData
      }
      if (analyticsRes.status === "fulfilled" && analyticsRes.value.ok) {
        const analyticsData = await analyticsRes.value.json()
        additionalData.analytics = analyticsData.data || analyticsData
      }

      if (Object.keys(additionalData).length > 0) {
        setProfile((prev) => (prev ? { ...prev, ...additionalData } : null))
      }
    } catch (err) {
      console.error("Error loading additional data:", err)
    }
  }

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => {
    setIsEditing(false)
    if (profile) initializeEditForm(profile)
  }

  const handleSave = async () => {
    if (!profile) return
    setIsSaving(true)
    setError(null)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) throw new Error("Токен доступа не найден")

      const fetchWithAuth = (url: string, options = {}) =>
        fetch(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
          method: "PATCH",
        })

      const profileUpdateData = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        phone_number: editForm.phone_number,
        address: editForm.address,
      }

      const doctorUpdateData = {
        education: editForm.education,
        certifications: editForm.certifications,
        consultation_fee: Number.parseFloat(editForm.consultation_fee) || 0,
        bio: editForm.bio,
      }

      const [profileRes, doctorRes] = await Promise.allSettled([
        fetchWithAuth(`${API_BASE_URL}/api/accounts/profile/`, { body: JSON.stringify(profileUpdateData) }),
        fetchWithAuth(`${API_BASE_URL}/api/doctors/profile/`, { body: JSON.stringify(doctorUpdateData) }),
      ])

      if (profileRes.status === "rejected" || (profileRes.status === "fulfilled" && !profileRes.value.ok)) {
        throw new Error("Не удалось обновить основную информацию профиля.")
      }
      if (doctorRes.status === "rejected" || (doctorRes.status === "fulfilled" && !doctorRes.value.ok)) {
        console.warn("Не удалось обновить профессиональную информацию.")
      }

      await fetchDoctorProfile()
      setIsEditing(false)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Не удалось сохранить изменения")
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Не указано"
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getVerificationDetails = (profile: DoctorProfile) => {
    const status = profile.verification?.status || (profile.is_verified ? "verified" : "unverified")
    const colorMap: Record<string, string> = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      unverified: "bg-gray-100 text-gray-800",
    }
    const iconMap: Record<string, React.ElementType> = {
      verified: CheckCircle,
      pending: Clock,
      rejected: AlertCircle,
      unverified: AlertCircle,
    }
    const textMap: Record<string, string> = {
      verified: "Верифицирован",
      pending: "На проверке",
      rejected: "Отклонен",
      unverified: "Не верифицирован",
    }
    return {
      status,
      color: colorMap[status],
      Icon: iconMap[status],
      text: textMap[status],
    }
  }

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))

  const safeToFixed = (value: any, decimals = 1) => (Number(value) || 0).toFixed(decimals)
  const safeToLocaleString = (value: any) => (Number(value) || 0).toLocaleString("ru-RU")

  const calculateProfileCompleteness = () => {
    if (!profile) return 0
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.phone_number,
      profile.address,
      profile.education,
      profile.certifications,
      profile.specialty,
      profile.license_number,
      profile.years_of_experience,
      profile.consultation_fee,
      profile.bio,
    ]
    const completedFields = fields.filter(Boolean).length
    return Math.round((completedFields / fields.length) * 100)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-muted-foreground">Загрузка профиля...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Ошибка загрузки
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDoctorProfile} variant="outline">
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardContent className="pt-6 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p>Профиль не найден.</p>
        </CardContent>
      </Card>
    )
  }

  const verification = getVerificationDetails(profile)

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      {/* Hero section with profile header */}
      <div className="relative">
        <div className="h-48 md:h-64 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative -mt-20 md:-mt-24 px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar className="w-36 h-36 md:w-44 md:h-44 rounded-xl border-4 border-white shadow-xl">
              <AvatarImage
                src={profile.profile_picture || "/placeholder.svg?height=176&width=176&query=doctor%20portrait"}
                alt={profile.full_name}
              />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {profile.first_name?.[0]}
                {profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left bg-white/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none p-6 md:p-0 rounded-xl md:rounded-none shadow-lg md:shadow-none">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Др. {profile.full_name}</h1>
                    {profile.is_verified && <CheckCircle className="w-5 h-5 text-blue-600" />}
                  </div>
                  <p className="text-lg text-gray-600 mb-2">{profile.specialty_display}</p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200">
                      <Stethoscope className="w-3 h-3 mr-1" />
                      {profile.category || "Врач"}
                    </Badge>
                    {profile.degree && (
                      <Badge variant="secondary" className="bg-purple-50 text-purple-700 border border-purple-200">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {profile.degree}
                      </Badge>
                    )}
                    <Badge className={`${verification.color} border`}>
                      <verification.Icon className="w-3 h-3 mr-1" />
                      {verification.text}
                    </Badge>
                    {profile.is_available && (
                      <Badge className="bg-green-100 text-green-800 border border-green-200">
                        <Activity className="w-3 h-3 mr-1" />
                        Доступен для записи
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{profile.hospital?.name || "Не указано"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{profile.years_of_experience || 0} лет опыта</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{safeToFixed(profile.rating || 0, 1)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  {!isEditing ? (
                    <>
                      <Button onClick={handleEdit} className="gap-1.5">
                        <Edit3 className="w-4 h-4" />
                        Редактировать
                      </Button>
                      <Button variant="outline" className="gap-1.5">
                        <Share2 className="w-4 h-4" />
                        Поделиться
                      </Button>
                      <Button variant="outline" className="gap-1.5">
                        <Printer className="w-4 h-4" />
                        Печать
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleSave} disabled={isSaving} className="gap-1.5">
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <Save className="w-4 h-4" />
                        Сохранить
                      </Button>
                      <Button onClick={handleCancel} variant="outline" disabled={isSaving} className="gap-1.5">
                        <X className="w-4 h-4" />
                        Отмена
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile completeness card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-1">
                Заполненность профиля: {calculateProfileCompleteness()}%
              </h3>
              <p className="text-sm text-blue-600 mb-3">Заполните все поля профиля для повышения доверия пациентов</p>
              <Progress
                value={calculateProfileCompleteness()}
                className="h-2 w-full md:w-80 bg-blue-200"
                indicatorClassName="bg-blue-600"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 gap-1.5">
                <Download className="w-4 h-4" />
                Скачать данные
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5">
                <Sparkles className="w-4 h-4" />
                Улучшить профиль
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-1">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <User className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger
              value="professional"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Профессиональное
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              График
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Отзывы
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bio and Specializations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />О враче
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bio" className="text-sm text-muted-foreground mb-2 block">
                    Биография
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Расскажите о себе, своем опыте и подходе к лечению"
                      rows={5}
                      className="resize-none"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{profile.bio || "Биография не указана."}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Специализации</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations?.map((spec) => (
                      <Badge key={spec} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 py-1.5">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Образование</Label>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      {isEditing ? (
                        <Textarea
                          id="education"
                          value={editForm.education}
                          onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                          placeholder="Укажите ВУЗ, год окончания и специальность"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">{profile.education || "Не указано"}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Сертификаты и достижения</Label>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      {isEditing ? (
                        <Textarea
                          id="certifications"
                          value={editForm.certifications}
                          onChange={(e) => setEditForm({ ...editForm, certifications: e.target.value })}
                          placeholder="Перечислите сертификаты, курсы повышения квалификации"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">{profile.certifications || "Не указано"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clipboard className="w-5 h-5 text-blue-600" />
                    Основная информация
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={User} label="Имя">
                      {isEditing ? (
                        <Input
                          id="first_name"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          className="h-8 text-sm"
                        />
                      ) : (
                        profile.first_name || "Не указано"
                      )}
                    </InfoItem>

                    <InfoItem icon={User} label="Фамилия">
                      {isEditing ? (
                        <Input
                          id="last_name"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          className="h-8 text-sm"
                        />
                      ) : (
                        profile.last_name || "Не указано"
                      )}
                    </InfoItem>
                  </div>

                  <InfoItem icon={Mail} label="Email">
                    {profile.email}
                  </InfoItem>

                  <InfoItem icon={Phone} label="Телефон">
                    {isEditing ? (
                      <Input
                        id="phone_number"
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                        className="h-8 text-sm"
                      />
                    ) : (
                      profile.phone_number || "Не указано"
                    )}
                  </InfoItem>

                  <InfoItem icon={MapPin} label="Адрес">
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        rows={2}
                        className="text-sm"
                      />
                    ) : (
                      profile.address || "Не указано"
                    )}
                  </InfoItem>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={Calendar} label="Дата рождения">
                      {formatDate(profile.date_of_birth)}
                    </InfoItem>

                    <InfoItem icon={Calendar} label="Регистрация">
                      {formatDate(profile.date_joined)}
                    </InfoItem>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Star className="w-5 h-5 text-amber-500" />
                    Рейтинг и отзывы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">
                        {safeToFixed(profile.reviews?.average_rating || profile.rating || 0, 1)}
                      </span>
                      <div className="flex">{renderStars(profile.reviews?.average_rating || profile.rating || 0)}</div>
                    </div>
                    <span className="text-sm text-muted-foreground">{profile.reviews?.total_reviews || 0} отзывов</span>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <a href="#reviews">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Смотреть все отзывы
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Всего пациентов"
              value={safeToLocaleString(profile.analytics?.total_patients || 0)}
              change={8}
              color="blue"
            />
            <StatCard
              icon={MessageSquare}
              label="Консультаций"
              value={safeToLocaleString(profile.analytics?.total_consultations || 0)}
              change={12}
              color="green"
            />
            <StatCard
              icon={Heart}
              label="Удовлетворенность"
              value={`${profile.analytics?.satisfaction_rate || 95}%`}
              change={2}
              color="rose"
            />
            <StatCard
              icon={BookOpen}
              label="Опыт работы"
              value={`${profile.years_of_experience || 0} лет`}
              color="purple"
            />
          </div>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  Профессиональная информация
                </CardTitle>
                <CardDescription>
                  Подробная информация о вашей профессиональной деятельности и квалификации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InfoItem
                    icon={Award}
                    label="Специализация"
                    tooltip="Основная медицинская специализация согласно классификатору"
                  >
                    {profile.specialty_display}
                  </InfoItem>

                  <InfoItem
                    icon={Shield}
                    label="Категория"
                    tooltip="Профессиональная категория, присвоенная аттестационной комиссией"
                  >
                    {profile.category || "Не указано"}
                  </InfoItem>

                  <InfoItem icon={Clock} label="Опыт работы" tooltip="Общий стаж работы по специальности">
                    {profile.years_of_experience || 0} лет
                  </InfoItem>

                  <InfoItem icon={Building2} label="Место работы" tooltip="Основное место работы">
                    {profile.hospital?.name || "Не указано"}
                  </InfoItem>

                  <InfoItem
                    icon={FileText}
                    label="Лицензия"
                    tooltip="Номер лицензии на осуществление медицинской деятельности"
                  >
                    {profile.license_number || "Не указано"}
                  </InfoItem>

                  <InfoItem icon={Globe} label="Стоимость консультации" tooltip="Стоимость первичной консультации">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editForm.consultation_fee}
                        onChange={(e) => setEditForm({ ...editForm, consultation_fee: e.target.value })}
                        placeholder="Сум"
                        className="h-8 text-sm"
                      />
                    ) : (
                      `${safeToLocaleString(profile.consultation_fee)} сум`
                    )}
                  </InfoItem>
                </div>

                <Separator className="my-2" />

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="education" className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        Образование
                      </Label>
                      {!isEditing && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Добавить
                        </Button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border">
                      {isEditing ? (
                        <Textarea
                          id="education"
                          value={editForm.education}
                          onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                          placeholder="Укажите ВУЗ, год окончания и специальность"
                          rows={4}
                        />
                      ) : (
                        <div className="space-y-3">
                          {profile.education ? (
                            <div className="whitespace-pre-wrap text-gray-700">{profile.education}</div>
                          ) : (
                            <div className="text-center text-muted-foreground py-4">
                              <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-40" />
                              <p>Информация об образовании не указана</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="certifications" className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-4 h-4" />
                        Сертификаты и достижения
                      </Label>
                      {!isEditing && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Добавить
                        </Button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border">
                      {isEditing ? (
                        <Textarea
                          id="certifications"
                          value={editForm.certifications}
                          onChange={(e) => setEditForm({ ...editForm, certifications: e.target.value })}
                          placeholder="Перечислите сертификаты, курсы повышения квалификации"
                          rows={4}
                        />
                      ) : (
                        <div className="space-y-3">
                          {profile.certifications ? (
                            <div className="whitespace-pre-wrap text-gray-700">{profile.certifications}</div>
                          ) : (
                            <div className="text-center text-muted-foreground py-4">
                              <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
                              <p>Информация о сертификатах не указана</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-indigo-800">
                    <Shield className="w-5 h-5" />
                    Статус верификации
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-full ${verification.status === "verified" ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      <verification.Icon
                        className={`w-6 h-6 ${verification.status === "verified" ? "text-green-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{verification.text}</p>
                      <p className="text-sm text-gray-500">
                        Последняя проверка:{" "}
                        {formatDate(profile.verification?.last_verification_date || profile.updated_at)}
                      </p>
                    </div>
                  </div>

                  {verification.status !== "verified" && (
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Запросить верификацию</Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Специализации
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations?.map((spec) => (
                      <Badge key={spec} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 py-1.5">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="w-5 h-5 text-green-600" />
                    Активность профиля
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Заполненность профиля</span>
                      <span className="font-medium">{calculateProfileCompleteness()}%</span>
                    </div>
                    <Progress value={calculateProfileCompleteness()} className="h-2" />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Последнее обновление</p>
                    <p className="font-medium">{formatDate(profile.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                График работы и консультаций
              </CardTitle>
              <CardDescription>Информация о вашем расписании и доступности для пациентов</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.schedule ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-purple-800">Дни приема</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].map(
                          (day) => {
                            const isActive = profile.schedule?.days?.includes(day)
                            return (
                              <Badge
                                key={day}
                                variant={isActive ? "default" : "outline"}
                                className={isActive ? "bg-purple-600" : "text-gray-400 border-gray-200"}
                              >
                                {day}
                              </Badge>
                            )
                          },
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-purple-800">Время приема</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-sm text-purple-700">Начало</p>
                          <p className="text-2xl font-bold text-purple-900">{profile.schedule.start_time || "--:--"}</p>
                        </div>
                        <div className="h-px w-12 bg-purple-200"></div>
                        <div className="text-center">
                          <p className="text-sm text-purple-700">Окончание</p>
                          <p className="text-2xl font-bold text-purple-900">{profile.schedule.end_time || "--:--"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-purple-800">Онлайн консультации</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-full ${profile.schedule.online_consultations ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {profile.schedule.online_consultations ? (
                            <Video className="w-6 h-6 text-green-600" />
                          ) : (
                            <X className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {profile.schedule.online_consultations ? "Доступны" : "Недоступны"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {profile.schedule.online_consultations
                              ? "Вы можете проводить онлайн консультации"
                              : "Онлайн консультации отключены"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-purple-800">Языки приема</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.schedule.languages?.length > 0 ? (
                          profile.schedule.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="bg-white border-purple-200 text-purple-700">
                              {lang}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">Не указано</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-purple-800">Стоимость консультации</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-amber-100">
                          <Globe className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{safeToLocaleString(profile.consultation_fee)} сум</p>
                          <p className="text-sm text-muted-foreground">За первичную консультацию</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-200" />
                  <h3 className="text-xl font-semibold mb-2">График работы не настроен</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Настройте график работы, чтобы пациенты могли записаться к вам на прием
                  </p>
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Настроить график
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Контактная информация
              </CardTitle>
              <CardDescription>Контактные данные для связи с вами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-50 border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-green-800">Основные контакты</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-green-100">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-green-100">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <p className="font-medium">
                          {isEditing ? (
                            <Input
                              id="phone_number"
                              value={editForm.phone_number}
                              onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                              className="h-8 text-sm"
                            />
                          ) : (
                            profile.phone_number || "Не указано"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-green-100">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Адрес</p>
                        <p className="font-medium">
                          {isEditing ? (
                            <Textarea
                              id="address"
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              rows={2}
                              className="text-sm"
                            />
                          ) : (
                            profile.address || "Не указано"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-green-800">Рабочие контакты</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-green-100">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Рабочий email</p>
                        <p className="font-medium">{profile.work_email || "Не указан"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-green-100">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Рабочий телефон</p>
                        <p className="font-medium">{profile.work_phone || "Не указан"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-green-100">
                        <Building2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Место работы</p>
                        <p className="font-medium">{profile.hospital?.name || "Не указано"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {profile.social_links && Object.values(profile.social_links).some((link) => link) && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Профессиональные профили</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.social_links.linkedin && (
                      <a
                        href={profile.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-600 hover:underline"
                      >
                        <div className="p-2 rounded-full bg-blue-50">
                          <Linkedin className="w-5 h-5" />
                        </div>
                        <span>LinkedIn профиль</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}

                    {profile.social_links.research_gate && (
                      <a
                        href={profile.social_links.research_gate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-green-600 hover:underline"
                      >
                        <div className="p-2 rounded-full bg-green-50">
                          <Award className="w-5 h-5" />
                        </div>
                        <span>ResearchGate профиль</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}

                    {profile.social_links.orcid && (
                      <a
                        href={profile.social_links.orcid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-purple-600 hover:underline"
                      >
                        <div className="p-2 rounded-full bg-purple-50">
                          <User className="w-5 h-5" />
                        </div>
                        <span>ORCID профиль</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Rating Overview */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5 text-amber-500" />
                  Общий рейтинг
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Rating */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {safeToFixed(profile.reviews?.average_rating || 0, 1)}
                  </div>
                  <div className="flex justify-center mb-2">{renderStars(profile.reviews?.average_rating || 0)}</div>
                  <p className="text-sm text-muted-foreground">
                    На основе {profile.reviews?.total_reviews || 0} отзывов
                  </p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">Распределение оценок</h4>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = profile.reviews?.rating_breakdown?.[rating] || 0
                    const total = profile.reviews?.total_reviews || 1
                    const percentage = Math.round((count / total) * 100)

                    return (
                      <div key={rating} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-muted-foreground">{rating}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-xs text-muted-foreground">{count}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">За месяц</span>
                    <span className="font-medium">{profile.reviews?.monthly_reviews || 0} отзывов</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Отвечает на отзывы</span>
                    <span className="font-medium">{profile.reviews?.response_rate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Время ответа</span>
                    <span className="font-medium">{profile.reviews?.average_response_time || "Не указано"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Отзывы пациентов</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтр
                  </Button>
                  <Button variant="outline" size="sm">
                    Все отзывы
                  </Button>
                </div>
              </div>

              {profile.reviews?.recent_reviews?.length > 0 ? (
                <div className="space-y-4">
                  {profile.reviews.recent_reviews.map((review) => (
                    <Card key={review.id} className="border-l-4 border-l-amber-400 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={review.patient_avatar || "/placeholder.svg"}
                                alt={review.patient_name}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {review.patient_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{review.patient_name}</p>
                                {review.verified_patient && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Проверенный пациент
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">{renderStars(review.rating)}</div>
                                <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                              </div>
                            </div>
                          </div>

                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Review Content */}
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                          {/* Tags */}
                          {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {review.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Doctor Response */}
                          {review.response && (
                            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-l-blue-400">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={profile.profile_picture || "/placeholder.svg"}
                                    alt={profile.full_name}
                                  />
                                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                                    {profile.first_name?.[0]}
                                    {profile.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-blue-800">Ответ врача</span>
                                <span className="text-xs text-blue-600">{formatDate(review.response.date)}</span>
                              </div>
                              <p className="text-sm text-blue-700">{review.response.text}</p>
                            </div>
                          )}

                          {/* Review Actions */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Полезно ({review.helpful_count || 0})
                              </Button>
                              {!review.response && (
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Ответить
                                </Button>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <Share2 className="w-4 h-4 mr-1" />
                              Поделиться
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Load More Button */}
                  <div className="text-center pt-4">
                    <Button variant="outline" className="w-full max-w-md">
                      Показать еще отзывы
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-amber-200" />
                    <h3 className="text-xl font-semibold mb-2">Пока нет отзывов</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Отзывы от пациентов будут отображаться здесь после проведения консультаций
                    </p>
                    <Button>
                      <Users className="w-4 h-4 mr-2" />
                      Пригласить пациентов оставить отзыв
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Review Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Аналитика отзывов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-700">Средняя оценка</p>
                      <p className="text-2xl font-bold text-amber-800">
                        {safeToFixed(profile.reviews?.average_rating || 0, 1)}
                      </p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700">Всего отзывов</p>
                      <p className="text-2xl font-bold text-blue-800">{profile.reviews?.total_reviews || 0}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">Отвечает на отзывы</p>
                      <p className="text-2xl font-bold text-green-800">{profile.reviews?.response_rate || 0}%</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700">За месяц</p>
                      <p className="text-2xl font-bold text-purple-800">{profile.reviews?.monthly_reviews || 0}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
