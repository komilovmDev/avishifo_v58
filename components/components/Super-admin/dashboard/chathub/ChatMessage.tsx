// src/components/dashboard/chathub/ChatMessage.tsx
"use client";

import type { MessageType } from "@/types/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: MessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  return (
    <div
      className={`flex ${
        message.isUser ? "justify-end" : "items-start gap-3"
      }`}
    >
      {!message.isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-cyan-300 text-cyan-700 text-xs">
            {getInitials(message.sender)}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-2xl p-3 max-w-xs ${
          message.isUser
            ? "bg-blue-500 text-white rounded-tr-md"
            : "bg-gray-100 rounded-tl-md"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${
            message.isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}
