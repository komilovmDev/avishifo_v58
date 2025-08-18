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
  UserCheck, CalendarDays, Clock4
} from "lucide-react"

const API_BASE_URL = "https://new.avishifo.uz"

const MOCK_DOCTOR_DATA = {
  full_name: "Доктор Ахмедов Алишер",
  first_name: "Алишер",
  last_name: "Ахмедов",
  email: "alisher.ahmedov@example.com",
  phone: "+998 90 123 45 67",
  specialization: "Кардиолог",
  experience: "15 лет",
  education: "Ташкентский медицинский университет",
  location: "Ташкент, Узбекистан",
  bio: "Опытный кардиолог с 15-летним стажем работы. Специализируюсь на лечении сердечно-сосудистых заболеваний.",
  languages: "Узбекский, Русский, Английский",
  certifications: "Сертификат кардиолога, Европейское общество кардиологов",
  date_of_birth: "1985-03-15",
  gender: "Мужской",
  address: "ул. Навои, 15, Ташкент, Узбекистан",
  emergency_contact: "+998 90 987 65 43",
  medical_license: "MD-12345",
  insurance: "Страховая компания 'Медицинская защита'",
  working_hours: "9:00-18:00",
  consultation_fee: "150,000 сум",
  availability: "Понедельник - Пятница",
  total_patients: 127,
  monthly_consultations: 89,
  rating: 4.9,
  total_reviews: 156,
  years_experience: 15,
  completed_treatments: 234,
  active_patients: 45,
  monthly_income: 4500000,
  languages_spoken: ["Узбекский", "Русский", "Английский"],
  specializations: ["Кардиология", "Эхокардиография", "ЭКГ"],
  awards: ["Лучший врач года 2023", "Отличник здравоохранения"],
  research_papers: 12,
  conferences_attended: 28
}

export default function DoctorProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState(MOCK_DOCTOR_DATA)
  const [formData, setFormData] = useState({
    fullName: MOCK_DOCTOR_DATA.full_name,
    email: MOCK_DOCTOR_DATA.email,
    phone: MOCK_DOCTOR_DATA.phone,
    specialization: MOCK_DOCTOR_DATA.specialization,
    experience: MOCK_DOCTOR_DATA.experience,
    education: MOCK_DOCTOR_DATA.education,
    location: MOCK_DOCTOR_DATA.location,
    bio: MOCK_DOCTOR_DATA.bio,
    languages: MOCK_DOCTOR_DATA.languages,
    certifications: MOCK_DOCTOR_DATA.certifications,
    dateOfBirth: MOCK_DOCTOR_DATA.date_of_birth,
    gender: MOCK_DOCTOR_DATA.gender,
    address: MOCK_DOCTOR_DATA.address,
    emergencyContact: MOCK_DOCTOR_DATA.emergency_contact,
    medicalLicense: MOCK_DOCTOR_DATA.medical_license,
    insurance: MOCK_DOCTOR_DATA.insurance,
    workingHours: MOCK_DOCTOR_DATA.working_hours,
    consultationFee: MOCK_DOCTOR_DATA.consultation_fee,
    availability: MOCK_DOCTOR_DATA.availability
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    try {
      const response = await axios.get(`${API_BASE_URL}/api/accounts/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const userData = response.data
      if (userData.user_type === "doctor") {
        setUserProfile(userData)
        setFormData({
          fullName: userData.full_name || `${userData.first_name} ${userData.last_name}` || "",
          email: userData.email || "",
          phone: userData.phone || "",
          specialization: userData.specialization || "",
          experience: userData.experience || "",
          education: userData.education || "",
          location: userData.location || "",
          bio: userData.bio || "",
          languages: userData.languages || "",
          certifications: userData.certifications || "",
          dateOfBirth: userData.date_of_birth || "",
          gender: userData.gender || "",
          address: userData.address || "",
          emergencyContact: userData.emergency_contact || "",
          medicalLicense: userData.medical_license || "",
          insurance: userData.insurance || "",
          workingHours: userData.working_hours || "",
          consultationFee: userData.consultation_fee || "",
          availability: userData.availability || ""
        })
      }
    } catch (error) {
      console.error("API error, using mock data:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (token) {
        const updateData = {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: formData.experience,
          education: formData.education,
          location: formData.location,
          bio: formData.bio,
          languages: formData.languages,
          certifications: formData.certifications,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address,
          emergency_contact: formData.emergencyContact,
          medical_license: formData.medicalLicense,
          insurance: formData.insurance,
          working_hours: formData.workingHours,
          consultation_fee: formData.consultationFee,
          availability: formData.availability
        }
        const response = await axios.patch(`${API_BASE_URL}/api/accounts/profile/`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserProfile(response.data)
        alert("Профиль успешно обновлен!")
      } else {
        setUserProfile({
          ...userProfile,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: formData.experience,
          education: formData.education,
          location: formData.location,
          bio: formData.bio,
          languages: formData.languages,
          certifications: formData.certifications,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address,
          emergency_contact: formData.emergencyContact,
          medical_license: formData.medicalLicense,
          insurance: formData.insurance,
          working_hours: formData.workingHours,
          consultation_fee: formData.consultationFee,
          availability: formData.availability
        })
        alert("Профиль обновлен (локально)!")
      }
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Ошибка при обновлении профиля")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: userProfile?.full_name || `${userProfile?.first_name} ${userProfile?.last_name}` || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      specialization: userProfile?.specialization || "",
      experience: userProfile?.experience || "",
      education: userProfile?.education || "",
      location: userProfile?.location || "",
      bio: userProfile?.bio || "",
      languages: userProfile?.languages || "",
      certifications: userProfile?.certifications || "",
      dateOfBirth: userProfile?.date_of_birth || "",
      gender: userProfile?.gender || "",
      address: userProfile?.address || "",
      emergencyContact: userProfile?.emergency_contact || "",
      medicalLicense: userProfile?.medical_license || "",
      insurance: userProfile?.insurance || "",
      workingHours: userProfile?.working_hours || "",
      consultationFee: userProfile?.consultation_fee || "",
      availability: userProfile?.availability || ""
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-4 border-blue-200">
                  <AvatarImage src={userProfile.profile_picture || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl font-bold">
                    {userProfile.first_name?.[0]}{userProfile.last_name?.[0] || "Д"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userProfile.full_name || `${userProfile.first_name} ${userProfile.last_name}`}
                  </h1>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      {userProfile.specialization || "Врач"}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {userProfile.experience || "15 лет"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-gray-600 font-medium">{userProfile.rating || "4.9"}</span>
                    </div>
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
              <p className="text-3xl font-bold text-blue-700 mb-1">{userProfile.total_patients || 127}</p>
              <p className="text-blue-600 font-medium">Пациенты</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">{userProfile.monthly_consultations || 89}</p>
              <p className="text-green-600 font-medium">Консультации</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-700 mb-1">{userProfile.rating || "4.9"}</p>
              <p className="text-purple-600 font-medium">Рейтинг</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-700 mb-1">{(userProfile.monthly_income || 4500000) / 1000}K</p>
              <p className="text-orange-600 font-medium">Доход</p>
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
                        <p className="text-gray-700 font-medium">{formData.fullName || "Не указано"}</p>
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
                        <p className="text-gray-700 font-medium">{formData.email || "Не указано"}</p>
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
                      <p className="text-gray-700 leading-relaxed">{formData.bio || "Биография не указана"}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <p className="text-gray-700 font-medium">{formData.dateOfBirth || "Не указано"}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-600" />
                      Пол
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700 font-medium">{formData.gender || "Не указано"}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      Языки
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.languages}
                        onChange={(e) => handleInputChange("languages", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700 font-medium">{formData.languages || "Не указано"}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      Специализация
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700 font-medium">{formData.specialization || "Не указано"}</p>
                      </div>
                    )}
                  </div>
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
                        <p className="text-gray-700 font-medium">{formData.experience || "Не указано"}</p>
                      </div>
                    )}
                  </div>
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
                      <p className="text-gray-700 font-medium">{formData.education || "Не указано"}</p>
                    </div>
                  )}
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
                      <p className="text-gray-700">{formData.certifications || "Не указано"}</p>
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
                        <p className="text-gray-700 font-medium">{formData.medicalLicense || "Не указано"}</p>
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
                        <p className="text-gray-700 font-medium">{formData.insurance || "Не указано"}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <Clock4 className="w-4 h-4 text-purple-600" />
                      Рабочие часы
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.workingHours}
                        onChange={(e) => handleInputChange("workingHours", e.target.value)}
                        placeholder="9:00-18:00"
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700 font-medium">{formData.workingHours || "Не указано"}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-purple-600" />
                      Доступность
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.availability}
                        onChange={(e) => handleInputChange("availability", e.target.value)}
                        placeholder="Пн-Пт"
                        className="w-full border-gray-300 focus:border-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-700 font-medium">{formData.availability || "Не указано"}</p>
                      </div>
                    )}
                  </div>
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
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{formData.consultationFee || "Не указано"}</p>
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
                        <p className="text-gray-700 font-medium">{formData.phone || "Не указано"}</p>
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
                        <p className="text-gray-700 font-medium">{formData.emergencyContact || "Не указано"}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Адрес
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full border-gray-300 focus:border-blue-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-700 font-medium">{formData.address || "Не указано"}</p>
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
                  <span className="font-bold text-blue-600">{userProfile.active_patients || 45}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Завершенные курсы</span>
                  </div>
                  <span className="font-bold text-green-600">{userProfile.completed_treatments || 234}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Исследования</span>
                  </div>
                  <span className="font-bold text-purple-600">{userProfile.research_papers || 12}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Конференции</span>
                  </div>
                  <span className="font-bold text-orange-600">{userProfile.conferences_attended || 28}</span>
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
    </div>
  )
}
