"use client"

import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"
import { MedicalFormData } from "@/ai-form/lib/validation"
import { translations, Language } from "@/ai-form/lib/translations"

// Register Roboto font with Cyrillic support from CDN
let CYRILLIC_FONT = 'Helvetica' // Fallback

// Function to register font
const registerCyrillicFont = () => {
  try {
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
    return true
  } catch (error) {
    console.warn('Could not register Roboto from CDN, trying alternatives...', error)
    try {
      Font.register({
        family: 'Roboto',
        src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
      })
      CYRILLIC_FONT = 'Roboto'
      return true
    } catch (e2) {
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
        return true
      } catch (e3) {
        return false
      }
    }
  }
}

registerCyrillicFont()

// Helper function to normalize text
const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ""
  try {
    let normalized = String(text).replace(/^\uFEFF/, '')
    normalized = normalized
      .replace(/\u0000/g, '')
      .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, '')

    normalized = normalized.normalize('NFC')

    try {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder('utf-8', { fatal: false })
      const bytes = encoder.encode(normalized)
      normalized = decoder.decode(bytes)
    } catch (e) {
      normalized = normalized.replace(/[^\u0000-\uFFFF]/g, '')
    }
    return normalized
  } catch (e) {
    return String(text).replace(/[^\u0000-\uFFFF]/g, '')
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 80,
    paddingBottom: 60,
    fontSize: 10,
    fontFamily: CYRILLIC_FONT,
    backgroundColor: "#ffffff",
    lineHeight: 1.5
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 30,
    right: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#1e40af",
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerLogo: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#1e40af",
  },
  headerDate: {
    fontSize: 8,
    color: "#64748b",
  },
  titleBlock: {
    marginBottom: 20,
    textAlign: 'center'
  },
  mainTitle: {
    fontSize: 18,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#1e40af",
    marginBottom: 5
  },
  subTitle: {
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#1e40af",
    backgroundColor: "#eff6ff",
    padding: 5,
    borderRadius: 2
  },
  row: {
    flexDirection: "row",
    marginBottom: 5
  },
  fieldColumn: {
    width: "48%",
    marginRight: "2%"
  },
  fieldLabel: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 1
  },
  fieldValue: {
    fontSize: 9,
    color: "#1e293b",
    fontFamily: CYRILLIC_FONT,
    minHeight: 14
  },
  analysisSection: {
    marginTop: 20,
  },
  analysisTitle: {
    fontSize: 16,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#1e40af",
    textAlign: 'center'
  },
  analysisText: {
    fontSize: 10,
    color: "#1e293b",
    lineHeight: 1.6,
    textAlign: "justify",
    marginBottom: 8,
  },
  analysisHeading1: {
    fontSize: 14,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#1e40af",
    marginTop: 15,
    marginBottom: 8,
  },
  analysisHeading2: {
    fontSize: 12,
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
    color: "#2563eb",
    marginTop: 10,
    marginBottom: 5,
  },
  analysisBold: {
    fontFamily: CYRILLIC_FONT,
    fontWeight: 'bold',
  },
  listContainer: {
    marginLeft: 15,
    marginBottom: 8
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  listBullet: {
    width: 15,
    fontSize: 10,
    color: "#3b82f6",
  },
  listContent: {
    flex: 1,
    fontSize: 10,
    color: "#1e293b",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  pageNumber: {
    fontSize: 8,
    color: "#94a3b8",
  }
})

interface AnalysisPDFDocumentProps {
  formData: MedicalFormData
  analysisResult: string
  logoUrl?: string
  language?: Language
}

const renderField = (label: string, value: string | undefined) => {
  const normalizedLabel = normalizeText(label)
  const normalizedValue = normalizeText(value)

  return (
    <View style={{ marginBottom: 5 }}>
      <Text style={styles.fieldLabel}>{normalizedLabel}</Text>
      <Text style={styles.fieldValue}>{normalizedValue || "—"}</Text>
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
        // Process bold text inside paragraph
        const processed = renderBoldText(paraText, `para-${elements.length}`)
        elements.push(processed)
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

  // Clean text helper: remove markdown symbols ** or __ or #### but keep content
  // Note: Headers are handled by their own logic, so distinct from inline bold

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushList()
      flushParagraph()
      return
    }

    // Headers (Level 1-4)
    // We remove the # symbols and display styled text
    if (trimmedLine.startsWith('#### ')) {
      flushList()
      flushParagraph()
      const content = trimmedLine.replace(/^####\s+/, '')
      // Using heading2 style for h4 but maybe slightly smaller or different if needed
      // For now, reusing heading2 is safe or define a new one. Let's reuse heading2.
      elements.push(<Text key={`h4-${lineIndex}`} style={styles.analysisHeading2}>{cleanMarkdown(content)}</Text>)
      return
    }
    if (trimmedLine.startsWith('### ')) {
      flushList()
      flushParagraph()
      const content = trimmedLine.replace(/^###\s+/, '')
      elements.push(<Text key={`h3-${lineIndex}`} style={styles.analysisHeading2}>{cleanMarkdown(content)}</Text>)
      return
    }
    if (trimmedLine.startsWith('## ')) {
      flushList()
      flushParagraph()
      const content = trimmedLine.replace(/^##\s+/, '')
      elements.push(<Text key={`h2-${lineIndex}`} style={styles.analysisHeading2}>{cleanMarkdown(content)}</Text>)
      return
    }
    if (trimmedLine.startsWith('# ')) {
      flushList()
      flushParagraph()
      const content = trimmedLine.replace(/^#\s+/, '')
      elements.push(<Text key={`h1-${lineIndex}`} style={styles.analysisHeading1}>{cleanMarkdown(content)}</Text>)
      return
    }

    // Lists
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      flushParagraph()
      if (!inList) inList = true
      listItems.push(numberedMatch[2]) // We will clean inside renderList
      return
    }

    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)$/)
    if (bulletMatch) {
      flushParagraph()
      if (!inList) inList = true
      listItems.push(bulletMatch[1]) // We will clean inside renderList
      return
    }

    // Regular text (accumulate for paragraph)
    flushList()
    currentParagraph.push(trimmedLine)
  })

  flushList()
  flushParagraph()

  return elements.length > 0 ? elements : [<Text key="default" style={styles.analysisText}>{cleanMarkdown(normalizedText)}</Text>]
}

// Helper to remove markdown symbols like **text** -> text
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/__(.*?)__/g, '$1')     // Remove __bold__
    .replace(/^\#+\s*/, '')          // Remove leading # if any left
}

const renderList = (items: string[], key: string) => (
  <View key={key} style={styles.listContainer}>
    {items.map((item, index) => {
      // Clean markdown in list items too
      // If we want bolding in list items, we need a smarter render.
      // Current design: just clean text or partial bold support.
      // Let's support bolding in list items via renderBoldText
      return (
        <View key={`${key}-item-${index}`} style={styles.listItem}>
          <Text style={styles.listBullet}>• </Text>
          <View style={styles.listContent}>
            {renderBoldText(item, `${key}-item-${index}-content`)}
          </View>
        </View>
      )
    })}
  </View>
)

const renderBoldText = (text: string, key: string) => {
  const parts: any[] = []
  let lastIndex = 0
  // Regex to find **text**
  const regex = /\*\*(.+?)\*\*/g
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // Normal text before bold
      parts.push(<Text key={`${key}-before-${match.index}`}>{text.substring(lastIndex, match.index)}</Text>)
    }
    // Bold text (without the **)
    parts.push(<Text key={`${key}-bold-${match.index}`} style={styles.analysisBold}>{match[1]}</Text>)
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    // Remaining text
    parts.push(<Text key={`${key}-after`}>{text.substring(lastIndex)}</Text>)
  }

  // If no bold found, return text as is
  if (parts.length === 0) {
    return <Text key={key} style={styles.analysisText}>{text}</Text>
  }

  return <Text key={key} style={styles.analysisText}>{parts}</Text>
}

export const AnalysisPDFDocument = ({ formData, analysisResult, logoUrl, language = "ru" }: AnalysisPDFDocumentProps) => {
  const normalizedAnalysisResult = normalizeText(analysisResult)
  const t = translations[language]
  const dateLocale = language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US'
  const currentDate = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Image src={logoUrl || "/logologin.png"} style={styles.headerLogo} />
            <Text style={styles.headerTitle}>AviShifo</Text>
          </View>
          <Text style={styles.headerDate}>{currentDate}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{normalizeText(t.analysis.generated)}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.mainTitle}>{normalizeText(t.analysis.title)}</Text>
          <Text style={styles.subTitle}>{normalizeText(t.analysis.patientData)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{normalizeText(t.personalData.title)}</Text>
          <View style={styles.row}>
            <View style={styles.fieldColumn}>{renderField(t.personalData.fullName, formData.fullName)}</View>
            <View style={styles.fieldColumn}>{renderField(t.personalData.passport, formData.passport)}</View>
          </View>
          <View style={styles.row}>
            <View style={styles.fieldColumn}>{renderField(t.personalData.birthDate, formData.birthDate)}</View>
            <View style={styles.fieldColumn}>{renderField(t.personalData.gender, formData.gender)}</View>
          </View>
          <View style={styles.row}>
            <View style={styles.fieldColumn}>{renderField(t.personalData.address, formData.address)}</View>
            <View style={styles.fieldColumn}>{renderField(t.personalData.job, formData.job)}</View>
          </View>
        </View>

        {(formData.admissionDate || formData.mainComplaints) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{normalizeText(t.clinicVisit.title)}</Text>
            <View style={styles.row}>
              <View style={styles.fieldColumn}>{renderField(t.clinicVisit.admissionDate, formData.admissionDate)}</View>
              <View style={styles.fieldColumn}>{renderField(t.clinicVisit.mainComplaints, formData.mainComplaints)}</View>
            </View>
            <View style={styles.row}>
              <View style={{ width: '100%' }}>{renderField(t.clinicVisit.referralDiagnosis, formData.referralDiagnosis)}</View>
            </View>
          </View>
        )}

        <View break>
          <Text style={styles.analysisTitle}>{normalizeText(t.analysis.title)}</Text>
          <View style={styles.analysisSection}>
            {formatAnalysisText(normalizedAnalysisResult)}
          </View>
        </View>
      </Page>
    </Document>
  )
}
