"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Plus, Search, Phone, Video, MoreHorizontal, Send } from "lucide-react"

const API_BASE_URL = "https://new.avishifo.uz"

export default function PatientMessagesPage() {
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
      <h1 className="text-3xl font-bold text-gray-800">Сообщения</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Контакты</CardTitle>
              <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск контактов..."
                className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm rounded-xl"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 cursor-pointer">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Доктор Джонсон</p>
                  <span className="text-xs text-gray-500">12:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">Как вы себя чувствуете сегодня?</p>
                  <Badge className="bg-indigo-500 text-white border-indigo-600">2</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">DP</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Доктор Петров</p>
                  <span className="text-xs text-gray-500">Вчера</span>
                </div>
                <p className="text-sm text-gray-500 truncate">Результаты анализов готовы</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  МС
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Медсестра Светлана</p>
                  <span className="text-xs text-gray-500">Пн</span>
                </div>
                <p className="text-sm text-gray-500 truncate">Напоминаем о записи на прием</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">ДИ</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate">Доктор Иванова</p>
                  <span className="text-xs text-gray-500">23.05</span>
                </div>
                <p className="text-sm text-gray-500 truncate">Спасибо за визит</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl lg:col-span-2">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    DJ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">Доктор Джонсон</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Онлайн</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[400px] overflow-y-auto space-y-4">
            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">Здравствуйте, Сара! Как вы себя чувствуете сегодня?</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:15</p>
              </div>
            </div>

            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[80%]">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-t-xl rounded-l-xl text-white">
                  <p>Здравствуйте, доктор! В целом хорошо, но иногда беспокоят головные боли.</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">10:17</p>
              </div>
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                  SJ
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Понимаю. Как часто возникают головные боли? Есть ли какие-то триггеры, которые их вызывают?
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:20</p>
              </div>
            </div>

            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[80%]">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-t-xl rounded-l-xl text-white">
                  <p>
                    Примерно 2-3 раза в неделю. Обычно после долгой работы за компьютером или при недостатке сна. Иногда
                    помогает обычный анальгетик, но не всегда.
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">10:22</p>
              </div>
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                  SJ
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Спасибо за информацию. Это похоже на головные боли напряжения. Я рекомендую сделать перерывы каждые
                    45 минут работы за компьютером и выполнять простые упражнения для шеи и глаз.
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:25</p>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Также важно следить за режимом сна и питьевым режимом. Как вы себя чувствуете сегодня?
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:26</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Badge className="bg-gray-100 text-gray-600 border-gray-200">Сегодня 12:30</Badge>
            </div>

            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 p-3 rounded-t-xl rounded-r-xl">
                  <p className="text-gray-800">
                    Здравствуйте, Сара! Как вы себя чувствуете сегодня? Помогли ли мои рекомендации?
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">12:30</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex items-center gap-2 w-full">
              <Button variant="outline" size="icon" className="rounded-full">
                <Plus className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Введите сообщение..."
                className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm rounded-xl"
              />
              <Button size="icon" className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
