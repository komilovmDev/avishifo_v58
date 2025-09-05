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
import { API_CONFIG } from "../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

interface AiMessage {
  id?: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  isError?: boolean
  isFallback?: boolean
  tokens_used?: number
  response_time_ms?: number
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
function MarkdownContent({ content }: { content: string }) {
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2 text-gray-800">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-800">$1</h1>')
      .replace(/^\d+\.\s(.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^-\s(.*$)/gm, '<li class="ml-4 mb-1 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, "<br>")
  }

  const formattedContent = formatContent(content)

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{
        __html: `<p class="mb-2">${formattedContent}</p>`,
      }}
    />
  )
}

export function AiRadiologSection() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "demo">("connected")

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [chatStats, setChatStats] = useState<ChatStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const [currentChat, setCurrentChat] = useState<AiMessage[]>([
    {
      role: "assistant",
      content:
        "Привет! Я AviRadiolog, ваш ИИ помощник для анализа медицинских изображений. Загружайте рентгеновские снимки, МРТ или другие изображения, и я помогу с интерпретацией. Как я могу помочь сегодня?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ])
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

  useEffect(() => {
    loadChatHistory()
    loadChatStats()
    createNewChatSession()
  }, [])

  const suggestedPrompts = [
    {
      title: "Анализ рентгеновского снимка",
      description: "обнаружение переломов",
      prompt:
        "Проанализируйте рентгеновский снимок руки пациента и укажите наличие переломов или аномалий.",
    },
    {
      title: "Интерпретация МРТ",
      description: "оценка тканей",
      prompt:
        "Оцените МРТ изображения головного мозга и определите признаки патологий, таких как опухоли или ишемия.",
    },
    {
      title: "Сравнение изображений",
      description: "динамика изменений",
      prompt:
        "Сравните два КТ снимка легких, сделанных с интервалом в 6 месяцев, и укажите изменения.",
    },
    {
      title: "Рекомендации по диагностике",
      description: "на основе изображения",
      prompt:
        "На основе рентгеновского снимка грудной клетки дайте рекомендации по дальнейшей диагностике.",
    },
  ]

  const getAuthToken = () => {
    return localStorage.getItem("accessToken") || localStorage.getItem("token")
  }

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
        const storedSessions = localStorage.getItem("aviradiolog_chat_sessions")
        if (storedSessions) {
          setChatSessions(JSON.parse(storedSessions))
        }
        setIsLoadingHistory(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const transformedSessions =
          data.results?.map((session: any) => ({
            id: session.id,
            title: session.title || `Чат ${session.id}`,
            date: session.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            last_message: session.last_message || "",
            messages_count: session.messages_count || 0,
            total_tokens_used: session.total_tokens_used || 0,
          })) || []

        setChatSessions(transformedSessions)
      } else {
        const storedSessions = localStorage.getItem("aviradiolog_chat_sessions")
        if (storedSessions) {
          setChatSessions(JSON.parse(storedSessions))
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error)
      const storedSessions = localStorage.getItem("aviradiolog_chat_sessions")
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
        const storedSessions = localStorage.getItem("aviradiolog_chat_sessions")
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

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/stats/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChatStats(data)
      } else {
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

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev]
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

    try {
      const token = getAuthToken()

      if (!token || !currentSessionId) {
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

      if (attachments.length > 0) {
        for (const attachment of attachments) {
          if (attachment.type === "image") {
            await sendImageToBackend(attachment.file)
          }
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${currentSessionId}/send_message_radiolog/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: currentMessage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const responseTime = Date.now() - startTime

        const assistantMessage: AiMessage = {
          role: "assistant",
          content: data.reply || data.content || "Изображение проанализировано AI",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          response_time_ms: responseTime,
        }

        setCurrentChat((prev) => [...prev, assistantMessage])
        setConnectionStatus("connected")

        loadChatHistory()
        loadChatStats()
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setConnectionStatus("disconnected")

      const errorMessage: AiMessage = {
        role: "assistant",
        content:
          "Извините, произошла ошибка при подключении к сервису AviRadiolog. Проверьте подключение и попробуйте снова.",
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

  const sendImageToBackend = async (imageFile: File) => {
    try {
      const token = getAuthToken()
      if (!token || !currentSessionId) return

      const formData = new FormData()
      formData.append("image", imageFile)

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${currentSessionId}/send_image_radiolog/`, {
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
          content: data.reply || "Изображение проанализировано AI. Результаты готовы.",
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

  const generateFallbackResponse = (userMessage: string): string => {
    return `**AviRadiolog в демо-режиме**

Анализ запроса: "${userMessage}"

В демо-режиме я могу предложить только базовую структуру анализа:

**1. Предварительная оценка изображения:**
- Требуется загрузка рентгеновского снимка или МРТ
- Подробный анализ доступен при полной активации

**2. Возможные находки:**
- Переломы, трещины или аномалии (нужны изображения для точности)
- Патологии тканей (МРТ/КТ данные необходимы)

**3. Рекомендации:**
- Проведение дополнительной диагностики
- Консультация с радиологом

**4. Заключение:**
Для полной интерпретации изображений необходима активация версии AviRadiolog с подключением к backend API https://new.aviradiolog.uz/

*Демо-режим ограничивает возможности детального анализа медицинских изображений.*`
  }

  const handlePromptClick = (promptText: string) => {
    setMessage(promptText)
  }

  const loadChatSession = async (session: ChatSession) => {
    try {
      const token = getAuthToken()
      if (!token) {
        const sessionKey = `aviradiolog_chat_messages_${session.id}`
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

      const response = await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${session.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const sessionData = await response.json()
        const transformedMessages =
          sessionData.messages?.map((msg: any) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })) || []

        setCurrentChat(transformedMessages)
        setCurrentSessionId(session.id)
        setActiveTab("chat")
      } else {
        const sessionKey = `aviradiolog_chat_messages_${session.id}`
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

  const startNewChat = async () => {
    setCurrentChat([
      {
        role: "assistant",
        content:
          "Привет! Я AviRadiolog, ваш ИИ помощник для анализа медицинских изображений. Загружайте рентгеновские снимки, МРТ или другие изображения, и я помогу с интерпретацией. Как я могу помочь сегодня?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])

    const newSessionId = await createNewChatSession()
    setCurrentSessionId(newSessionId)
    setActiveTab("chat")
    setConnectionStatus("connected")
  }

  const deleteChatSession = async (sessionId: string) => {
    try {
      const token = getAuthToken()
      if (token && !sessionId.startsWith("local-")) {
        await fetch(`${API_BASE_URL}/api/chat/gpt/chats/${sessionId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }

      const storedSessions = localStorage.getItem("aviradiolog_chat_sessions")
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions)
        const updatedSessions = sessions.filter((s: any) => s.id !== sessionId)
        localStorage.setItem("aviradiolog_chat_sessions", JSON.stringify(updatedSessions))
        localStorage.removeItem(`aviradiolog_chat_messages_${sessionId}`)
      }

      setChatSessions((prev) => prev.filter((session) => session.id !== sessionId))
      if (currentSessionId === sessionId) {
        startNewChat()
      }

      loadChatStats()
    } catch (error) {
      console.error("Error deleting session:", error)
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
              title: session.title || `Чат ${session.id}`,
              date: session.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
              last_message: session.last_message || "",
              messages_count: session.messages_count || 0,
              total_tokens_used: session.total_tokens_used || 0,
            })) || []

          setChatSessions(transformedSessions)
          return
        }
      }

      const storedSessions = localStorage.getItem("aviradiolog_chat_sessions")
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
          const roleName = msg.role === "user" ? "Врач" : "AviRadiolog"
          exportData += `[${msg.timestamp}] ${roleName}:\n${msg.content}\n\n`
        })
      } else if (format === "md") {
        exportData = `# ${session.title}\n\n**Дата:** ${new Date(session.date).toLocaleString()}\n\n`
        currentChat.forEach((msg: AiMessage) => {
          const roleName = msg.role === "user" ? "**Врач**" : "**AviRadiolog**"
          exportData += `### ${roleName} (${msg.timestamp})\n\n${msg.content}\n\n---\n\n`
        })
      }

      if (exportData) {
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
        return "Подключен к new.aviradiolog.uz"
      case "disconnected":
        return "Нет подключения"
      case "demo":
        return "Демо-режим"
      default:
        return "Проверка подключения..."
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Card className="flex-1 flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AviRadiolog</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-blue-100 text-sm">Powered by new.aviradiolog.uz</p>
                  {/* {getConnectionIcon()}
                  <span className="text-xs text-blue-200">{getConnectionText()}</span> */}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {chatStats && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  {chatStats.total_sessions} сессий
                </Badge>
              )}
              <Button onClick={startNewChat} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Plus className="w-4 h-4 mr-2" />
                Новый чат
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 m-4 mb-0">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Чат
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                История запросов
                {chatSessions.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {chatSessions.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              <div className="flex-1 overflow-auto p-6 space-y-4" ref={scrollAreaRef}>
                {currentChat.length === 1 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 relative">
                      <Bot className="w-16 h-16 text-white" />
                      <div className="absolute -top-1 -right-1 p-1 bg-green-500 rounded-full">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Подключен к AviRadiolog</h2>
                    <div className="w-full mx-auto mb-5 text-gray-800 text-sm leading-snug space-y-3 text-left">
                      <p><strong>AviRadiolog</strong> — это инструмент для быстрой и точной расшифровки медицинских изображений: КТ, МРТ, рентген, УЗИ.</p>

                      <p><strong>Что нужно сделать:</strong></p>
                      <p>1. Загрузите изображение (JPEG, PNG, DICOM, PDF).</p>
                      <p>2. Укажите контекст: возраст, жалобы, анамнез.</p>
                      <p>3. Сформулируйте задачу: диагноз, дифференцировка, тактика?</p>
                      <p>4. Получите ответ:</p>
                      <p>- Расшифровка снимка</p>
                      <p>- Диагноз и дифференциальный ряд</p>
                      <p>- Рекомендации по обследованию и действиям</p>

                      <p><strong>Примеры запросов:</strong></p>
                      <p>- КТ грудной клетки, очаг в S6, 35 лет — мнение?</p>
                      <p>- МРТ колена, травма 2 недели назад — есть ли повреждение менисков?</p>
                    </div>
                    {chatStats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-2xl font-bold text-blue-600">{chatStats.total_sessions}</div>
                          <div className="text-xs text-gray-600">Всего сессий</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-2xl font-bold text-green-600">{chatStats.total_messages}</div>
                          <div className="text-xs text-gray-600">Сообщений</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-2xl font-bold text-purple-600">{chatStats.sessions_this_week}</div>
                          <div className="text-xs text-gray-600">На этой неделе</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-2xl font-bold text-orange-600">
                            {chatStats.avg_messages_per_session.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-600">Среднее/сессия</div>
                        </div>
                      </div>
                    )}

                    <div className="w-full max-w-4xl">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-left">Возможности AviRadiolog</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestedPrompts.map((item, index) => (
                          <Card
                            key={index}
                            className="bg-white border border-gray-200 hover:border-blue-300 cursor-pointer hover:shadow-lg transition-all duration-200 group"
                            onClick={() => handlePromptClick(item.prompt)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                                <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ml-2" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  currentChat.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-3"}`}>
                      {msg.role === "assistant" && (
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback
                            className={`${msg.isError
                              ? "bg-red-500"
                              : msg.isFallback
                                ? "bg-orange-500"
                                : "bg-gradient-to-r from-blue-500 to-purple-500"
                              } text-white relative`}
                          >
                            {msg.isError ? (
                              <AlertCircle className="w-5 h-5" />
                            ) : msg.isFallback ? (
                              <Settings className="w-5 h-5" />
                            ) : (
                              <>
                                <Bot className="w-5 h-5" />
                                {!msg.isFallback && !msg.isError && (
                                  <div className="absolute -top-0.5 -right-0.5 p-0.5 bg-green-500 rounded-full">
                                    <Sparkles className="w-2 h-2 text-white" />
                                  </div>
                                )}
                              </>
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-2xl p-4 max-w-xs sm:max-w-md lg:max-w-lg ${msg.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-lg"
                          : msg.isError
                            ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-md shadow-sm"
                            : msg.isFallback
                              ? "bg-orange-50 border border-orange-200 text-orange-800 rounded-bl-md shadow-sm"
                              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                          }`}
                      >
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {msg.attachments.map((attachment, attIndex) => (
                              <div
                                key={attIndex}
                                className={`rounded-lg overflow-hidden border ${msg.role === "user" ? "border-blue-400" : "border-gray-200"
                                  }`}
                              >
                                {attachment.type === "image" ? (
                                  <div className="relative group">
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-w-full max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => {
                                        const modal = document.createElement("div")
                                        modal.className =
                                          "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                                        modal.onclick = () => modal.remove()

                                        const img = document.createElement("img")
                                        img.src = attachment.url || "/placeholder.svg"
                                        img.className = "max-w-full max-h-full object-contain"
                                        img.onclick = (e) => e.stopPropagation()

                                        const closeBtn = document.createElement("button")
                                        closeBtn.innerHTML = "×"
                                        closeBtn.className =
                                          "absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
                                        closeBtn.onclick = () => modal.remove()

                                        modal.appendChild(img)
                                        modal.appendChild(closeBtn)
                                        document.body.appendChild(modal)
                                      }}
                                    />
                                    <div
                                      className={`absolute bottom-0 left-0 right-0 p-2 text-xs rounded-b-lg ${msg.role === "user"
                                        ? "bg-blue-600/70 text-white"
                                        : "bg-gray-100/70 text-gray-700"
                                        }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="truncate">{attachment.name}</span>
                                        <span className="ml-2 text-xs opacity-75">
                                          {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ""}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                        Нажмите для увеличения
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={`flex items-center gap-2 p-2 ${msg.role === "user" ? "bg-blue-700/50" : "bg-gray-100"
                                      }`}
                                  >
                                    <File
                                      className={`w-4 h-4 ${msg.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                                    />
                                    <span
                                      className={`text-sm truncate ${msg.role === "user" ? "text-blue-50" : "text-gray-700"}`}
                                    >
                                      {attachment.name}
                                    </span>
                                    <span
                                      className={`text-xs ml-auto ${msg.role === "user" ? "text-blue-200" : "text-gray-500"}`}
                                    >
                                      {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ""}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-sm leading-relaxed">
                          <MarkdownContent content={msg.content} />
                        </div>
                        <span
                          className={`text-xs mt-2 block ${msg.role === "user"
                            ? "text-blue-100"
                            : msg.isError
                              ? "text-red-600"
                              : msg.isFallback
                                ? "text-orange-600"
                                : "text-gray-500"
                            }`}
                        >
                          {msg.timestamp}
                          {!msg.isFallback && !msg.isError && msg.role === "assistant" && (
                            <span className="ml-2 text-green-600">• Backend API</span>
                          )}
                          {msg.response_time_ms && (
                            <span className="ml-2 text-gray-400">• {msg.response_time_ms}ms</span>
                          )}
                          {msg.tokens_used && <span className="ml-2 text-gray-400">• {msg.tokens_used} токенов</span>}
                        </span>
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white relative">
                        <Bot className="w-5 h-5" />
                        <div className="absolute -top-0.5 -right-0.5 p-0.5 bg-green-500 rounded-full">
                          <Sparkles className="w-2 h-2 text-white animate-pulse" />
                        </div>
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">AviRadiolog анализирует изображение...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50/50">
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2 pr-1"
                      >
                        {attachment.type === "image" ? (
                          <div className="w-8 h-8 relative rounded overflow-hidden">
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <File className="w-5 h-5 text-gray-500" />
                        )}
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
                    ))}
                  </div>
                )}
                <div className="flex gap-3 bg-white rounded-2xl border border-gray-200 p-3 shadow-sm items-end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept="image/*" // Faqat tasvirlar qo'llab-quvvatlanadi
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Загрузите рентген или МРТ и задайте вопрос для анализа..."
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder:text-gray-500 resize-none min-h-[20px] max-h-[120px] overflow-y-auto"
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
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl shrink-0"
                    disabled={isLoading}
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm shrink-0 disabled:opacity-50 relative"
                    onClick={sendMessage}
                    disabled={(!message.trim() && attachments.length === 0) || isLoading}
                  >
                    <ArrowUp className="w-5 h-5" />
                    {connectionStatus === "connected" && (
                      <div className="absolute -top-1 -right-1 p-0.5 bg-green-500 rounded-full">
                        <Sparkles className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  <span className="text-green-600 font-medium">✓ Подключен </span> • Анализ
                  изображений напрямую от backend API • Поддержка рентгенов и МРТ • История синхронизируется
                  автоматически
                </p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 flex flex-col m-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">История запросов</h3>
                    <p className="text-sm text-gray-600">Ваши анализы с Backend API new.aviradiolog.uz</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Поиск по истории..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          searchChatSessions(e.target.value)
                        }}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {chatSessions.length} сессий
                    </Badge>
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-3">
                    {isLoadingHistory ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Загрузка истории...</p>
                      </div>
                    ) : chatSessions.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-600 mb-2">
                          {searchQuery ? "Ничего не найдено" : "История пуста"}
                        </h4>
                        <p className="text-gray-500">
                          {searchQuery
                            ? "Попробуйте изменить поисковый запрос"
                            : "Загрузите изображение для начала анализа"}
                        </p>
                      </div>
                    ) : (
                      chatSessions.map((session) => (
                        <Card
                          key={session.id}
                          className="bg-white border border-gray-200 hover:border-blue-300 cursor-pointer hover:shadow-md transition-all duration-200 group"
                          onClick={() => loadChatSession(session)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                                  <h4 className="font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                                    {session.title}
                                  </h4>
                                  <Sparkles className="w-3 h-3 text-green-500 shrink-0" />
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{session.last_message}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(session.date)}
                                  <span>•</span>
                                  <span>{session.messages_count} сообщений</span>
                                  <span>•</span>
                                  <span className="text-green-600">Backend API</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 shrink-0"
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
                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteChatSession(session.id)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}