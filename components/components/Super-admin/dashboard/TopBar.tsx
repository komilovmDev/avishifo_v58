// src/components/dashboard/TopBar.tsx
"use client";

import type React from "react";
import type { NotificationType, SidebarItemType } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Bell, Settings } from "lucide-react";

interface TopBarProps {
  activeSectionLabel: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  notifications: NotificationType[];
  unreadNotificationCount: number;
  onMarkNotificationAsRead: (id: number) => void;
}

export function TopBar({
  activeSectionLabel,
  searchQuery,
  onSearchQueryChange,
  notifications,
  unreadNotificationCount,
  onMarkNotificationAsRead,
}: TopBarProps) {
  return (
    <header className="h-20 bg-white/30 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4 lg:gap-6 ml-12 lg:ml-0">
        <h2 className="text-lg lg:text-2xl font-bold truncate">
          {activeSectionLabel}
        </h2>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hidden sm:inline-flex">
          Система Исправна
        </Badge>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск в системе..."
            className="pl-10 w-60 lg:w-80 bg-gray-100 border-gray-300/50 text-gray-700 rounded-full"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Уведомления</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                  onClick={() => onMarkNotificationAsRead(notification.id)}
                >
                  <p className="text-sm font-medium">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hidden sm:flex"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" />
          <AvatarFallback className="bg-gray-300 text-gray-700">
            SA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
