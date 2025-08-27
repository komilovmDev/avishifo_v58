"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Eye,
  BarChart3,
  Activity,
  AlertTriangle,
  TrendingUp,
  Settings,
  Search,
  Bell,
  Grid3X3,
  List,
  Shield,
  Menu,
  X,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Download,
  RefreshCw,
  Send,
  Plus,
  UserPlus,
  MoreHorizontal,
  LogOut,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Новый пользователь зарегистрирован",
      time: "2 мин назад",
      read: false,
    },
    {
      id: 2,
      message: "Системное обновление завершено",
      time: "15 мин назад",
      read: false,
    },
    {
      id: 3,
      message: "Превышен лимит API запросов",
      time: "1 час назад",
      read: true,
    },
  ]);

  const sidebarItems = [
    {
      id: "overview",
      label: "Обзор",
      icon: BarChart3,
      color: "from-blue-600 to-cyan-600",
    },
    {
      id: "crm",
      label: "CRM",
      icon: Users,
      color: "from-purple-600 to-pink-600",
    },
    {
      id: "chat",
      label: "Чат Центр",
      icon: MessageSquare,
      color: "from-green-600 to-emerald-600",
    },
    {
      id: "observation",
      label: "Полное Наблюдение",
      icon: Eye,
      color: "from-orange-600 to-red-600",
    },
    {
      id: "requests",
      label: "Мониторинг Запросов",
      icon: Activity,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm shadow-lg rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8 mt-12 lg:mt-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AviShifo
                </h1>
                <p className="text-sm text-gray-500">Супер Админ</p>
              </div>
            </div>
            <nav className="space-y-3">
              {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12 ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } transition-all duration-200 rounded-xl`}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
                {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Button>
              ))}
            </nav>
          </div>
          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-indigo-600 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Помощь</span>
              </Button>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-400">AviShifo v2.1 © 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="h-20 bg-white/30 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4 lg:gap-6 ml-12 lg:ml-0">
            <h2 className="text-lg lg:text-2xl font-bold truncate">
              {sidebarItems.find((item) => item.id === activeSection)?.label ||
                "Dashboard"}
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Notifications */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900 relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
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
                      onClick={() => markNotificationAsRead(notification.id)}
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

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {activeSection === "overview" && (
            <OverviewSection searchQuery={searchQuery} />
          )}
          {activeSection === "crm" && (
            <CRMSection
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchQuery={searchQuery}
            />
          )}
          {activeSection === "chat" && <ChatHubSection />}
          {activeSection === "observation" && <ObservationSection />}
          {activeSection === "requests" && <RequestsMonitoringSection />}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({ searchQuery }: { searchQuery: string }) {
  const [metrics, setMetrics] = useState([
    {
      label: "Всего Пользователей",
      value: 2847,
      change: "+12%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Активные Чаты",
      value: 156,
      change: "+8%",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Системные Оповещения",
      value: 3,
      change: "-25%",
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Время Работы",
      value: 99.9,
      change: "+0.1%",
      color: "from-purple-500 to-pink-500",
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    // Симуляция API запроса
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMetrics((prev) =>
      prev.map((metric) => ({
        ...metric,
        value:
          metric.label === "Время Работы"
            ? Number.parseFloat((Math.random() * 0.2 + 99.8).toFixed(1))
            : Math.floor(metric.value + Math.random() * 20 - 10),
      }))
    );
    setIsRefreshing(false);
  };

  const exportData = () => {
    const data = metrics.map((m) => `${m.label}: ${m.value}`).join("\n");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metrics.txt";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold">Обзор Системы</h3>
        <div className="flex gap-2">
          <Button
            onClick={refreshMetrics}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Обновить
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-white/90 border-gray-200/50 hover:bg-gray-100 transition-all duration-300 shadow-md cursor-pointer"
          >
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-500 text-xs lg:text-sm truncate">
                    {metric.label}
                  </p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-800">
                    {metric.label === "Время Работы"
                      ? `${metric.value}%`
                      : metric.value.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs lg:text-sm ${
                      metric.change.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {metric.change} с прошлой недели
                  </p>
                </div>
                <div
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-sm flex-shrink-0 ml-2`}
                >
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemActivityChart />
        <RecentAlertsPanel />
      </div>
    </div>
  );
}

function SystemActivityChart() {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-800 text-lg">
          Активность Системы
        </CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1ч</SelectItem>
            <SelectItem value="24h">24ч</SelectItem>
            <SelectItem value="7d">7д</SelectItem>
            <SelectItem value="30d">30д</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-48 lg:h-64 bg-gray-100/50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm lg:text-base">
              График активности за {timeRange}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentAlertsPanel() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      message: "Высокая нагрузка на сервер",
      time: "2 мин назад",
      resolved: false,
    },
    {
      id: 2,
      type: "info",
      message: "Плановое обслуживание завершено",
      time: "15 мин назад",
      resolved: true,
    },
    {
      id: 3,
      type: "error",
      message: "Ошибка подключения к БД",
      time: "1 час назад",
      resolved: false,
    },
  ]);

  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    );
  };

  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-800 text-lg">
          Последние Оповещения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-xl"
            >
              <AlertTriangle
                className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                  alert.type === "error"
                    ? "text-red-400"
                    : alert.type === "warning"
                    ? "text-orange-400"
                    : "text-blue-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm truncate">
                  {alert.message}
                </p>
                <p className="text-gray-400 text-xs">{alert.time}</p>
              </div>
              {!alert.resolved ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                  className="text-xs"
                >
                  Решить
                </Button>
              ) : (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Решено
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CRMSection({
  viewMode,
  setViewMode,
  searchQuery,
}: {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  searchQuery: string;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [stats, setStats] = useState({
    totalUsers: 2847,
    admins: 12,
    doctors: 45,
    patients: 2790,
    activeToday: 156,
    newThisWeek: 23,
    premiumUsers: 89,
    blockedUsers: 3,
  });

  const [adminsList, setAdminsList] = useState([
    {
      id: 1,
      name: "Иван Петров",
      role: "Главный Админ",
      lastActive: "2 мин назад",
      status: "online",
      email: "ivan@medpro.ru",
      blocked: false,
    },
    {
      id: 2,
      name: "Мария Сидорова",
      role: "Модератор",
      lastActive: "15 мин назад",
      status: "online",
      email: "maria@medpro.ru",
      blocked: false,
    },
    {
      id: 3,
      name: "Алексей Козлов",
      role: "Техподдержка",
      lastActive: "1 час назад",
      status: "away",
      email: "alex@medpro.ru",
      blocked: false,
    },
    {
      id: 4,
      name: "Елена Волкова",
      role: "Аналитик",
      lastActive: "3 часа назад",
      status: "offline",
      email: "elena@medpro.ru",
      blocked: false,
    },
  ]);

  const [doctorsList, setDoctorsList] = useState([
    {
      id: 1,
      name: "Др. Анна Смирнова",
      specialty: "Кардиолог",
      patients: 45,
      rating: 4.9,
      status: "online",
      email: "anna@medpro.ru",
      blocked: false,
    },
    {
      id: 2,
      name: "Др. Михаил Попов",
      specialty: "Терапевт",
      patients: 67,
      rating: 4.8,
      status: "online",
      email: "mikhail@medpro.ru",
      blocked: false,
    },
    {
      id: 3,
      name: "Др. Ольга Новикова",
      specialty: "Невролог",
      patients: 32,
      rating: 4.7,
      status: "away",
      email: "olga@medpro.ru",
      blocked: false,
    },
    {
      id: 4,
      name: "Др. Сергей Лебедев",
      specialty: "Психиатр",
      patients: 28,
      rating: 4.9,
      status: "offline",
      email: "sergey@medpro.ru",
      blocked: false,
    },
  ]);

  const [patientsList, setPatientsList] = useState([
    {
      id: 1,
      name: "Анна Иванова",
      age: 32,
      lastVisit: "Сегодня",
      status: "active",
      plan: "Premium",
      email: "anna.i@email.ru",
      blocked: false,
    },
    {
      id: 2,
      name: "Петр Сидоров",
      age: 45,
      lastVisit: "Вчера",
      status: "active",
      plan: "Basic",
      email: "petr@email.ru",
      blocked: false,
    },
    {
      id: 3,
      name: "Мария Козлова",
      age: 28,
      lastVisit: "3 дня назад",
      status: "inactive",
      plan: "Premium",
      email: "maria.k@email.ru",
      blocked: false,
    },
    {
      id: 4,
      name: "Дмитрий Волков",
      age: 52,
      lastVisit: "1 неделю назад",
      status: "inactive",
      plan: "Basic",
      email: "dmitry@email.ru",
      blocked: false,
    },
  ]);

  const blockUser = (type: "admin" | "doctor" | "patient", id: number) => {
    const updateList = (list: any[], setList: any) => {
      setList((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, blocked: !user.blocked } : user
        )
      );
    };

    switch (type) {
      case "admin":
        updateList(adminsList, setAdminsList);
        break;
      case "doctor":
        updateList(doctorsList, setDoctorsList);
        break;
      case "patient":
        updateList(patientsList, setPatientsList);
        break;
    }
  };

  const deleteUser = (type: "admin" | "doctor" | "patient", id: number) => {
    const updateList = (list: any[], setList: any) => {
      setList((prev) => prev.filter((user) => user.id !== id));
    };

    switch (type) {
      case "admin":
        updateList(adminsList, setAdminsList);
        setStats((prev) => ({
          ...prev,
          admins: prev.admins - 1,
          totalUsers: prev.totalUsers - 1,
        }));
        break;
      case "doctor":
        updateList(doctorsList, setDoctorsList);
        setStats((prev) => ({
          ...prev,
          doctors: prev.doctors - 1,
          totalUsers: prev.totalUsers - 1,
        }));
        break;
      case "patient":
        updateList(patientsList, setPatientsList);
        setStats((prev) => ({
          ...prev,
          patients: prev.patients - 1,
          totalUsers: prev.totalUsers - 1,
        }));
        break;
    }
  };

  const filteredData = (data: any[]) => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "blocked" && item.blocked) ||
        (filterStatus === "active" && !item.blocked);
      return matchesSearch && matchesFilter;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800">
          Управление Пользователями
        </h3>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="blocked">Заблокированные</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={`${
              viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-500"
            } w-8 h-8 lg:w-10 lg:h-10`}
          >
            <Grid3X3 className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={`${
              viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-500"
            } w-8 h-8 lg:w-10 lg:h-10`}
          >
            <List className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 lg:gap-4">
        {Object.entries(stats).map(([key, value], index) => {
          const colors = [
            "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
            "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
            "from-green-50 to-green-100 border-green-200 text-green-700",
            "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700",
            "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
            "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
            "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700",
            "from-red-50 to-red-100 border-red-200 text-red-700",
          ];

          const labels = {
            totalUsers: "Всего пользователей",
            admins: "Администраторы",
            doctors: "Доктора",
            patients: "Пациенты",
            activeToday: "Активны сегодня",
            newThisWeek: "Новые за неделю",
            premiumUsers: "Premium",
            blockedUsers: "Заблокированы",
          };

          return (
            <Card
              key={key}
              className={`bg-gradient-to-br ${colors[index]} shadow-md`}
            >
              <CardContent className="p-3 lg:p-4 text-center">
                <div className="text-lg lg:text-2xl font-bold">{value}</div>
                <div className="text-xs lg:text-sm">
                  {labels[key as keyof typeof labels]}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs for different user types */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="admins">Админы ({stats.admins})</TabsTrigger>
          <TabsTrigger value="doctors">Доктора ({stats.doctors})</TabsTrigger>
          <TabsTrigger value="patients">
            Пациенты ({stats.patients})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            adminsList={adminsList}
            doctorsList={doctorsList}
            patientsList={patientsList}
          />
        </TabsContent>

        <TabsContent value="admins">
          <UserManagementTable
            data={filteredData(adminsList)}
            type="admin"
            onBlock={blockUser}
            onDelete={deleteUser}
          />
        </TabsContent>

        <TabsContent value="doctors">
          <UserManagementTable
            data={filteredData(doctorsList)}
            type="doctor"
            onBlock={blockUser}
            onDelete={deleteUser}
          />
        </TabsContent>

        <TabsContent value="patients">
          <UserManagementTable
            data={filteredData(patientsList)}
            type="patient"
            onBlock={blockUser}
            onDelete={deleteUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab({ adminsList, doctorsList, patientsList }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-white/90 border-gray-200/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2 text-base lg:text-lg">
            <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" />
            Последние Администраторы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminsList.slice(0, 3).map((admin: any) => (
              <div
                key={admin.id}
                className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-xl"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-purple-300 text-purple-700 text-xs">
                    {admin.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-medium truncate">
                    {admin.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{admin.role}</p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    admin.status === "online"
                      ? "bg-green-400"
                      : admin.status === "away"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 border-gray-200/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2 text-base lg:text-lg">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
            Топ Доктора
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {doctorsList.slice(0, 3).map((doctor: any) => (
              <div
                key={doctor.id}
                className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-xl"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-green-300 text-green-700 text-xs">
                    {doctor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-medium truncate">
                    {doctor.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {doctor.specialty} • ⭐ {doctor.rating}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 text-xs flex-shrink-0">
                  {doctor.patients}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 border-gray-200/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2 text-base lg:text-lg">
            <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-500" />
            Активные Пациенты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patientsList.slice(0, 3).map((patient: any) => (
              <div
                key={patient.id}
                className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-xl"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-cyan-300 text-cyan-700 text-xs">
                    {patient.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-medium truncate">
                    {patient.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {patient.age} лет • {patient.lastVisit}
                  </p>
                </div>
                <Badge
                  className={`text-xs flex-shrink-0 ${
                    patient.plan === "Premium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {patient.plan}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserManagementTable({
  data,
  type,
  onBlock,
  onDelete,
}: {
  data: any[];
  type: "admin" | "doctor" | "patient";
  onBlock: (type: "admin" | "doctor" | "patient", id: number) => void;
  onDelete: (type: "admin" | "doctor" | "patient", id: number) => void;
}) {
  const [editingUser, setEditingUser] = useState<any>(null);

  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-800 text-base lg:text-lg">
          Список{" "}
          {type === "admin"
            ? "Администраторов"
            : type === "doctor"
            ? "Докторов"
            : "Пациентов"}
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить нового пользователя</DialogTitle>
            </DialogHeader>
            <AddUserForm type={type} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Имя
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                  Email
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Статус
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((user) => (
                <tr key={user.id} className={user.blocked ? "bg-red-50" : ""}>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3">
                        <AvatarFallback
                          className={`text-xs ${
                            type === "admin"
                              ? "bg-purple-300 text-purple-700"
                              : type === "doctor"
                              ? "bg-green-300 text-green-700"
                              : "bg-cyan-300 text-cyan-700"
                          }`}
                        >
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </div>
                        {type === "doctor" && (
                          <div className="text-xs text-gray-500">
                            {user.specialty}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`text-xs ${
                        user.blocked
                          ? "bg-red-100 text-red-700"
                          : user.status === "online"
                          ? "bg-green-100 text-green-700"
                          : user.status === "away"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.blocked
                        ? "Заблокирован"
                        : user.status === "online"
                        ? "Онлайн"
                        : user.status === "away"
                        ? "Отошел"
                        : "Оффлайн"}
                    </Badge>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Редактировать пользователя
                            </DialogTitle>
                          </DialogHeader>
                          <EditUserForm user={editingUser} type={type} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBlock(type, user.id)}
                        className={
                          user.blocked ? "text-green-600" : "text-orange-600"
                        }
                      >
                        {user.blocked ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Ban className="w-3 h-3" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(type, user.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function AddUserForm({ type }: { type: "admin" | "doctor" | "patient" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    specialty: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding user:", formData);
    // Здесь будет логика добавления пользователя
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>

      {type === "admin" && (
        <div>
          <Label htmlFor="role">Роль</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="moderator">Модератор</SelectItem>
              <SelectItem value="support">Техподдержка</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {type === "doctor" && (
        <div>
          <Label htmlFor="specialty">Специальность</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, specialty: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите специальность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiologist">Кардиолог</SelectItem>
              <SelectItem value="therapist">Терапевт</SelectItem>
              <SelectItem value="neurologist">Невролог</SelectItem>
              <SelectItem value="psychiatrist">Психиатр</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>

      <Button type="submit" className="w-full">
        Добавить пользователя
      </Button>
    </form>
  );
}

function EditUserForm({
  user,
  type,
}: {
  user: any;
  type: "admin" | "doctor" | "patient";
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    specialty: user?.specialty || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Editing user:", formData);
    // Здесь будет логика редактирования пользователя
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Имя</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      {type === "admin" && (
        <div>
          <Label htmlFor="edit-role">Роль</Label>
          <Input
            id="edit-role"
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
          />
        </div>
      )}

      {type === "doctor" && (
        <div>
          <Label htmlFor="edit-specialty">Специальность</Label>
          <Input
            id="edit-specialty"
            value={formData.specialty}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, specialty: e.target.value }))
            }
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Сохранить изменения
      </Button>
    </form>
  );
}

function ChatHubSection() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [chats] = useState([
    {
      id: 1,
      name: "Анна Иванова",
      type: "client",
      lastMessage: "Спасибо за помощь!",
      time: "5 мин назад",
      unread: 2,
    },
    {
      id: 2,
      name: "Др. Петров",
      type: "admin",
      lastMessage: "Нужна консультация",
      time: "10 мин назад",
      unread: 0,
    },
    {
      id: 3,
      name: "Мария Козлова",
      type: "client",
      lastMessage: "Когда следующий прием?",
      time: "1 час назад",
      unread: 1,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Анна Иванова",
      content: "Здравствуйте! У меня вопрос по поводу лечения",
      time: "14:30",
      isUser: false,
    },
    {
      id: 2,
      sender: "Супер Админ",
      content: "Здравствуйте! Я вас слушаю",
      time: "14:32",
      isUser: true,
    },
    {
      id: 3,
      sender: "Анна Иванова",
      content: "Спасибо за помощь!",
      time: "14:35",
      isUser: false,
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "Супер Админ",
      content: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1 bg-white/90 border-gray-200/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-800 text-base lg:text-lg">
              Активные Чаты
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-96 overflow-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                    activeChat === chat.id
                      ? "bg-blue-50 border-r-2 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={`text-xs ${
                        chat.type === "admin"
                          ? "bg-purple-300 text-purple-700"
                          : "bg-cyan-300 text-cyan-700"
                      }`}
                    >
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3 bg-white/90 border-gray-200/50 shadow-md flex flex-col">
          {activeChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-cyan-300 text-cyan-700">
                      {chats
                        .find((c) => c.id === activeChat)
                        ?.name.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {chats.find((c) => c.id === activeChat)?.name}
                    </h3>
                    <p className="text-sm text-green-600">Онлайн</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isUser ? "justify-end" : "items-start gap-3"
                      }`}
                    >
                      {!msg.isUser && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-cyan-300 text-cyan-700 text-xs">
                            {msg.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-2xl p-3 max-w-xs ${
                          msg.isUser
                            ? "bg-blue-500 text-white rounded-tr-md"
                            : "bg-gray-100 rounded-tl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            msg.isUser ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите сообщение..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="rounded-full"
                  />
                  <Button
                    size="icon"
                    onClick={sendMessage}
                    className="rounded-full"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Выберите чат для начала общения</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/90 border-gray-200/50 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">Активные разговоры</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-gray-200/50 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">2.3 мин</div>
            <div className="text-sm text-gray-600">Среднее время ответа</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-gray-200/50 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-gray-600">
              Уровень удовлетворенности
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ObservationSection() {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 75,
    memory: 50,
    storage: 33,
    network: 85,
  });

  const [logs, setLogs] = useState([
    {
      id: 1,
      type: "info",
      message: "Пользователь вошел в систему",
      timestamp: "2024-01-15 14:30:00",
      user: "admin@medpro.ru",
    },
    {
      id: 2,
      type: "warning",
      message: "Высокая нагрузка на сервер",
      timestamp: "2024-01-15 14:25:00",
      user: "system",
    },
    {
      id: 3,
      type: "error",
      message: "Ошибка подключения к БД",
      timestamp: "2024-01-15 14:20:00",
      user: "system",
    },
    {
      id: 4,
      type: "info",
      message: "Резервное копирование завершено",
      timestamp: "2024-01-15 14:15:00",
      user: "system",
    },
    {
      id: 5,
      type: "info",
      message: "Новый пользователь зарегистрирован",
      timestamp: "2024-01-15 14:10:00",
      user: "patient@email.ru",
    },
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(
          0,
          Math.min(100, prev.memory + (Math.random() - 0.5) * 5)
        ),
        storage: Math.max(
          0,
          Math.min(100, prev.storage + (Math.random() - 0.5) * 2)
        ),
        network: Math.max(
          0,
          Math.min(100, prev.network + (Math.random() - 0.5) * 15)
        ),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const addLog = () => {
    const newLog = {
      id: logs.length + 1,
      type: "info",
      message: "Ручное обновление системы",
      timestamp: new Date().toLocaleString(),
      user: "super-admin",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Мониторинг Системы</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <Label>Автообновление</Label>
          </div>
          <Button onClick={addLog} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить лог
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Metrics */}
        <Card className="bg-white/90 border-gray-200/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2 text-base lg:text-lg">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
              Состояние Системы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(systemMetrics).map(([key, value]) => {
                const labels = {
                  cpu: "Использование ЦП",
                  memory: "Память",
                  storage: "Хранилище",
                  network: "Сеть",
                };

                const getColor = (val: number) => {
                  if (val > 80) return "bg-red-500";
                  if (val > 60) return "bg-yellow-500";
                  return "bg-green-500";
                };

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 text-sm">
                        {labels[key as keyof typeof labels]}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {Math.round(value)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getColor(
                          value
                        )}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card className="bg-white/90 border-gray-200/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-800 text-base lg:text-lg">
              Журналы Активности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 bg-gray-100/50 rounded-xl"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      log.type === "error"
                        ? "bg-red-400"
                        : log.type === "warning"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm truncate">
                      {log.message}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-gray-500 text-xs">{log.timestamp}</p>
                      <Badge variant="outline" className="text-xs">
                        {log.user}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">1,247</div>
            <div className="text-sm text-blue-600">Активные сессии</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">99.8%</div>
            <div className="text-sm text-green-600">Время работы</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">2.1s</div>
            <div className="text-sm text-purple-600">Время отклика</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">156 GB</div>
            <div className="text-sm text-orange-600">Трафик сегодня</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RequestsMonitoringSection() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      user: "Анна Иванова",
      type: "Запись к врачу",
      description: "Запись на консультацию кардиолога",
      status: "pending",
      priority: "medium",
      time: "2 часа назад",
      assignedTo: "Др. Смирнова",
    },
    {
      id: 2,
      user: "Петр Сидоров",
      type: "Техподдержка",
      description: "Проблема с доступом к личному кабинету",
      status: "in-progress",
      priority: "high",
      time: "1 час назад",
      assignedTo: "Техподдержка",
    },
    {
      id: 3,
      user: "Мария Козлова",
      type: "Жалоба",
      description: "Некорректная работа системы оплаты",
      status: "resolved",
      priority: "low",
      time: "3 часа назад",
      assignedTo: "Администратор",
    },
    {
      id: 4,
      user: "Др. Петров",
      type: "Запрос данных",
      description: "Экспорт статистики пациентов",
      status: "pending",
      priority: "medium",
      time: "30 мин назад",
      assignedTo: "Не назначен",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const updateRequestStatus = (id: number, newStatus: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const assignRequest = (id: number, assignee: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, assignedTo: assignee } : req
      )
    );
  };

  const filteredRequests = requests.filter((req) => {
    const statusMatch = filterStatus === "all" || req.status === filterStatus;
    const priorityMatch =
      filterPriority === "all" || req.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800">
          Мониторинг Запросов
        </h3>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидание</SelectItem>
              <SelectItem value="in-progress">В работе</SelectItem>
              <SelectItem value="resolved">Решено</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все приоритеты</SelectItem>
              <SelectItem value="high">Высокий</SelectItem>
              <SelectItem value="medium">Средний</SelectItem>
              <SelectItem value="low">Низкий</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Request Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {requests.filter((r) => r.status === "pending").length}
            </div>
            <div className="text-sm text-yellow-600">Ожидают</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {requests.filter((r) => r.status === "in-progress").length}
            </div>
            <div className="text-sm text-blue-600">В работе</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {requests.filter((r) => r.status === "resolved").length}
            </div>
            <div className="text-sm text-green-600">Решено</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-700">
              {requests.filter((r) => r.priority === "high").length}
            </div>
            <div className="text-sm text-red-600">Высокий приоритет</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="bg-white/90 border-gray-200/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800 text-base lg:text-lg">
            Все Запросы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Пользователь
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                    Тип
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                    Описание
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Статус
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                    Приоритет
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm font-medium text-gray-900">
                        {request.user}
                      </div>
                      <div className="text-xs text-gray-500">
                        {request.time}
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden sm:table-cell">
                      {request.type}
                    </td>
                    <td className="px-3 lg:px-6 py-4 hidden md:table-cell">
                      <div className="text-xs lg:text-sm text-gray-900 max-w-xs truncate">
                        {request.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        Назначен: {request.assignedTo}
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <Select
                        value={request.status}
                        onValueChange={(value) =>
                          updateRequestStatus(request.id, value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <Badge
                            className={`text-xs ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status === "pending"
                              ? "Ожидание"
                              : request.status === "in-progress"
                              ? "В работе"
                              : "Решено"}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Ожидание</SelectItem>
                          <SelectItem value="in-progress">В работе</SelectItem>
                          <SelectItem value="resolved">Решено</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <Badge
                        className={`text-xs ${getPriorityColor(
                          request.priority
                        )}`}
                      >
                        {request.priority === "high"
                          ? "Высокий"
                          : request.priority === "medium"
                          ? "Средний"
                          : "Низкий"}
                      </Badge>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Управление запросом</DialogTitle>
                          </DialogHeader>
                          <RequestDetailsForm
                            request={request}
                            onAssign={assignRequest}
                          />
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RequestDetailsForm({
  request,
  onAssign,
}: {
  request: any;
  onAssign: (id: number, assignee: string) => void;
}) {
  const [assignee, setAssignee] = useState(request.assignedTo);
  const [notes, setNotes] = useState("");

  const handleAssign = () => {
    onAssign(request.id, assignee);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Пользователь</Label>
        <p className="text-sm text-gray-600">{request.user}</p>
      </div>

      <div>
        <Label>Тип запроса</Label>
        <p className="text-sm text-gray-600">{request.type}</p>
      </div>

      <div>
        <Label>Описание</Label>
        <p className="text-sm text-gray-600">{request.description}</p>
      </div>

      <div>
        <Label htmlFor="assignee">Назначить</Label>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Не назначен">Не назначен</SelectItem>
            <SelectItem value="Др. Смирнова">Др. Смирнова</SelectItem>
            <SelectItem value="Техподдержка">Техподдержка</SelectItem>
            <SelectItem value="Администратор">Администратор</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Заметки</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Добавить заметку..."
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleAssign} className="flex-1">
          Сохранить
        </Button>
        <Button variant="outline" className="flex-1">
          Отправить уведомление
        </Button>
      </div>
    </div>
  );
}
