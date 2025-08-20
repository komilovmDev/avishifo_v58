"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, MessageCircle, Send, ArrowLeft, User, Search,
  MoreVertical, PhoneCall, PhoneMissed, PhoneIncoming
} from "lucide-react"
import { useRouter } from "next/navigation"

interface DoctorForChat {
  id: number
  name: string
  specialization: string
  profile_picture: string | null
  action?: 'call' | 'message'
}

interface Message {
  id: number
  text: string
  sender: 'me' | 'doctor'
  timestamp: Date
  type: 'text' | 'call' | 'sms'
}

interface CallHistory {
  id: number
  type: 'incoming' | 'outgoing' | 'missed'
  timestamp: Date
  duration?: number
}

export default function ChatPage() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<DoctorForChat[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorForChat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [callHistory, setCallHistory] = useState<CallHistory[]>([])
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCalling, setIsCalling] = useState(false)
  const [callStatus, setCallStatus] = useState<string>("")

  // Mock doctors data
  const mockDoctors: DoctorForChat[] = [
    {
      id: 1,
      name: "Доктор Ахмедов Алишер",
      specialization: "Кардиолог",
      profile_picture: null
    },
    {
      id: 2,
      name: "Доктор Каримова Фарида",
      specialization: "Кардиолог",
      profile_picture: null
    },
    {
      id: 3,
      name: "Доктор Усманов Рашид",
      specialization: "Невролог",
      profile_picture: null
    },
    {
      id: 4,
      name: "Доктор Нурматова Дильфуза",
      specialization: "Педиатр",
      profile_picture: null
    },
    {
      id: 5,
      name: "Доктор Рахимов Шухрат",
      specialization: "Хирург",
      profile_picture: null
    }
  ]

  useEffect(() => {
    setDoctors(mockDoctors)
    
    // localStorage dan doctor ma'lumotlarini olish (agar modal dan kelgan bo'lsa)
    const doctorData = localStorage.getItem('selectedDoctorForChat')
    if (doctorData) {
      try {
        const doctor = JSON.parse(doctorData)
        const foundDoctor = mockDoctors.find(d => d.id === doctor.id)
        
        if (foundDoctor) {
          setSelectedDoctor(foundDoctor)
          
          // Agar action 'call' bo'lsa, avtomatik telefon qilish
          if (doctor.action === 'call') {
            handleAutoCall(foundDoctor)
          }
          
          // localStorage ni tozalash
          localStorage.removeItem('selectedDoctorForChat')
        }
      } catch (error) {
        console.error("Error parsing doctor data:", error)
      }
    }
  }, [])

  const handleAutoCall = (doctor: DoctorForChat) => {
    setIsCalling(true)
    setCallStatus("Звоним...")
    
    // Simulyatsiya qilish
    setTimeout(() => {
      setCallStatus("Вызов принят")
      
      // Qo'ng'roq tarixiga qo'shish
      const newCall: CallHistory = {
        id: Date.now(),
        type: 'outgoing',
        timestamp: new Date(),
        duration: 180 // 3 daqiqa
      }
      setCallHistory(prev => [newCall, ...prev])
      
      setTimeout(() => {
        setCallStatus("Разговор завершен")
        setIsCalling(false)
      }, 3000)
    }, 2000)
  }

  const handleCall = () => {
    if (selectedDoctor) {
      handleAutoCall(selectedDoctor)
    }
  }

  const handleSendSMS = () => {
    if (message.trim() && selectedDoctor) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        sender: 'me',
        timestamp: new Date(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, newMessage])
      setMessage("")
      
      // Doctor javobini simulyatsiya qilish
      setTimeout(() => {
        const doctorReply: Message = {
          id: Date.now() + 1,
          text: "Спасибо за сообщение! Я обязательно отвечу в ближайшее время.",
          sender: 'doctor',
          timestamp: new Date(),
          type: 'text'
        }
        setMessages(prev => [...prev, doctorReply])
      }, 1000)
    }
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const goBackToDoctors = () => {
    router.push('/dashboard/doctor/doctors')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar - User List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goBackToDoctors}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск врачей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Doctors List */}
          <div className="flex-1 overflow-y-auto">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedDoctor?.id === doctor.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={doctor.profile_picture || undefined} />
                    <AvatarFallback className="bg-blue-500 text-white text-sm font-bold">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{doctor.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{doctor.specialization}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedDoctor ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedDoctor.profile_picture || undefined} />
                    <AvatarFallback className="bg-blue-500 text-white text-sm font-bold">
                      {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
                    <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCall}
                      disabled={isCalling}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {isCalling ? 'Звоним...' : 'Позвонить'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex">
                {/* Messages Tab */}
                <div className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Начните разговор с {selectedDoctor.name}</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender === 'me'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendSMS()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendSMS} disabled={!message.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Call History Tab */}
                <div className="w-80 border-l border-gray-200 bg-gray-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">История звонков</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {callHistory.length === 0 ? (
                      <p className="text-gray-500 text-sm">История звонков пуста</p>
                    ) : (
                      callHistory.map((call) => (
                        <div key={call.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            call.type === 'incoming' ? 'bg-green-100' :
                            call.type === 'outgoing' ? 'bg-blue-100' : 'bg-red-100'
                          }`}>
                            {call.type === 'incoming' ? (
                              <PhoneIncoming className="w-4 h-4 text-green-600" />
                            ) : call.type === 'outgoing' ? (
                              <PhoneCall className="w-4 h-4 text-blue-600" />
                            ) : (
                              <PhoneMissed className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {call.type === 'incoming' ? 'Входящий' :
                               call.type === 'outgoing' ? 'Исходящий' : 'Пропущенный'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {call.timestamp.toLocaleString()}
                              {call.duration && ` • ${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}`}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Doctor Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Выберите врача</h3>
                <p>Выберите врача из списка слева для начала разговора</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
