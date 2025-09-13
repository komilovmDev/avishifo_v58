// /app/patients/components/tabs/VitalsTab.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Patient } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Plus } from "lucide-react"
import { API_CONFIG } from "@/config/api"

interface BackendVitalSign {
  id: number;
  measurement_time: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature_celsius?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  height_cm?: number;
  weight_kg?: number;
  notes?: string;
  created_at: string;
  medical_record: number;
}

interface VitalsTabProps {
  patient: Patient;
  onOpenAddVitalsDialog: () => void;
  onAddVitalSign?: (vitalSignData: any) => Promise<void>;
  onDeleteVitalSign?: (vitalSignId: string) => Promise<void>;
}

export function VitalsTab({ patient, onOpenAddVitalsDialog, onAddVitalSign, onDeleteVitalSign }: VitalsTabProps) {
  const [backendVitalSigns, setBackendVitalSigns] = useState<BackendVitalSign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load vital signs from backend
  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Fetch vital signs filtered by patient ID
        const response = await fetch(`${API_CONFIG.ENDPOINTS.VITAL_SIGNS}?patient_id=${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Backend vital signs response for patient:", patient.id, data);
          
          // Handle Django REST Framework pagination format
          let vitalSigns = [];
          if (data.results && Array.isArray(data.results)) {
            // Paginated response
            vitalSigns = data.results;
          } else if (Array.isArray(data)) {
            // Direct array response
            vitalSigns = data;
          } else {
            console.warn("Unexpected vital signs data format:", data);
            setBackendVitalSigns([]);
            return;
          }
          
          console.log("Vital signs for patient:", patient.id, vitalSigns);
          setBackendVitalSigns(vitalSigns);
        } else if (response.status === 404) {
          // Patient has no medical records or vital signs
          console.log("No vital signs found for patient:", patient.id);
          setBackendVitalSigns([]);
        } else {
          console.error("Failed to fetch vital signs:", response.status);
          setBackendVitalSigns([]);
        }
      } catch (error) {
        console.error("Error loading vital signs from backend:", error);
        setBackendVitalSigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitalSigns();
  }, [patient.id]);

  // Function to refresh vital signs from backend
  const refreshVitalSigns = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch vital signs filtered by patient ID
      const response = await fetch(`${API_CONFIG.ENDPOINTS.VITAL_SIGNS}?patient_id=${patient.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Refreshed vital signs from backend for patient:", patient.id, data);
        
        let vitalSigns = [];
        if (data.results && Array.isArray(data.results)) {
          vitalSigns = data.results;
        } else if (Array.isArray(data)) {
          vitalSigns = data;
        } else {
          setBackendVitalSigns([]);
          return;
        }
        
        console.log("Refreshed patient vital signs:", vitalSigns);
        setBackendVitalSigns(vitalSigns);
      } else if (response.status === 404) {
        // Patient has no medical records or vital signs
        console.log("No vital signs found for patient during refresh:", patient.id);
        setBackendVitalSigns([]);
      } else {
        console.error("Failed to refresh vital signs:", response.status);
      }
    } catch (error) {
      console.error("Error refreshing vital signs:", error);
    }
  }, [patient.id]);

  // Use only backend vital signs (no local data)
  const allVitalSigns = backendVitalSigns.map(vs => {
    const measurementTime = new Date(vs.measurement_time);
    const date = measurementTime.toISOString().split('T')[0]; // Extract date part
    const time = measurementTime.toTimeString().slice(0, 5); // Extract time part (HH:MM)
    
    return {
      id: vs.id,
      date: date,
      time: time,
      bp: vs.blood_pressure_systolic && vs.blood_pressure_diastolic 
        ? `${vs.blood_pressure_systolic}/${vs.blood_pressure_diastolic}` 
        : '',
      pulse: vs.heart_rate?.toString() || '',
      temp: vs.temperature_celsius?.toString() || '',
      weight: vs.weight_kg?.toString() || '',
      height: vs.height_cm?.toString() || '',
      respiratory_rate: vs.respiratory_rate?.toString() || '',
      oxygen_saturation: vs.oxygen_saturation?.toString() || '',
      notes: vs.notes || ''
    };
  });

  // Handle adding vital sign
  const handleAddVitalSign = async (vitalSignData: any) => {
    console.log("VitalsTab: handleAddVitalSign called with:", vitalSignData);
    if (onAddVitalSign) {
      console.log("VitalsTab: Calling onAddVitalSign...");
      await onAddVitalSign(vitalSignData);
      console.log("VitalsTab: onAddVitalSign completed, refreshing...");
      // Refresh vital signs from backend after adding
      await refreshVitalSigns();
      console.log("VitalsTab: refreshVitalSigns completed");
    } else {
      console.log("VitalsTab: onAddVitalSign is not provided");
    }
  };
  const renderDynamics = () => {
    // Prepare and sort data by date ASC
    const vitals = [...allVitalSigns].sort((a, b) => {
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return da - db
    })

    if (vitals.length < 2) {
      return (
        <div className="h-60 bg-white rounded-md border p-4 flex items-center justify-center text-gray-400">
          Недостаточно данных для графика
        </div>
      )
    }

    // Extract series
    const parseBP = (bp: string) => {
      if (!bp) return null
      const parts = bp.split("/")
      const systolic = parseInt(parts[0] || "", 10)
      return isNaN(systolic) ? null : systolic
    }

    const points = vitals.map((v, i) => ({
      xIndex: i,
      date: v.date,
      pulse: Number.parseFloat(String(v.pulse).replace(/[^0-9.]/g, "")),
      temp: Number.parseFloat(String(v.temp).replace(/[^0-9.]/g, "")),
      sbp: parseBP(v.bp || ""),
    }))

    const width = 640
    const height = 220
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    const xStep = chartW / Math.max(points.length - 1, 1)

    const seriesDefs = [
      {
        key: "pulse" as const,
        color: "#ef4444",
        label: "Пульс",
        filter: (n: number | null | undefined) => typeof n === "number" && !isNaN(n),
      },
      {
        key: "temp" as const,
        color: "#f59e0b",
        label: "Температура",
        filter: (n: number | null | undefined) => typeof n === "number" && !isNaN(n),
      },
      {
        key: "sbp" as const,
        color: "#3b82f6",
        label: "Систолическое АД",
        filter: (n: number | null | undefined) => typeof n === "number" && !isNaN(n),
      },
    ]

    // Compute min/max for shared Y scale across available series
    const allValues: number[] = []
    for (const s of seriesDefs) {
      for (const p of points) {
        const val = p[s.key]
        if (s.filter(val)) allValues.push(val as number)
      }
    }
    const yMin = Math.min(...allValues) - 2
    const yMax = Math.max(...allValues) + 2

    const yToPx = (val: number) => {
      const t = (val - yMin) / (yMax - yMin || 1)
      return padding.top + (1 - t) * chartH
    }

    const xToPx = (idx: number) => padding.left + idx * xStep

    const buildPath = (key: "pulse" | "temp" | "sbp") => {
      const filtered = points.filter((p) => {
        const v = p[key]
        return typeof v === "number" && !isNaN(v as number)
      })
      if (filtered.length === 0) return ""
      return filtered
        .map((p, i) => `${i === 0 ? "M" : "L"}${xToPx(p.xIndex)},${yToPx(p[key] as number)}`)
        .join(" ")
    }

    return (
      <div className="bg-white rounded-md border p-4">
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="График показателей">
          <rect x="0" y="0" width={width} height={height} fill="#ffffff" />
          {/* Y axis ticks (4) */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = padding.top + (chartH / 4) * i
            const val = (yMax - ((y - padding.top) / chartH) * (yMax - yMin)).toFixed(0)
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#eee" />
                <text x={padding.left - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280">{val}</text>
              </g>
            )
          })}
          {/* X axis labels (dates) */}
          {points.map((p, i) => (
            <text key={i} x={xToPx(p.xIndex)} y={height - 6} fontSize="10" textAnchor="middle" fill="#6b7280">
              {p.date}
            </text>
          ))}
          {/* Series paths */}
          {seriesDefs.map((s) => {
            const d = buildPath(s.key)
            if (!d) return null
            return <path key={s.key} d={d} fill="none" stroke={s.color} strokeWidth={2} />
          })}
        </svg>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
          {seriesDefs.map((s) => (
            <div key={s.key} className="flex items-center gap-1">
              <span className="inline-block w-3 h-1.5 rounded" style={{ backgroundColor: s.color }}></span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white shadow-sm rounded-lg border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
          <Activity className="h-5 w-5 text-red-500" /> Показатели здоровья
        </CardTitle>
        <Button onClick={onOpenAddVitalsDialog} className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Добавить
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Загрузка показателей...</p>
        ) : allVitalSigns.length > 0 ? (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Дата</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Время</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Давление</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Пульс</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Темп.</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Вес</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Рост</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {allVitalSigns.map((v, i) => (
                    <tr key={`${v.date}-${i}`} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium">{v.date}</td>
                      <td className="py-2.5 px-3 text-gray-600">{v.time}</td>
                      <td className="py-2.5 px-3">{v.bp || '-'}</td>
                      <td className="py-2.5 px-3">{v.pulse ? `${v.pulse} уд/мин` : '-'}</td>
                      <td className="py-2.5 px-3">{v.temp ? `${v.temp}°C` : '-'}</td>
                      <td className="py-2.5 px-3">{v.weight ? `${v.weight} кг` : '-'}</td>
                      <td className="py-2.5 px-3">{v.height ? `${v.height} см` : '-'}</td>
                      <td className="py-2.5 px-3">
                        {onDeleteVitalSign && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              const vitalSignId = String(v.id);
                              await onDeleteVitalSign(vitalSignId);
                              // Refresh vital signs from backend after deletion
                              await refreshVitalSigns();
                            }}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                          >
                            🗑️
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-md font-medium mb-2">Динамика показателей</h3>
              {renderDynamics()}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-8">Данные о показателях отсутствуют.</p>
        )}
      </CardContent>
    </Card>
  );
}