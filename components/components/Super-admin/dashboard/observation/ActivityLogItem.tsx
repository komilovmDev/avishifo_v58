// src/components/dashboard/observation/ActivityLogItem.tsx
"use client";

import type { LogEntryType } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";

interface ActivityLogItemProps {
  log: LogEntryType;
}

export function ActivityLogItem({ log }: ActivityLogItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-100/50 rounded-xl">
      <div
        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
          log.type === "error"
            ? "bg-red-400"
            : log.type === "warning"
            ? "bg-yellow-400"
            : "bg-blue-400" // info
        }`}
      ></div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 text-sm truncate">{log.message}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-500 text-xs">{log.timestamp}</p>
          <Badge variant="outline" className="text-xs">
            {log.user}
          </Badge>
        </div>
      </div>
    </div>
  );
}
