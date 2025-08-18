"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_BASE_URL = "https://new.avishifo.uz"

export default function PatientChatPage() {
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Чат с врачами</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Contacts */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Контакты</h2>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  ДИ
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Др. Иванов</h3>
                  <p className="text-sm text-gray-600">Кардиолог</p>
                </div>
                <div className="ml-auto">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  ДП
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Др. Петрова</h3>
                  <p className="text-sm text-gray-600">Терапевт</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  ДС
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Др. Сидоров</h3>
                  <p className="text-sm text-gray-600">Невролог</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                    <p>Здравствуйте, доктор! У меня есть вопрос по поводу моего лечения.</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 rounded-lg px-4 py-2 max-w-xs shadow-sm">
                    <p>Здравствуйте! Конечно, я готов помочь. Расскажите, что вас беспокоит?</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                    <p>Можно ли принимать аспирин вместе с другими лекарствами?</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Введите сообщение..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
