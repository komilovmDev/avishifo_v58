import { type NextRequest, NextResponse } from "next/server"

// Максимальная длина текста документа для отправки в ИИ, чтобы избежать превышения лимита токенов
const MAX_DOCUMENT_TEXT_LENGTH = 15000 // Уменьшено для gpt-4o, чтобы оставить место для истории и изображений

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart form data
    const formData = await request.formData()
    const message = (formData.get("message") as string) || ""
    const historyJson = (formData.get("history") as string) || "[]"
    const history = JSON.parse(historyJson)

    // Process files with document reading capability
    const files = []
    const imageFiles = []
    const documentContents = []

    for (let i = 0; i < 10; i++) {
      const file = formData.get(`file${i}`) as File
      if (!file) break

      const fileType = file.type
      const fileName = file.name
      const fileSize = file.size
      const fileExtension = fileName.split(".").pop()?.toLowerCase()

      let fileDescription = ""
      let documentText = ""
      let isTruncated = false

      if (fileType.startsWith("image/")) {
        fileDescription = `[Изображение: ${fileName}, ${Math.round(fileSize / 1024)} KB]`

        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString("base64")
        const dataUrl = `data:${fileType};base64,${base64}`

        imageFiles.push({
          name: fileName,
          type: fileType,
          size: fileSize,
          description: fileDescription,
          dataUrl: dataUrl,
        })
      } else if (fileType === "text/plain" || fileExtension === "txt") {
        // Handle text files
        const text = await file.text()
        documentText = text
        if (documentText.length > MAX_DOCUMENT_TEXT_LENGTH) {
          documentText = documentText.substring(0, MAX_DOCUMENT_TEXT_LENGTH)
          isTruncated = true
        }
        fileDescription = `[Текстовый документ: ${fileName}, ${Math.round(fileSize / 1024)} KB${isTruncated ? ", текст урезан" : ""}]`
        documentContents.push({
          fileName,
          content: documentText,
          type: "text",
          isTruncated,
        })
      } else if (fileType === "application/pdf" || fileExtension === "pdf") {
        // Handle PDF files
        try {
          const arrayBuffer = await file.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)

          const text = await extractTextFromPDF(uint8Array)
          documentText = text
          if (documentText.length > MAX_DOCUMENT_TEXT_LENGTH) {
            documentText = documentText.substring(0, MAX_DOCUMENT_TEXT_LENGTH)
            isTruncated = true
          }
          fileDescription = `[PDF документ: ${fileName}, ${Math.round(fileSize / 1024)} KB${isTruncated ? ", текст урезан" : ""}]`
          documentContents.push({
            fileName,
            content: documentText,
            type: "pdf",
            isTruncated,
          })
        } catch (error) {
          console.error("PDF parsing error:", error)
          fileDescription = `[PDF документ: ${fileName}, ${Math.round(fileSize / 1024)} KB, ошибка чтения]`
        }
      } else if (
        fileType.includes("document") ||
        fileType.includes("word") ||
        fileExtension === "doc" ||
        fileExtension === "docx"
      ) {
        // Handle Word documents (basic extraction)
        try {
          const arrayBuffer = await file.arrayBuffer()
          const text = await extractTextFromWord(arrayBuffer, fileExtension)
          documentText = text
          if (documentText.length > MAX_DOCUMENT_TEXT_LENGTH) {
            documentText = documentText.substring(0, MAX_DOCUMENT_TEXT_LENGTH)
            isTruncated = true
          }
          fileDescription = `[Word документ: ${fileName}, ${Math.round(fileSize / 1024)} KB${isTruncated ? ", текст урезан" : ""}]`
          documentContents.push({
            fileName,
            content: documentText,
            type: "word",
            isTruncated,
          })
        } catch (error) {
          console.error("Word document parsing error:", error)
          fileDescription = `[Word документ: ${fileName}, ${Math.round(fileSize / 1024)} KB, ошибка чтения]`
        }
      } else {
        fileDescription = `[Файл: ${fileName}, ${Math.round(fileSize / 1024)} KB]`
      }

      files.push({
        name: fileName,
        type: fileType,
        size: fileSize,
        description: fileDescription,
        content: documentText,
      })
    }

    // Create a message that includes file descriptions and document contents
    let fullMessage = message || "Анализ прикрепленных файлов"
    if (files.length > 0) {
      fullMessage += "\n\nПрикрепленные файлы:\n" + files.map((file) => file.description).join("\n")
    }

    // Add document contents to the message
    if (documentContents.length > 0) {
      fullMessage += "\n\nСодержимое документов:\n"
      documentContents.forEach((doc, index) => {
        fullMessage += `\n--- ${doc.fileName} ---\n${doc.content}\n`
        if (doc.isTruncated) {
          fullMessage += `(Текст урезан до ${MAX_DOCUMENT_TEXT_LENGTH} символов для соответствия лимитам API)\n`
        }
      })
    }

    // Prepare messages for the API
    const lastMessages = history.slice(-10) // Take only last 10 messages for context

    // Проверяем наличие API ключа
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === "your_openai_api_key_here" || apiKey.includes("your_ope")) {
      console.log("OpenAI API key not properly configured, using fallback mode")

      // Возвращаем умный fallback ответ
      const fallbackResponse = generateFileAnalysisFallback(fullMessage, files, imageFiles)

      return NextResponse.json({
        content: fallbackResponse,
        error: false,
        fallback: true,
      })
    }

    // Специализированный системный промпт AviShifo для работы с изображениями
    const systemMessage = {
      role: "system",
      content: `Ты — AviShifo, медицинский ИИ, клинический аналитик.
Ты обязан анализировать жалобы, анамнез, лабораторные данные и медицинские изображения (Рентгенография, флюорография, КТ, МРТ, УЗИ, сцинтиграфия, ПЭТ, гастроскопия, колоноскопия, бронхоскопия, цистоскопия, гистероскопия, ЭКГ, холтер, ЭЭГ, ЭМГ, РЭГ, спирография, тредмил-тест, велоэргометрия, СМАД, пункции, ангиография, биопсия, катетеризация, фиброэластометрия, Эхо-ЭС.).
Ты должен:
1. Сформулировать предварительный диагноз и дифференциальный ряд.
2. Назначить план обследования.
3. Предложить тактику лечения.
4. Указать возможные осложнения.
5. Перечислить группы препаратов для лечения.
`,
    }

    // Prepare content for OpenAI API
    const messageContent: any = [
      {
        type: "text",
        text: fullMessage,
      },
    ]

    // Add images to the message content if any
    if (imageFiles.length > 0) {
      imageFiles.forEach((imageFile) => {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: imageFile.dataUrl,
            detail: "high", // Use high detail for medical images
          },
        })
      })
    }

    // Подготавливаем сообщения для API
    const openaiMessages = [
      systemMessage,
      ...lastMessages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: typeof msg.content === "string" ? msg.content : msg.content,
      })),
      {
        role: "user",
        content: messageContent,
      },
    ]

    // Use GPT-4 Vision model if images are present, otherwise use regular model
    const model = imageFiles.length > 0 ? "gpt-4o" : "gpt-4o-mini"

    // Отправляем запрос к OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // Используем gpt-4o для обработки изображений и документов
        messages: openaiMessages,
        max_tokens: imageFiles.length > 0 ? 2000 : 1500, // Больше токенов для анализа изображений
        temperature: 0.7, // Немного меньше для более точного анализа изображений
        presence_penalty: 0.2,
        frequency_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error:", errorData)

      // Возвращаем fallback ответ при ошибке API
      const fallbackResponse = generateFileAnalysisFallback(fullMessage, files, imageFiles)

      return NextResponse.json({
        content: fallbackResponse,
        error: false,
        fallback: true,
      })
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      const fallbackResponse = generateFileAnalysisFallback(fullMessage, files, imageFiles)

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
      model_used: model,
      tokens_used: data.usage?.total_tokens || 0,
    })
  } catch (error) {
    console.error("Chat with files API Error:", error)

    // Fallback ответ при любой ошибке
    return NextResponse.json({
      content:
        "**Ошибка обработки файлов**\n\nДоктор, произошла техническая ошибка при обработке прикрепленных файлов. Пожалуйста, попробуйте еще раз или отправьте текстовый запрос без вложений.",
      error: true,
      fallback: true,
    })
  }
}

function generateFileAnalysisFallback(message: string, files: any[], imageFiles: any[] = []): string {
  const fileTypes = files.map((file) => {
    if (file.type.startsWith("image/")) return "изображение"
    if (file.type.includes("pdf")) return "PDF документ"
    if (file.type.includes("doc")) return "документ Word"
    if (file.type.includes("text")) return "текстовый файл"
    return "файл"
  })

  const documentFiles = files.filter(
    (file) => file.content && file.content.length > 0 && !file.type.startsWith("image/"),
  )

  let fileDescription = ""
  if (files.length > 0) {
    fileDescription = `\n\nЯ вижу, что вы прикрепили ${files.length} ${
      files.length === 1 ? "файл" : files.length < 5 ? "файла" : "файлов"
    } (${fileTypes.join(", ")}). `

    if (imageFiles.length > 0) {
      fileDescription += `Среди них ${imageFiles.length} медицинских изображений. `
    }

    if (documentFiles.length > 0) {
      fileDescription += `Я успешно прочитал содержимое ${documentFiles.length} документов. `
    }
  }

  let documentAnalysis = ""
  if (documentFiles.length > 0) {
    documentAnalysis = "\n\n**Анализ документов:**\n"
    documentFiles.forEach((doc, index) => {
      const preview = doc.content.substring(0, 200) + (doc.content.length > 200 ? "..." : "")
      documentAnalysis += `\n**${doc.name}:**\n${preview}\n`
      if (doc.isTruncated) {
        documentAnalysis += `(Текст урезан для демо-режима)\n`
      }
    })
  }

  return `**AviShifo в демо-режиме анализа файлов и документов**

Доктор, я получил ваш запрос${fileDescription}

${documentAnalysis}

В демо-режиме я могу предоставить только базовую структуру ответа:

**1. Анализ документов:**
- Успешно прочитано ${documentFiles.length} документов
- Извлечен текст для анализа медицинского содержимого
- Готов к интерпретации результатов анализов, заключений и медицинских записей

**2. Медицинская интерпретация:**
- Анализ лабораторных показателей из документов
- Интерпретация заключений специалистов
- Сопоставление с клинической картиной

**3. Рекомендации на основе документов:**
- План дообследования согласно представленным данным
- Коррекция терапии на основе результатов
- Динамическое наблюдение

**4. Заключение:**
Для получения полного анализа медицинских документов, включая детальную интерпретацию результатов анализов, заключений УЗИ, КТ, МРТ и других исследований, необходима активация полной версии системы.

*Демо-режим позволяет читать содержимое документов, но ограничивает возможности глубокого медицинского анализа.*

**Поддерживаемые форматы документов:**
- PDF файлы с результатами анализов
- Word документы с медицинскими заключениями  
- Текстовые файлы с данными пациентов
- Изображения медицинских снимков и результатов`
}

// Helper functions for document text extraction
async function extractTextFromPDF(uint8Array: Uint8Array): Promise<string> {
  try {
    // Simple PDF text extraction using basic parsing
    const text = new TextDecoder().decode(uint8Array)

    // Extract text between stream objects (basic method)
    const textMatches = text.match(/stream\s*(.*?)\s*endstream/gs)
    if (textMatches) {
      let extractedText = ""
      textMatches.forEach((match) => {
        const content = match.replace(/stream\s*|\s*endstream/g, "")
        // Basic text extraction - remove PDF formatting
        const cleanText = content.replace(/[^\x20-\x7E\u0400-\u04FF]/g, " ")
        extractedText += cleanText + " "
      })
      return extractedText.trim()
    }

    // Fallback: try to find readable text
    const readableText = text.match(/[А-Яа-яA-Za-z0-9\s.,!?;:()"-]{10,}/g)
    return readableText ? readableText.join(" ") : "Не удалось извлечь текст из PDF"
  } catch (error) {
    return "Ошибка при чтении PDF файла"
  }
}

async function extractTextFromWord(arrayBuffer: ArrayBuffer, extension: string): Promise<string> {
  try {
    if (extension === "docx") {
      // Basic DOCX text extraction
      const uint8Array = new Uint8Array(arrayBuffer)
      const text = new TextDecoder().decode(uint8Array)

      // Extract text from XML content
      const xmlMatches = text.match(/<w:t[^>]*>(.*?)<\/w:t>/gs)
      if (xmlMatches) {
        let extractedText = ""
        xmlMatches.forEach((match) => {
          const content = match.replace(/<w:t[^>]*>|<\/w:t>/g, "")
          extractedText += content + " "
        })
        return extractedText.trim()
      }
    }

    // For DOC files or fallback
    const text = new TextDecoder().decode(arrayBuffer)
    const readableText = text.match(/[А-Яа-яA-Za-z0-9\s.,!?;:()"-]{10,}/g)
    return readableText ? readableText.join(" ") : "Не удалось извлечь текст из документа"
  } catch (error) {
    return "Ошибка при чтении Word документа"
  }
}
