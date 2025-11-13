// app/under-construction/page.tsx
"use client"

import type { FC } from "react"
import { useRouter } from "next/navigation"
import { RadioTower } from "lucide-react"

const UnderConstructionPage: FC = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 text-slate-900 relative overflow-hidden">
      {/* ===== ФОН: мягкие круги / сетка / блики ===== */}
      {/* большие мягкие круги */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-[-60px] h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute top-[-120px] right-[-40px] h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-sky-100/80 blur-3xl" />
      </div>

      {/* тонкая сетка по фону */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* декоративные элементы по углам */}
      <div className="pointer-events-none absolute top-8 left-8 flex items-center gap-2 text-[10px] font-medium text-sky-500/80 tracking-[0.25em] uppercase">
        <span className="h-0.5 w-6 rounded-full bg-sky-400/70" />
        <span>AviShifo UI</span>
      </div>

      <div className="pointer-events-none absolute bottom-10 right-10 text-[10px] text-slate-400 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)] animate-pulse" />
        <span>Module status · Building</span>
      </div>

      {/* мелкие точки-светлячки */}
      <div className="pointer-events-none absolute top-24 right-1/3 h-2 w-2 rounded-full bg-cyan-400/90 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
      <div className="pointer-events-none absolute bottom-32 left-1/4 h-1.5 w-1.5 rounded-full bg-sky-500/90 shadow-[0_0_16px_rgba(59,130,246,0.9)]" />

      {/* ===== КАРТОЧКА ===== */}
      <div className="relative max-w-xl w-full px-4">
        <div className="relative rounded-[32px] bg-white/85 border border-slate-200/80 backdrop-blur-xl shadow-[0_22px_70px_rgba(15,23,42,0.16)] px-8 py-10 md:px-12 md:py-12 overflow-hidden">
          {/* лёгкий внутренний градиент по краям карточки */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/0 to-white/40" />

          {/* декоративные линии по краям карточки */}
          <div className="pointer-events-none absolute inset-[18px] rounded-[28px] border border-white/70" />
          <div className="pointer-events-none absolute -top-10 left-10 h-16 w-16 rounded-full border border-sky-200/70" />
          <div className="pointer-events-none absolute -bottom-8 right-12 h-20 w-20 rounded-full border border-cyan-200/70" />

          {/* СОДЕРЖИМОЕ */}
          <div className="relative">
            {/* верх: иконка + подпись */}
            <div className="flex flex-col items-center mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-200 shadow-sm">
                <RadioTower className="h-6 w-6 text-sky-500" />
              </div>
              <span className="text-xs uppercase tracking-[0.35em] text-sky-500/80">
                AviShifo · Beta
              </span>
            </div>

            {/* “пульс” */}
            <div className="mb-6">
              <div className="relative mx-auto max-w-md">
                <svg
                  viewBox="0 0 400 120"
                  className="w-full text-sky-400"
                  aria-hidden="true"
                >
                  <path
                    d="M0 60 H70 L95 25 L125 95 L155 40 L185 80 L215 55 L245 75 L275 40 L305 90 L335 60 H400"
                    className="stroke-sky-300/55"
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M0 60 H70 L95 25 L125 95 L155 40 L185 80 L215 55 L245 75 L275 40 L305 90 L335 60 H400"
                    className="stroke-sky-500"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div className="pointer-events-none absolute inset-0 blur-md bg-sky-200/40" />
              </div>
            </div>

            {/* текст */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-semibold md:font-bold tracking-tight mb-3">
                Раздел в&nbsp;разработке
              </h1>

              <p className="text-sm md:text-base text-slate-600 mb-7">
                Мы усердно работаем над этим модулем. Совсем скоро здесь
                появится много полезных инструментов для врачей и пациентов.
              </p>

              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(56,189,248,0.45)] hover:shadow-[0_14px_40px_rgba(56,189,248,0.6)] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        </div>

        {/* футер */}
        <div className="mt-6 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} AviShifo. Все права защищены.
        </div>
      </div>
    </div>
  )
}

export default UnderConstructionPage
