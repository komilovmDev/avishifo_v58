"use client"

import { Search, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import axios from "axios"

interface TopBarProps {
  activeSectionLabel: string
}

interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  user_type: string
  phone_number: string
  date_of_birth: string
  address: string
  profile_picture: string
  is_verified: boolean
  date_joined: string
}

import { API_CONFIG } from "../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export function TopBar({ activeSectionLabel }: TopBarProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) return

        const response = await axios.get(API_CONFIG.ENDPOINTS.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUserProfile(response.data)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const getUserInitials = () => {
    if (!userProfile) return "DR"
    const firstInitial = userProfile.first_name?.charAt(0) || ""
    const lastInitial = userProfile.last_name?.charAt(0) || ""
    return (firstInitial + lastInitial).toUpperCase() || userProfile.username?.charAt(0).toUpperCase() || "DR"
  }

  const getUserTypeLabel = () => {
    if (!userProfile) return "Доктор"
    switch (userProfile.user_type) {
      case "doctor":
        return "Доктор"
      case "patient":
        return "Пациент"
      case "admin":
        return "Администратор"
      case "super_admin":
        return "Супер Администратор"
      default:
        return "Пользователь"
    }
  }

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <h2 className="text-2xl font-bold text-gray-800">{activeSectionLabel}</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Онлайн
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск пациентов, записей..."
            className="pl-10 w-80 bg-white/50 border-white/20 rounded-full"
          />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">
              {loading ? "Загрузка..." : userProfile?.full_name || "Доктор"}
            </p>
            <p className="text-xs text-gray-500">{loading ? "" : getUserTypeLabel()}</p>
          </div>
          <Avatar className="w-10 h-10 border-2 border-white shadow-md">
            <AvatarImage
              src={userProfile?.profile_picture || "/placeholder.svg?height=40&width=40"}
              alt={userProfile?.full_name || "User"}
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {userProfile?.is_verified && (
            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute -bottom-0 -right-0 shadow-sm"></div>
          )}
        </div>
      </div>
    </header>
  )
}
