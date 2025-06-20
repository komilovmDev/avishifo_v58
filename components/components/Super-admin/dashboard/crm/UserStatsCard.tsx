// src/components/dashboard/crm/UserStatsCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

interface UserStatsCardProps {
  label: string;
  value: number | string;
  colorClasses: string;
}

export function UserStatsCard({ label, value, colorClasses }: UserStatsCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${colorClasses} shadow-md`}>
      <CardContent className="p-3 lg:p-4 text-center">
        <div className="text-lg lg:text-2xl font-bold">{value}</div>
        <div className="text-xs lg:text-sm">{label}</div>
      </CardContent>
    </Card>
  );
}
