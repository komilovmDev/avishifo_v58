// src/components/dashboard/chathub/ChatHubSection.tsx
"use client";

import { useState } from "react";
import type { ChatContactType, MessageType } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatListItem } from "./ChatListItem";
import { ChatWindow } from "./ChatWindow";
import { ChatStatsCard } from "./ChatStatsCard";

// Initial Data (can be fetched from API)
const initialChats: ChatContactType[] = [
  { id: 1, name: "Анна Иванова", type: "client", lastMessage: "Спасибо за помощь!", time: "5 мин назад", unread: 2 },
  { id: 2, name: "Др. Петров", type: "admin", lastMessage: "Нужна консультация", time: "10 мин назад", unread: 0 },
  { id: 3, name: "Мария Козлова", type: "client", lastMessage: "Когда следующий прием?", time: "1 час назад", unread: 1 },
];

const initialMessages: Record<number, MessageType[]> = { // Store messages per chat ID
    1: [
        { id: 1, sender: "Анна Иванова", content: "Здравствуйте! У меня вопрос по поводу лечения", time: "14:30", isUser: false },
        { id: 2, sender: "Супер Админ", content: "Здравствуйте! Я вас слушаю", time: "14:32", isUser: true },
        { id: 3, sender: "Анна Иванова", content: "Спасибо за помощь!", time: "14:35", isUser: false },
    ],
    2: [
        { id: 1, sender: "Др. Петров", content: "Приветствую! Нужна ваша помощь с одним вопросом.", time: "10:00", isUser: false },
    ],
    3: [
        { id: 1, sender: "Мария Козлова", content: "Добрый день! Когда можно записаться на следующий прием?", time: "11:15", isUser: false },
        { id: 2, sender: "Супер Админ", content: "Добрый! Уточню и сообщу вам.", time: "11:17", isUser: true },
    ]
};


export function ChatHubSection() {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<ChatContactType[]>(initialChats); // chat list
  const [allMessages, setAllMessages] = useState<Record<number, MessageType[]>>(initialMessages); // all messages object

  const currentChatMessages = activeChatId ? allMessages[activeChatId] || [] : [];
  const activeChatContact = chats.find(c => c.id === activeChatId);

  const handleSelectChat = (chatId: number) => {
    setActiveChatId(chatId);
    // Mark messages as read for this chat
    setChats(prevChats => prevChats.map(c => c.id === chatId ? {...c, unread: 0} : c));
  };

  const handleSendMessage = (content: string) => {
    if (!activeChatId || !activeChatContact) return;

    const newMessage: MessageType = {
      id: Date.now(), // simple unique ID
      sender: "Супер Админ", // Or dynamic current user name
      content: content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    };

    setAllMessages(prevAllMessages => ({
        ...prevAllMessages,
        [activeChatId]: [...(prevAllMessages[activeChatId] || []), newMessage]
    }));

    // Update last message in chat list
    setChats(prevChats => prevChats.map(c =>
        c.id === activeChatId ? {...c, lastMessage: content, time: newMessage.time} : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]"> {/* Adjust height as needed */}
        {/* Chat List */}
        <Card className="lg:col-span-1 bg-white/90 border-gray-200/50 shadow-md flex flex-col">
          <CardHeader>
            <CardTitle className="text-gray-800 text-base lg:text-lg">
              Активные Чаты
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {chats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChatId === chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <ChatWindow
            activeChatContact={activeChatContact}
            messages={currentChatMessages}
            onSendMessage={handleSendMessage}
        />
      </div>

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChatStatsCard value="156" label="Активные разговоры" valueColorClass="text-blue-600"/>
        <ChatStatsCard value="2.3 мин" label="Среднее время ответа" valueColorClass="text-green-600"/>
        <ChatStatsCard value="94%" label="Уровень удовлетворенности" valueColorClass="text-purple-600"/>
      </div>
    </div>
  );
}
