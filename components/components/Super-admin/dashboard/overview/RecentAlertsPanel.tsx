// src/components/dashboard/overview/RecentAlertsPanel.tsx
"use client";

import { useState } from "react";
import type { AlertType } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

const initialAlerts: AlertType[] = [
  {
    id: 1,
    type: "warning",
    message: "Высокая нагрузка на сервер",
    time: "2 мин назад",
    resolved: false,
  },
  {
    id: 2,
    type: "info",
    message: "Плановое обслуживание завершено",
    time: "15 мин назад",
    resolved: true,
  },
  {
    id: 3,
    type: "error",
    message: "Ошибка подключения к БД",
    time: "1 час назад",
    resolved: false,
  },
];

export function RecentAlertsPanel() {
  const [alerts, setAlerts] = useState<AlertType[]>(initialAlerts);

  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    );
  };

  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-800 text-lg">
          Последние Оповещения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-xl"
            >
              <AlertTriangle
                className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                  alert.type === "error"
                    ? "text-red-400"
                    : alert.type === "warning"
                    ? "text-orange-400"
                    : "text-blue-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm truncate">
                  {alert.message}
                </p>
                <p className="text-gray-400 text-xs">{alert.time}</p>
              </div>
              {!alert.resolved ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                  className="text-xs"
                >
                  Решить
                </Button>
              ) : (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Решено
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
