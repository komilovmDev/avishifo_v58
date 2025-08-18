"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Activity, Target, Zap, BarChart3, Plus } from "lucide-react"

const API_BASE_URL = "https://new.avishifo.uz"

export default function PatientHealthTrackerPage() {
  const router = useRouter()

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
      <h1 className="text-3xl font-bold text-gray-800">Трекер Здоровья</h1>

      {/* Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md shadow-red-200/50">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Пульс</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">72</span>
              <span className="text-gray-500 mb-1">уд/мин</span>
            </div>
            <div className="mt-4">
              <Progress value={72} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Давление</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">120/80</span>
              <span className="text-gray-500 mb-1">мм рт.ст.</span>
            </div>
            <div className="mt-4">
              <Progress value={80} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>90/60</span>
                <span>120/80</span>
                <span>140/90</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-green-200/50">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Стабильно</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Вес</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">58</span>
              <span className="text-gray-500 mb-1">кг</span>
            </div>
            <div className="mt-4">
              <Progress value={58} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>40</span>
                <span>60</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md shadow-amber-200/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Хорошо</Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Сон</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">7.5</span>
              <span className="text-gray-500 mb-1">часов</span>
            </div>
            <div className="mt-4">
              <Progress value={75} max={100} className="h-2 bg-gray-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Charts */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Динамика Показателей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Графики здоровья будут отображаться здесь</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Цели Здоровья
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-200/50">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-gray-800">Снижение веса</h3>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">В процессе</Badge>
            </div>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Прогресс</span>
                <span className="text-sm font-medium text-indigo-600">60%</span>
              </div>
              <Progress value={60} max={100} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Цель: 55 кг</span>
              <span className="text-gray-600">Текущий: 58 кг</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-green-200/50">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-gray-800">Физическая активность</h3>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Выполнено</Badge>
            </div>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Прогресс</span>
                <span className="text-sm font-medium text-green-600">100%</span>
              </div>
              <Progress value={100} max={100} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Цель: 10,000 шагов</span>
              <span className="text-gray-600">Текущий: 12,345 шагов</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-gray-800">Водный баланс</h3>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">В процессе</Badge>
            </div>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Прогресс</span>
                <span className="text-sm font-medium text-blue-600">75%</span>
              </div>
              <Progress value={75} max={100} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Цель: 2 литра</span>
              <span className="text-gray-600">Текущий: 1.5 литра</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-200/50">
            <Plus className="w-4 h-4 mr-2" />
            Добавить Новую Цель
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
