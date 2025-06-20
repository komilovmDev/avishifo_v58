// src/components/dashboard/chathub/ChatListItem.tsx
"use client";

import type { ChatContactType } from "@/types/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ChatListItemProps {
  chat: ChatContactType;
  isActive: boolean;
  onClick: () => void;
}

export function ChatListItem({ chat, isActive, onClick }: ChatListItemProps) {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-50 border-r-2 border-blue-500"
          : "hover:bg-gray-50"
      }`}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback
          className={`text-xs ${
            chat.type === "admin"
              ? "bg-purple-300 text-purple-700"
              : "bg-cyan-300 text-cyan-700" // Assuming 'client' maps to cyan
          }`}
        >
          {getInitials(chat.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {chat.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {chat.lastMessage}
        </p>
        <p className="text-xs text-gray-400">{chat.time}</p>
      </div>
      {chat.unread > 0 && (
        <Badge className="bg-red-500 text-white text-xs">
          {chat.unread}
        </Badge>
      )}
    </div>
  );
}
