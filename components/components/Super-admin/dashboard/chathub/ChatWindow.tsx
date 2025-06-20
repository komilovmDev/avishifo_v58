// src/components/dashboard/chathub/ChatWindow.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatContactType, MessageType } from "@/types/dashboard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { ChatMessage } from "./ChatMessage";

interface ChatWindowProps {
  activeChatContact: ChatContactType | undefined;
  messages: MessageType[];
  onSendMessage: (content: string) => void;
}

export function ChatWindow({
  activeChatContact,
  messages,
  onSendMessage,
}: ChatWindowProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendMessage(currentMessage);
    setCurrentMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  if (!activeChatContact) {
    return (
      <Card className="lg:col-span-3 bg-white/90 border-gray-200/50 shadow-md flex flex-col h-full">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Выберите чат для начала общения</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-3 bg-white/90 border-gray-200/50 shadow-md flex flex-col h-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback
              className={`text-xs ${
                activeChatContact.type === "admin"
                  ? "bg-purple-300 text-purple-700"
                  : "bg-cyan-300 text-cyan-700"
              }`}
            >
              {getInitials(activeChatContact.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{activeChatContact.name}</h3>
            <p className="text-sm text-green-600">Онлайн</p> {/* This could be dynamic */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
           <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Введите сообщение..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="rounded-full"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            className="rounded-full"
            disabled={!currentMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
