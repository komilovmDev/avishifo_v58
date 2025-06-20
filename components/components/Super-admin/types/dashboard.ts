// src/types/dashboard.ts
import type { LucideIcon } from "lucide-react";

export interface SidebarItemType {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export interface NotificationType {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export interface MetricCardType {
  label: string;
  value: number | string;
  change: string;
  color: string;
  // Assuming TrendingUp is always used for these cards as in the original
}

export interface AlertType {
  id: number;
  type: "warning" | "info" | "error";
  message: string;
  time: string;
  resolved: boolean;
}

export interface UserStatsType {
  totalUsers: number;
  admins: number;
  doctors: number;
  patients: number;
  activeToday: number;
  newThisWeek: number;
  premiumUsers: number;
  blockedUsers: number;
}

export interface BaseUserType {
  id: number;
  name: string;
  email: string;
  blocked: boolean;
  status: string; // 'online', 'away', 'offline', 'active', 'inactive'
}

export interface AdminUserType extends BaseUserType {
  role: string;
  lastActive: string;
}

export interface DoctorUserType extends BaseUserType {
  specialty: string;
  patients: number;
  rating: number;
}

export interface PatientUserType extends BaseUserType {
  age: number;
  lastVisit: string;
  plan: "Premium" | "Basic";
}

export type AnyUserType = AdminUserType | DoctorUserType | PatientUserType;

export type UserRoleType = "admin" | "doctor" | "patient";


export interface ChatContactType {
  id: number;
  name: string;
  type: "client" | "admin"; // Or 'user' | 'doctor' | 'support'
  lastMessage: string;
  time: string;
  unread: number;
}

export interface MessageType {
  id: number;
  sender: string;
  content: string;
  time: string;
  isUser: boolean; // True if message is from the current super admin
}

export interface SystemLoadMetricsType {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

export interface LogEntryType {
  id: number;
  type: "info" | "warning" | "error";
  message: string;
  timestamp: string;
  user: string;
}

export interface RequestEntryType {
  id: number;
  user: string;
  type: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "high" | "medium" | "low";
  time: string;
  assignedTo: string;
}

export type ViewMode = "grid" | "list";
