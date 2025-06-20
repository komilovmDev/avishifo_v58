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
  // Простая функция для парсинга markdown
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **текст** -> <strong>текст</strong>
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // *текст* -> <em>текст</em>
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>') // `код` -> <code>код</code>
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-800">$1</h3>') // ### заголовок
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2 text-gray-800">$1</h2>') // ## заголовок
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-800">$1</h1>') // # заголовок
      .replace(/^\d+\.\s(.*$)/gm, '<li class="ml-4 mb-1">$1</li>') // 1. пункт -> <li>пункт</li>
      .replace(/^-\s(.*$)/gm, '<li class="ml-4 mb-1 list-disc">$1</li>') // - пункт -> <li>пункт</li>
      .replace(/\n\n/g, '</p><p class="mb-2">') // двойной перенос -> новый параграф
      .replace(/\n/g, "<br>") // одинарный перенос -> <br>
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

export function AiChatSection() {
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
        "Привет! Я Авишифо, ваш ИИ помощник с полной интеграцией Avishifo.ai. Готов предоставить профессиональные медицинские консультации. Как я могу помочь вам сегодня?",
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

  // Загрузка истории чатов при монтировании компонента
  useEffect(() => {
    loadChatHistory()
    loadChatStats()
  }, [])

  const suggestedPrompts = [
    {
      title: "Дифференциальная диагностика",
      description: "анализ сложных случаев",
      prompt:
        "Помогите провести дифференциальную диагностику для пациента с болью в груди, одышкой и повышенным потоотделением.",
    },
    {
      title: "Персонализированный план лечения",
      description: "с учетом коморбидности",
      prompt:
        "Составьте план лечения для пациента 65 лет с сахарным диабетом 2 типа, гипертонией и хронической болезнью почек.",
    },
    {
      title: "Анализ лекарственных взаимодействий",
      description: "комплексная оценка",
      prompt:
        "Проанализируйте возможные взаимодействия между метформином, лизиноприлом, аторвастатином и новым назначением амоксициллина.",
    },
    {
      title: "Актуальные рекомендации",
      description: "последние исследования",
      prompt: "Какие последние изменения в рекомендациях по лечению артериальной гипертензии согласно ESC/ESH 2023?",
    },
  ]

  const loadChatHistory = async () => {
    setIsLoadingHistory(true)
    try {
      // Try to fetch from API
      const response = await fetch("/api/chat-history/sessions/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        setChatSessions(data.results || data)
      } else {
        // Fallback to local storage if API is not available
        console.log("API not available, using local storage fallback")
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        if (storedSessions) {
          setChatSessions(JSON.parse(storedSessions))
        } else {
          // Use empty array if nothing in local storage
          setChatSessions([])
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error)
      // Fallback to local storage
      try {
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        if (storedSessions) {
          setChatSessions(JSON.parse(storedSessions))
        }
      } catch (e) {
        console.error("Error loading from local storage:", e)
        setChatSessions([])
      }
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadChatStats = async () => {
    try {
      // Try to fetch from API
      const response = await fetch("/api/chat-history/statistics/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json()
        if (result.success) {
          setChatStats(result.data)
        }
      } else {
        // Generate mock stats based on local storage
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        if (storedSessions) {
          const sessions = JSON.parse(storedSessions)
          const mockStats = {
            total_sessions: sessions.length,
            total_messages: sessions.reduce((acc, session) => acc + (session.messages_count || 0), 0),
            total_tokens: 0,
            avg_messages_per_session: sessions.length
              ? sessions.reduce((acc, session) => acc + (session.messages_count || 0), 0) / sessions.length
              : 0,
            most_active_day: new Date().toISOString().split("T")[0],
            sessions_this_week: sessions.length,
            sessions_this_month: sessions.length,
          }
          setChatStats(mockStats)
        }
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

  const createNewSession = async (firstMessage: string) => {
    try {
      // Try to create via API
      const response = await fetch("/api/chat-history/sessions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : ""),
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const session = await response.json()
        return session.id
      } else {
        // Fallback to local storage
        const sessionId = `local-${Date.now()}`
        const newSession = {
          id: sessionId,
          title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : ""),
          date: new Date().toISOString().split("T")[0],
          last_message: "",
          messages_count: 1,
          total_tokens_used: 0,
        }

        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        const sessions = storedSessions ? JSON.parse(storedSessions) : []
        localStorage.setItem("avishifo_chat_sessions", JSON.stringify([newSession, ...sessions]))

        // Update state
        setChatSessions((prev) => [newSession, ...prev])

        return sessionId
      }
    } catch (error) {
      console.error("Error creating session:", error)
      // Fallback to local storage
      const sessionId = `local-${Date.now()}`
      const newSession = {
        id: sessionId,
        title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : ""),
        date: new Date().toISOString().split("T")[0],
        last_message: "",
        messages_count: 1,
        total_tokens_used: 0,
      }

      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      const sessions = storedSessions ? JSON.parse(storedSessions) : []
      localStorage.setItem("avishifo_chat_sessions", JSON.stringify([newSession, ...sessions]))

      // Update state
      setChatSessions((prev) => [newSession, ...prev])

      return sessionId
    }
  }

  const saveMessageToSession = async (sessionId: string, message: AiMessage) => {
    try {
      // Try to save via API
      if (!sessionId.startsWith("local-")) {
        await fetch(`/api/chat-history/sessions/${sessionId}/messages/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            role: message.role,
            content: message.content,
            tokens_used: message.tokens_used || 0,
            is_error: message.isError || false,
            is_fallback: message.isFallback || false,
            response_time_ms: message.response_time_ms || null,
          }),
        })
      }

      // Always update local storage as backup
      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions)
        const sessionIndex = sessions.findIndex((s: any) => s.id === sessionId)

        if (sessionIndex !== -1) {
          // Update session
          sessions[sessionIndex].last_message =
            message.content.slice(0, 100) + (message.content.length > 100 ? "..." : "")
          sessions[sessionIndex].messages_count = (sessions[sessionIndex].messages_count || 0) + 1

          // Store messages in local storage too
          const sessionKey = `avishifo_chat_messages_${sessionId}`
          const storedMessages = localStorage.getItem(sessionKey)
          const messages = storedMessages ? JSON.parse(storedMessages) : []
          messages.push({ ...message, id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` })
          localStorage.setItem(sessionKey, JSON.stringify(messages))

          // Update sessions list
          localStorage.setItem("avishifo_chat_sessions", JSON.stringify(sessions))
        }
      }
    } catch (error) {
      console.error("Error saving message:", error)
      // Ensure local storage is updated even if API fails
      try {
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")
        if (storedSessions) {
          const sessions = JSON.parse(storedSessions)
          const sessionIndex = sessions.findIndex((s: any) => s.id === sessionId)

          if (sessionIndex !== -1) {
            // Update session
            sessions[sessionIndex].last_message =
              message.content.slice(0, 100) + (message.content.length > 100 ? "..." : "")
            sessions[sessionIndex].messages_count = (sessions[sessionIndex].messages_count || 0) + 1

            // Store messages in local storage too
            const sessionKey = `avishifo_chat_messages_${sessionId}`
            const storedMessages = localStorage.getItem(sessionKey)
            const messages = storedMessages ? JSON.parse(storedMessages) : []
            messages.push({ ...message, id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` })
            localStorage.setItem(sessionKey, JSON.stringify(messages))

            // Update sessions list
            localStorage.setItem("avishifo_chat_sessions", JSON.stringify(sessions))
          }
        }
      } catch (e) {
        console.error("Error updating local storage:", e)
      }
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
    setMessage("")
    setAttachments([])
    setIsLoading(true)

    // Создаем новую сессию если это первое сообщение
    let sessionId = currentSessionId
    if (!sessionId && currentChat.length === 1) {
      sessionId = await createNewSession(userMessage.content || "Новый чат с вложениями")
      setCurrentSessionId(sessionId)
    }

    try {
      // Prepare files for upload if any
      const formData = new FormData()

      // Add message content
      formData.append("message", message)

      // Add chat history
      formData.append("history", JSON.stringify(currentChat))

      // Add files if any
      attachments.forEach((att, index) => {
        formData.append(`file${index}`, att.file)
      })

      // If we have attachments, use FormData API
      let response
      if (attachments.length > 0) {
        response = await fetch("/api/chat-with-files", {
          method: "POST",
          body: formData,
        })
      } else {
        // Otherwise use the regular JSON API
        response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...currentChat, userMessage],
          }),
        })
      }

      const data = await response.json()
      const responseTime = Date.now() - startTime

      const assistantMessage: AiMessage = {
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isError: data.error,
        isFallback: data.fallback,
        response_time_ms: responseTime,
        tokens_used: data.tokens_used,
      }

      setCurrentChat((prev) => [...prev, assistantMessage])

      if (data.error) {
        setConnectionStatus("disconnected")
      } else if (data.fallback) {
        setConnectionStatus("demo")
      } else {
        setConnectionStatus("connected")
      }

      // Сохраняем сообщения в базу данных или локальное хранилище
      if (sessionId) {
        await saveMessageToSession(sessionId, userMessage)
        await saveMessageToSession(sessionId, assistantMessage)

        // Обновляем историю
        loadChatHistory()
        loadChatStats()
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setConnectionStatus("disconnected")

      const errorMessage: AiMessage = {
        role: "assistant",
        content:
          "Извините, произошла ошибка при подключению к ИИ сервису. Проверьте подключение к интернету и попробуйте снова.",
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

  const handlePromptClick = (promptText: string) => {
    setMessage(promptText)
  }

  const loadChatSession = async (session: ChatSession) => {
    try {
      if (session.id.startsWith("local-")) {
        // Load from local storage
        const sessionKey = `avishifo_chat_messages_${session.id}`
        const storedMessages = localStorage.getItem(sessionKey)
        if (storedMessages) {
          setCurrentChat(JSON.parse(storedMessages))
          setCurrentSessionId(session.id)
          setActiveTab("chat")
        } else {
          // If no messages found, start a new chat
          startNewChat()
        }
        return
      }

      // Try to load from API
      const response = await fetch(`/api/chat-history/sessions/${session.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const sessionData = await response.json()
        setCurrentChat(sessionData.messages || [])
        setCurrentSessionId(session.id)
        setActiveTab("chat")
      } else {
        // Fallback to local storage
        const sessionKey = `avishifo_chat_messages_${session.id}`
        const storedMessages = localStorage.getItem(sessionKey)
        if (storedMessages) {
          setCurrentChat(JSON.parse(storedMessages))
        } else {
          // If no messages found, use welcome message
          setCurrentChat([
            {
              role: "assistant",
              content:
                "Привет! Я Авишифо, ваш ИИ помощник с полной интеграцией Avishifo.ai. Готов предоставить профессиональные медицинские консультации. Как я могу помочь вам сегодня?",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ])
        }
        setCurrentSessionId(session.id)
        setActiveTab("chat")
      }
    } catch (error) {
      console.error("Error loading session:", error)
      // Fallback to local storage
      const sessionKey = `avishifo_chat_messages_${session.id}`
      const storedMessages = localStorage.getItem(sessionKey)
      if (storedMessages) {
        setCurrentChat(JSON.parse(storedMessages))
      } else {
        // If no messages found, use welcome message
        setCurrentChat([
          {
            role: "assistant",
            content:
              "Привет! Я Авишифо, ваш ИИ помощник с полной интеграцией Avishifo.ai. Готов предоставить профессиональные медицинские консультации. Как я могу помочь вам сегодня?",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ])
      }
      setCurrentSessionId(session.id)
      setActiveTab("chat")
    }
  }

  const startNewChat = () => {
    setCurrentChat([
      {
        role: "assistant",
        content:
          "Привет! Я Авишифо, ваш ИИ помощник с полной интеграцией Avishifo.ai. Готов предоставить профессиональные медицинские консультации. Как я могу помочь вам сегодня?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])
    setCurrentSessionId(null)
    setActiveTab("chat")
    setConnectionStatus("connected")
  }

  const deleteChatSession = async (sessionId: string) => {
    try {
      if (!sessionId.startsWith("local-")) {
        // Try to delete via API
        await fetch(`/api/chat-history/sessions/${sessionId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        })
      }

      // Always update local storage
      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions)
        const updatedSessions = sessions.filter((s: any) => s.id !== sessionId)
        localStorage.setItem("avishifo_chat_sessions", JSON.stringify(updatedSessions))

        // Remove messages
        localStorage.removeItem(`avishifo_chat_messages_${sessionId}`)
      }

      // Update state
      setChatSessions((prev) => prev.filter((session) => session.id !== sessionId))
      if (currentSessionId === sessionId) {
        startNewChat()
      }

      // Update stats
      loadChatStats()
    } catch (error) {
      console.error("Error deleting session:", error)
      // Ensure local storage is updated even if API fails
      const storedSessions = localStorage.getItem("avishifo_chat_sessions")
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions)
        const updatedSessions = sessions.filter((s: any) => s.id !== sessionId)
        localStorage.setItem("avishifo_chat_sessions", JSON.stringify(updatedSessions))

        // Remove messages
        localStorage.removeItem(`avishifo_chat_messages_${sessionId}`)
      }

      // Update state
      setChatSessions((prev) => prev.filter((session) => session.id !== sessionId))
      if (currentSessionId === sessionId) {
        startNewChat()
      }
    }
  }

  const searchChatSessions = async (query: string) => {
    if (!query.trim()) {
      loadChatHistory()
      return
    }

    try {
      // Try to search via API
      const response = await fetch(`/api/chat-history/search/?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json()
        if (result.success) {
          setChatSessions(result.data)
        }
      } else {
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
      }
    } catch (error) {
      console.error("Error searching sessions:", error)
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
    }
  }

  const exportSession = async (sessionId: string, format: "json" | "txt" | "md" = "txt") => {
    try {
      let exportData = ""
      const fileName = `chat-${sessionId}.${format}`

      if (sessionId.startsWith("local-")) {
        // Export from local storage
        const sessionKey = `avishifo_chat_messages_${sessionId}`
        const storedMessages = localStorage.getItem(sessionKey)
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")

        if (storedMessages && storedSessions) {
          const messages = JSON.parse(storedMessages)
          const sessions = JSON.parse(storedSessions)
          const session = sessions.find((s: any) => s.id === sessionId)

          if (session) {
            if (format === "json") {
              exportData = JSON.stringify(
                {
                  id: session.id,
                  title: session.title,
                  date: session.date,
                  messages: messages,
                },
                null,
                2,
              )
            } else if (format === "txt") {
              exportData = `Чат: ${session.title}\nДата: ${new Date(session.date).toLocaleString()}\n\n`
              messages.forEach((msg: AiMessage) => {
                const roleName = msg.role === "user" ? "Врач" : "Avishifo.ai"
                exportData += `[${msg.timestamp}] ${roleName}:\n${msg.content}\n\n`
              })
            } else if (format === "md") {
              exportData = `# ${session.title}\n\n**Дата:** ${new Date(session.date).toLocaleString()}\n\n`
              messages.forEach((msg: AiMessage) => {
                const roleName = msg.role === "user" ? "**Врач**" : "**Avishifo.ai**"
                exportData += `### ${roleName} (${msg.timestamp})\n\n${msg.content}\n\n---\n\n`
              })
            }
          }
        }
      } else {
        // Try to export via API
        const response = await fetch(`/api/chat-history/sessions/${sessionId}/export/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ format }),
        })

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json()
          if (result.success) {
            exportData = result.data
          }
        } else {
          // Fallback to local storage
          throw new Error("API not available")
        }
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
      // Try to export from local storage as fallback
      try {
        const sessionKey = `avishifo_chat_messages_${sessionId}`
        const storedMessages = localStorage.getItem(sessionKey)
        const storedSessions = localStorage.getItem("avishifo_chat_sessions")

        if (storedMessages && storedSessions) {
          const messages = JSON.parse(storedMessages)
          const sessions = JSON.parse(storedSessions)
          const session = sessions.find((s: any) => s.id === sessionId)

          if (session) {
            let exportData = ""
            if (format === "json") {
              exportData = JSON.stringify(
                {
                  id: session.id,
                  title: session.title,
                  date: session.date,
                  messages: messages,
                },
                null,
                2,
              )
            } else if (format === "txt") {
              exportData = `Чат: ${session.title}\nДата: ${new Date(session.date).toLocaleString()}\n\n`
              messages.forEach((msg: AiMessage) => {
                const roleName = msg.role === "user" ? "Врач" : "Avishifo.ai"
                exportData += `[${msg.timestamp}] ${roleName}:\n${msg.content}\n\n`
              })
            } else if (format === "md") {
              exportData = `# ${session.title}\n\n**Дата:** ${new Date(session.date).toLocaleString()}\n\n`
              messages.forEach((msg: AiMessage) => {
                const roleName = msg.role === "user" ? "**Врач**" : "**Avishifo.ai**"
                exportData += `### ${roleName} (${msg.timestamp})\n\n${msg.content}\n\n---\n\n`
              })
            }

            // Create and download file
            const blob = new Blob([exportData], {
              type: format === "json" ? "application/json" : "text/plain",
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `chat-${sessionId}.${format}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        }
      } catch (e) {
        console.error("Error exporting from local storage:", e)
        alert("Не удалось экспортировать чат. Пожалуйста, попробуйте позже.")
      }
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
        return "Avishifo.ai активен"
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
        <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">ИИ Авишифо</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-blue-100 text-sm">Powered by Avishifo.ai</p>
                  {getConnectionIcon()}
                  <span className="text-xs text-blue-200">{getConnectionText()}</span>
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
          {connectionStatus === "connected" && (
            <Alert className="m-4 mb-0 border-green-200 bg-green-50">
              <Sparkles className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ИИ Авишифо полностью активен! Теперь вы получаете персонализированные ответы от Avishifo.ai, специально
                настроенного для медицинских консультаций. История сохраняется автоматически.
              </AlertDescription>
            </Alert>
          )}

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
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Готов к профессиональным консультациям!</h2>
                    <p className="text-gray-600 mb-8 max-w-md">
                      Теперь я использую полную мощь Avishifo.ai для предоставления детальных медицинских консультаций,
                      анализа сложных случаев и актуальных рекомендаций. Вся история автоматически сохраняется.
                    </p>

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
                      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-left">Расширенные возможности</h3>
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
                            className={`${
                              msg.isError
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
                        className={`rounded-2xl p-4 max-w-xs sm:max-w-md lg:max-w-lg ${
                          msg.role === "user"
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
                                className={`rounded-lg overflow-hidden border ${
                                  msg.role === "user" ? "border-blue-400" : "border-gray-200"
                                }`}
                              >
                                {attachment.type === "image" ? (
                                  <div className="relative group">
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-w-full max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => {
                                        // Открыть изображение в полном размере
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
                                      className={`absolute bottom-0 left-0 right-0 p-2 text-xs rounded-b-lg ${
                                        msg.role === "user"
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
                                    className={`flex items-center gap-2 p-2 ${
                                      msg.role === "user" ? "bg-blue-700/50" : "bg-gray-100"
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
                          className={`text-xs mt-2 block ${
                            msg.role === "user"
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
                            <span className="ml-2 text-green-600">• Avishifo.ai</span>
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
                        <span className="text-sm text-gray-600">Avishifo.ai анализирует ваш запрос...</span>
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
                    accept="image/*,.pdf,.doc,.docx,.txt"
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
                    placeholder="Задайте сложный медицинский вопрос - Avishifo.ai готов к детальному анализу..."
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
                  <span className="text-green-600 font-medium">✓ Avishifo.ai активен</span> • Получайте профессиональные
                  медицинские консультации с учетом последних исследований и рекомендаций • История сохраняется
                  автоматически
                </p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 flex flex-col m-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">История запросов</h3>
                    <p className="text-sm text-gray-600">Ваши профессиональные консультации с Avishifo.ai</p>
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
                            : "Начните новую консультацию с Avishifo.ai"}
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
                                  <span className="text-green-600">Avishifo.ai</span>
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
