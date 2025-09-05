"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppointmentsManagementSection } from "@/components/Doctors/appointments-management"
import axios from "axios"

import { API_CONFIG } from "../../../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

export default function DoctorAppointmentsPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and is a doctor
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await axios.get(API_CONFIG.ENDPOINTS.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data

        if (userData.user_type !== "doctor") {
          console.error("User is not a doctor")
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          router.push("/")
        }
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-12 px-6">
        <AppointmentsManagementSection />
      </div>
    </div>
  )
}
