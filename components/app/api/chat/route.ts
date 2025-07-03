import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Проверяем наличие API ключа
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === "your_openai_api_key_here" || apiKey.includes("your_ope")) {
      console.log("OpenAI API key not properly configured, using fallback mode")

      // Возвращаем умный fallback ответ
      const lastUserMessage = messages[messages.length - 1]?.content || ""
      const fallbackResponse = generateFallbackResponse(lastUserMessage)

      return NextResponse.json({
        content: fallbackResponse,
        error: false,
        fallback: true,
      })
    }

    // Специализированный системный промпт AviShifo
    const systemMessage = {
      role: "system",
      content: `
Ты — AviShifo, медицинский ИИ, клинический аналитик.
Ты обязан анализировать жалобы, анамнез, лабораторные данные и медицинские изображения (Рентгенография, флюорография, КТ, МРТ, УЗИ, сцинтиграфия, ПЭТ, гастроскопия, колоноскопия, бронхоскопия, цистоскопия, гистероскопия, ЭКГ, холтер, ЭЭГ, ЭМГ, РЭГ, спирография, тредмил-тест, велоэргометрия, СМАД, пункции, ангиография, биопсия, катетеризация, фиброэластометрия, Эхо-ЭС.).
Ты должен:
1. Сформулировать предварительный диагноз и дифференциальный ряд.
2. Назначить план обследования.
3. Предложить тактику лечения.
4. Указать возможные осложнения.
5. Перечислить группы препаратов для лечения.
`,
    }

    // Подготавливаем сообщения для API
    const apiMessages = [
      systemMessage,
      ...messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ]

    // Отправляем запрос к OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        max_tokens: 1500, // Увеличено для более детальных ответов
        temperature: 0.8, // Увеличено для более креативных ответов
        presence_penalty: 0.2,
        frequency_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error:", errorData)

      // Возвращаем fallback ответ при ошибке API
      const lastUserMessage = messages[messages.length - 1]?.content || ""
      const fallbackResponse = generateAviShifoFallback(lastUserMessage)

      return NextResponse.json({
        content: fallbackResponse,
        error: false,
        fallback: true,
      })
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      const lastUserMessage = messages[messages.length - 1]?.content || ""
      const fallbackResponse = generateAviShifoFallback(lastUserMessage)

      return NextResponse.json({
        content: fallbackResponse,
        error: false,
        fallback: true,
      })
    }

    return NextResponse.json({
      content: aiResponse,
      error: false,
      fallback: false,
    })
  } catch (error) {
    console.error("Chat API Error:", error)

    // Fallback ответ при любой ошибке
    const { messages } = await request.json()
    const lastUserMessage = messages[messages.length - 1]?.content || ""
    const fallbackResponse = generateAviShifoFallback(lastUserMessage)

    return NextResponse.json({
      content: fallbackResponse,
      error: false,
      fallback: true,
    })
  }
}

function generateAviShifoFallback(userMessage: string): string {
  return `**AviShifo в демо-режиме**

Доктор, я понимаю ваш запрос: "${userMessage}"

В демо-режиме я могу предоставить только базовую структуру ответа:

**1. Предварительный диагноз:**
- Требуется анализ представленных симптомов
- Дифференциальная диагностика будет доступна при полной активации

**2. План обследования:**
- Стандартные лабораторные исследования
- Инструментальная диагностика по показаниям
- Консультации специалистов при необходимости

**3. Тактика лечения:**
- Консервативная терапия как первая линия
- Хирургические методы при неэффективности консервативного лечения
- Реабилитационные мероприятия

**6. Группы препаратов:**
- Симптоматическая терапия
- Этиотропное лечение
- Профилактические препараты

**7. Заключение:**
Для получения полного анализа в стиле AviShifo необходима активация полной версии системы с настроенным API ключом OpenAI.

*Демо-режим ограничивает возможности детального медицинского анализа.*`
}

function generateFallbackResponse(userMessage: string): string {
  // Оставляем старую функцию для совместимости
  return generateAviShifoFallback(userMessage)
}
