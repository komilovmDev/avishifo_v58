// src/components/dashboard/observation/RealtimeStatCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

interface RealtimeStatCardProps {
  value: string | number;
  label: string;
  gradientClasses: string; // e.g., "from-blue-50 to-blue-100 border-blue-200"
  textColorClass: string; // e.g., "text-blue-700"
  labelColorClass: string; // e.g., "text-blue-600"
}

export function RealtimeStatCard({
  value,
  label,
  gradientClasses,
  textColorClass,
  labelColorClass
}: RealtimeStatCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradientClasses}`}>
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${textColorClass}`}>{value}</div>
        <div className={`text-sm ${labelColorClass}`}>{label}</div>
      </CardContent>
    </Card>
  );
}
