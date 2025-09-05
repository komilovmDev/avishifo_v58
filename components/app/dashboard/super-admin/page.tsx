// app/dashboard/super-admin/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SuperAdminDashboard from "@/components/Super-admin/SuperAdminDashboard"
import axios from "axios"

import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export default function SuperAdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and is a super-admin
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        // No token, redirect to login
        router.push("/")
        return
      }

      try {
        // Verify token and get user data
        const response = await axios.get(API_CONFIG.ENDPOINTS.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data

        // Check if user is super-admin or admin
        if (userData.user_type !== "super_admin" && userData.user_type !== "admin") {
          // Not authorized, redirect to login
          console.error("User is not a super-admin")
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          router.push("/")
        }
      } catch (error) {
        // Token invalid or expired
        console.error("Auth error:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  return <SuperAdminDashboard />
}
