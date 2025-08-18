"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_BASE_URL = "https://new.avishifo.uz"

export default function PatientDocumentsPage() {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Мои документы</h1>
        
        <div className="space-y-6">
          {/* Document Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-blue-600 text-2xl mb-2">📋</div>
              <h3 className="font-medium text-blue-900">Медицинские карты</h3>
              <p className="text-blue-700 text-sm">3 документа</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-600 text-2xl mb-2">🔬</div>
              <h3 className="font-medium text-green-900">Анализы</h3>
              <p className="text-green-700 text-sm">8 документов</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-purple-600 text-2xl mb-2">💊</div>
              <h3 className="font-medium text-purple-900">Рецепты</h3>
              <p className="text-purple-700 text-sm">5 документов</p>
            </div>
          </div>

          {/* Recent Documents */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Недавние документы</h2>
            <div className="space-y-3">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-red-600 text-lg">📄</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Общий анализ крови</h3>
                  <p className="text-sm text-gray-600">Лаборатория №1 • 10 декабря 2024</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Просмотр</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Скачать</button>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">ЭКГ</h3>
                  <p className="text-sm text-gray-600">Кардиология • 8 декабря 2024</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Просмотр</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Скачать</button>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 text-lg">💊</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Рецепт на лекарства</h3>
                  <p className="text-sm text-gray-600">Терапевт • 5 декабря 2024</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Просмотр</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Скачать</button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload New Document */}
          <div className="pt-6 border-t border-gray-200">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-400 text-4xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Загрузить новый документ</h3>
              <p className="text-gray-600 mb-4">Перетащите файл сюда или нажмите для выбора</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Выбрать файл
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
