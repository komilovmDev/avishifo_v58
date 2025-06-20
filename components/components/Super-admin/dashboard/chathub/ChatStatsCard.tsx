// src/components/dashboard/chathub/ChatStatsCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ChatStatsCardProps {
  value: string | number;
  label: string;
  valueColorClass?: string; // e.g., "text-blue-600"
}

export function ChatStatsCard({ value, label, valueColorClass = "text-gray-800" }: ChatStatsCardProps) {
  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardContent className="p-6 text-center">
        <div className={`text-2xl font-bold ${valueColorClass}`}>{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </CardContent>
    </Card>
  );
}
