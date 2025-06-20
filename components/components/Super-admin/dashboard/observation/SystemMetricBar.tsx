// src/components/dashboard/observation/SystemMetricBar.tsx
"use client";

interface SystemMetricBarProps {
  label: string;
  value: number; // Percentage
}

export function SystemMetricBar({ label, value }: SystemMetricBarProps) {
  const getColor = (val: number) => {
    if (val > 80) return "bg-red-500";
    if (val > 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-700 text-sm">{label}</span>
        <span className="text-gray-800 font-medium">
          {Math.round(value)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
