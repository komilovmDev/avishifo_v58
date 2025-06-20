// components/WHOStandardsSection.tsx
"use client";

import { useState } from "react";
import { X, Info } from "lucide-react"; // Ensure lucide-react is installed
import { Button } from "@/components/ui/button"; // Ensure this path is correct for your shadcn/ui setup
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"; // Ensure this path is correct
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Ensure this path is correct

// Define a more specific type for disease if possible, instead of 'any'
// For example:
interface Disease {
  id: string;
  name: string;
  category: "mental" | "chronic";
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}


function DiseaseDetail({
  disease,
  onBack,
}: {
  disease: Disease; // Using the more specific type
  onBack: () => void;
}) {
  const categoryColor = disease.category === "mental" ? "blue" : "green";

  return (
    <Card>
      <CardHeader className={`bg-${categoryColor}-50`}>
        <div className="flex justify-between items-center">
          <CardTitle className={`text-${categoryColor}-700`}>
            {disease.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <X className="w-4 h-4 mr-1" /> Закрыть
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Описание</h3>
            <p className="text-gray-700">{disease.description}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="symptoms">
              <AccordionTrigger className="text-lg font-medium">
                Симптомы
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {disease.symptoms.map((symptom: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {symptom}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="treatment">
              <AccordionTrigger className="text-lg font-medium">
                Лечение
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {disease.treatment.map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prevention">
              <AccordionTrigger className="text-lg font-medium">
                Профилактика
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {disease.prevention.map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Важно знать</h3>
            </div>
            <p className="text-yellow-700">
              {disease.category === "mental"
                ? "Психические расстройства поддаются лечению. Раннее обращение за помощью значительно повышает эффективность лечения. Не стесняйтесь обращаться к специалистам в области психического здоровья."
                : "Хронические заболевания требуют регулярного медицинского наблюдения и соблюдения рекомендаций врача. Самолечение может привести к серьезным осложнениям."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onBack}
          className={`bg-${categoryColor}-600 hover:bg-${categoryColor}-700`}
        >
          Вернуться к списку
        </Button>
      </CardFooter>
    </Card>
  );
}


export function WHOStandardsSection() {
  const [activeDisease, setActiveDisease] = useState<string | null>(null);

  const diseases: Disease[] = [ // Using the specific Disease type
    {
      id: "depression",
      name: "Депрессия",
      category: "mental",
      description:
        "Депрессия — это распространенное психическое расстройство, характеризующееся постоянной грустью и потерей интереса к деятельности, которая обычно приносит удовольствие, сопровождающееся неспособностью выполнять повседневные дела в течение 14 дней или дольше.",
      symptoms: [
        "Постоянное чувство грусти, тревоги или пустоты",
        "Потеря интереса или удовольствия от деятельности",
        "Нарушения сна (бессонница или чрезмерный сон)",
        "Изменения аппетита или веса",
        "Снижение энергии или повышенная утомляемость",
        "Чувство никчемности или чрезмерной вины",
        "Трудности с концентрацией внимания",
        "Мысли о смерти или самоубийстве",
      ],
      treatment: [
        "Психотерапия (когнитивно-поведенческая терапия)",
        "Антидепрессанты (СИОЗС, ТЦА)",
        "Регулярная физическая активность",
        "Социальная поддержка",
        "Нормализация режима сна",
        "Избегание алкоголя и наркотиков",
      ],
      prevention: [
        "Регулярная физическая активность",
        "Поддержание социальных связей",
        "Управление стрессом",
        "Здоровый сон",
        "Сбалансированное питание",
        "Избегание алкоголя и наркотиков",
      ],
    },
    {
      id: "anxiety",
      name: "Тревожные расстройства",
      category: "mental",
      description:
        "Тревожные расстройства характеризуются чрезмерным страхом, беспокойством и связанными с ними поведенческими нарушениями. Тревога становится расстройством, когда она мешает повседневной деятельности, вызывает значительный дистресс или непропорциональна ситуац��и.",
      symptoms: [
        "Чрезмерное беспокойство или страх",
        "Нервозность или напряженность",
        "Учащенное сердцебиение",
        "Гипервентиляция",
        "Потливость",
        "Тремор",
        "Проблемы с концентрацией внимания",
        "Нарушения сна",
      ],
      treatment: [
        "Психотерапия (когнитивно-поведенческая терапия)",
        "Анксиолитики (при необходимости)",
        "Антидепрессанты (СИОЗС)",
        "Техники релаксации",
        "Регулярная физическая активность",
        "Избегание кофеина и алкоголя",
      ],
      prevention: [
        "Регулярная физическая активность",
        "Техники релаксации и медитации",
        "Здоровый сон",
        "Ограничение потребления кофеина",
        "Избегание алкоголя и наркотиков",
        "Социальная поддержка",
      ],
    },
    {
      id: "diabetes",
      name: "Сахарный диабет",
      category: "chronic",
      description:
        "Сахарный диабет — это хроническое заболевание, которое возникает, когда поджелудочная железа не вырабатывает достаточно инсулина или когда организм не может эффективно использовать вырабатываемый инсулин, что приводит к повышенному уровню глюкозы в крови (гипергликемии).",
      symptoms: [
        "Повышенная жажда и частое мочеиспускание",
        "Потеря веса без видимых причин",
        "Постоянное чувство голода",
        "Нечеткость зрения",
        "Усталость",
        "Медленное заживление ран",
        "Частые инфекции",
        "Покалывание или онемение в руках или ногах (при диабете 2 типа)",
      ],
      treatment: [
        "Инсулинотерапия (для диабета 1 типа)",
        "Пероральные гипогликемические препараты (для диабета 2 типа)",
        "Регулярный мониторинг уровня глюкозы в крови",
        "Сбалансированное питание",
        "Регулярная физическая активность",
        "Поддержание здорового веса",
      ],
      prevention: [
        "Поддержание здорового веса",
        "Регулярная физическая активность",
        "Здоровое питание с ограничением сахара и насыщенных жиров",
        "Избегание курения",
        "Ограничение потребления алкоголя",
        "Регулярные медицинские осмотры",
      ],
    },
    {
      id: "hypertension",
      name: "Артериальная гипертензия",
      category: "chronic",
      description:
        "Артериальная гипертензия (высокое кровяное давление) — это состояние, при котором кровяное давление в артериях постоянно повышено. Нормальное кровяное давление у взрослых составляет 120/80 мм рт. ст. Гипертензия диагностируется при давлении 130/80 мм рт. ст. или выше.",
      symptoms: [
        "Часто протекает бессимптомно ('тихий убийца')",
        "Головные боли (особенно в затылочной области)",
        "Головокружение",
        "Одышка",
        "Боль в груди",
        "Учащенное сердцебиение",
        "Кровотечение из носа",
        "Нарушения зрения",
      ],
      treatment: [
        "Изменение образа жизни",
        "Диуретики",
        "Бета-блокаторы",
        "Ингибиторы АПФ",
        "Блокаторы кальциевых каналов",
        "Антагонисты рецепторов ангиотензина II",
        "Регулярный мониторинг артериального давления",
      ],
      prevention: [
        "Ограничение потребления соли",
        "Регулярная физическая активность",
        "Поддержание здорового веса",
        "Ограничение потребления алкоголя",
        "Отказ от курения",
        "Управление стрессом",
        "Здоровое питание (DASH-диета)",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {activeDisease ? (
        <DiseaseDetail
          disease={diseases.find((d) => d.id === activeDisease)!} // Using non-null assertion as we expect to find it
          onBack={() => setActiveDisease(null)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">
                  Психические расстройства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diseases
                    .filter((d) => d.category === "mental")
                    .map((disease) => (
                      <div
                        key={disease.id}
                        className="p-3 bg-white rounded-lg border border-blue-100"
                      >
                        <h4 className="font-medium text-blue-800">
                          {disease.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {disease.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => setActiveDisease(disease.id)}
                        >
                          Подробнее
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">
                  Хронические заболевания
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diseases
                    .filter((d) => d.category === "chronic")
                    .map((disease) => (
                      <div
                        key={disease.id}
                        className="p-3 bg-white rounded-lg border border-green-100"
                      >
                        <h4 className="font-medium text-green-800">
                          {disease.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {disease.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => setActiveDisease(disease.id)}
                        >
                          Подробнее
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Общие рекомендации ВОЗ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Физическая активность
                  </h3>
                  <p className="text-blue-700">
                    ВОЗ рекомендует взрослым 150-300 минут умеренной аэробной
                    физической активности или 75-150 минут интенсивной аэробной
                    физической активности в неделю, а также силовые упражнения 2
                    или более дней в неделю.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">
                    Здоровое питание
                  </h3>
                  <p className="text-green-700">
                    Сбалансированное питание должно включать фрукты, овощи,
                    бобовые, орехи и цельные злаки. Ограничьте потребление соли,
                    сахара и жиров, особенно трансжиров.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">
                    Психическое здоровье
                  </h3>
                  <p className="text-purple-700">
                    Поддерживайте социальные связи, регулярно отдыхайте,
                    практикуйте техники релаксации и обращайтесь за помощью при
                    первых признаках психических расстройств.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
