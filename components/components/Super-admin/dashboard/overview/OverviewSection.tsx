// src/components/dashboard/overview/OverviewSection.tsx
"use client";

import { useState } from "react";
import type { MetricCardType } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { SystemActivityChart } from "./SystemActivityChart";
import { RecentAlertsPanel } from "./RecentAlertsPanel";

const initialMetrics: MetricCardType[] = [
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
];

interface OverviewSectionProps {
  searchQuery: string; // Though not used in this section's current implementation, kept for consistency if needed
}

export function OverviewSection({ searchQuery }: OverviewSectionProps) {
  const [metrics, setMetrics] = useState<MetricCardType[]>(initialMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMetrics((prev) =>
      prev.map((metric) => ({
        ...metric,
        value:
          metric.label === "Время Работы"
            ? Number.parseFloat((Math.random() * 0.2 + 99.8).toFixed(1))
            : typeof metric.value === 'number' ? Math.floor(metric.value + Math.random() * 20 - 10) : metric.value,
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
    URL.revokeObjectURL(url);
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
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemActivityChart />
        <RecentAlertsPanel />
      </div>
    </div>
  );
}
