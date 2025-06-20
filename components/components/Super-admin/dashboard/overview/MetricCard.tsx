// src/components/dashboard/overview/MetricCard.tsx
"use client";

import type { MetricCardType } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react"; // Assuming this icon is standard for these cards

interface MetricCardProps {
  metric: MetricCardType;
}

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className="bg-white/90 border-gray-200/50 hover:bg-gray-100 transition-all duration-300 shadow-md cursor-pointer">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs lg:text-sm truncate">
              {metric.label}
            </p>
            <p className="text-xl lg:text-2xl font-bold text-gray-800">
              {metric.label === "Время Работы" && typeof metric.value === 'number'
                ? `${metric.value}%`
                : typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
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
  );
}
