// src/app/page.tsx
"use client"

import { useState, type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

// --- Critical: Ensure these imports are correct ---
import LoginPage from "@/components/login-page"

// Define API base URL
const API_BASE_URL = "https://new.avishifo.uz"

// ... (ваши типы UserData, UserRole, CurrentUserState) ...
interface BaseUserData {
  id: string
  name: string
  email?: string
}

interface DoctorSpecificData {
  specialization: string
}

interface PatientSpecificData {
  dateOfBirth: string
}

interface SuperAdminSpecificData {
  permissions: string[]
}

type UserData =
  | (BaseUserData & DoctorSpecificData)
  | (BaseUserData & PatientSpecificData)
  | (BaseUserData & SuperAdminSpecificData)
  | Record<string, any>
  | null

type UserRole = "doctor" | "patient" | "super-admin"

interface CurrentUserState {
  type: UserRole | null
  data: UserData
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<CurrentUserState>({
    type: null,
    data: null,
  })
  const router = useRouter()

  // Check for existing token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (token) {
        try {
          // Verify token and get user data
          const response = await axios.get(`${API_BASE_URL}/api/accounts/profile/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const userData = response.data

          // Map backend user_type to frontend user types
          let userType: UserRole

          switch (userData.user_type) {
            case "doctor":
              userType = "doctor"
              break
            case "patient":
              userType = "patient"
              break
            case "super_admin":
            case "admin":
              userType = "super-admin"
              break
            default:
              userType = "patient"
          }

          setCurrentUser({
            type: userType,
            data: {
              id: userData.id.toString(),
              name: userData.full_name || `${userData.first_name} ${userData.last_name}`,
              email: userData.email,
              ...userData,
            },
          })

          // Redirect based on user role
          if (userType === "super-admin") {
            router.push("/dashboard/super-admin")
          } else if (userType === "doctor") {
            router.push("/dashboard/doctor/profile")
          } else if (userType === "patient") {
            router.push("/dashboard/patient")
          }
        } catch (error) {
          // Token invalid or expired
          console.error("Auth error:", error)
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }
      }
    }

    checkAuth()
  }, [router])

  const handleLogin = (userType: UserRole, userData: UserData) => {
    console.log("Attempting to log in as:", userType, "with data:", userData)
    if (!["doctor", "patient", "super-admin"].includes(userType)) {
      console.error("Invalid userType in handleLogin:", userType)
      return
    }

    // Format user data to match our expected structure
    const formattedUserData = {
      id: userData.id?.toString() || "",
      name: userData.full_name || userData.name || `${userData.first_name} ${userData.last_name}`,
      email: userData.email,
      ...userData,
    }

    setCurrentUser({ type: userType, data: formattedUserData })

    // Redirect based on user role
    if (userType === "super-admin") {
      router.push("/dashboard/super-admin")
    } else if (userType === "doctor") {
      router.push("/dashboard/doctor/profile")
    } else if (userType === "patient") {
      router.push("/dashboard/patient")
    }
  }

  // If user is already authenticated, show loading while redirecting
  if (currentUser.type) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Перенаправление...</p>
        </div>
      </div>
    )
  }

  // Show login page for unauthenticated users
  return <LoginPage onLogin={handleLogin} />
}
