// src/components/dashboard/crm/UserManagementTable.tsx
"use client";

import { useState } from "react";
import type { AnyUserType, UserRoleType, DoctorUserType } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Ban, CheckCircle, UserPlus } from "lucide-react";
import { AddUserForm } from "./AddUserForm";
import { EditUserForm } from "./EditUserForm";

interface UserManagementTableProps {
  data: AnyUserType[];
  type: UserRoleType;
  onBlock: (type: UserRoleType, id: number) => void;
  onDelete: (type: UserRoleType, id: number) => void;
  onAddUser?: (type: UserRoleType, formData: any) => void; // For adding a new user
  onEditUser?: (type: UserRoleType, userId: number, formData: any) => void; // For editing
}

export function UserManagementTable({
  data,
  type,
  onBlock,
  onDelete,
  onAddUser,
  onEditUser
}: UserManagementTableProps) {
  const [editingUser, setEditingUser] = useState<AnyUserType | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);


  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  const handleOpenEditDialog = (user: AnyUserType) => {
    setEditingUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingUser(null);
    setIsEditUserDialogOpen(false);
  };

  const handleAddUserSubmit = (formData: any) => {
      if (onAddUser) {
          onAddUser(type, formData);
      }
      setIsAddUserDialogOpen(false); // Close dialog
  }

  const handleEditUserSubmit = (userId: number, formData: any) => {
    if (onEditUser) {
        onEditUser(type, userId, formData);
    }
    handleCloseEditDialog(); // Close dialog
  }


  return (
    <Card className="bg-white/90 border-gray-200/50 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-800 text-base lg:text-lg">
          Список{" "}
          {type === "admin"
            ? "Администраторов"
            : type === "doctor"
            ? "Докторов"
            : "Пациентов"}
        </CardTitle>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить нового пользователя ({type})</DialogTitle>
            </DialogHeader>
            <AddUserForm type={type} onAddUser={handleAddUserSubmit} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Имя
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                  Email
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Статус
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((user) => (
                <tr key={user.id} className={user.blocked ? "bg-red-50" : ""}>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3">
                        <AvatarFallback
                          className={`text-xs ${
                            type === "admin"
                              ? "bg-purple-300 text-purple-700"
                              : type === "doctor"
                              ? "bg-green-300 text-green-700"
                              : "bg-cyan-300 text-cyan-700"
                          }`}
                        >
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </div>
                        {type === "doctor" && (
                          <div className="text-xs text-gray-500">
                            {(user as DoctorUserType).specialty}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`text-xs ${
                        user.blocked
                          ? "bg-red-100 text-red-700"
                          : user.status === "online"
                          ? "bg-green-100 text-green-700"
                          : user.status === "away"
                          ? "bg-yellow-100 text-yellow-700"
                          : user.status === "active" // For patients
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700" // inactive/offline
                      }`}
                    >
                      {user.blocked
                        ? "Заблокирован"
                        : user.status === "online"
                        ? "Онлайн"
                        : user.status === "away"
                        ? "Отошел"
                        : user.status === "active"
                        ? "Активен"
                        : "Оффлайн/Неактивен"}
                    </Badge>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                    <div className="flex gap-1">
                       <Dialog open={isEditUserDialogOpen && editingUser?.id === user.id} onOpenChange={(isOpen) => !isOpen && handleCloseEditDialog()}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(user)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Редактировать пользователя ({type})
                            </DialogTitle>
                          </DialogHeader>
                          <EditUserForm user={editingUser} type={type} onEditUser={handleEditUserSubmit}/>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBlock(type, user.id)}
                        className={
                          user.blocked ? "text-green-600" : "text-orange-600"
                        }
                      >
                        {user.blocked ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Ban className="w-3 h-3" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(type, user.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
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
