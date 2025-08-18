"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import PatientDashboard from "@/components/patient-dashboard"
import axios from "axios"

const API_BASE_URL = "https://new.avishifo.uz"

export default function PatientDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and is a patient
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        // No token, redirect to login
        router.push("/")
        return
      }

      try {
        // Verify token and get user data
        const response = await axios.get(`${API_BASE_URL}/api/accounts/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data

        // Check if user is patient
        if (userData.user_type !== "patient") {
          // Not authorized, redirect to login
          console.error("User is not a patient")
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

  return <PatientDashboard onLogout={handleLogout} />
}
