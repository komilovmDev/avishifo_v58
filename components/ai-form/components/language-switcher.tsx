"use client"

import { useI18n } from "@/ai-form/lib/i18n"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { cn } from "@/ai-form/lib/utils"

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  const languages = [
    { code: "ru" as const, name: "Русский", flag: "🇷🇺", isText: false },
    { code: "uz" as const, name: "O'zbek", flag: "🇺🇿", isText: false },
    { code: "en" as const, name: "English", flag: "EN", isText: true },
  ]

  return (
    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-1 shadow-sm">
      <Languages className="w-4 h-4 text-gray-600 ml-1" />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "gap-1.5 h-8 px-2 sm:px-3 text-xs sm:text-sm",
            language === lang.code
              ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
              : "hover:bg-gray-100"
          )}
        >
          {lang.isText ? (
            <span className={cn(
              "font-bold text-[10px] sm:text-xs leading-none inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded",
              language === lang.code 
                ? "text-white bg-white/20 backdrop-blur-sm border border-white/30" 
                : "text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 px-1.5 py-0.5 rounded border border-gray-300 shadow-sm"
            )}>
              {lang.flag}
            </span>
          ) : (
            <span className="text-base leading-none">{lang.flag}</span>
          )}
          <span className="hidden sm:inline">{lang.name}</span>
        </Button>
      ))}
    </div>
  )
}


