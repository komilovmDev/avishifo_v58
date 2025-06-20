// src/components/dashboard/requests/RequestsTable.tsx
"use client";

import { useState } from "react";
import type { RequestEntryType } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";
import { RequestDetailsForm } from "./RequestDetailsForm";

interface RequestsTableProps {
  requests: RequestEntryType[];
  onUpdateRequestStatus: (id: number, newStatus: RequestEntryType['status']) => void;
  onAssignRequest: (id: number, assignee: string) => void;
}

export function RequestsTable({
  requests,
  onUpdateRequestStatus,
  onAssignRequest,
}: RequestsTableProps) {
  const [editingRequest, setEditingRequest] = useState<RequestEntryType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "resolved": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-orange-100 text-orange-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const openDetailsModal = (request: RequestEntryType) => {
    setEditingRequest(request);
    setIsDetailsModalOpen(true);
  }

  const closeDetailsModal = () => {
    setEditingRequest(null);
    setIsDetailsModalOpen(false);
  }


  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-800 text-base lg:text-lg">
          Все Запросы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Тип</th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Описание</th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Приоритет</th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs lg:text-sm font-medium text-gray-900">{request.user}</div>
                    <div className="text-xs text-gray-500">{request.time}</div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden sm:table-cell">{request.type}</td>
                  <td className="px-3 lg:px-6 py-4 hidden md:table-cell">
                    <div className="text-xs lg:text-sm text-gray-900 max-w-xs truncate">{request.description}</div>
                    <div className="text-xs text-gray-500">Назначен: {request.assignedTo}</div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <Select
                      value={request.status}
                      onValueChange={(value) => onUpdateRequestStatus(request.id, value as RequestEntryType['status'])}
                    >
                      <SelectTrigger className="w-auto min-w-[100px] border-none shadow-none p-0 h-auto">
                        <Badge className={`text-xs ${getStatusColor(request.status)} cursor-pointer`}>
                          {request.status === "pending" ? "Ожидание" : request.status === "in-progress" ? "В работе" : "Решено"}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ожидание</SelectItem>
                        <SelectItem value="in-progress">В работе</SelectItem>
                        <SelectItem value="resolved">Решено</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <Badge className={`text-xs ${getPriorityColor(request.priority)}`}>
                      {request.priority === "high" ? "Высокий" : request.priority === "medium" ? "Средний" : "Низкий"}
                    </Badge>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <Dialog open={isDetailsModalOpen && editingRequest?.id === request.id} onOpenChange={(isOpen) => !isOpen && closeDetailsModal()}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => openDetailsModal(request)}>
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Управление запросом</DialogTitle>
                        </DialogHeader>
                        {editingRequest && (
                          <RequestDetailsForm
                            request={editingRequest}
                            onAssign={(id, assignee) => {
                                onAssignRequest(id, assignee);
                                // Optionally update the local editingRequest or refetch
                                setEditingRequest(prev => prev ? {...prev, assignedTo: assignee} : null);
                                // closeDetailsModal(); // Or keep open if more actions
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
