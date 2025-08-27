"use client"

import type React from "react"

import {
  Mic,
  Plus,
  ArrowUp,
  Bot,
  History,
  MessageSquare,
  AlertCircle,
  Wifi,
  WifiOff,
  Settings,
  Sparkles,
  Search,
  BarChart3,
  Trash2,
  Calendar,
  Download,
  File,
  X,
  Paperclip,
  ChevronDown,
  Star,
  Zap,
  Brain,
  Stethoscope,
  Crown,
  Check,
  Play,
  Copy,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEffect, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

// API Base URL
const API_BASE_URL = "https://new.avishifo.uz"
// const API_BASE_URL = "http://localhost:8000"

// Helper function to generate default titles for chat sessions
const generateDefaultTitle = (sessionId: string) => {
  const titles = [
    "Медицинская консультация",
    "Диагностика",
    "Анализ симптомов",
    "План лечения",
    "Вопросы здоровья",
    "Медицинский совет",
    "Клинический случай",
    "Консультация врача"
  ]
  const randomIndex = parseInt(sessionId) % titles.length
  return titles[randomIndex]
}

interface AiMessage {
  id?: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  isError?: boolean
  isFallback?: boolean
  tokens_used?: number
  response_time_ms?: number
  model_used?: string
  attachments?: {
    type: "image" | "file"
    name: string
    url: string
    size?: number
  }[]
}

interface ChatSession {
  id: string
  title: string
  date: string
  messages?: AiMessage[]
  last_message: string
  messages_count: number
  total_tokens_used: number
}

interface ChatStats {
  total_sessions: number
  total_messages: number
  total_tokens: number
  avg_messages_per_session: number
  most_active_day: string
  sessions_this_week: number
  sessions_this_month: number
}

// Компонент для рендеринга markdown контента
function MarkdownContent({ content, isUserMessage = false }: { content: string; isUserMessage?: boolean }) {
  // Простая функция для парсинга markdown
  const formatContent = (text: string) => {
    const textColor = isUserMessage ? "text-white" : "text-gray-800"
    const headingColor = isUserMessage ? "text-white" : "text-gray-800"
    const codeBg = isUserMessage ? "bg-white/20" : "bg-gray-100"
    const codeText = isUserMessage ? "text-white" : "text-gray-800"
    
    return text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${textColor}">$1</strong>`) // **текст** -> <strong>текст</strong>
      .replace(/\*(.*?)\*/g, `<em class="${textColor}">$1</em>`) // *текст* -> <em>текст</em>
      .replace(/`(.*?)`/g, `<code class="${codeBg} ${codeText} px-1 py-0.5 rounded text-sm">$1</code>`) // `код` -> <code>код</code>
      .replace(/^### (.*$)/gm, `<h3 class="text-lg font-semibold mt-4 mb-2 ${headingColor}">$1</h3>`) // ### заголовок
      .replace(/^## (.*$)/gm, `<h2 class="text-xl font-semibold mt-4 mb-2 ${headingColor}">$1</h2>`) // ## заголовок
      .replace(/^# (.*$)/gm, `<h1 class="text-2xl font-bold mt-4 mb-2 ${headingColor}">$1</h1>`) // # заголовок
      .replace(/^\d+\.\s(.*$)/gm, `<li class="ml-4 mb-1 ${textColor}">$1</li>`) // 1. пункт -> <li>пункт</li>
      .replace(/^-\s(.*$)/gm, `<li class="ml-4 mb-1 list-disc ${textColor}">$1</li>`) // - пункт -> <li>пункт</li>
      .replace(/\n\n/g, `</p><p class="mb-2 ${textColor}">`) // двойной перенос -> новый параграф
      .replace(/\n/g, "<br>") // одинарный перенос -> <br>
  }

  const formattedContent = formatContent(content)

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{
        __html: `<p class="mb-2 ${isUserMessage ? 'text-white' : 'text-gray-800'}">${formattedContent}</p>`,
      }}
    />
  )
}

export function AiChatSection() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "demo">("connected")
  const [selectedModel, setSelectedModel] = useState("avishifo-ai")
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [showModelSwitchConfirm, setShowModelSwitchConfirm] = useState(false)
  const [pendingModelSwitch, setPendingModelSwitch] = useState<string | null>(null)
  const [showModelSwitchNotification, setShowModelSwitchNotification] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [chatStats, setChatStats] = useState<ChatStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const [currentChat, setCurrentChat] = useState<AiMessage[]>([])
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<
    {
      type: "image" | "file"
      name: string
      url: string
      file: File
      size: number
    }[]
  >([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [currentChat])

  // Add click outside handler for model menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showModelMenu && !(event.target as Element).closest('.model-menu-container')) {
        setShowModelMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showModelMenu])

  // Загрузка истории чатов при монтировании компонента
  useEffect(() => {
    loadChatHistory()
    loadChatStats()
    // Создаем новую сессию при загрузке компонента с правильным приветственным сообщением
    startNewChat()
  }, [])

  const aiModels = [
    {
      id: "avishifo-ai",
      name: "AviShifo AI",
      description: "Наш самый умный медицинский ассистент",
      icon: <Brain className="w-5 h-5" />,
      isPremium: true,
      isSelected: selectedModel === "avishifo-ai",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
    },
    {
      id: "avishifo-radiolog",
      name: "AviRadiolog",
      description: "Специализированный анализ медицинских изображений",
      icon: <Stethoscope className="w-5 h-5" />,
      isPremium: true,
      isSelected: selectedModel === "avishifo-radiolog",
      color: "from-green-500 to-teal-600",
      bgColor: "bg-gradient-to-r from-green-500 to-teal-600",
    },
    {
      id: "chatgpt-5",
      name: "ChatGPT 5",
      description: "Отлично для общих задач",
      icon: <Zap className="w-5 h-5" />,
      isPremium: false,
      isSelected: selectedModel === "chatgpt-5",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500 to-red-600",
    },
  ]

  const suggestedPrompts = [
    {
      title: "Дифференциальная диагностика",
      description: "анализ сложных случаев",
      prompt:
        "Помогите провести дифференциальную диагностику для пациента с болью в груди, одышкой и повышенным потоотделением.",
      icon: <Brain className="w-4 h-4" />,
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Персонализированный план лечения",
      description: "с учетом коморбидности",
      prompt:
        "Составьте план лечения для пациента 65 лет с сахарным диабетом 2 типа, гипертонией и хронической болезнью почек.",
      icon: <Stethoscope className="w-4 h-4" />,
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Анализ лекарственных взаимодействий",
      description: "комплексная оценка",
      prompt:
        "Проанализируйте возможные взаимодействия между метформином, лизиноприлом, аторвастатином и новым назначением амоксициллина.",
      icon: <Zap className="w-4 h-4" />,
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Актуальные рекомендации",
      description: "последние исследования",
      prompt: "Какие последние изменения в рекомендациях по лечению артериальной гипертензии согласно ESC/ESH 2023?",
      icon: <Sparkles className="w-4 h-4" />,
      color: "from-purple-500 to-pink-600",
    },
  ]

  // Функция для получения токена авторизации
  const getAuthToken = () => {
    return localStorage.getItem("accessToken") || localStorage.getItem("token")
  }

  // Helper function to generate meaningful titles from user messages
  const generateTitleFromMessage = (message: string) => {
    // Clean and truncate the message
    let title = message.trim()
    
    // Remove common prefixes and clean up
    const prefixesToRemove = [
      "помогите", "помоги", "нужна помощь", "нужна консультация", "вопрос", "вопросы",
      "help", "help me", "need help", "need consultation", "question", "questions"
    ]
    
    for (const prefix of prefixesToRemove) {
      if (title.toLowerCase().startsWith(prefix.toLowerCase())) {
        title = title.slice(prefix.length).trim()
      }
    }
    
    // If message is still too long, truncate it
    if (title.length > 40) {
      const words = title.split(" ")
      if (words.length > 6) {
        title = words.slice(0, 6).join(" ") + "..."
      } else {
        title = title.slice(0, 40) + "..."
      }
    }
    
    // If title is empty or too short, use a default
    if (!title || title.length < 3) {
      title = "Новый чат"
    }
    
    return title
  }

  // Helper function to update chat session title
  const updateChatSessionTitle = (sessionId: string | null, newTitle: string) => {
    if (!sessionId) return
    
    // Update local state
    setChatSessions((prev: ChatSession[]) => 
      prev.map((session: ChatSession) => 
        session.id === sessionId 
          ? { ...session, title: newTitle }
          : session
      )
    )
    
    // Update local storage
    const storedSessions = localStorage.getItem("avishifo_chat_sessions")
    if (storedSessions) {
      const sessions = JSON.parse(storedSessions)
      const updatedSessions = sessions.map((session: any) => 
        session.id === sessionId 
          ? { ...session, title: newTitle }
          : session
      )
      localStorage.setItem("avishifo_chat_sessions", JSON.stringify(updatedSessions))
    }
  }

  // Создание новой сессии чата через API
  const createNewChatSession = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.log("No auth token found, using fallback mode")
        setConnectionStatus("demo")
        return null
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentSessionId(data.id)
        setConnectionStatus("connected")
        console.log("New chat session created:", data.id)
        return data.id
      } else {
        console.error("Failed to create chat session:", response.status)
        setConnectionStatus("demo")
        return null
      }
    } catch (error) {
      console.error("Error creating chat session:", error)
      setConnectionStatus("demo")
      return null
    }
  }

  const loadChatHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const token = getAuthToken()
      if (!token) {
        // Fallback to local storage if no token
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        if (storedSessions) {
          setChatSessions(JSON.parse(storedSessions))
        }
        setIsLoadingHistory(false)
        return
      }

      // Try to fetch from backend API
      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Transform backend data to our format
        const transformedSessions =
          data.results?.map((session: any) => ({
            id: session.id,
            title: session.title || generateDefaultTitle(session.id),
            date: session.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            last_message: session.last_message || "",
            messages_count: session.messages_count || 0,
            total_tokens_used: session.total_tokens_used || 0,
          })) || []

        setChatSessions(transformedSessions)
      } else {
        // Fallback to local storage
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        if (storedSessions) {
          setChatSessions(JSON.parse(storedSessions))
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error)
      // Fallback to local storage
      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      if (storedSessions) {
        setChatSessions(JSON.parse(storedSessions))
      }
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadChatStats = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        // Generate mock stats from local storage
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        if (storedSessions) {
          const sessions = JSON.parse(storedSessions)
          const mockStats = {
            total_sessions: sessions.length,
            total_messages: sessions.reduce((acc: number, session: any) => acc + (session.messages_count || 0), 0),
            total_tokens: 0,
            avg_messages_per_session: sessions.length
              ? sessions.reduce((acc: number, session: any) => acc + (session.messages_count || 0), 0) / sessions.length
              : 0,
            most_active_day: new Date().toISOString().split("T")[0],
            sessions_this_week: sessions.length,
            sessions_this_month: sessions.length,
          }
          setChatStats(mockStats)
        }
        return
      }

      // Try to fetch stats from backend
      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/stats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChatStats(data)
      } else {
        // Generate basic mock stats
        setChatStats({
          total_sessions: chatSessions.length,
          total_messages: 0,
          total_tokens: 0,
          avg_messages_per_session: 0,
          most_active_day: "Сегодня",
          sessions_this_week: chatSessions.length,
          sessions_this_month: chatSessions.length,
        })
      }
    } catch (error) {
      console.error("Error loading chat stats:", error)
      // Generate basic mock stats
      setChatStats({
        total_sessions: chatSessions.length,
        total_messages: 0,
        total_tokens: 0,
        avg_messages_per_session: 0,
        most_active_day: "Сегодня",
        sessions_this_week: chatSessions.length,
        sessions_this_month: chatSessions.length,
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAttachments = Array.from(files).map((file) => {
      const isImage = file.type.startsWith("image/")
      return {
        type: isImage ? ("image" as const) : ("file" as const),
        name: file.name,
        url: URL.createObjectURL(file),
        file,
        size: file.size,
      }
    })

    setAttachments((prev) => [...prev, ...newAttachments])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev]
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newAttachments[index].url)
      newAttachments.splice(index, 1)
      return newAttachments
    })
  }

  const sendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || isLoading) return

    const startTime = Date.now()
    const userMessage: AiMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachments:
        attachments.length > 0
          ? attachments.map((att) => ({
            type: att.type,
            name: att.name,
            url: att.url,
            size: att.size,
          }))
          : undefined,
    }

    setCurrentChat((prev) => [...prev, userMessage])
    const currentMessage = message
    setMessage("")
    setAttachments([])
    setIsLoading(true)
    
    // Update chat title if this is the first user message
    if (currentChat.length === 1) { // Only assistant message exists
      const newTitle = generateTitleFromMessage(currentMessage)
      updateChatSessionTitle(currentSessionId, newTitle)
    }

    try {
      const token = getAuthToken()

      if (!token || !currentSessionId) {
        // Fallback mode
        const fallbackResponse = generateFallbackResponse(currentMessage)
        const assistantMessage: AiMessage = {
          role: "assistant",
          content: fallbackResponse,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isFallback: true,
        }
        setCurrentChat((prev) => [...prev, assistantMessage])
        setConnectionStatus("demo")
        setIsLoading(false)
        return
      }

      // If we have both image and text, send them together in one request
      if (attachments.length > 0 && currentMessage.trim()) {
        // Send combined image + text request
        await sendCombinedImageAndText(attachments, currentMessage)
      } else if (attachments.length > 0) {
        // Only image, no text - send image and keep it in chat
        for (const attachment of attachments) {
          if (attachment.type === "image") {
            // Create a user message with the image attachment to display in chat
            const imageUserMessage = createImageMessage(attachment)
            setCurrentChat((prev) => [...prev, imageUserMessage])
            
            // Send image to backend
            await sendImageToBackend(attachment.file)
          }
        }
      } else if (currentMessage.trim()) {
        // Only text, no image
        await sendTextMessage(currentMessage)
      }

      // Update chat history
      loadChatHistory()
      loadChatStats()
    } catch (error) {
      console.error("Error sending message:", error)
      setConnectionStatus("disconnected")

      const errorMessage: AiMessage = {
        role: "assistant",
        content:
          "Извините, произошла ошибка при подключении к ИИ сервису. Проверьте подключение к интернету и попробуйте снова.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isError: true,
      }

      setCurrentChat((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // New function to send combined image and text
  const sendCombinedImageAndText = async (imageAttachments: any[], textMessage: string) => {
    try {
      const token = getAuthToken()
      if (!token || !currentSessionId) return

      // Use the new combined endpoint to prevent duplicate responses
      if (imageAttachments.length > 0) {
        const imageAttachment = imageAttachments[0] // Take first image
        if (imageAttachment.type === "image") {
          const formData = new FormData()
          formData.append("image", imageAttachment.file)
          formData.append("text", textMessage)
          formData.append("model", selectedModel)

          const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${currentSessionId}/send_combined_image_and_text/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            
            // Add single combined response to chat
            const assistantMessage: AiMessage = {
              role: "assistant",
              content: data.reply || "Изображение и текст обработаны AI",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              model_used: data.model_used,
            }
            setCurrentChat((prev) => [...prev, assistantMessage])
            setConnectionStatus("connected")
          } else {
            throw new Error(`HTTP ${response.status}`)
          }
        }
      }
    } catch (error) {
      console.error("Error sending combined image and text:", error)
      // Fallback: send them separately if the combined endpoint fails
      if (imageAttachments.length > 0) {
        for (const attachment of imageAttachments) {
          if (attachment.type === "image") {
            // Create a user message with the image attachment to display in chat
            const imageUserMessage = createImageMessage(attachment)
            setCurrentChat((prev) => [...prev, imageUserMessage])
            
            await sendImageToBackend(attachment.file)
          }
        }
      }
      if (textMessage.trim()) {
        await sendTextMessage(textMessage)
      }
    }
  }

  // New function to send only text message
  const sendTextMessage = async (textMessage: string) => {
    try {
      const token = getAuthToken()
      if (!token || !currentSessionId) return

      const messageStartTime = Date.now() // Define start time locally

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${currentSessionId}/send_message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: textMessage,
          model: selectedModel,  // Send the selected model to backend
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const responseTime = Date.now() - messageStartTime

        const assistantMessage: AiMessage = {
          role: "assistant",
          content: data.reply || data.content || "Получен ответ от AI",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          response_time_ms: responseTime,
          model_used: data.model_used,  // Store which model was used
        }

        setCurrentChat((prev) => [...prev, assistantMessage])
        setConnectionStatus("connected")
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error("Error sending text message:", error)
      throw error
    }
  }

  const sendImageToBackend = async (imageFile: File) => {
    try {
      const token = getAuthToken()
      if (!token || !currentSessionId) return

      const formData = new FormData()
      formData.append("image", imageFile)

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${currentSessionId}/send_image/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()

        const assistantMessage: AiMessage = {
          role: "assistant",
          content: data.reply || "Изображение обработано AI",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }

        setCurrentChat((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error sending image:", error)
    }
  }

  // Helper function to create a user message with image attachment
  const createImageMessage = (imageAttachment: any): AiMessage => {
    return {
      role: "user",
      content: `📷 Медицинское изображение: ${imageAttachment.name}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachments: [{
        type: imageAttachment.type,
        name: imageAttachment.name,
        url: imageAttachment.url,
        size: imageAttachment.size,
      }],
    }
  }

  const generateFallbackResponse = (userMessage: string): string => {
    return `**AviShifo в демо-режиме**

Доктор, я понимаю ваш запрос: "${userMessage}"

В демо-режиме я могу предоставить только базовую структуру ответа:

**1. Предварительный диагноз:**
- Требуется анализ представленных симптомов
- Дифференциальная диагностика будет доступна при полной активации

**2. План обследования:**
- Стандартные лабораторные исследования
- Инструментальная диагностика по показаниям
- Консультации специалистов при необходимости

**3. Тактика лечения:**
- Консервативная терапия как первая линия
- Хирургические методы при неэффективности консервативного лечения
- Реабилитационные мероприятия

**6. Группы препаратов:**
- Симптоматическая терапия
- Этиотропное лечение
- Профилактические препараты

**7. Заключение:**
Для получения полного анализа в стиле AviShifo необходима активация полной версии системы с подключением к backend API https://new.avishifo.uz/

*Демо-режим ограничивает возможности детального медицинского анализа.*`
  }

  const handlePromptClick = (promptText: string) => {
    setMessage(promptText)
  }

  const handleModelSwitch = (newModelId: string) => {
    if (newModelId !== selectedModel) {
      // If there are messages in current chat, show confirmation
      if (currentChat.length > 1) {
        setPendingModelSwitch(newModelId)
        setShowModelSwitchConfirm(true)
      } else {
        // No messages, switch directly
        setSelectedModel(newModelId)
        startNewChat(true)
      }
    }
    setShowModelMenu(false)
  }

  const confirmModelSwitch = () => {
    if (pendingModelSwitch) {
      setSelectedModel(pendingModelSwitch)
      startNewChat(true)
      setPendingModelSwitch(null)
      setShowModelSwitchConfirm(false)
    }
  }

  const loadChatSession = async (session: ChatSession) => {
    try {
      const token = getAuthToken()
      if (!token) {
        // Load from local storage
        const sessionKey = `avishifo_chat_messages_${session.id}`
        const storedMessages = localStorage.getItem(sessionKey)
        if (storedMessages) {
          setCurrentChat(JSON.parse(storedMessages))
          setCurrentSessionId(session.id)
          setActiveTab("chat")
        } else {
          startNewChat()
        }
        return
      }

      // Try to load from backend API
      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${session.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const sessionData = await response.json()
        // Transform backend messages to our format
        const transformedMessages =
          sessionData.messages?.map((msg: any) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            model_used: msg.model_used || undefined,  // Include model information if available
          })) || []

        setCurrentChat(transformedMessages)
        setCurrentSessionId(session.id)
        setActiveTab("chat")
      } else {
        // Fallback to local storage
        const sessionKey = `avishifo_chat_messages_${session.id}`
        const storedMessages = localStorage.getItem(sessionKey)
        if (storedMessages) {
          setCurrentChat(JSON.parse(storedMessages))
        } else {
          startNewChat()
        }
        setCurrentSessionId(session.id)
        setActiveTab("chat")
      }
    } catch (error) {
      console.error("Error loading session:", error)
      startNewChat()
    }
  }

  const startNewChat = async (modelSwitched: boolean = false) => {
    // Generate appropriate welcome message based on selected model
    let welcomeMessage = ""
    
    if (selectedModel === "chatgpt-5") {
      welcomeMessage = modelSwitched 
        ? `Здравствуйте! Я ChatGPT-5. Переключился на новую модель и готов начать новый диалог. Чем могу помочь?`
        : "Здравствуйте! Я ChatGPT-5, ваш медицинский ИИ-ассистент. Готов помочь вам с любыми медицинскими вопросами, диагностикой, анализом симптомов и составлением планов лечения. Чем могу помочь сегодня?"
    } else if (selectedModel === "avishifo-radiolog") {
      welcomeMessage = modelSwitched 
        ? `Здравствуйте! Я AviRadiolog. Переключился на новую модель и готов начать новый диалог. Чем могу помочь?`
        : `Уважаемый доктор!
Для корректной работы AviRadiolog просим вносить данные пациента в следующем формате. Чем полнее и точнее будут данные, тем качественнее результат анализа.

1. Общие сведения о пациенте

- Возраст: ___ лет

- Пол: Мужчина / Женщина

- Рост / вес (опционально)

- Анамнез (ключевые хронические болезни, курение, операции и т.д.)

2. Клиническая картина

- Жалобы (например: кашель, лихорадка 38.5 °C, боль в груди, одышка).

- Давность симптомов (дни/недели).

- Сопутствующие данные (например: повышение CRP, лейкоцитоз, сатурация).

3. Исследование

- Вид исследования: Рентген / КТ / МРТ / УЗИ.

- Область исследования: Грудная клетка / брюшная полость / другое.

- Проекция (для рентгена): PA / AP / Латеральная.

- Дата исследования.

- Формат: желательно DICOM; допустимо PNG/JPEG (но с пометкой «не DICOM»).

4. Технические детали (по возможности)

- Качество снимка: удовлетворительное / среднее / низкое (артефакты, движение).

- Дополнительные замечания (например: послеоперационные изменения, наличие катетеров).`
    } else {
      welcomeMessage = modelSwitched 
        ? `Здравствуйте! Я ${aiModels.find(m => m.id === selectedModel)?.name}. Переключился на новую модель и готов начать новый диалог. Чем могу помочь?`
        : "Здравствуйте, уважаемый доктор! Я рад присоединиться к вашей работе в качестве медицинского консультанта AviShifo. Вместе с вами я готов анализировать сложные случаи, помогать в принятии клинических решений и сопровождать пациента на всём пути лечения — до полного выздоровления. Введите или загрузите необходимую информацию — и начнём."
    }
    
    setCurrentChat([
      {
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])

    // Create new session
    const newSessionId = await createNewChatSession()
    setCurrentSessionId(newSessionId)
    setActiveTab("chat")
    setConnectionStatus("connected")
    
    // Add new session to local storage with a meaningful title
    if (newSessionId) {
      const newSession = {
        id: newSessionId,
        title: "Новый чат",
        date: new Date().toISOString().split("T")[0],
        last_message: "",
        messages_count: 1,
        total_tokens_used: 0,
      }
      
      setChatSessions(prev => [newSession, ...prev])
      
      // Also save to local storage
      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      const sessions = storedSessions ? JSON.parse(storedSessions) : []
      sessions.unshift(newSession)
      localStorage.setItem("avishifo_chat_sessions", JSON.stringify(sessions))
    }
    
    // Show notification if model was switched
    if (modelSwitched) {
      setShowModelSwitchNotification(true)
      setTimeout(() => setShowModelSwitchNotification(false), 5000) // Hide after 5 seconds
    }
  }

  const deleteChatSession = async (sessionId: string) => {
    try {
      const token = getAuthToken()
      if (token && !sessionId.startsWith("local-")) {
        // Try to delete via backend API
        const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${sessionId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (!response.ok) {
          console.warn(`Backend delete failed with status: ${response.status}`)
        }
      }

      // Always update local storage and state regardless of backend response
      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions)
        const updatedSessions = sessions.filter((s: any) => s.id !== sessionId)
        localStorage.setItem("avishifo_chat_sessions", JSON.stringify(updatedSessions))
        localStorage.removeItem(`avishifo_chat_messages_${sessionId}`)
      }

      // Update state
      setChatSessions((prev) => prev.filter((session) => session.id !== sessionId))
      
      // If current session is deleted, start a new chat
      if (currentSessionId === sessionId) {
        startNewChat()
      }

      // Update stats
      loadChatStats()
      
      console.log(`Successfully deleted chat session: ${sessionId}`)
    } catch (error) {
      console.error("Error deleting session:", error)
      // Even if there's an error, try to remove from local state
      setChatSessions((prev) => prev.filter((session) => session.id !== sessionId))
    }
  }

  const searchChatSessions = async (query: string) => {
    if (!query.trim()) {
      loadChatHistory()
      return
    }

    try {
      const token = getAuthToken()
      if (token) {
        // Try to search via backend API
        const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/?search=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const transformedSessions =
            data.results?.map((session: any) => ({
              id: session.id,
              title: session.title || generateDefaultTitle(session.id),
              date: session.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
              last_message: session.last_message || "",
              messages_count: session.messages_count || 0,
              total_tokens_used: session.total_tokens_used || 0,
            })) || []

          setChatSessions(transformedSessions)
          return
        }
      }

      // Search in local storage
      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions)
        const filteredSessions = sessions.filter(
          (session: any) =>
            session.title.toLowerCase().includes(query.toLowerCase()) ||
            session.last_message.toLowerCase().includes(query.toLowerCase()),
        )
        setChatSessions(filteredSessions)
      }
    } catch (error) {
      console.error("Error searching sessions:", error)
    }
  }

  const exportSession = async (sessionId: string, format: "json" | "txt" | "md" = "txt") => {
    try {
      let exportData = ""
      const fileName = `chat-${sessionId}.${format}`

      // Try to get session data
      const session = chatSessions.find((s) => s.id === sessionId)
      if (!session) return

      if (format === "json") {
        exportData = JSON.stringify(
          {
            id: session.id,
            title: session.title,
            date: session.date,
            messages: currentChat,
          },
          null,
          2,
        )
      } else if (format === "txt") {
        exportData = `Чат: ${session.title}\nДата: ${new Date(session.date).toLocaleString()}\n\n`
        currentChat.forEach((msg: AiMessage) => {
          const roleName = msg.role === "user" ? "Врач" : "Avishifo.ai"
          exportData += `[${msg.timestamp}] ${roleName}:\n${msg.content}\n\n`
        })
      } else if (format === "md") {
        exportData = `# ${session.title}\n\n**Дата:** ${new Date(session.date).toLocaleString()}\n\n`
        currentChat.forEach((msg: AiMessage) => {
          const roleName = msg.role === "user" ? "**Врач**" : "**Avishifo.ai**"
          exportData += `### ${roleName} (${msg.timestamp})\n\n${msg.content}\n\n---\n\n`
        })
      }

      if (exportData) {
        // Create and download file
        const blob = new Blob([exportData], {
          type: format === "json" ? "application/json" : "text/plain",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error exporting session:", error)
      alert("Не удалось экспортировать чат. Пожалуйста, попробуйте позже.")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера"
    } else {
      return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Sparkles className="w-4 h-4 text-green-500" />
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />
      case "demo":
        return <Settings className="w-4 h-4 text-orange-500" />
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />
    }
  }

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Подключен к new.avishifo.uz"
      case "disconnected":
        return "Нет подключения"
      case "demo":
        return "Демо-режим"
      default:
        return "Проверка подключения..."
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Header with Model Selection */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ai
                </h1>
                <p className="text-sm text-gray-500">Powered by avishifo.uz</p>
              </div>
            </div>

            {/* Model Selection Dropdown */}
            <div className="relative model-menu-container">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-blue-300/80 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 relative group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${aiModels.find(m => m.id === selectedModel)?.bgColor} text-white shadow-lg`}>
                    {aiModels.find(m => m.id === selectedModel)?.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      {aiModels.find(m => m.id === selectedModel)?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {aiModels.find(m => m.id === selectedModel)?.description}
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showModelMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                Сменить AI модель (начнется новый чат)
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
              
              {/* Model Menu Dropdown */}
              {showModelMenu && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 bg-gradient-to-r from-gray-50/80 to-blue-50/80 border-b border-gray-200/60">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">Выберите AI модель</h3>
                    <p className="text-xs text-gray-600">Выберите наиболее подходящую модель для ваших задач</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {aiModels.map((model) => (
                      <div
                        key={model.id}
                        className={`relative p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          model.isSelected 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md scale-105' 
                            : 'hover:bg-gray-50/80 hover:shadow-sm border-2 border-transparent'
                        }`}
                        onClick={() => handleModelSwitch(model.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg transition-all duration-300 ${
                            model.isPremium 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-md' 
                              : model.bgColor
                          } text-white`}>
                            {model.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800 text-sm">{model.name}</span>
                              {model.isPremium && (
                                <div className="flex items-center gap-1">
                                  <Crown className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs text-yellow-600 font-medium">Premium</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{model.description}</p>
                            <div className="flex items-center gap-2">
                              {model.isPremium ? (
                                <button className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-md hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 hover:shadow-md flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  Upgrade
                                </button>
                              ) : (
                                model.isSelected ? (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <Check className="w-3 h-3" />
                                    <span className="text-xs font-medium">Выбрано</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-blue-600">
                                    <Plus className="w-3 h-3" />
                                    <span className="text-xs font-medium">Новый чат</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats and New Chat */}
            <div className="flex items-center gap-3">
              {chatStats && (
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{chatStats.total_sessions}</div>
                    <div className="text-xs text-gray-600">Сессий</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{chatStats.total_messages}</div>
                    <div className="text-xs text-gray-600">Сообщений</div>
                  </div>
                </div>
              )}
              <Button 
                onClick={() => startNewChat(false)} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Новый чат
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-120px)] flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-none border-r border-gray-200 flex flex-col h-full overflow-hidden shadow-lg">
            

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" ref={scrollAreaRef}>
              {currentChat.length === 1 ? (
                <div className="text-center py-12">
                  <div className={`inline-flex p-8 rounded-full ${aiModels.find(m => m.id === selectedModel)?.bgColor} text-white mb-8 shadow-2xl ring-6 ring-white/20`}>
                    {aiModels.find(m => m.id === selectedModel)?.icon || <Bot className="w-20 h-20" />}
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                    Добро пожаловать в {aiModels.find(m => m.id === selectedModel)?.name}!
                  </h2>
                                                        <div className="text-gray-600 mb-6 max-w-4xl mx-auto">
                      {selectedModel === "avishifo-radiolog" ? (
                        <div className="text-sm leading-relaxed space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="font-medium text-blue-800 mb-2">Уважаемый доктор!</p>
                            <p className="text-blue-700">Для корректной работы AviRadiolog просим вносить данные пациента в следующем формате. Чем полнее и точнее будут данные, тем качественнее результат анализа.</p>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-2">1. Общие сведения о пациенте</h4>
                              <ul className="text-green-700 space-y-1 text-xs">
                                <li>• Возраст: ___ лет</li>
                                <li>• Пол: Мужчина / Женщина</li>
                                <li>• Рост / вес (опционально)</li>
                                <li>• Анамнез (хронические болезни, курение, операции)</li>
                              </ul>
                            </div>
                            
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-800 mb-2">2. Клиническая картина</h4>
                              <ul className="text-purple-700 space-y-1 text-xs">
                                <li>• Жалобы (кашель, лихорадка, боль в груди)</li>
                                <li>• Давность симптомов (дни/недели)</li>
                                <li>• Сопутствующие данные (CRP, лейкоцитоз)</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                              <h4 className="font-semibold text-orange-800 mb-2">3. Исследование</h4>
                              <ul className="text-orange-700 space-y-1 text-xs">
                                <li>• Вид: Рентген / КТ / МРТ / УЗИ</li>
                                <li>• Область: (Грудная клетка / брюшная полость)</li>
                                <li>• Проекция: (PA / AP / Латеральная)</li>
                                <li>• Формат: допустимо PNG/JPEG .</li>
                              </ul>
                            </div>
                            
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                              <h4 className="font-semibold text-red-800 mb-2">4. Технические детали</h4>
                              <ul className="text-red-700 space-y-1 text-xs">
                                <li>• Качество снимка: удовлетворительное / среднее / низкое (артефакты, движение).</li>
                                <li>• Дополнительные замечания (например: послеоперационные изменения, наличие катетеров).</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-base leading-relaxed">Я готов помочь вам с медицинскими вопросами, диагностикой и лечением. Задайте вопрос или загрузите медицинские данные для начала.</p>
                      )}
                    </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Активная модель: {aiModels.find(m => m.id === selectedModel)?.name}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentChat.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-4"}`}>
                      {msg.role === "assistant" && (
                        <Avatar className="w-12 h-12 shrink-0 shadow-lg">
                          <AvatarFallback className={`${aiModels.find(m => m.id === selectedModel)?.bgColor} text-white text-lg font-semibold`}>
                            {aiModels.find(m => m.id === selectedModel)?.icon || <Bot className="w-6 h-6" />}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-md lg:max-w-2xl rounded-2xl p-5 shadow-lg ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl"
                            : "bg-white border border-gray-200 shadow-md"
                        }`}
                      >
                        {/* Show image attachments if they exist */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mb-4 space-y-3">
                            {msg.attachments.map((attachment, attIndex) => (
                              <div key={attIndex} className="flex items-center gap-3">
                                {attachment.type === "image" ? (
                                  <div className="relative">
                                    <div className="w-24 h-24 relative rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
                                      <img
                                        src={attachment.url}
                                        alt={attachment.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                                      📷
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-24 h-24 relative rounded-lg bg-white/20 border-2 border-white/30 flex items-center justify-center">
                                    <File className="w-8 h-8 text-white/80" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white">{attachment.name}</p>
                                  <p className="text-xs text-white/80">
                                    {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'File'}
                                  </p>
                                  {attachment.type === "image" && (
                                    <p className="text-xs text-blue-100 mt-1">Медицинское изображение для анализа</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Message content */}
                        <MarkdownContent content={msg.content} isUserMessage={msg.role === "user"} />
                        
                                                 <div className={`text-xs mt-3 flex items-center gap-2 ${
                           msg.role === "user" 
                             ? "text-blue-100" 
                             : "text-gray-600"
                         }`}>
                           <span>{msg.timestamp}</span>
                           {msg.response_time_ms && (
                             <>
                               <span>•</span>
                               <span>{msg.response_time_ms}ms</span>
                             </>
                           )}
                           {msg.role === "user" && (
                             <>
                               <span>•</span>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 className="h-6 px-2 py-1 text-xs text-blue-200 hover:text-blue-100"
                                 onClick={async () => {
                                   try {
                                     await navigator.clipboard.writeText(msg.content || '');
                                     console.log('User message copied to clipboard');
                                   } catch (err) {
                                     console.error('Failed to copy user message:', err);
                                     // Fallback for older browsers
                                     const textArea = document.createElement('textarea');
                                     textArea.value = msg.content || '';
                                     document.body.appendChild(textArea);
                                     textArea.select();
                                     document.execCommand('copy');
                                     document.body.removeChild(textArea);
                                   }
                                 }}
                               >
                                 <Copy className="w-3 h-3 mr-1" />
                                 Copy
                               </Button>
                                                               <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 py-1 text-xs text-green-200 hover:text-green-100"
                                  onClick={() => {
                                    // Allow editing user messages by putting the content back in the input field
                                    setMessage(msg.content);
                                    // Scroll to the input area
                                    if (scrollAreaRef.current) {
                                      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
                                    }
                                  }}
                                  title="Edit message"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                             </>
                           )}
                           {msg.role === "assistant" && (
                              <>
                                <span>•</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 py-1 text-xs text-blue-600 hover:text-blue-700"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(msg.content || '');
                                      console.log('AI response copied to clipboard');
                                    } catch (err) {
                                      console.error('Failed to copy AI response:', err);
                                      // Fallback for older browsers
                                      const textArea = document.createElement('textarea');
                                      textArea.value = msg.content || '';
                                      document.body.appendChild(textArea);
                                      textArea.select();
                                      document.execCommand('copy');
                                      document.body.removeChild(textArea);
                                    }
                                  }}
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </Button>
                              </>
                            )}
                           {msg.attachments && msg.attachments.length > 0 && (
                             <>
                               <span>•</span>
                               <span className={`${
                                 msg.role === "user" ? "text-green-200" : "text-green-600"
                               }`}>✓ Анализ завершен</span>
                             </>
                           )}
                         </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 shrink-0 shadow-lg">
                        <AvatarFallback className={`${aiModels.find(m => m.id === selectedModel)?.bgColor} text-white text-lg font-semibold`}>
                          {aiModels.find(m => m.id === selectedModel)?.icon || <Bot className="w-6 h-6" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-gray-700 font-medium">
                            {attachments.length > 0 ? "Анализирую изображение..." : "Обрабатываю запрос..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
              {attachments.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
                    >
                      {attachment.type === "image" ? (
                        <div className="space-y-2">
                          <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-700 max-w-[100px] truncate">{attachment.name}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 rounded-full p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <File className="w-5 h-5 text-gray-500" />
                          <span className="text-xs text-gray-700 max-w-[100px] truncate">{attachment.name}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-full p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
                             <div className="flex gap-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-lg items-end">
                 <input
                   type="file"
                   ref={fileInputRef}
                   onChange={handleFileSelect}
                   className="hidden"
                   multiple
                   accept="image/*,.pdf,.doc,.docx,.txt"
                 />
                 <Button
                   size="icon"
                   variant="ghost"
                   className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl shrink-0 transition-all duration-200"
                   onClick={() => fileInputRef.current?.click()}
                   disabled={isLoading}
                 >
                   <Paperclip className="w-5 h-5" />
                 </Button>
                                   <div className="flex-1 relative">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Задайте медицинский вопрос - ${aiModels.find(m => m.id === selectedModel)?.name} готов к анализу...`}
                      className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder:text-gray-500 resize-none min-h-[20px] max-h-[120px] overflow-y-auto text-base pr-24"
                      disabled={isLoading}
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = "auto"
                        target.style.height = Math.min(target.scrollHeight, 120) + "px"
                      }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      {message.trim() && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(message);
                                console.log('Text copied to clipboard');
                              } catch (err) {
                                console.error('Failed to copy text:', err);
                                // Fallback for older browsers
                                const textArea = document.createElement('textarea');
                                textArea.value = message;
                                document.body.appendChild(textArea);
                                textArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textArea);
                              }
                            }}
                            title="Copy text"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50"
                            onClick={() => {
                              setMessage("");
                            }}
                            title="Clear text"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                 <Button
                   size="icon"
                   variant="ghost"
                   className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl shrink-0 transition-all duration-200"
                   disabled={isLoading}
                 >
                   <Mic className="w-5 h-5" />
                 </Button>
                 <Button
                   size="icon"
                   className={`rounded-xl ${aiModels.find(m => m.id === selectedModel)?.bgColor} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50`}
                   onClick={sendMessage}
                   disabled={(!message.trim() && attachments.length === 0) || isLoading}
                 >
                   <ArrowUp className="w-5 h-5" />
                 </Button>
               </div>
              
              <p className="text-xs text-gray-600 mt-3 text-center">
                <span className="text-green-600 font-medium">✓ Подключен к {API_BASE_URL}</span> • 
                Получайте ответы от {aiModels.find(m => m.id === selectedModel)?.name} • 
                Поддержка изображений и файлов
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat History */}
        {isHistoryOpen && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col h-full transition-all duration-500 ease-in-out shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <History className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">История чатов</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("history")} 
                  className="hover:bg-blue-50/80 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <History className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsHistoryOpen(false)} 
                  className="hover:bg-red-50/80 text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto">
              {chatSessions.slice(0, 8).map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 cursor-pointer transition-all duration-300 border border-gray-100/60 hover:border-blue-300/80 hover:shadow-lg group"
                  onClick={() => loadChatSession(session)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 group-hover:scale-125 transition-transform"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{session.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 font-medium">{formatDate(session.date)}</p>
                      <p className="text-xs text-gray-400 mt-2 truncate leading-relaxed">{session.last_message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Toggle Button (when closed) */}
        {!isHistoryOpen && (
          <div className="w-16 bg-white/95 backdrop-blur-md border-l border-gray-200/60 flex items-center justify-center shadow-lg">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsHistoryOpen(true)}
              className="hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 p-3 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <History className="w-7 h-7 text-blue-600" />
            </Button>
          </div>
        )}
      </div>

      {/* History Tab Content */}
      {activeTab === "history" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200/60">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">История запросов</h3>
                <Button variant="ghost" onClick={() => setActiveTab("chat")} className="hover:bg-gray-100/80">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 cursor-pointer transition-all duration-200 border border-gray-200/60"
                    onClick={() => {
                      loadChatSession(session)
                      setActiveTab("chat")
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{session.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{session.last_message}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <Calendar className="w-3 h-3" />
                          {formatDate(session.date)}
                          <span>•</span>
                          <span>{session.messages_count} сообщений</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-gray-400 hover:text-blue-500 hover:bg-blue-50/80"
                          onClick={(e) => {
                            e.stopPropagation()
                            exportSession(session.id, "txt")
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50/80"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSessionToDelete(session.id)
                            setShowDeleteConfirm(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Chat Session Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Удалить чат?</h3>
              <p className="text-gray-600">
                Это действие нельзя отменить. Весь чат и все сообщения будут удалены навсегда.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSessionToDelete(null)
                }}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={() => {
                  if (sessionToDelete) {
                    deleteChatSession(sessionToDelete)
                    setShowDeleteConfirm(false)
                    setSessionToDelete(null)
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Model Switch Confirmation Dialog */}
      {showModelSwitchConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Сменить AI модель?</h3>
                            <p className="text-gray-600">
                При смене модели текущий чат будет завершен и начнется новый. 
                Все несохраненные сообщения будут потеряны.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModelSwitchConfirm(false)
                  setPendingModelSwitch(null)
                }}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={confirmModelSwitch}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Сменить модель
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
