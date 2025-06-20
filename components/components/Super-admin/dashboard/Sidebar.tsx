// src/components/dashboard/Sidebar.tsx
"use client";

import type React from "react";
import type { SidebarItemType } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, HelpCircle, ChevronRight } from "lucide-react";

interface SidebarProps {
  sidebarItems: SidebarItemType[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onSidebarClose: () => void; // For mobile
}

export function Sidebar({
  sidebarItems,
  activeSection,
  onSectionChange,
  onSidebarClose,
}: SidebarProps) {
  return (
    <div className="p-6 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8 mt-12 lg:mt-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AviShifo
            </h1>
            <p className="text-sm text-gray-500">Супер Админ</p>
          </div>
        </div>
        <nav className="space-y-3">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start h-12 ${
                activeSection === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              } transition-all duration-200 rounded-xl`}
              onClick={() => {
                onSectionChange(item.id);
                onSidebarClose(); // Close sidebar on mobile after selection
              }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
              {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Button>
          ))}
        </nav>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-600 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-indigo-600 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Помощь</span>
          </Button>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">AviShifo v2.1 © 2024</p>
        </div>
      </div>
    </div>
  );
}
