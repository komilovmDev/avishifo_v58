"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User, UserCheck, Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Define the API base URL 2
import { API_CONFIG } from "../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

type UserType = "doctor" | "patient" | "super-admin"

interface LoginPageProps {
  onLogin: (userType: UserType, userData: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<UserType>("doctor")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Demo credentials for quick testing
  const demoCredentials = {
    doctor: { username: "doctor", password: "doctor123" },
    patient: { username: "patient", password: "patient123" },
    "super-admin": { username: "admin", password: "admin123" },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!username.trim()) {
      setError("Пожалуйста, введите имя пользователя")
      return
    }

    if (!password.trim()) {
      setError("Пожалуйста, введите пароль")
      return
    }

    setIsLoading(true)

    try {
      // Make API call to login endpoint
      const response = await axios.post(API_CONFIG.ENDPOINTS.LOGIN, {
        username: username, // Using email as username
        password: password,
      })

      // Get the token from response
      const { access, refresh } = response.data

      // Store tokens in localStorage
      localStorage.setItem("accessToken", access)
      localStorage.setItem("refreshToken", refresh)

      // Get user profile data
      const userResponse = await axios.get(API_CONFIG.ENDPOINTS.PROFILE, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })

      const userData = userResponse.data

      // Map backend user_type to frontend user types
      let frontendUserType: UserType

      switch (userData.user_type) {
        case "doctor":
          frontendUserType = "doctor"
          break
        case "patient":
          frontendUserType = "patient"
          break
        case "super_admin":
        case "admin":
          frontendUserType = "super-admin"
          break
        default:
          frontendUserType = "patient"
      }

      // Call onLogin with the user data and mapped user type
      onLogin(frontendUserType, userData)
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.response && err.response.data) {
        // Handle specific API error messages
        if (err.response.data.detail) {
          setError(err.response.data.detail)
        } else if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0])
        } else {
          setError("Неверный email или пароль")
        }
      } else {
        setError("Ошибка соединения с сервером. Пожалуйста, попробуйте позже.")
      }
      setIsLoading(false)
    }
  }

  const getUserName = (userType: UserType) => {
    switch (userType) {
      case "doctor":
        return "Доктор Иванов"
      case "patient":
        return "Пациент Петров"
      case "super-admin":
        return "Администратор Сидоров"
      default:
        return ""
    }
  }

  const fillDemoCredentials = () => {
    const credentials = demoCredentials[activeTab]
    setUsername(credentials.username)
    setPassword(credentials.password)
  }

  const getTabIcon = (tab: UserType) => {
    switch (tab) {
      case "doctor":
        return <UserCheck className="w-4 h-4 mr-2" />
      case "patient":
        return <User className="w-4 h-4 mr-2" />
      case "super-admin":
        return <Shield className="w-4 h-4 mr-2" />
    }
  }

  const getTabTitle = (tab: UserType) => {
    switch (tab) {
      case "doctor":
        return "Врач"
      case "patient":
        return "Пациент"
      case "super-admin":
        return "Администратор"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <img className="w-[100px]" src="/logologin.png" alt="" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AviShifo
              </h1>
              <p className="text-sm text-gray-500">Медицинская информационная система</p>
            </div>
          </div>
        </div>

        <Card className="border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Вход в систему</CardTitle>
            <CardDescription className="text-center">
              Выберите тип пользователя и введите данные для входа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="doctor" value={activeTab} onValueChange={(value) => setActiveTab(value as UserType)}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="doctor" className="flex items-center">
                  {getTabIcon("doctor")}
                  {getTabTitle("doctor")}
                </TabsTrigger>
                <TabsTrigger value="patient" className="flex items-center">
                  {getTabIcon("patient")}
                  {getTabTitle("patient")}
                </TabsTrigger>
                <TabsTrigger value="super-admin" className="flex items-center">
                  {getTabIcon("super-admin")}
                  {getTabTitle("super-admin")}
                </TabsTrigger>
              </TabsList>

              {["doctor", "patient", "super-admin"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Имя пользователя</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="sr-only">{showPassword ? "Скрыть пароль" : "Показать пароль"}</span>
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Вход...
                        </>
                      ) : (
                        "Войти"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              <Link href={'https://www.avishifo.uz/contact'}>
                <Button variant="link" onClick={fillDemoCredentials} className="text-sm text-gray-500">
                  Зарегистрироваться
                </Button>
              </Link>
            </div>
            <div className="text-center text-xs text-gray-500">
              <p>
                Забыли пароль?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Восстановить
                </a>
              </p>
            </div>
          </CardFooter>
        </Card>
        <p className="text-center text-xs text-gray-500 mt-8">© 2024 AviShifo. Все права защищены.</p>
      </div>
    </div>
  )
}
