// src/app/page.tsx
"use client"

import { useState, type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios" // Add axios import

// --- Critical: Ensure these imports are correct ---
import LoginPage from "@/components/login-page"
import PatientDashboard from "@/components/patient-dashboard"
import { DoctorDashboard } from "@/components/Doctors/DoctorDashboard"

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

          // Redirect super-admin
          if (userType === "super-admin") {
            router.push("/dashboard/super-admin")
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
  }

  const handleLogout = () => {
    console.log("Logging out")
    // Clear tokens
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setCurrentUser({ type: null, data: null })
    router.push("/") // Redirect to login page
  }

  // Эффект для перенаправления после установки currentUser.type
  useEffect(() => {
    if (currentUser.type === "super-admin") {
      // Вместо рендеринга компонента, перенаправляем на его страницу
      router.push("/dashboard/super-admin")
    }
    // Для других ролей (patient, doctor), если их дашборды являются компонентами, а не страницами,
    // логика рендеринга остается. Если они тоже страницы, их также нужно перенаправлять.
  }, [currentUser.type, router])

  // --- Debugging Step: Check if components are defined (оставляем для Patient/Doctor) ---
  if (typeof LoginPage === "undefined") {
    console.error("LoginPage is undefined. Check its export from '@/components/login-page.tsx'")
    return <div>Error: LoginPage component is missing.</div>
  }
  // SuperAdminDashboard больше не рендерится здесь напрямую
  if (typeof PatientDashboard === "undefined") {
    console.error("PatientDashboard is undefined. Check its export from '@/components/patient-dashboard.tsx'")
    return <div>Error: PatientDashboard component is missing.</div>
  }
  if (typeof DoctorDashboard === "undefined") {
    // Предполагаем, что DoctorDashboard - это НЕ SuperAdminDashboard, а отдельный компонент
    console.error("DoctorDashboard is undefined. Check its export from '@/components/Doctors/DoctorDashboard.tsx'")
    return <div>Error: DoctorDashboard component is missing.</div>
  }
  // --- End Debugging Step ---

  let dashboardComponent: ReactNode
  const userDataForDashboard = currentUser.data || {}

  if (!currentUser.type) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Если это super-admin, useEffect выше уже должен был перенаправить.
  // Этот код выполнится до перенаправления или если тип не super-admin.
  if (currentUser.type === "super-admin") {
    // Можно показать заглушку "Перенаправление..." или null, пока происходит редирект
    return <div>Перенаправление в панель супер-администратора...</div>
  }

  switch (currentUser.type) {
    // super-admin case обработан выше через redirect
    case "patient":
      dashboardComponent = <PatientDashboard onLogout={handleLogout} userData={userDataForDashboard} />
      break
    case "doctor":
      dashboardComponent = <DoctorDashboard onLogout={handleLogout} userData={userDataForDashboard} />
      break
    default:
      // Этот кейс не должен достигаться, если currentUser.type валиден
      // и не является 'super-admin' (который уже обработан)
      console.warn("Invalid currentUser.type in switch (after super-admin check):", currentUser.type)
      // Возвращаемся на LoginPage как запасной вариант, если что-то пошло не так
      return <LoginPage onLogin={handleLogin} />
  }

  return <>{dashboardComponent}</>
}
