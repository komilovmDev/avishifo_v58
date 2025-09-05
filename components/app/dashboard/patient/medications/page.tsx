"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pill, Calendar, Clock, CheckCircle, MoreHorizontal, Plus, Check } from "lucide-react"

import { API_CONFIG } from "../../../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export default function PatientMedicationsPage() {
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Мои Лекарства</h1>

      {/* Current Medications */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-500" />
              Текущие Лекарства
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-200/50">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Витамин D3</h3>
                  <p className="text-sm text-gray-600">2000 МЕ, 1 раз в день</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Активно</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Утром с едой</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Принято
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Омега-3</h3>
                  <p className="text-sm text-gray-600">1000 мг, 2 раза в день</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Активно</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Утром и вечером с едой</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Принято
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md shadow-amber-200/50">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Магний B6</h3>
                  <p className="text-sm text-gray-600">100 мг, 1 раз в день</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Активно</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Вечером перед сном</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Принято
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication Schedule */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Расписание Приема
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <h3 className="font-medium text-gray-800 mb-3">Сегодня</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm shadow-indigo-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Витамин D3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Принято</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm shadow-blue-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Омега-3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Принято</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm shadow-blue-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Омега-3</p>
                      <p className="text-xs text-gray-600">20:00</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    <Check className="w-3 h-3 mr-1" />
                    Принять
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm shadow-amber-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Магний B6</p>
                      <p className="text-xs text-gray-600">22:00</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    <Check className="w-3 h-3 mr-1" />
                    Принять
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">Завтра</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm shadow-indigo-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Витамин D3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200">Ожидается</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm shadow-blue-200/50">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Омега-3</p>
                      <p className="text-xs text-gray-600">08:00</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200">Ожидается</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication History */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            История Приема
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Май 2024</h3>
                <Badge className="bg-green-100 text-green-700 border-green-200">98% выполнено</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
              <p className="text-sm text-gray-600">
                Пропущен прием Магния B6 (15 мая) из-за поездки. Все остальные приемы выполнены по расписанию.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Апрель 2024</h3>
                <Badge className="bg-green-100 text-green-700 border-green-200">100% выполнено</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Все приемы лекарств выполнены по расписанию.</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Март 2024</h3>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">92% выполнено</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-sm text-gray-600">
                Пропущены приемы Витамина D3 (3, 4, 5 марта) из-за болезни. Остальные приемы выполнены по расписанию.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            Показать полную историю
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
