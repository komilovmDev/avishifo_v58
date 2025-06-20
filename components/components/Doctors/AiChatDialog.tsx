"use client"

import type React from "react"

import { Mic, ArrowUp, Paperclip, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useEffect, useRef } from "react"

interface AiMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
  attachments?: {
    type: "image" | "file"
    name: string
    url: string
    size?: number
  }[]
}

interface AiChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatHistory: AiMessage[]
  message: string
  setMessage: (message: string) => void
  onSendMessage: () => void
  attachments?: {
    type: "image" | "file"
    name: string
    url: string
    file: File
    size: number
  }[]
  onAddAttachment?: (files: FileList) => void
  onRemoveAttachment?: (index: number) => void
}

export function AiChatDialog({
  open,
  onOpenChange,
  chatHistory,
  message,
  setMessage,
  onSendMessage,
  attachments = [],
  onAddAttachment,
  onRemoveAttachment,
}: AiChatDialogProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatHistory])

  const suggestedPrompts = [
    {
      title: "Преодолеть прокрастинацию",
      description: "дайте советы",
      prompt: "Как преодолеть прокрастинацию? Дайте мне несколько советов.",
    },
    {
      title: "Показать фрагмент кода",
      description: "липкого заголовка веб-сайта",
      prompt: "Покажите мне фрагмент кода для липкого заголовка веб-сайта.",
    },
    {
      title: "Проверка грамматики",
      description: "перепишите для лучшей читабельности",
      prompt: "Проверьте грамматику этого текста и перепишите его для лучшей читабельности: 'Ваш текст здесь'",
    },
    {
      title: "Расскажите забавный факт",
      description: "о Римской империи",
      prompt: "Расскажите мне забавный факт о Римской империи.",
    },
  ]

  const handlePromptClick = (promptText: string) => {
    setMessage(promptText)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAddAttachment && e.target.files && e.target.files.length > 0) {
      onAddAttachment(e.target.files)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[600px] flex flex-col p-0 gap-0 bg-[#171717] text-gray-100 border-none rounded-lg overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-800 bg-[#171717]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-semibold text-gray-100">ИИ Авишифо</DialogTitle>
              <span className="text-xs text-gray-400">v1.0</span>
            </div>
            {/* You can add model selection here if needed, similar to the screenshot */}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar" ref={scrollAreaRef}>
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <img src="/ai-logo.png" alt="AI Logo" className="w-24 h-24 mb-6 opacity-80" />
              <h2 className="text-3xl font-bold text-gray-100 mb-4">Как я могу вам помочь сегодня?</h2>
              <p className="text-sm text-gray-400 mb-8">Задайте мне вопрос или выберите одну из предложенных тем.</p>

              <div className="w-full max-w-2xl">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 text-left">Предложенные</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestedPrompts.map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-800 border border-gray-700 text-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors flex flex-col justify-between"
                      onClick={() => handlePromptClick(item.prompt)}
                    >
                      <div>
                        <h4 className="font-semibold text-base mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4 text-gray-500">
                        <span className="text-xs">Prompt</span>
                        <ArrowUp className="w-4 h-4" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-3"}`}>
                {msg.role === "assistant" && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-xl p-3 max-w-xs sm:max-w-md ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-800 text-gray-100 rounded-bl-md"
                  }`}
                >
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {msg.attachments.map((attachment, attIndex) => (
                        <div
                          key={attIndex}
                          className={`rounded-lg overflow-hidden border ${
                            msg.role === "user" ? "border-blue-400" : "border-gray-700"
                          }`}
                        >
                          {attachment.type === "image" ? (
                            <div className="relative">
                              <img
                                src={attachment.url || "/placeholder.svg"}
                                alt={attachment.name}
                                className="max-w-full max-h-48 object-contain"
                              />
                              <div
                                className={`absolute bottom-0 left-0 right-0 p-1 text-xs ${
                                  msg.role === "user" ? "bg-blue-700/70 text-white" : "bg-gray-700/70 text-gray-100"
                                }`}
                              >
                                {attachment.name}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`flex items-center gap-2 p-2 ${
                                msg.role === "user" ? "bg-blue-700/50" : "bg-gray-700/50"
                              }`}
                            >
                              <File className={`w-4 h-4 ${msg.role === "user" ? "text-blue-100" : "text-gray-300"}`} />
                              <span
                                className={`text-sm truncate ${msg.role === "user" ? "text-blue-50" : "text-gray-200"}`}
                              >
                                {attachment.name}
                              </span>
                              <span
                                className={`text-xs ml-auto ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}
                              >
                                {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={`text-sm ${msg.role === "user" ? "text-white" : "text-gray-100"}`}>{msg.content}</p>
                  <span className={`text-xs mt-2 block ${msg.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#171717] flex flex-col items-center">
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2 w-full max-w-2xl">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-800 rounded-lg border border-gray-700 p-2 pr-1"
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
                    <File className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-xs text-gray-300 max-w-[100px] truncate">{attachment.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full p-0 text-gray-500 hover:text-red-400 hover:bg-gray-700"
                    onClick={() => onRemoveAttachment && onRemoveAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex w-full max-w-2xl gap-2 bg-gray-800 rounded-xl border border-gray-700 p-2">
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
              className="text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Спросите Авишифо о чем угодно..."
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-100 placeholder:text-gray-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  onSendMessage()
                }
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSendMessage}
              disabled={!message.trim() && attachments.length === 0}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">ИИ может ошибаться. Проверяйте важную информацию.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
