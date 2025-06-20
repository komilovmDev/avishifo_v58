// src/components/dashboard/requests/RequestStatsCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

interface RequestStatsCardProps {
  value: number;
  label: string;
  gradientClasses: string; // e.g., "from-yellow-50 to-yellow-100 border-yellow-200"
  textColorClass: string; // e.g., "text-yellow-700"
  labelColorClass: string; // e.g., "text-yellow-600"
}

export function RequestStatsCard({
  value,
  label,
  gradientClasses,
  textColorClass,
  labelColorClass
}: RequestStatsCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradientClasses}`}>
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${textColorClass}`}>{value}</div>
        <div className={`text-sm ${labelColorClass}`}>{label}</div>
      </CardContent>
    </Card>
  );
}
