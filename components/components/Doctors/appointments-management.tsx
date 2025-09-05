"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  MessageSquare,
  Search,
  ChevronDown,
  Send,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

import { API_CONFIG } from "../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL

interface AppointmentType {
  id: number
  patient_name: string
  patient_age: number | null
  patient_phone: string
  patient_email: string
  doctor_name: string
  requested_date: string
  requested_time: string
  reason: string
  description: string
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled"
  priority: "low" | "normal" | "high" | "urgent"
  patient_history_notes: string
  confirmed_at: string | null
  rejected_at: string | null
  rejection_reason: string
  created_at: string
  updated_at: string
}

interface StatsType {
  total: number
  pending: number
  confirmed: number
  rejected: number
  high_priority: number
}

export function AppointmentsManagementSection() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null)
  const [rejectionMessage, setRejectionMessage] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    high_priority: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("accessToken")
  }

  // API request helper
  const apiRequest = async (url: string, options: any = {}) => {
    const token = getAuthToken()
    return axios({
      url: `${API_BASE_URL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })
  }

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchQuery) params.append("search", searchQuery)
      if (filterStatus !== "all") params.append("priority", filterStatus)

      const response = await apiRequest(`/api/appointments/appointments/?${params.toString()}`)
      setAppointments(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить записи",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await apiRequest("/api/appointments/appointments/stats/")
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  // Initial load
  useEffect(() => {
    fetchAppointments()
    fetchStats()
  }, [])

  // Refresh data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAppointments()
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery, filterStatus])

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchAppointments(), fetchStats()])
    setRefreshing(false)
    toast({
      title: "Обновлено",
      description: "Данные успешно обновлены",
    })
  }

  // Accept appointment
  const handleAcceptAppointment = async (appointmentId: number) => {
    try {
      await apiRequest(`/api/appointments/appointments/${appointmentId}/accept/`, {
        method: "POST",
      })

      toast({
        title: "Успешно",
        description: "Запись подтверждена",
      })

      await fetchAppointments()
      await fetchStats()
    } catch (error) {
      console.error("Error accepting appointment:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось подтвердить запись",
        variant: "destructive",
      })
    }
  }

  // Reject appointment
  const handleRejectAppointment = async (appointmentId: number, reason: string) => {
    try {
      await apiRequest(`/api/appointments/appointments/${appointmentId}/reject/`, {
        method: "POST",
        data: { rejection_reason: reason },
      })

      toast({
        title: "Успешно",
        description: "Запись отклонена",
      })

      setShowRejectionDialog(false)
      setRejectionMessage("")
      setSelectedAppointment(null)

      await fetchAppointments()
      await fetchStats()
    } catch (error) {
      console.error("Error rejecting appointment:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось отклонить запись",
        variant: "destructive",
      })
    }
  }

  const openRejectionDialog = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment)
    setShowRejectionDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает"
      case "confirmed":
        return "Подтверждено"
      case "rejected":
        return "Отклонено"
      case "completed":
        return "Завершено"
      case "cancelled":
        return "Отменено"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Срочный"
      case "high":
        return "Высокий"
      case "normal":
        return "Обычный"
      case "low":
        return "Низкий"
      default:
        return priority
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesTab = activeTab === "all" || appointment.status === activeTab
    const matchesSearch =
      appointment.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || appointment.priority === filterStatus

    return matchesTab && matchesSearch && matchesFilter
  })

  const getTabCount = (status: string) => {
    if (status === "all") return stats.total
    return stats[status as keyof StatsType] || 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Загрузка записей...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Записи Пациентов
            </h2>
            <p className="text-gray-500 text-xl">Управление запросами на запись и подтвержденными приемами</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="h-14 px-6 rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
          >
            <RefreshCw className={`w-5 h-5 mr-3 ${refreshing ? "animate-spin" : ""}`} />
            Обновить
          </Button>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-52 h-14 rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue placeholder="Приоритет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все приоритеты</SelectItem>
              <SelectItem value="urgent">Срочный</SelectItem>
              <SelectItem value="high">Высокий</SelectItem>
              <SelectItem value="normal">Обычный</SelectItem>
              <SelectItem value="low">Низкий</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Поиск записей..."
              className="pl-12 w-80 h-14 rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-amber-700 mb-1">{stats.pending}</div>
            <div className="text-sm text-amber-600 font-medium">Ожидают подтверждения</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.confirmed}</div>
            <div className="text-sm text-emerald-600 font-medium">Подтверждено</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 border-rose-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-500/25">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-rose-700 mb-1">{stats.rejected}</div>
            <div className="text-sm text-rose-600 font-medium">Отклонено</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{stats.high_priority}</div>
            <div className="text-sm text-blue-600 font-medium">Высокий приоритет</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full h-14 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-2 shadow-inner">
          <TabsTrigger
            value="all"
            className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 transition-all duration-200"
          >
            Все ({getTabCount("all")})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 transition-all duration-200"
          >
            Ожидают ({getTabCount("pending")})
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 transition-all duration-200"
          >
            Подтверждено ({getTabCount("confirmed")})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 transition-all duration-200"
          >
            Отклонено ({getTabCount("rejected")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-8">
          <div className="space-y-6">
            {filteredAppointments.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200/50 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">Записей не найдено</h3>
                  <p className="text-gray-500 text-lg">Попробуйте изменить фильтры или поисковый запрос</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onAccept={handleAcceptAppointment}
                  onReject={openRejectionDialog}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  getStatusLabel={getStatusLabel}
                  getPriorityLabel={getPriorityLabel}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white to-gray-50/50 border-gray-200/50 shadow-2xl rounded-2xl">
          <DialogHeader className="pb-6 border-b border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">Отклонить запись</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div>
              <Label htmlFor="rejection-reason" className="text-sm font-bold text-gray-700 mb-3 block">
                Причина отклонения
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="Укажите причину отклонения записи..."
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                className="rounded-xl border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-md transition-all duration-200"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectionDialog(false)
                  setRejectionMessage("")
                  setSelectedAppointment(null)
                }}
                className="rounded-xl border-gray-200/50 hover:bg-gray-50/80 transition-all duration-200"
              >
                Отмена
              </Button>
              <Button
                onClick={() => {
                  if (selectedAppointment && rejectionMessage.trim()) {
                    handleRejectAppointment(selectedAppointment.id, rejectionMessage)
                  }
                }}
                disabled={!rejectionMessage.trim()}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl rounded-xl transition-all duration-200"
              >
                <Send className="w-4 h-4 mr-2" />
                Отклонить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AppointmentCard({
  appointment,
  onAccept,
  onReject,
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
}: {
  appointment: AppointmentType
  onAccept: (id: number) => void
  onReject: (appointment: AppointmentType) => void
  getStatusColor: (status: string) => string
  getPriorityColor: (priority: string) => string
  getStatusLabel: (status: string) => string
  getPriorityLabel: (priority: string) => string
}) {
  const [showDetails, setShowDetails] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU")
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div
        className={`h-1 bg-gradient-to-r ${
          appointment.priority === "urgent" || appointment.priority === "high"
            ? "from-red-400 to-pink-500"
            : appointment.priority === "normal"
              ? "from-blue-400 to-indigo-500"
              : "from-gray-400 to-slate-500"
        }`}
      ></div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-lg font-bold">
                {appointment.patient_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{appointment.patient_name}</h3>
              <p className="text-gray-500 font-medium">
                {appointment.patient_age ? `${appointment.patient_age} лет` : "Возраст не указан"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getPriorityColor(appointment.priority)} px-3 py-1 rounded-full font-medium shadow-sm`}>
              {getPriorityLabel(appointment.priority)}
            </Badge>
            <Badge className={`${getStatusColor(appointment.status)} px-3 py-1 rounded-full font-medium shadow-sm`}>
              {getStatusLabel(appointment.status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Дата</span>
                <p className="font-bold text-gray-900">{formatDate(appointment.requested_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Время</span>
                <p className="font-bold text-gray-900">{appointment.requested_time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Причина</span>
                <p className="font-bold text-gray-900">{appointment.reason}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Телефон</span>
                <p className="font-bold text-gray-900">{appointment.patient_phone || "Не указан"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Email</span>
                <p className="font-bold text-gray-900 text-sm">{appointment.patient_email || "Не указан"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center shadow-md">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Создано</span>
                <p className="font-bold text-gray-900">{formatDateTime(appointment.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50">
          <p className="text-sm text-gray-600 mb-2 font-medium">Описание:</p>
          <p className="text-gray-800 leading-relaxed">{appointment.description}</p>
        </div>

        {/* Additional Details */}
        <div className="border-t border-gray-200/50 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="mb-4 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
          >
            {showDetails ? "Скрыть детали" : "Показать детали"}
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
            />
          </Button>

          {showDetails && (
            <div className="space-y-3 bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200/50 shadow-inner">
              {appointment.patient_history_notes && (
                <div className="p-4 bg-white/80 rounded-xl shadow-sm">
                  <p className="text-sm font-bold text-gray-700 mb-2">История пациента:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{appointment.patient_history_notes}</p>
                </div>
              )}

              {appointment.status === "confirmed" && appointment.confirmed_at && (
                <div className="p-4 bg-green-50/80 rounded-xl border border-green-200/50">
                  <p className="text-sm font-bold text-green-700 mb-2">Подтверждено:</p>
                  <p className="text-sm text-green-600">{formatDateTime(appointment.confirmed_at)}</p>
                </div>
              )}

              {appointment.status === "rejected" && appointment.rejection_reason && (
                <div className="p-4 bg-red-50/80 rounded-xl border border-red-200/50">
                  <p className="text-sm font-bold text-red-700 mb-2">Причина отклонения:</p>
                  <p className="text-sm text-red-600 leading-relaxed">{appointment.rejection_reason}</p>
                  {appointment.rejected_at && (
                    <p className="text-xs text-red-500 mt-2">Отклонено: {formatDateTime(appointment.rejected_at)}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {appointment.status === "pending" && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200/50">
            <Button
              onClick={() => onAccept(appointment.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 rounded-xl py-2 font-semibold"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Принять
            </Button>
            <Button
              variant="destructive"
              onClick={() => onReject(appointment)}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 rounded-xl py-2 font-semibold"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Отклонить
            </Button>
          </div>
        )}

        {appointment.status === "confirmed" && (
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-2 p-3 bg-green-50/80 rounded-xl border border-green-200/50">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-700 font-bold">Запись подтверждена</span>
            </div>
          </div>
        )}

        {appointment.status === "rejected" && (
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-2 p-3 bg-red-50/80 rounded-xl border border-red-200/50">
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-rose-500 rounded-lg flex items-center justify-center shadow-md">
                <XCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-red-700 font-bold">Запись отклонена</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
