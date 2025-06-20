// src/components/dashboard/observation/ObservationSection.tsx
"use client";

import { useState, useEffect } from "react";
import type { SystemLoadMetricsType, LogEntryType } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Activity, Plus } from "lucide-react";
import { SystemMetricBar } from "./SystemMetricBar";
import { ActivityLogItem } from "./ActivityLogItem";
import { RealtimeStatCard } from "./RealtimeStatCard";

const initialSystemMetrics: SystemLoadMetricsType = {
  cpu: 75,
  memory: 50,
  storage: 33,
  network: 85,
};

const initialLogs: LogEntryType[] = [
  { id: 1, type: "info", message: "Пользователь вошел в систему", timestamp: "2024-01-15 14:30:00", user: "admin@medpro.ru" },
  { id: 2, type: "warning", message: "Высокая нагрузка на сервер", timestamp: "2024-01-15 14:25:00", user: "system" },
  { id: 3, type: "error", message: "Ошибка подключения к БД", timestamp: "2024-01-15 14:20:00", user: "system" },
  { id: 4, type: "info", message: "Резервное копирование завершено", timestamp: "2024-01-15 14:15:00", user: "system" },
  { id: 5, type: "info", message: "Новый пользователь зарегистрирован", timestamp: "2024-01-15 14:10:00", user: "patient@email.ru" },
];

const systemMetricLabels: Record<keyof SystemLoadMetricsType, string> = {
  cpu: "Использование ЦП",
  memory: "Память",
  storage: "Хранилище",
  network: "Сеть",
};

export function ObservationSection() {
  const [systemMetrics, setSystemMetrics] = useState<SystemLoadMetricsType>(initialSystemMetrics);
  const [logs, setLogs] = useState<LogEntryType[]>(initialLogs);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0,Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        storage: Math.max(0, Math.min(100, prev.storage + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const addLog = () => {
    const newLog: LogEntryType = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      type: "info",
      message: "Ручное обновление системы",
      timestamp: new Date().toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'medium'}),
      user: "super-admin",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold">Мониторинг Системы</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="autoRefreshObservation" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <Label htmlFor="autoRefreshObservation">Автообновление</Label>
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
              {Object.entries(systemMetrics).map(([key, value]) => (
                <SystemMetricBar
                  key={key}
                  label={systemMetricLabels[key as keyof SystemLoadMetricsType]}
                  value={value}
                />
              ))}
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
                <ActivityLogItem key={log.id} log={log} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealtimeStatCard
            value="1,247"
            label="Активные сессии"
            gradientClasses="from-blue-50 to-blue-100 border-blue-200"
            textColorClass="text-blue-700"
            labelColorClass="text-blue-600"
        />
        <RealtimeStatCard
            value="99.8%"
            label="Время работы"
            gradientClasses="from-green-50 to-green-100 border-green-200"
            textColorClass="text-green-700"
            labelColorClass="text-green-600"
        />
        <RealtimeStatCard
            value="2.1s"
            label="Время отклика"
            gradientClasses="from-purple-50 to-purple-100 border-purple-200"
            textColorClass="text-purple-700"
            labelColorClass="text-purple-600"
        />
        <RealtimeStatCard
            value="156 GB"
            label="Трафик сегодня"
            gradientClasses="from-orange-50 to-orange-100 border-orange-200"
            textColorClass="text-orange-700"
            labelColorClass="text-orange-600"
        />
      </div>
    </div>
  );
}
