"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Shield, Plus } from "lucide-react"

import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export default function PatientProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
  })

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
        } else {
          setUserProfile(userData)
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            phone_number: userData.phone_number || "",
            address: userData.address || "",
            date_of_birth: userData.date_of_birth || "",
          })
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

  // Получаем имя пользователя для отображения
  const getUserDisplayName = () => {
    if (!userProfile) return "Пользователь"

    if (userProfile.full_name) return userProfile.full_name
    if (userProfile.first_name && userProfile.last_name) return `${userProfile.first_name} ${userProfile.last_name}`
    if (userProfile.first_name) return userProfile.first_name
    if (userProfile.username) return userProfile.username

    return "Пользователь"
  }

  // Получаем инициалы пользователя для аватара
  const getUserInitials = () => {
    if (!userProfile) return "П"

    if (userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`
    }

    if (userProfile.full_name) {
      const nameParts = userProfile.full_name.split(" ")
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`
      }
      return userProfile.full_name[0]
    }

    if (userProfile.first_name) return userProfile.first_name[0]
    if (userProfile.username) return userProfile.username[0]

    return "П"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found")
        return
      }

      const response = await fetch(API_CONFIG.ENDPOINTS.PROFILE, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Обновляем данные пользователя после успешного сохранения
      const updatedData = await response.json()
      setUserProfile(updatedData)

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных профиля...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Мой Профиль</h1>

      {/* Profile Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="text-center">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl mx-auto">
                {userProfile.profile_picture ? (
                  <AvatarImage src={userProfile.profile_picture || "/placeholder.svg"} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-4xl">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="mt-4 space-y-2">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-md shadow-indigo-200/50 rounded-xl">
                  Изменить фото
                </Button>
                <Button variant="outline" className="w-full rounded-xl">
                  Удалить фото
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <Input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
                  <Input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                    disabled={!isEditing}
                  >
                    <option value="female">Женский</option>
                    <option value="male">Мужской</option>
                    <option value="other">Другой</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>

              <div className="pt-4 flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50"
                      onClick={handleSave}
                    >
                      Сохранить изменения
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={() => setIsEditing(false)}>
                      Отменить
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50"
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать профиль
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Медицинская Информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Аллергии</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-100 text-red-700 border-red-200">Пенициллин</Badge>
              <Badge className="bg-red-100 text-red-700 border-red-200">Арахис</Badge>
              <Badge className="bg-red-100 text-red-700 border-red-200">Пыльца</Badge>
              <Button variant="outline" size="sm" className="rounded-full h-6 px-3">
                <Plus className="w-3 h-3 mr-1" />
                Добавить
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Хронические заболевания</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Астма</Badge>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Мигрень</Badge>
              <Button variant="outline" size="sm" className="rounded-full h-6 px-3">
                <Plus className="w-3 h-3 mr-1" />
                Добавить
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Группа крови</h3>
            <select className="w-full md:w-1/3 p-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
              <option>A+ (II положительная)</option>
              <option>A- (II отрицательная)</option>
              <option>B+ (III положительная)</option>
              <option>B- (III отрицательная)</option>
              <option>AB+ (IV положительная)</option>
              <option>AB- (IV отрицательная)</option>
              <option>O+ (I положительная)</option>
              <option>O- (I отрицательная)</option>
            </select>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Экстренные контакты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">Джон Джонсон</p>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Муж</Badge>
                </div>
                <p className="text-sm text-gray-600">+7 (900) 987-65-43</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">Мария Смит</p>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Сестра</Badge>
                </div>
                <p className="text-sm text-gray-600">+7 (900) 111-22-33</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-2 rounded-xl">
              <Plus className="w-4 h-4 mr-1" />
              Добавить контакт
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50">
            Сохранить медицинскую информацию
          </Button>
        </CardFooter>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Настройки Приватности
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Доступ к медицинской истории</p>
              <p className="text-sm text-gray-600">Разрешить врачам видеть вашу полную медицинскую историю</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Уведомления о приеме лекарств</p>
              <p className="text-sm text-gray-600">Получать напоминания о приеме лекарств</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Анонимная статистика</p>
              <p className="text-sm text-gray-600">Разрешить использовать анонимные данные для улучшения сервиса</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Двухфакторная аутентификация</p>
              <p className="text-sm text-gray-600">Дополнительный уровень защиты для вашего аккаунта</p>
            </div>
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-xl shadow-md shadow-indigo-200/50">
            Сохранить настройки приватности
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
