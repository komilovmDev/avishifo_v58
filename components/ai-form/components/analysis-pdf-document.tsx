"use client"

import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"
import { MedicalFormData } from "@/ai-form/lib/validation"

// Register Roboto font with Cyrillic support from CDN
// This is essential for proper Cyrillic text display in PDF
let CYRILLIC_FONT = 'Helvetica' // Fallback

// Function to register font (will be called when component loads)
const registerCyrillicFont = () => {
  try {
    // Try to register Roboto from CDN (supports Cyrillic)
    // Include regular, bold, and italic variants
    Font.register({
      family: 'Roboto',
      fonts: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
          fontWeight: 'normal',
          fontStyle: 'normal',
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
          fontWeight: 'bold',
          fontStyle: 'normal',
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf',
          fontWeight: 'normal',
          fontStyle: 'italic',
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bolditalic-webfont.ttf',
          fontWeight: 'bold',
          fontStyle: 'italic',
        },
      ],
    })
    CYRILLIC_FONT = 'Roboto'
    console.log('✓ Roboto font registered for Cyrillic support (with italic)')
    return true
  } catch (error) {
    console.warn('Could not register Roboto from CDN, trying alternatives...', error)
    
    // Try alternative: Google Fonts CDN (simpler registration)
    try {
      Font.register({
        family: 'Roboto',
        src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
      })
      CYRILLIC_FONT = 'Roboto'
      console.log('✓ Roboto font registered from Google Fonts (basic)')
      return true
    } catch (e2) {
      console.warn('Alternative font registration failed:', e2)
      
      // Try local font if available
      try {
        Font.register({
          family: 'Roboto',
          fonts: [
            { src: '/fonts/Roboto-Regular.ttf' },
            { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
            { src: '/fonts/Roboto-Italic.ttf', fontStyle: 'italic' },
            { src: '/fonts/Roboto-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
          ],
        })
        CYRILLIC_FONT = 'Roboto'
        console.log('✓ Roboto font registered from local files (with italic)')
        return true
      } catch (e3) {
        console.warn('Local font registration failed:', e3)
        console.warn('⚠ Using Helvetica fallback - Cyrillic may not display correctly')
        // If Roboto fails, use Helvetica but remove italic styles to avoid errors
        return false
      }
    }
  }
}

// Register font immediately
registerCyrillicFont()

// Helper function to normalize text and ensure proper encoding
const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ""
  try {
    // Convert to string
    let normalized = String(text)
    
    // Remove BOM if present
    normalized = normalized.replace(/^\uFEFF/, '')
    
    // Remove control characters except newlines and tabs
    normalized = normalized
      .replace(/\u0000/g, '') // Remove null characters
      .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, '') // Remove control characters
    
    // Normalize Unicode to NFC form (best for display)
    normalized = normalized.normalize('NFC')
    
    // Ensure all characters are valid UTF-8
    // Replace any invalid UTF-8 sequences
    try {
      // Encode and decode to ensure valid UTF-8
      const encoder = new TextEncoder()
      const decoder = new TextDecoder('utf-8', { fatal: false })
      const bytes = encoder.encode(normalized)
      normalized = decoder.decode(bytes)
    } catch (e) {
      // If encoding fails, try to fix common issues
      normalized = normalized.replace(/[^\u0000-\uFFFF]/g, '') // Remove invalid Unicode
    }
    
    return normalized
  } catch (e) {
    console.warn("Text normalization error:", e)
    // Fallback: return as-is but ensure it's a string
    return String(text).replace(/[^\u0000-\uFFFF]/g, '')
  }
}

// Split text into chunks to handle long texts better
const splitTextIntoChunks = (text: string, maxLength: number = 1000): string[] => {
  const chunks: string[] = []
  let currentChunk = ""
  
  const words = text.split(/(\s+)/)
  for (const word of words) {
    if ((currentChunk + word).length > maxLength && currentChunk) {
      chunks.push(currentChunk)
      currentChunk = word
    } else {
      currentChunk += word
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk)
  }
  
  return chunks.length > 0 ? chunks : [text]
}

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontSize: 11, 
    fontFamily: CYRILLIC_FONT, 
    backgroundColor: "#ffffff" 
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#1e40af",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
    minHeight: 80,
  },
  logo: {
    width: 120,
    height: 120,
    objectFit: "contain",
  },
  logoText: {
    fontSize: 20,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#1e40af",
    marginTop: 8,
    textAlign: "center",
  },
  title: { 
    fontSize: 24, 
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    marginBottom: 10, 
    textAlign: "center", 
    color: "#1e40af" 
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#64748b",
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    textAlign: "center",
    color: "#94a3b8",
  },
  section: { 
    marginBottom: 20, 
    padding: 15, 
    backgroundColor: "#f8fafc", 
    borderRadius: 5 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    marginBottom: 12, 
    color: "#1e40af", 
    borderBottomWidth: 1, 
    borderBottomColor: "#cbd5e1", 
    paddingBottom: 5 
  },
  field: { marginBottom: 10 },
  label: { 
    fontSize: 10, 
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#475569", 
    marginBottom: 3 
  },
  value: { 
    fontSize: 10, 
    color: "#1e293b", 
    lineHeight: 1.6,
    textAlign: "justify",
  },
  empty: { 
    fontSize: 10, 
    color: "#94a3b8", 
    fontStyle: CYRILLIC_FONT === 'Roboto' ? "italic" : "normal" // Only use italic if Roboto is registered
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10 
  },
  column: { width: "48%" },
  analysisSection: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#eff6ff",
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  analysisContent: {
    marginTop: 10,
  },
  analysisTitle: {
    fontSize: 18,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#1e40af",
  },
  aiNote: {
    fontSize: 10,
    fontFamily: CYRILLIC_FONT,
    fontStyle: CYRILLIC_FONT === 'Roboto' ? 'italic' : 'normal', // Only use italic if Roboto is registered
    color: "#64748b",
    marginBottom: 12,
    textAlign: "center",
  },
  analysisText: {
    fontSize: 11,
    color: "#1e293b",
    lineHeight: 1.8,
    textAlign: "justify",
    marginBottom: 10,
    marginTop: 4,
  },
  analysisMainHeader: {
    fontSize: 16,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#1e40af",
    marginTop: 16,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  analysisSectionHeader: {
    fontSize: 14,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#2563eb",
    marginTop: 14,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  analysisSubtitle: {
    fontSize: 12,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#3b82f6",
    marginTop: 12,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  analysisBoldText: {
    fontSize: 11,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#1e293b",
    lineHeight: 1.8,
  },
  listContainer: {
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 15,
    paddingLeft: 5,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 5,
  },
  listBullet: {
    fontSize: 11,
    color: "#3b82f6",
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    marginRight: 5,
  },
  listText: {
    fontSize: 11,
    color: "#1e293b",
    lineHeight: 1.6,
    flex: 1,
  },
  paragraphSpacer: {
    fontSize: 8,
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
})

interface AnalysisPDFDocumentProps {
  formData: MedicalFormData
  analysisResult: string
  logoUrl?: string
}

const renderField = (label: string, value: string | undefined) => {
  const normalizedLabel = normalizeText(label)
  const normalizedValue = normalizeText(value)
  
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{normalizedLabel}:</Text>
      <Text style={normalizedValue ? styles.value : styles.empty}>
        {normalizedValue || "не указано"}
      </Text>
    </View>
  )
}

// Function to format analysis text with proper structure
const formatAnalysisText = (text: string): any[] => {
  const normalizedText = normalizeText(text)
  const elements: any[] = []
  
  // Split by lines first to handle headers and lists better
  const lines = normalizedText.split('\n')
  let currentParagraph: string[] = []
  let inList = false
  let listItems: string[] = []
  let listIndex = 0
  
  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paraText = currentParagraph.join(' ').trim()
      if (paraText) {
        elements.push(
          <Text key={`para-${elements.length}`} style={styles.analysisText}>
            {paraText}
          </Text>
        )
      }
      currentParagraph = []
    }
  }
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(renderList(listItems, `list-${listIndex++}`))
      listItems = []
      inList = false
    }
  }
  
  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim()
    
    if (!trimmedLine) {
      // Empty line - flush current paragraph/list
      flushList()
      flushParagraph()
      return
    }
    
    // Check for headers first
    if (trimmedLine.startsWith('### ')) {
      flushList()
      flushParagraph()
      const headerText = trimmedLine.replace(/^###\s+/, '').trim()
      elements.push(
        <Text key={`h3-${lineIndex}`} style={styles.analysisSubtitle}>
          {headerText}
        </Text>
      )
      return
    }
    
    if (trimmedLine.startsWith('## ')) {
      flushList()
      flushParagraph()
      const headerText = trimmedLine.replace(/^##\s+/, '').trim()
      elements.push(
        <Text key={`h2-${lineIndex}`} style={styles.analysisSectionHeader}>
          {headerText}
        </Text>
      )
      return
    }
    
    if (trimmedLine.startsWith('# ')) {
      flushList()
      flushParagraph()
      const headerText = trimmedLine.replace(/^#\s+/, '').trim()
      elements.push(
        <Text key={`h1-${lineIndex}`} style={styles.analysisMainHeader}>
          {headerText}
        </Text>
      )
      return
    }
    
    // Check for numbered list (1., 2., etc.)
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      flushParagraph()
      if (!inList) {
        inList = true
      }
      listItems.push(normalizeText(numberedMatch[2]))
      return
    }
    
    // Check for bullet list (-, *, •)
    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)$/)
    if (bulletMatch) {
      flushParagraph()
      if (!inList) {
        inList = true
      }
      listItems.push(normalizeText(bulletMatch[1]))
      return
    }
    
    // Regular text line
    flushList()
    
    // Check if line contains bold text
    if (trimmedLine.includes('**')) {
      elements.push(renderBoldText(trimmedLine, `bold-${lineIndex}`))
    } else {
      // Add to current paragraph
      currentParagraph.push(trimmedLine)
    }
  })
  
  // Flush remaining content
  flushList()
  flushParagraph()
  
  return elements.length > 0 ? elements : [<Text key="default" style={styles.analysisText}>{normalizedText}</Text>]
}

// Helper to render lists
const renderList = (items: string[], key: string) => (
  <View key={key} style={styles.listContainer}>
    {items.map((item, index) => (
      <View key={`${key}-item-${index}`} style={styles.listItem}>
        <Text style={styles.listBullet}>• </Text>
        <Text style={styles.listText}>{normalizeText(item)}</Text>
      </View>
    ))}
  </View>
)

// Helper to render bold text
const renderBoldText = (text: string, key: string) => {
  const parts: any[] = []
  let lastIndex = 0
  const regex = /\*\*(.+?)\*\*/g
  let match
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > lastIndex) {
      parts.push(
        <Text key={`${key}-before-${match.index}`} style={styles.analysisText}>
          {text.substring(lastIndex, match.index)}
        </Text>
      )
    }
    // Add bold text
    parts.push(
      <Text key={`${key}-bold-${match.index}`} style={styles.analysisBoldText}>
        {match[1]}
      </Text>
    )
    lastIndex = regex.lastIndex
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <Text key={`${key}-after`} style={styles.analysisText}>
        {text.substring(lastIndex)}
      </Text>
    )
  }
  
  return <Text key={key} style={styles.analysisText}>{parts}</Text>
}

export const AnalysisPDFDocument = ({ formData, analysisResult, logoUrl }: AnalysisPDFDocumentProps) => {
  // Normalize all text inputs
  const normalizedAnalysisResult = normalizeText(analysisResult)
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {(logoUrl && logoUrl !== "") ? (
              <Image src={logoUrl} style={styles.logo} />
            ) : (
              // Try to use default logo paths
              <Image src="/logologin.png" style={styles.logo} />
            )}
            <Text style={styles.logoText}>AviShifo</Text>
          </View>
          <Text style={styles.title}>{normalizeText("Результаты анализа медицинской анкеты")}</Text>
          <Text style={styles.subtitle}>{normalizeText("Анализ данных пациента с использованием ИИ")}</Text>
          <Text style={styles.date}>
            {normalizeText("Дата анализа:")} {new Date().toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        {/* Patient Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{normalizeText("Данные пациента")}</Text>
          
          {/* Personal Data */}
          <View style={styles.row}>
            <View style={styles.column}>{renderField("Ф.И.О", formData.fullName)}</View>
            <View style={styles.column}>{renderField("Паспорт", formData.passport)}</View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>{renderField("Дата рождения", formData.birthDate)}</View>
            <View style={styles.column}>{renderField("Пол", formData.gender)}</View>
          </View>
          {renderField("Семейное положение", formData.maritalStatus)}
          {renderField("Образование", formData.education)}
          {renderField("Место работы, специальность, должность", formData.job)}
          {renderField("Домашний адрес и телефон", formData.address)}
          
          {/* Admission Information */}
          {(formData.admissionDate || formData.referralDiagnosis || formData.mainComplaints) && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 15, fontSize: 14 }]}>
                {normalizeText("Обращение в клинику")}
              </Text>
              {renderField("Дата поступления", formData.admissionDate)}
              {renderField("Диагноз направившего учреждения", formData.referralDiagnosis)}
              {renderField("Основные жалобы", formData.mainComplaints)}
              {renderField("Детализация основных жалоб", formData.mainComplaintsDetail)}
              {renderField("Общие жалобы", formData.generalComplaints)}
              {renderField("Дополнительные жалобы", formData.additionalComplaints)}
              {renderField("Когда впервые появились жалобы", formData.firstSymptomsDate)}
              {renderField("Какие жалобы появились первыми", formData.firstSymptoms)}
              {renderField("Что способствовало появлению симптомов", formData.triggers)}
              {renderField("Динамика симптомов", formData.symptomsDynamic)}
              {renderField("Предыдущие диагнозы и лечение", formData.previousDiagnosis)}
              {renderField("Клинические проявления в момент обращения", formData.currentState)}
            </>
          )}
          
          {/* Life History */}
          {(formData.badHabits || formData.familyHistory || formData.allergies || formData.pastDiseases) && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 15, fontSize: 14 }]}>
                {normalizeText("Анамнез жизни")}
              </Text>
              {renderField("Хронические интоксикации", formData.badHabits)}
              {renderField("Наследственный анамнез", formData.familyHistory)}
              {renderField("Аллергологический анамнез", formData.allergies)}
              {renderField("Перенесённые заболевания / операции / прививки", formData.pastDiseases)}
            </>
          )}
        </View>

        {/* AI Analysis Results */}
        <View style={styles.analysisSection}>
          <Text style={styles.analysisTitle}>
            {normalizeText("Результаты анализа данных пациента")}
          </Text>
          <Text style={styles.aiNote}>
            {normalizeText("Анализ выполнен с использованием искусственного интеллекта (ИИ)")}
          </Text>
          <View style={styles.analysisContent}>
            {formatAnalysisText(normalizedAnalysisResult)}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {normalizeText("Сгенерировано системой AviShifo")} • {new Date().toLocaleDateString('ru-RU')}
        </Text>
      </Page>
    </Document>
  )
}

