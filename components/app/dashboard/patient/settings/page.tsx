"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Settings, Shield, Bell, Clock, UserCircle, Lock, AlertCircle, Sparkles } from "lucide-react"

const API_BASE_URL = "https://new.avishifo.uz"

export default function PatientSettingsPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")

  useEffect(() => {
    // Check if user is authenticated and is a patient
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/accounts/profile/`, {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Настройки</h1>
          <p className="text-gray-600">Управление настройками приложения</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              Общие Настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Shield className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Конфиденциальность</p>
                  <p className="text-sm text-gray-500">Управление доступом к данным</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Bell className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Уведомления</p>
                  <p className="text-sm text-gray-500">Настройка напоминаний</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Clock className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">История активности</p>
                  <p className="text-sm text-gray-500">Просмотр всех действий</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-indigo-500" />
              Аккаунт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Lock className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Изменить пароль</p>
                  <p className="text-sm text-gray-500">Обновить пароль аккаунта</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white hover:bg-indigo-50">
                <Shield className="w-5 h-5 mr-3 text-indigo-500" />
                <div className="text-left">
                  <p className="font-medium">Двухфакторная аутентификация</p>
                  <p className="text-sm text-gray-500">Дополнительная защита</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl bg-white"
              >
                <AlertCircle className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Удалить аккаунт</p>
                  <p className="text-sm text-gray-500">Безвозвратное удаление</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Preferences */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Предпочтения Приложения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Язык интерфейса</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
                  <option>Русский</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Часовой пояс</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
                  <option>GMT+3 (Москва)</option>
                  <option>GMT+0 (UTC)</option>
                  <option>GMT-5 (EST)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тема оформления</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Темная</option>
                  <option value="system">Автоматически</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Формат даты</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200">
                  <option>ДД.ММ.ГГГГ</option>
                  <option>ММ/ДД/ГГГГ</option>
                  <option>ГГГГ-ММ-ДД</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-md shadow-indigo-200/50 rounded-xl">
              Сохранить Настройки
            </Button>
            <Button variant="outline" className="rounded-xl">
              Сбросить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
