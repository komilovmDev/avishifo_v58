// src/components/dashboard/overview/SystemActivityChart.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

export function SystemActivityChart() {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-800 text-lg">
          Активность Системы
        </CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1ч</SelectItem>
            <SelectItem value="24h">24ч</SelectItem>
            <SelectItem value="7d">7д</SelectItem>
            <SelectItem value="30d">30д</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-48 lg:h-64 bg-gray-100/50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm lg:text-base">
              График активности за {timeRange}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
