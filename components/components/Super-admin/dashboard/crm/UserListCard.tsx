// src/components/dashboard/crm/UserListCard.tsx
"use client";

import type React from "react";
import type { AdminUserType, DoctorUserType, PatientUserType, AnyUserType } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Activity, LucideIcon } from "lucide-react"; // Adjust icons as needed

interface UserListCardProps {
  title: string;
  Icon: LucideIcon;
  iconColor: string;
  users: AnyUserType[];
  userType: "admin" | "doctor" | "patient";
}

export function UserListCard({ title, Icon, iconColor, users, userType }: UserListCardProps) {
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader>
        <CardTitle className={`text-gray-800 flex items-center gap-2 text-base lg:text-lg`}>
          <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-xl"
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback
                  className={`text-xs ${
                    userType === "admin"
                      ? "bg-purple-300 text-purple-700"
                      : userType === "doctor"
                      ? "bg-green-300 text-green-700"
                      : "bg-cyan-300 text-cyan-700"
                  }`}
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm font-medium truncate">
                  {user.name}
                </p>
                {userType === "admin" && (
                  <p className="text-gray-500 text-xs truncate">{(user as AdminUserType).role}</p>
                )}
                {userType === "doctor" && (
                  <p className="text-gray-500 text-xs truncate">
                    {(user as DoctorUserType).specialty} • ⭐ {(user as DoctorUserType).rating}
                  </p>
                )}
                {userType === "patient" && (
                  <p className="text-gray-500 text-xs truncate">
                    {(user as PatientUserType).age} лет • {(user as PatientUserType).lastVisit}
                  </p>
                )}
              </div>
              {userType === "doctor" && (
                <Badge className="bg-blue-100 text-blue-700 text-xs flex-shrink-0">
                  {(user as DoctorUserType).patients}
                </Badge>
              )}
              {userType === "patient" && (
                <Badge
                  className={`text-xs flex-shrink-0 ${
                    (user as PatientUserType).plan === "Premium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {(user as PatientUserType).plan}
                </Badge>
              )}
               {userType === "admin" && user.status && (
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    user.status === "online"
                      ? "bg-green-400"
                      : user.status === "away"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
