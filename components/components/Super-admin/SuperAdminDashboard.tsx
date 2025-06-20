// src/app/dashboard/super-admin/page.tsx (или где у вас лежит SuperAdminDashboard)
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { SidebarItemType, NotificationType, ViewMode } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquare,
  Eye,
  BarChart3,
  Activity,
  Menu,
  X,
} from "lucide-react"; // Add other icons as needed for sidebarItems

// Import Components
import { Sidebar } from "./dashboard/Sidebar";
import { TopBar } from "./dashboard/TopBar";
import { OverviewSection } from "./dashboard/overview/OverviewSection";
import { CRMSection } from "./dashboard/crm/CRMSection";
import { ChatHubSection } from "./dashboard/chathub/ChatHubSection";
import { ObservationSection } from "./dashboard/observation/ObservationSection";
import { RequestsMonitoringSection } from "./dashboard/observation/RequestsMonitoringSection";

const initialSidebarItems: SidebarItemType[] = [
  { id: "overview", label: "Обзор", icon: BarChart3, color: "from-blue-600 to-cyan-600" },
  { id: "crm", label: "CRM", icon: Users, color: "from-purple-600 to-pink-600" },
  { id: "chat", label: "Чат Центр", icon: MessageSquare, color: "from-green-600 to-emerald-600" },
  { id: "observation", label: "Полное Наблюдение", icon: Eye, color: "from-orange-600 to-red-600" },
  { id: "requests", label: "Мониторинг Запросов", icon: Activity, color: "from-emerald-500 to-teal-500" },
];

const initialNotifications: NotificationType[] = [
  { id: 1, message: "Новый пользователь зарегистрирован", time: "2 мин назад", read: false },
  { id: 2, message: "Системное обновление завершено", time: "15 мин назад", read: false },
  { id: 3, message: "Превышен лимит API запросов", time: "1 час назад", read: true },
];

export default function SuperAdminDashboardPage() { // Renamed for Next.js page convention
  const [activeSection, setActiveSection] = useState("overview");
  const [viewMode, setViewMode] = useState<ViewMode>("grid"); // For CRM section
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);

  const sidebarItems = initialSidebarItems; // Could be fetched or static

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeSectionLabel = sidebarItems.find((item) => item.id === activeSection)?.label || "Dashboard";

  // Close sidebar on route change (if using Next.js router and sections were routes)
  // useEffect(() => {
  //   setSidebarOpen(false);
  // }, [activeSection]);


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
        <Sidebar
          sidebarItems={sidebarItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onSidebarClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden"> {/* Added overflow-hidden */}
        <TopBar
          activeSectionLabel={activeSectionLabel}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          notifications={notifications}
          unreadNotificationCount={unreadCount}
          onMarkNotificationAsRead={markNotificationAsRead}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto"> {/* Ensure this scrolls */}
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

// Make sure this is the default export if it's a page component in Next.js
// export default SuperAdminDashboardPage;
