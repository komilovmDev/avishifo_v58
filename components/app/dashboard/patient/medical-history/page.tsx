"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock, AlertCircle, FileText, FileBarChart, Stethoscope, Activity } from "lucide-react"

import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export default function PatientMedicalHistoryPage() {
  const router = useRouter()
  const [medicalHistoryAccess, setMedicalHistoryAccess] = useState(false)

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Медицинская История</h1>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${
            medicalHistoryAccess ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
          }`}
          onClick={() => setMedicalHistoryAccess(!medicalHistoryAccess)}
        >
          {medicalHistoryAccess ? (
            <>
              <Unlock className="w-4 h-4" />
              <span>Доступ Открыт</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Доступ Закрыт</span>
            </>
          )}
        </Button>
      </div>

      {!medicalHistoryAccess ? (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Доступ к медицинской истории закрыт</h2>
            <p className="text-gray-600 mb-6">
              Для просмотра вашей медицинской истории, пожалуйста, откройте доступ. Ваши данные защищены и доступны
              только вам и вашим врачам.
            </p>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md shadow-indigo-200/50"
              onClick={() => setMedicalHistoryAccess(true)}
            >
              <Unlock className="w-4 h-4 mr-2" />
              Открыть Доступ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Важная Информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <h3 className="font-medium text-red-800 mb-1">Аллергии</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-100 text-red-700 border-red-200">Пенициллин</Badge>
                    <Badge className="bg-red-100 text-red-700 border-red-200">Арахис</Badge>
                    <Badge className="bg-red-100 text-red-700 border-red-200">Пыльца</Badge>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h3 className="font-medium text-amber-800 mb-1">Хронические Заболевания</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">Астма</Badge>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">Мигрень</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                История Посещений
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-200/50 mt-1">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">Доктор Джонсон</h3>
                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Терапевт</Badge>
                      </div>
                      <span className="text-sm text-gray-500">15.05.2024</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Плановый осмотр. Жалобы на периодические головные боли и усталость.
                    </p>
                    <div className="bg-white/60 p-3 rounded-lg border border-indigo-100 text-sm">
                      <p className="font-medium text-gray-800 mb-1">Диагноз:</p>
                      <p className="text-gray-600">Переутомление, легкое обезвоживание</p>
                      <p className="font-medium text-gray-800 mt-2 mb-1">Рекомендации:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>Режим труда и отдыха</li>
                        <li>Увеличить потребление воды до 2л в день</li>
                        <li>Витаминный комплекс (назначен)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50 mt-1">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">Доктор Петров</h3>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Кардиолог</Badge>
                      </div>
                      <span className="text-sm text-gray-500">03.04.2024</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Консультация кардиолога. Жалобы на периодические боли в области сердца.
                    </p>
                    <div className="bg-white/60 p-3 rounded-lg border border-blue-100 text-sm">
                      <p className="font-medium text-gray-800 mb-1">Диагноз:</p>
                      <p className="text-gray-600">Функциональная кардиалгия</p>
                      <p className="font-medium text-gray-800 mt-2 mb-1">Рекомендации:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>ЭКГ (результаты в норме)</li>
                        <li>Снижение стрессовых нагрузок</li>
                        <li>Контроль АД</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Показать полную историю
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart className="w-5 h-5 text-indigo-500" />
                Результаты Анализов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">Общий анализ крови</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
                    </div>
                    <span className="text-sm text-gray-500">10.05.2024</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Просмотреть результаты
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">Биохимический анализ крови</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Норма</Badge>
                    </div>
                    <span className="text-sm text-gray-500">10.05.2024</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Просмотреть результаты
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">Анализ на гормоны щитовидной железы</h3>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">Небольшие отклонения</Badge>
                    </div>
                    <span className="text-sm text-gray-500">15.04.2024</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Просмотреть результаты
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Показать все анализы
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
