"use client"

import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"
import { MedicalFormData } from "@/ai-form/lib/validation"
import { translations, Language } from "@/ai-form/lib/translations"

// Register Roboto font with Cyrillic support from CDN
let CYRILLIC_FONT = 'Helvetica' // Fallback

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

interface PDFDocumentProps {
  data: MedicalFormData
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

const PDFDocument = ({ data, language = "ru" }: PDFDocumentProps) => {
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
            <Image src="/logologin.png" style={styles.headerLogo} />
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
          <Text style={styles.mainTitle}>{normalizeText(t.title)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{normalizeText(t.personalData.title)}</Text>
          <View style={styles.row}>
            <View style={styles.fieldColumn}>{renderField(t.personalData.fullName, data.fullName)}</View>
            <View style={styles.fieldColumn}>{renderField(t.personalData.passport, data.passport)}</View>
          </View>
          <View style={styles.row}>
            <View style={styles.fieldColumn}>{renderField(t.personalData.birthDate, data.birthDate)}</View>
            <View style={styles.fieldColumn}>{renderField(t.personalData.gender, data.gender)}</View>
          </View>
          {renderField(t.personalData.maritalStatus, data.maritalStatus)}
          {renderField(t.personalData.education, data.education)}
          {renderField(t.personalData.job, data.job)}
          {renderField(t.personalData.address, data.address)}
        </View>

        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>{normalizeText(t.clinicVisit.title)}</Text>
          <View style={styles.row}>
            <View style={styles.fieldColumn}>{renderField(t.clinicVisit.admissionDate, data.admissionDate)}</View>
            <View style={styles.fieldColumn}>{renderField(t.clinicVisit.firstSymptomsDate, data.firstSymptomsDate)}</View>
          </View>
          {renderField(t.clinicVisit.referralDiagnosis, data.referralDiagnosis)}
          {renderField(t.clinicVisit.mainComplaints, data.mainComplaints)}
          {renderField(t.clinicVisit.mainComplaintsDetail, data.mainComplaintsDetail)}
          {renderField(t.clinicVisit.generalComplaints, data.generalComplaints)}
          {renderField(t.clinicVisit.additionalComplaints, data.additionalComplaints)}
          {renderField(t.clinicVisit.firstSymptoms, data.firstSymptoms)}
          {renderField(t.clinicVisit.triggers, data.triggers)}
          {renderField(t.clinicVisit.symptomsDynamic, data.symptomsDynamic)}
          {renderField(t.clinicVisit.previousDiagnosis, data.previousDiagnosis)}
          {renderField(t.clinicVisit.currentState, data.currentState)}
        </View>

        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>{normalizeText(t.lifeHistory.title)}</Text>
          {renderField(t.lifeHistory.badHabits, data.badHabits)}
          {renderField(t.lifeHistory.familyHistory, data.familyHistory)}
          {renderField(t.lifeHistory.allergies, data.allergies)}
          {renderField(t.lifeHistory.pastDiseases, data.pastDiseases)}
        </View>

        <View style={styles.section} break={false}>
          <Text style={styles.sectionTitle}>{normalizeText(t.examination.title)}</Text>
          {renderField(t.examination.generalExamination, data.generalExamination)}
          {renderField(t.examination.headNeck, data.headNeck)}
          {renderField(t.examination.skin, data.skin)}
          {renderField(t.examination.respiratory, data.respiratory)}
          {renderField(t.examination.cardiovascular, data.cardiovascular)}
          {renderField(t.examination.abdomen, data.abdomen)}
          {renderField(t.examination.musculoskeletal, data.musculoskeletal)}
          {renderField(t.examination.lymphNodes, data.lymphNodes)}
          {renderField(t.examination.abdomenPalpation, data.abdomenPalpation)}
          {renderField(t.examination.percussion, data.percussion)}
          {renderField(t.examination.lungAuscultation, data.lungAuscultation)}
          {renderField(t.examination.heartAuscultation, data.heartAuscultation)}
          {renderField(t.examination.abdomenAuscultation, data.abdomenAuscultation)}
        </View>
      </Page>
    </Document>
  )
}

export { PDFDocument }
