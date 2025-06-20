// components/ChatSection.tsx
"use client";

import React, { useState, useRef, useEffect } from "react"; // Added React, useRef, useEffect
import { Users, UserCheck, Shield, Send, Paperclip, Smile, MessageCircle as MessageCircleIconLucide } from "lucide-react"; // Added more icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardHeader, CardTitle
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Interface for individual messages
interface Message {
  id: number;
  sender: string;
  senderAvatar?: string;
  senderFallback: string;
  content: string;
  timestamp: string;
  type: "admin" | "client" | "colleague"; // 'admin' is the current doctor
  isRead?: boolean;
}

// Interface for chat tabs and their potential participants
interface ChatTab {
  id: "clients" | "colleagues" | "super-admin";
  label: string;
  icon: React.ElementType; // For Lucide icons
  participants?: Array<{ // Array of participants for the list
    id: string;
    name: string;
    avatar?: string;
    fallback: string;
    lastMessage?: string;
    unread?: number;
    online?: boolean;
    lastMessageTime?: string;
  }>;
}

// Mock data for doctor's details (replace with actual logged-in user data)
const currentDoctor = {
  name: "Доктор Смирнов",
  fallback: "ДС",
  avatar: "/placeholders/avatar-doctor.jpg" // Optional: path to doctor's avatar
};

export function ChatSection() {
  const [activeChatTabId, setActiveChatTabId] = useState<ChatTab['id']>("clients");
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null); // To track selected participant

  // Store messages per participant chat
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({
    "client-p1": [ // Key might be `tabId-participantId`
      { id: 1, sender: "Иван Петров", senderAvatar: "/placeholders/avatar-male1.jpg", senderFallback: "ИП", content: "Здравствуйте, доктор! У меня вопрос по поводу моего последнего анализа крови.", timestamp: "14:30", type: "client", isRead: false, },
      { id: 2, sender: currentDoctor.name, senderAvatar: currentDoctor.avatar, senderFallback: currentDoctor.fallback, content: "Здравствуйте, Иван! Конечно, давайте посмотрим. Какой именно показатель вас интересует?", timestamp: "14:32", type: "admin", isRead: true, },
    ],
    "client-p2": [
      { id: 1, sender: "Анна Сидорова", senderAvatar: "/placeholders/avatar-female1.jpg", senderFallback: "АС", content: "Могу ли я перенести свою запись на следующую неделю?", timestamp: "15:01", type: "client", isRead: true, },
      { id: 2, sender: currentDoctor.name, senderAvatar: currentDoctor.avatar, senderFallback: currentDoctor.fallback, content: "Да, Анна, конечно. На какое число вам было бы удобно?", timestamp: "15:05", type: "admin", isRead: true, },
    ],
    "colleague-c1": [
        {id: 1, sender: "Др. Елена Васильева", senderAvatar: "/placeholders/avatar-female2.jpg", senderFallback: "ЕВ", content: "Привет! Можешь взглянуть на ЭКГ пациента N?", timestamp: "10:15", type: "colleague", isRead: false}
    ]
    // ... more chats
  });

  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const chatTabs: ChatTab[] = [
    { id: "clients", label: "Клиенты", icon: Users, participants: [
        { id: "p1", name: "Иван Петров", avatar: "/placeholders/avatar-male1.jpg", fallback: "ИП", lastMessage: "Какой именно показатель...", unread: 1, online: true, lastMessageTime: "14:32" },
        { id: "p2", name: "Анна Сидорова", avatar: "/placeholders/avatar-female1.jpg", fallback: "АС", lastMessage: "Да, Анна, конечно...", online: false, lastMessageTime: "15:05" },
        { id: "p3", name: "Сергей Кузнецов", avatar: "/placeholders/avatar-male2.jpg", fallback: "СК", lastMessage: "Спасибо за консультацию!", online: true, lastMessageTime: "Вчера" },
    ]},
    { id: "colleagues", label: "Коллеги", icon: UserCheck, participants: [
        { id: "c1", name: "Др. Елена Васильева", avatar: "/placeholders/avatar-female2.jpg", fallback: "ЕВ", lastMessage: "Привет! Можешь взглянуть...", unread: 1, online: true, lastMessageTime: "10:15"},
        { id: "c2", name: "Др. Михаил Захаров", avatar: "/placeholders/avatar-doctor2.jpg", fallback: "МЗ", lastMessage: "Отправь мне рентген, пожалуйста.", online: false, lastMessageTime: "Пн"},
    ]},
    { id: "super-admin", label: "Администрация", icon: Shield, participants: [
        { id: "sa1", name: "Главный Врач", fallback: "ГВ", lastMessage: "Нужен ваш отчет по итогам месяца.", online: true, lastMessageTime: "09:30"},
    ]},
  ];

  const currentMessagesKey = activeParticipantId ? `${activeChatTabId}-${activeParticipantId}` : null;
  const currentMessages = currentMessagesKey ? (allMessages[currentMessagesKey] || []) : [];

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("div[data-radix-scroll-area-viewport]");
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [currentMessages]); // Depend on currentMessages


  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentMessagesKey || !activeParticipantId) return;

    const message: Message = {
      id: Date.now(), // Use timestamp for more unique ID
      sender: currentDoctor.name,
      senderAvatar: currentDoctor.avatar,
      senderFallback: currentDoctor.fallback,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "admin",
      isRead: true,
    };

    setAllMessages(prevAllMessages => ({
        ...prevAllMessages,
        [currentMessagesKey]: [...(prevAllMessages[currentMessagesKey] || []), message]
    }));
    setNewMessage("");

    // Simulate a reply for "clients" tab for demo purposes
    const currentTab = chatTabs.find(tab => tab.id === activeChatTabId);
    const participant = currentTab?.participants?.find(p => p.id === activeParticipantId);

    if (participant && activeChatTabId === "clients") {
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                sender: participant.name,
                senderAvatar: participant.avatar,
                senderFallback: participant.fallback,
                content: `Спасибо за ваш ответ, ${currentDoctor.name.split(" ")[0]}!`,
                timestamp: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
                type: "client",
                isRead: false,
            };
             setAllMessages(prevAllMessages => ({
                ...prevAllMessages,
                [currentMessagesKey]: [...(prevAllMessages[currentMessagesKey] || []), reply]
            }));
        }, 1500);
    }
  };

  const currentTabDetails = chatTabs.find(tab => tab.id === activeChatTabId);
  const activeParticipantDetails = currentTabDetails?.participants?.find(p => p.id === activeParticipantId);


  const handleParticipantSelect = (participantId: string) => {
    setActiveParticipantId(participantId);
    // Mark messages as read for this participant (conceptual)
    const messageKey = `${activeChatTabId}-${participantId}`;
    if (allMessages[messageKey]) {
        const updatedMessages = allMessages[messageKey].map(msg => msg.type !== 'admin' ? {...msg, isRead: true} : msg);
        setAllMessages(prev => ({...prev, [messageKey]: updatedMessages}));
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      <CardHeader className="p-4 border-b bg-gray-50">
        <CardTitle className="text-xl font-semibold text-gray-800">Центр сообщений</CardTitle>
        <div className="flex gap-2 mt-3">
          {chatTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeChatTabId === tab.id ? "default" : "outline"}
              onClick={() => {
                setActiveChatTabId(tab.id);
                setActiveParticipantId(null); // Deselect participant when changing tabs
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors
                ${activeChatTabId === tab.id
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-600 bg-white hover:bg-gray-100 border-gray-300'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for chat participants */}
        <ScrollArea className="w-full sm:w-1/3 md:w-1/4 border-r bg-gray-50">
            <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1 uppercase tracking-wider">
                    {currentTabDetails?.label || "Чаты"}
                </h3>
                {currentTabDetails?.participants?.map(p => {
                    const messageKey = `${activeChatTabId}-${p.id}`;
                    const participantMessages = allMessages[messageKey] || [];
                    const unreadCount = participantMessages.filter(m => m.type !== 'admin' && !m.isRead).length;

                    return (
                        <div
                            key={p.id}
                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors
                                ${activeParticipantId === p.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => handleParticipantSelect(p.id)}
                        >
                            <Avatar className="w-10 h-10 relative shrink-0">
                                {p.avatar && <AvatarImage src={p.avatar} alt={p.name}/>}
                                <AvatarFallback className={`font-semibold ${activeParticipantId === p.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{p.fallback}</AvatarFallback>
                                {p.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-gray-50"></span>}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className={`font-medium text-sm truncate ${activeParticipantId === p.id ? 'text-blue-700' : 'text-gray-800'}`}>{p.name}</p>
                                    {p.lastMessageTime && <p className={`text-xs ${activeParticipantId === p.id ? 'text-blue-600' : 'text-gray-400'}`}>{p.lastMessageTime}</p>}
                                </div>
                                <div className="flex justify-between items-center">
                                    {p.lastMessage && <p className={`text-xs truncate ${activeParticipantId === p.id ? 'text-blue-600' : 'text-gray-500'}`}>{p.lastMessage}</p>}
                                    {unreadCount > 0 && (
                                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5 shrink-0">{unreadCount}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {(!currentTabDetails?.participants || currentTabDetails.participants.length === 0) && (
                    <p className="text-sm text-gray-500 text-center mt-4 px-2">Нет активных чатов в этой категории.</p>
                )}
            </div>
        </ScrollArea>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-100 to-gray-200">
          {!activeParticipantId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <MessageCircleIconLucide className="w-20 h-20 mb-6 text-gray-400"/>
              <p className="text-xl font-semibold">Выберите чат</p>
              <p className="text-sm">Выберите участника из списка слева, чтобы начать общение.</p>
            </div>
          ) : (
            <>
              <CardHeader className="p-3 border-b bg-white shadow-sm">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        {activeParticipantDetails?.avatar && <AvatarImage src={activeParticipantDetails.avatar} alt={activeParticipantDetails.name} />}
                        <AvatarFallback className="bg-gray-300 text-gray-700 font-semibold">{activeParticipantDetails?.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-gray-800">{activeParticipantDetails?.name}</p>
                        {activeParticipantDetails?.online !== undefined && (
                             <p className={`text-xs ${activeParticipantDetails.online ? 'text-green-600' : 'text-gray-500'}`}>
                                {activeParticipantDetails.online ? 'Онлайн' : 'Офлайн'}
                            </p>
                        )}
                    </div>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                {currentMessages.map((message) => (
                    <div
                    key={message.id}
                    className={`flex items-end gap-2.5 ${
                        message.type === "admin" ? "justify-end" : "justify-start"
                    }`}
                    >
                    {message.type !== "admin" && (
                        <Avatar className="w-8 h-8 shrink-0">
                        {message.senderAvatar && <AvatarImage src={message.senderAvatar} alt={message.sender}/>}
                        <AvatarFallback className="bg-gray-300 text-gray-700 text-xs font-semibold">{message.senderFallback}</AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={`rounded-xl p-3 max-w-[70%] shadow-sm break-words ${
                        message.type === "admin"
                            ? "bg-blue-500 text-white rounded-br-lg" // Adjusted rounding
                            : "bg-white text-gray-800 rounded-bl-lg border border-gray-200" // Adjusted rounding
                        }`}
                    >
                        {message.type !== "admin" && (
                            <p className="text-xs font-medium text-blue-600 mb-0.5">{message.sender}</p>
                        )}
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1.5 text-right ${
                            message.type === "admin" ? "text-blue-100" : "text-gray-400"
                        }`}>
                        {message.timestamp}
                        </p>
                    </div>
                    {message.type === "admin" && (
                        <Avatar className="w-8 h-8 shrink-0">
                            {currentDoctor.avatar && <AvatarImage src={currentDoctor.avatar} alt={currentDoctor.name} />}
                            <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">{currentDoctor.fallback}</AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {currentMessages.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-gray-400 pt-16">
                        <MessageCircleIconLucide className="w-12 h-12 mb-3"/>
                        <p className="text-sm">Нет сообщений в этом чате.</p>
                    </div>
                )}
                </div>
              </ScrollArea>

              <div className="p-3 border-t bg-white shadow-inner">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 rounded-full">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Напишите сообщение..."
                    className="flex-1 h-10 px-4 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 rounded-full">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-10 h-10" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
