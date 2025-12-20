"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type MedicalFormData } from "@/ai-form/lib/validation"
import { createCustomResolver } from "@/ai-form/lib/custom-resolver"
import { useAutoSave } from "@/ai-form/lib/auto-save"
import { FormSection } from "@/ai-form/components/form-section"
import { StepNavigation } from "@/ai-form/components/step-navigation"
import { LanguageSwitcher } from "@/ai-form/components/language-switcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  User,
  Calendar,
  Stethoscope,
  FileText,
  Download,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  TestTube,
  Scan,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  History,
  Trash2,
  RotateCcw,
  Brain,
} from "lucide-react"
import { TestResultsTable } from "@/ai-form/components/test-results-table"
import { SerologicalTestTable } from "@/ai-form/components/serological-test-table"
import { Step6InstrumentalResearch } from "@/ai-form/components/instrumental-research"
import { PDFDocument } from "@/ai-form/components/pdf-document"
import { AnalysisPDFDocument } from "@/ai-form/components/analysis-pdf-document"
import { pdf } from "@react-pdf/renderer"
import { useState, useRef, useMemo, useEffect } from "react"
import { cn } from "@/ai-form/lib/utils"
import { I18nProvider, useI18n } from "@/ai-form/lib/i18n"
import { API_CONFIG } from "@/config/api"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"

export default function DoctorAIFormPage() {
  return (
    <I18nProvider>
      <AIFormInner />
    </I18nProvider>
  )
}

function AIFormInner() {
  const { t, language } = useI18n()
  const { toast } = useToast()

  const STEPS = useMemo(() => [
    { id: 1, title: t.steps.step1.title, description: t.steps.step1.description, icon: User },
    { id: 2, title: t.steps.step2.title, description: t.steps.step2.description, icon: Calendar },
    { id: 3, title: t.steps.step3.title, description: t.steps.step3.description, icon: FileText },
    { id: 4, title: t.steps.step4.title, description: t.steps.step4.description, icon: Stethoscope },
    { id: 5, title: t.steps.step5.title, description: t.steps.step5.description, icon: TestTube },
    { id: 6, title: t.steps.step6.title, description: t.steps.step6.description, icon: Scan },
  ], [t])
  const [currentStep, setCurrentStep] = useState(1)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false)
  const [formDataForSave, setFormDataForSave] = useState<MedicalFormData | null>(null)
  const [medicalHistory, setMedicalHistory] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<any | null>(null)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [isGeneratingAnalysisPDF, setIsGeneratingAnalysisPDF] = useState(false)
  const [isGeneratingHistoryPDF, setIsGeneratingHistoryPDF] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Logo URL - можно настроить через переменную окружения или использовать дефолтный путь
  const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || "/logologin.png"

  const defaultValues = useMemo(() => ({
    fullName: "",
    passport: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    education: "",
    job: "",
    nationality: "",
    profession: "",
    position: "",
    address: "",
    admissionDate: "",
    referralDiagnosis: "",
    mainComplaints: "",
    mainComplaintsDetail: "",
    generalComplaints: "",
    additionalComplaints: "",
    firstSymptomsDate: "",
    firstSymptoms: "",
    triggers: "",
    symptomsDynamic: "",
    previousDiagnosis: "",
    currentState: "",
    badHabits: "",
    familyHistory: "",
    allergies: "",
    pastDiseases: "",
    generalExamination: "",
    headNeck: "",
    skin: "",
    respiratory: "",
    cardiovascular: "",
    abdomen: "",
    musculoskeletal: "",
    lymphNodes: "",
    abdomenPalpation: "",
    percussion: "",
    lungAuscultation: "",
    heartAuscultation: "",
    abdomenAuscultation: "",
    oak_wbc: "",
    oak_rbc: "",
    oak_hgb: "",
    oak_hct: "",
    oak_mcv: "",
    oak_mch: "",
    oak_mchc: "",
    oak_rdw_cv: "",
    oak_rdw_sd: "",
    oak_plt: "",
    oak_pct: "",
    oak_mpv: "",
    oak_pdw: "",
    oam_color: "",
    oam_transparency: "",
    oam_sediment: "",
    oam_ph_reaction: "",
    oam_bilirubin: "",
    oam_urobilinogen: "",
    oam_ketones: "",
    oam_ascorbic_acid: "",
    oam_glucose: "",
    oam_protein: "",
    oam_blood: "",
    oam_ph: "",
    oam_nitrites: "",
    oam_leukocytes_digital: "",
    oam_specific_gravity: "",
    oam_epithelium: "",
    oam_leukocytes_microscopy: "",
    oam_erythrocytes_unchanged: "",
    oam_erythrocytes_changed: "",
    oam_bacteria: "",
    oam_mucus: "",
    bio_bilt: "",
    bio_bild: "",
    bio_ast: "",
    bio_alt: "",
    bio_urea: "",
    bio_crea: "",
    bio_tp: "",
    bio_alb: "",
    bio_alp: "",
    bio_amy: "",
    bio_glue: "",
    bio_ldh: "",
    bio_glob: "",
    bio_alb_glob: "",
    bio_ritis: "",
    imm_cd3: "",
    imm_cd3_hla_dr: "",
    imm_cd4_cd8_minus: "",
    imm_cd4_minus_cd8: "",
    imm_cd4_cd8_ratio: "",
    imm_cd3_minus_cd8: "",
    imm_cd4_minus_cd8_alt: "",
    imm_cd19: "",
    imm_cd16_cd56: "",
    imm_cd3_cd16_cd56: "",
    imm_cd3_cd25: "",
    imm_cd8_hla_dr: "",
    imm_cd19_cd27_igd: "",
    imm_leukocytes: "",
    imm_lymphocytes_percent: "",
    imm_igg: "",
    imm_igm: "",
    imm_iga: "",
    sero_early_igg: "",
    sero_early_igm: "",
    sero_acute_igg: "",
    sero_acute_igm: "",
    sero_immunity_igg: "",
    sero_immunity_igm: "",
    sero_risk_igg: "",
    sero_risk_igm: "",
    pcr_chlamydia: "",
    pcr_ureaplasma: "",
    pcr_mycoplasma_hominis: "",
    pcr_mycoplasma_genitalium: "",
    pcr_herpes: "",
    pcr_cmv: "",
    pcr_gonorrhea: "",
    pcr_trichomonas: "",
    pcr_gardnerella: "",
    pcr_candida: "",
    pcr_hpv_high: "",
    pcr_hpv_low: "",
    pcr_streptococcus: "",
    oak_conclusion: "",
    oam_conclusion: "",
    bio_conclusion: "",
    imm_conclusion: "",
    sero_conclusion: "",
    pcr_conclusion: "",
    instrumental_research: [],
  }), [])

  const form = useForm<MedicalFormData>({
    resolver: createCustomResolver(language),
    mode: "onChange",
    defaultValues,
  })

  useEffect(() => { form.trigger() }, [language, form])
  const { saveNow } = useAutoSave(form)

  useEffect(() => { form.trigger() }, [language, form])

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof MedicalFormData)[] = []
    switch (step) {
      case 1:
        fieldsToValidate = ["fullName", "passport", "birthDate", "gender", "maritalStatus", "education", "job", "address", "nationality", "profession", "position"]
        const result = await form.trigger(fieldsToValidate)
        if (!result) {
          const firstError = Object.keys(form.formState.errors)[0]
          if (firstError) {
            const element = document.querySelector(`[name="${firstError}"]`) as HTMLElement | null
            element?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }
        return result
      default:
        return true
    }
  }

  const handleNext = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
  const handleStepClick = async (step: number) => {
    if (step < currentStep) { setCurrentStep(step); window.scrollTo({ top: 0, behavior: "smooth" }); return }
    if (step > currentStep) {
      const isValid = await validateStep(currentStep)
      if (isValid) { setCurrentStep(step); window.scrollTo({ top: 0, behavior: "smooth" }) }
    }
  }

  // Function to find or create patient based on personal data
  const findOrCreatePatient = async (formData: MedicalFormData, token: string): Promise<number> => {
    try {
      // Parse passport (assuming format like "AA1234567" or "AA 1234567" or "AA123456")
      const passport = formData.passport?.replace(/\s+/g, '').toUpperCase() || ''

      // Try different passport formats
      let passportSeries = ''
      let passportNumber = ''

      // Format 1: AA1234567 (2 letters + 7 digits)
      if (passport.length >= 9) {
        passportSeries = passport.substring(0, 2)
        passportNumber = passport.substring(2)
      }
      // Format 2: AA123456 (2 letters + 6 digits)
      else if (passport.length >= 8) {
        passportSeries = passport.substring(0, 2)
        passportNumber = passport.substring(2)
      }
      // Format 3: Try to split by any non-alphanumeric character
      else {
        const match = passport.match(/^([A-Z]{2})(\d+)$/)
        if (match) {
          passportSeries = match[1]
          passportNumber = match[2]
        } else {
          // Last resort: split at first digit
          const splitIndex = passport.search(/\d/)
          if (splitIndex > 0) {
            passportSeries = passport.substring(0, splitIndex)
            passportNumber = passport.substring(splitIndex)
          }
        }
      }

      if (!passportSeries || !passportNumber) {
        console.error("Passport parsing failed. Original:", formData.passport, "Parsed:", { passportSeries, passportNumber })
        throw new Error("Паспортные данные неполные или неверный формат")
      }

      // Try to find existing patient by passport
      try {
        const searchResponse = await axios.get(
          `${API_CONFIG.ENDPOINTS.PATIENTS_SEARCH}?passport_series=${encodeURIComponent(passportSeries)}&passport_number=${encodeURIComponent(passportNumber)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        // Handle different response formats
        let patients = []
        if (Array.isArray(searchResponse.data)) {
          patients = searchResponse.data
        } else if (searchResponse.data?.results) {
          patients = searchResponse.data.results
        } else if (searchResponse.data?.data) {
          patients = Array.isArray(searchResponse.data.data) ? searchResponse.data.data : [searchResponse.data.data]
        }

        if (patients && patients.length > 0) {
          // Patient exists, return ID
          const patientId = patients[0].id || patients[0].pk
          if (patientId) {
            console.log("Found existing patient:", patientId)
            return patientId
          }
        }
      } catch (searchError: any) {
        // If search fails (404 or other), continue to create new patient
        // Only log if it's not a 404 (not found is expected)
        if (searchError.response?.status !== 404) {
          console.warn("Patient search failed, will try to create new:", searchError.response?.data || searchError.message)
        }
      }

      // Patient doesn't exist, create new one
      // Determine gender - check both Russian and English translations
      let genderValue: string | null = null
      const genderText = formData.gender || ''
      if (genderText.toLowerCase().includes('male') || genderText.toLowerCase().includes('муж') || genderText === 'Мужской') {
        genderValue = 'male'
      } else if (genderText.toLowerCase().includes('female') || genderText.toLowerCase().includes('жен') || genderText === 'Женский') {
        genderValue = 'female'
      }

      // Prepare patient data - only required fields and valid optional fields
      const newPatientData: any = {
        full_name: (formData.fullName || '').trim(),
        passport_series: passportSeries.trim(),
        passport_number: passportNumber.trim(),
      }

      // Validate required fields
      if (!newPatientData.full_name) {
        throw new Error("ФИО обязательно для заполнения")
      }
      if (!newPatientData.passport_series || !newPatientData.passport_number) {
        throw new Error("Паспортные данные обязательны")
      }

      // Add optional fields only if they have values
      if (formData.birthDate && formData.birthDate.trim()) {
        newPatientData.birth_date = formData.birthDate.trim()
      }
      if (genderValue) {
        newPatientData.gender = genderValue
      }
      if (formData.address && formData.address.trim()) {
        newPatientData.address = formData.address.trim()
      }

      console.log("Creating patient with data:", newPatientData)

      const createResponse = await axios.post(
        API_CONFIG.ENDPOINTS.PATIENT_CREATE,
        newPatientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      console.log("Patient creation response:", createResponse.data)

      // Handle different response formats
      let patientId = null
      if (createResponse.data?.data?.id) {
        patientId = createResponse.data.data.id
      } else if (createResponse.data?.id) {
        patientId = createResponse.data.id
      } else if (createResponse.data?.pk) {
        patientId = createResponse.data.pk
      } else if (typeof createResponse.data === 'number') {
        patientId = createResponse.data
      }

      if (!patientId) {
        console.error("Could not extract patient ID from response:", createResponse.data)
        throw new Error("Не удалось получить ID созданного пациента из ответа сервера")
      }

      return patientId
    } catch (error: any) {
      console.error("Error finding/creating patient:", error)
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        formData: {
          fullName: formData.fullName,
          passport: formData.passport,
          birthDate: formData.birthDate,
          gender: formData.gender,
        }
      })

      // Extract error message from different possible formats
      let errorMessage = ''
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.map((err: any) =>
            typeof err === 'string' ? err : (err.message || JSON.stringify(err))
          ).join(', ')
        } else if (typeof error.response.data === 'object') {
          // Try to extract field errors
          const fieldErrors = Object.entries(error.response.data)
            .map(([field, errors]: [string, any]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`
              }
              return `${field}: ${errors}`
            })
            .join('; ')
          if (fieldErrors) {
            errorMessage = fieldErrors
          }
        }
      }

      if (!errorMessage) {
        errorMessage = error.message || 'Неизвестная ошибка'
      }

      throw new Error("Не удалось найти или создать пациента: " + errorMessage)
    }
  }

  // Function to map AI form data to KasallikTarixi format
  const mapFormDataToMedicalHistory = (formData: MedicalFormData, patientId: number) => {
    // Extract job information - try to split by common separators
    const jobText = formData.job || ''
    let kasbi = ''
    let ishJoyi = ''
    let ishVazifasi = ''

    // Try to parse job field (format: "Место работы, специальность, должность")
    const jobParts = jobText.split(',').map(s => s.trim()).filter(Boolean)
    if (jobParts.length >= 1) {
      ishJoyi = jobParts[0]
    }
    if (jobParts.length >= 2) {
      kasbi = jobParts[1]
    }
    if (jobParts.length >= 3) {
      ishVazifasi = jobParts.slice(2).join(', ')
    }

    // Combine all complaints
    const allComplaints = [
      formData.mainComplaints,
      formData.mainComplaintsDetail,
      formData.generalComplaints,
      formData.additionalComplaints,
      formData.firstSymptoms,
    ].filter(Boolean).join('\n')

    // Combine examination data
    const examinationData = [
      formData.generalExamination,
      formData.headNeck,
      formData.skin,
      formData.respiratory,
      formData.cardiovascular,
      formData.abdomen,
      formData.musculoskeletal,
      formData.lymphNodes,
      formData.abdomenPalpation,
      formData.percussion,
      formData.lungAuscultation,
      formData.heartAuscultation,
      formData.abdomenAuscultation,
    ].filter(Boolean).join('\n')

    // Combine test results
    const testResults = []
    if (formData.oak_conclusion) testResults.push(`ОАК: ${formData.oak_conclusion}`)
    if (formData.oam_conclusion) testResults.push(`ОАМ: ${formData.oam_conclusion}`)
    if (formData.bio_conclusion) testResults.push(`Биохимия: ${formData.bio_conclusion}`)
    if (formData.imm_conclusion) testResults.push(`Иммунология: ${formData.imm_conclusion}`)
    if (formData.sero_conclusion) testResults.push(`Серология: ${formData.sero_conclusion}`)
    if (formData.pcr_conclusion) testResults.push(`ПЦР: ${formData.pcr_conclusion}`)

    // Combine instrumental research with AI analyses
    const instrumentalData = formData.instrumental_research?.map((item, itemIndex) => {
      // Get research type label
      const researchTypeLabels: Record<string, string> = {
        'xray': 'Рентгенография',
        'fluoroscopy': 'Рентгеноскопия',
        'contrast': 'Контрастные исследования',
        'ct': 'КТ / МСКТ',
        'mri': 'МРТ',
        'ultrasound': 'УЗИ',
        'echocardiography': 'Эхокардиография',
        'ecg': 'ЭКГ',
        'eeg': 'ЭЭГ',
        'pft': 'ФВД',
        'other': item.type || 'Другое',
      }
      const researchTypeLabel = researchTypeLabels[item.type] || item.type || 'Исследование'
      
      let result = `\n${researchTypeLabel}`
      if (item.date) result += `\nДата: ${item.date}`
      if (item.performingDoctor) result += `\nВрач-выполняющий: ${item.performingDoctor}`
      if (item.institution) result += `\nУчреждение: ${item.institution}`
      if (item.comment) result += `\nКомментарий врача: ${item.comment}`
      
      // Add AI analyses for images
      if (item.images && item.images.length > 0) {
        result += `\n\n📷 Изображения (${item.images.length}):`
        item.images.forEach((image, imgIndex) => {
          result += `\n\n🖼️ Изображение ${imgIndex + 1}:`
          if (item.imageAnalyses && item.imageAnalyses[imgIndex]) {
            result += `\n\n🤖 AI Tahlil:\n${item.imageAnalyses[imgIndex]}\n`
          }
        })
      }
      
      return result
    }).join('\n\n' + '='.repeat(50) + '\n\n') || ''

    return {
      patient: patientId,
      fish: formData.fullName || '',
      tugilgan_sana: formData.birthDate || new Date().toISOString().split('T')[0],
      millati: '', // Not in AI form
      malumoti: formData.education || '',
      kasbi: kasbi,
      ish_joyi: ishJoyi,
      ish_vazifasi: ishVazifasi,
      uy_manzili: formData.address || '',
      kelgan_vaqti: formData.admissionDate || new Date().toISOString().split('T')[0],
      shikoyatlar: allComplaints,

      // Respiratory system - use respiratory examination data
      nafas_tizimi: formData.respiratory || '',
      yotal: '', // Not in AI form
      balgam: '', // Not in AI form
      qon_tuflash: '', // Not in AI form
      kokrak_ogriq: '', // Not in AI form
      nafas_qisishi: '', // Not in AI form

      // Cardiovascular system - use cardiovascular examination data
      yurak_qon_shikoyatlari: formData.cardiovascular || '',
      yurak_ogriq: '', // Not in AI form
      yurak_urishi_ozgarishi: '', // Not in AI form
      yurak_urishi_sezish: '', // Not in AI form

      // Digestive system - use abdomen examination data
      hazm_tizimi: formData.abdomen || '',
      qusish: '', // Not in AI form
      qorin_ogriq: '', // Not in AI form
      ich_ozgarishi: '', // Not in AI form
      anus_shikoyatlar: '', // Not in AI form

      // Urinary system
      siydik_tizimi: '', // Not in AI form

      // Endocrine system
      endokrin_tizimi: '', // Not in AI form

      // Musculoskeletal system
      tayanch_tizimi: formData.musculoskeletal || '',

      // Nervous system
      asab_tizimi: '', // Not in AI form

      // Doctor recommendations
      doktor_tavsiyalari: [
        '=== ОБЪЕКТИВНОЕ ОБСЛЕДОВАНИЕ ===',
        examinationData,
        testResults.length > 0 ? '\n=== РЕЗУЛЬТАТЫ АНАЛИЗОВ ===\n' + testResults.join('\n') : '',
        instrumentalData ? '\n=== ИНСТРУМЕНТАЛЬНЫЕ ИССЛЕДОВАНИЯ ===\n' + instrumentalData : '',
      ].filter(Boolean).join('\n\n'),

      // Qo'shimcha ma'lumotlar (Life History)
      zararli_odatlar: formData.badHabits || '',
      oilaviy_anamnez: formData.familyHistory || '',
      allergiyalar: formData.allergies || '',
      otkazilgan_kasalliklar: formData.pastDiseases || '',

      // Fizikal ko'rik (Examination)
      umumiy_korik: formData.generalExamination || '',
      bosh_boyin: formData.headNeck || '',
      teri: formData.skin || '',
      limfa_tugunlari: formData.lymphNodes || '',
      qorin_palpatsiyasi: formData.abdomenPalpation || '',
      perkussiya: formData.percussion || '',
      opka_auskultatsiyasi: formData.lungAuscultation || '',
      yurak_auskultatsiyasi: formData.heartAuscultation || '',
      qorin_auskultatsiyasi: formData.abdomenAuscultation || '',

      // AI Analysis
      ai_tahlil: analysisResult || ''
    }
  }

  // Function to format analysis text with markdown support
  const formatAnalysisText = (text: string) => {
    if (!text) return null

    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []
    let currentListItems: React.ReactNode[] = []
    let listKey = 0

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ')
        if (paragraphText.trim()) {
          elements.push(
            <p key={`p-${elements.length}`} className="text-gray-800 leading-relaxed mb-4 last:mb-0">
              {formatInlineMarkdown(paragraphText)}
            </p>
          )
        }
        currentParagraph = []
      }
    }

    const flushList = () => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`ul-${listKey++}`} className="list-none space-y-2 mb-4 ml-0">
            {currentListItems}
          </ul>
        )
        currentListItems = []
      }
    }

    const formatInlineMarkdown = (text: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = []
      let currentIndex = 0

      // Match **bold**, *italic*, and regular text
      const boldRegex = /\*\*(.+?)\*\*/g
      const italicRegex = /\*(.+?)\*/g
      const matches: Array<{ type: 'bold' | 'italic', start: number, end: number, text: string }> = []

      let match
      while ((match = boldRegex.exec(text)) !== null) {
        matches.push({ type: 'bold', start: match.index, end: match.index + match[0].length, text: match[1] })
      }
      while ((match = italicRegex.exec(text)) !== null) {
        // Skip if it's part of a bold match
        const isPartOfBold = matches.some(m => match!.index >= m.start && match!.index < m.end)
        if (!isPartOfBold) {
          matches.push({ type: 'italic', start: match.index, end: match.index + match[0].length, text: match[1] })
        }
      }

      matches.sort((a, b) => a.start - b.start)

      matches.forEach((match, idx) => {
        // Add text before match
        if (match.start > currentIndex) {
          const beforeText = text.substring(currentIndex, match.start)
          if (beforeText) {
            parts.push(<span key={`text-${idx}-before`}>{beforeText}</span>)
          }
        }

        // Add formatted match
        if (match.type === 'bold') {
          parts.push(
            <strong key={`bold-${idx}`} className="font-semibold text-gray-900">
              {match.text}
            </strong>
          )
        } else {
          parts.push(
            <em key={`italic-${idx}`} className="italic text-gray-700">
              {match.text}
            </em>
          )
        }

        currentIndex = match.end
      })

      // Add remaining text
      if (currentIndex < text.length) {
        const remainingText = text.substring(currentIndex)
        if (remainingText) {
          parts.push(<span key={`text-final`}>{remainingText}</span>)
        }
      }

      return parts.length > 0 ? parts : [text]
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      // Headers (## or ###)
      if (trimmedLine.startsWith('###')) {
        flushParagraph()
        flushList()
        const headerText = trimmedLine.replace(/^###+\s*/, '')
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg font-bold text-gray-900 mt-6 mb-3 first:mt-0 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
            {formatInlineMarkdown(headerText)}
          </h3>
        )
        return
      }

      if (trimmedLine.startsWith('##')) {
        flushParagraph()
        flushList()
        const headerText = trimmedLine.replace(/^##+\s*/, '')
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl font-bold text-gray-900 mt-8 mb-4 first:mt-0 flex items-center gap-3 border-b border-blue-200 pb-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
            {formatInlineMarkdown(headerText)}
          </h2>
        )
        return
      }

      // List items (- or *)
      if (trimmedLine.match(/^[-*]\s+/)) {
        flushParagraph()
        const listText = trimmedLine.replace(/^[-*]\s+/, '')
        currentListItems.push(
          <li key={`li-${index}`} className="flex items-start gap-2 text-gray-800">
            <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
            <span className="flex-1">{formatInlineMarkdown(listText)}</span>
          </li>
        )
        return
      }

      // Numbered list
      if (trimmedLine.match(/^\d+\.\s+/)) {
        flushParagraph()
        const listText = trimmedLine.replace(/^\d+\.\s+/, '')
        const number = trimmedLine.match(/^(\d+)\./)?.[1] || ''
        currentListItems.push(
          <li key={`li-${index}`} className="flex items-start gap-2 text-gray-800">
            <span className="text-blue-500 font-semibold mt-1.5 flex-shrink-0 min-w-[20px]">{number}.</span>
            <span className="flex-1">{formatInlineMarkdown(listText)}</span>
          </li>
        )
        return
      }

      // Empty line
      if (!trimmedLine) {
        flushParagraph()
        flushList()
        return
      }

      // Regular paragraph text
      flushList()
      currentParagraph.push(trimmedLine)
    })

    flushParagraph()
    flushList()

    return elements.length > 0 ? elements : <p className="text-gray-800">{text}</p>
  }

  const onSubmit = async (data: MedicalFormData) => {
    if (currentStep !== STEPS.length) return
    const isValid = await validateStep(currentStep)
    if (!isValid) return

    // Analyze medical form data using ChatGPT
    setIsAnalyzing(true)
    setShowAnalysisDialog(true)

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("Требуется авторизация")
      }

      // Step 1: Analyze with ChatGPT
      const analysisResponse = await axios.post(
        API_CONFIG.ENDPOINTS.ANALYZE_MEDICAL_FORM,
        { ...data, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (analysisResponse.data.status === "success" && analysisResponse.data.analysis) {
        // Fix text encoding from API response
        let analysisText = analysisResponse.data.analysis
        if (typeof analysisText === 'string') {
          // Ensure proper UTF-8 encoding
          analysisText = analysisText
            .replace(/^\uFEFF/, '') // Remove BOM
            .normalize('NFC') // Normalize Unicode
        }
        setAnalysisResult(analysisText)
        // Store form data for saving
        setFormDataForSave(data)
      } else {
        throw new Error("Не удалось получить анализ")
      }

      // Step 2: Save to medical history
      setIsSaving(true)
      setSaveStatus('saving')
      setSaveError(null)

      try {
        // Find or create patient
        const patientId = await findOrCreatePatient(data, token)
        setSelectedPatientId(patientId)

        // Map form data to medical history format
        const medicalHistoryData = mapFormDataToMedicalHistory(data, patientId)

        // Save medical history
        await axios.post(
          API_CONFIG.ENDPOINTS.MEDICAL_HISTORY,
          medicalHistoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        // Show success
        setSaveStatus('success')
        setSelectedPatientId(patientId) // Ensure patient ID is set
        toast({
          title: "Успешно сохранено",
          description: "Медицинская анкета сохранена в историю болезни пациента",
          variant: "default",
        })
        console.log("Medical history saved successfully")

        // Refresh medical history list after saving
        setTimeout(() => {
          fetchMedicalHistory(patientId)
        }, 500) // Small delay to ensure data is saved on backend
      } catch (saveError: any) {
        console.error("Error saving medical history:", saveError)
        setSaveStatus('error')
        setSaveError(
          saveError.response?.data?.error ||
          saveError.response?.data?.message ||
          saveError.message ||
          "Не удалось сохранить в историю болезни"
        )
        toast({
          title: "Ошибка сохранения",
          description: "Анализ завершен, но не удалось сохранить данные. Вы можете попробовать сохранить позже.",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    } catch (error: any) {
      console.error("Error analyzing medical form:", error)
      setAnalysisResult(
        error.response?.data?.error ||
        error.message ||
        "Произошла ошибка при анализе медицинской анкеты. Пожалуйста, попробуйте позже."
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Function to retry saving medical history
  const retrySaveMedicalHistory = async () => {
    if (!formDataForSave) return

    setIsSaving(true)
    setSaveStatus('saving')
    setSaveError(null)

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("Требуется авторизация")
      }

      // Find or create patient
      const patientId = await findOrCreatePatient(formDataForSave, token)

      // Map form data to medical history format
      const medicalHistoryData = mapFormDataToMedicalHistory(formDataForSave, patientId)

      // Save medical history
      await axios.post(
        API_CONFIG.ENDPOINTS.MEDICAL_HISTORY,
        medicalHistoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      // Show success
      setSaveStatus('success')
      setSelectedPatientId(patientId)
      // Refresh medical history after a short delay to ensure data is saved
      setTimeout(() => {
        fetchMedicalHistory(patientId)
      }, 500)
      toast({
        title: "Успешно сохранено",
        description: "Медицинская анкета сохранена в историю болезни пациента",
        variant: "default",
      })
    } catch (saveError: any) {
      console.error("Error saving medical history:", saveError)
      setSaveStatus('error')
      setSaveError(
        saveError.response?.data?.error ||
        saveError.response?.data?.message ||
        saveError.message ||
        "Не удалось сохранить в историю болезни"
      )
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить данные. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (formRef.current) {
      formRef.current.onsubmit = (ev) => { ev?.preventDefault(); ev?.stopPropagation(); return false }
    }
    try { saveNow(); alert(t.messages.saved) } catch { /* noop */ }
    return false
  }

  // Function to clear/reset form
  const handleClearForm = () => {
    if (!confirm("Barcha ma'lumotlarni o'chirishni xohlaysizmi? Barcha kiritilgan ma'lumotlar yo'qoladi.")) {
      return
    }

    form.reset(defaultValues)
    setCurrentStep(1)
    setSelectedHistoryEntry(null)
    setAnalysisResult(null)
    setFormDataForSave(null)

    toast({
      title: "Tozalandi",
      description: "Barcha ma'lumotlar o'chirildi",
      variant: "default",
    })
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const data = form.getValues()
      const doc = <PDFDocument data={data} language={language} />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `медицинская_анкета_${data.fullName || "пациент"}_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url)
    } catch { alert(t.messages.pdfError) } finally { setIsGeneratingPDF(false) }
  }

  // Helper function to fix text encoding
  const fixTextEncoding = (text: string): string => {
    if (!text) return ""
    try {
      // Ensure text is properly encoded
      // If text has encoding issues, try to fix them
      let fixed = text

      // Check if text has encoding issues (contains replacement characters or mojibake)
      // Try to decode and re-encode properly
      if (typeof text === 'string') {
        // Remove any BOM and normalize
        fixed = text.replace(/^\uFEFF/, '').normalize('NFC')
      }

      return fixed
    } catch (e) {
      console.warn("Text encoding fix error:", e)
      return text
    }
  }

  // Function to download analysis PDF
  const handleDownloadAnalysisPDF = async () => {
    if (!analysisResult || !formDataForSave) return

    setIsGeneratingAnalysisPDF(true)
    try {
      // Fix encoding for analysis result
      const fixedAnalysisResult = fixTextEncoding(analysisResult)

      // Fix encoding for form data
      const fixedFormData = {
        ...formDataForSave,
        fullName: fixTextEncoding(formDataForSave.fullName || ''),
        passport: fixTextEncoding(formDataForSave.passport || ''),
        birthDate: fixTextEncoding(formDataForSave.birthDate || ''),
        gender: fixTextEncoding(formDataForSave.gender || ''),
        education: fixTextEncoding(formDataForSave.education || ''),
        job: fixTextEncoding(formDataForSave.job || ''),
        address: fixTextEncoding(formDataForSave.address || ''),
      }

      const doc = <AnalysisPDFDocument
        formData={fixedFormData}
        analysisResult={fixedAnalysisResult}
        logoUrl={LOGO_URL}
        language={language}
      />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `анализ_медицинской_анкеты_${formDataForSave.fullName || "пациент"}_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "PDF скачан",
        description: "Анализ медицинской анкеты успешно сохранен в PDF",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error generating analysis PDF:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF файл",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAnalysisPDF(false)
    }
  }

  // Function to delete history entry
  const handleDeleteHistory = async () => {
    if (!selectedHistoryEntry || !selectedHistoryEntry.id) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить запись",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Вы уверены, что хотите удалить эту запись истории болезни?")) {
      return
    }

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("Требуется авторизация")
      }

      const deleteUrl = selectedHistoryEntry.id
        ? `${API_CONFIG.ENDPOINTS.MEDICAL_HISTORY}${selectedHistoryEntry.id}/`
        : `${API_CONFIG.ENDPOINTS.MEDICAL_HISTORY}${selectedHistoryEntry.pk || selectedHistoryEntry.id}/`

      await axios.delete(
        deleteUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast({
        title: "Успешно",
        description: "Запись истории болезни удалена",
        variant: "default",
      })

      // Close dialog and refresh history
      setShowHistoryDialog(false)
      setSelectedHistoryEntry(null)
      fetchMedicalHistory()
    } catch (error: any) {
      console.error("Error deleting history entry:", error)
      toast({
        title: "Ошибка",
        description: error.response?.data?.message || "Не удалось удалить запись",
        variant: "destructive",
      })
    }
  }

  // Function to fill form with history entry data
  const handleFillFormFromHistory = () => {
    if (!selectedHistoryEntry) return

    try {
      // Map history entry data to form data
      const formData: Partial<MedicalFormData> = {
        fullName: selectedHistoryEntry.fish || "",
        birthDate: selectedHistoryEntry.tugilgan_sana || "",
        education: selectedHistoryEntry.malumoti || "",
        job: selectedHistoryEntry.kasbi || (selectedHistoryEntry.ish_joyi ? `${selectedHistoryEntry.ish_joyi}${selectedHistoryEntry.ish_vazifasi ? `, ${selectedHistoryEntry.ish_vazifasi}` : ''}` : ""),
        address: selectedHistoryEntry.uy_manzili || "",
        admissionDate: selectedHistoryEntry.kelgan_vaqti || "",
        mainComplaints: selectedHistoryEntry.shikoyatlar || "",
        // Add more mappings as needed
      }

      // Set form values
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          form.setValue(key as keyof MedicalFormData, value as any)
        }
      })

      // Close dialog
      setShowHistoryDialog(false)
      setSelectedHistoryEntry(null)

      // Go to first step
      setCurrentStep(1)

      toast({
        title: "Успешно",
        description: "Форма заполнена данными из истории болезни",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error filling form from history:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось заполнить форму",
        variant: "destructive",
      })
    }
  }

  // Function to download history entry PDF with analysis
  const handleDownloadHistoryPDF = async () => {
    if (!selectedHistoryEntry || !formDataForSave || !analysisResult) return

    setIsGeneratingHistoryPDF(true)
    try {
      const doc = <AnalysisPDFDocument
        formData={formDataForSave}
        analysisResult={analysisResult}
        logoUrl={LOGO_URL}
        language={language}
      />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `kasallik_tarixi_${selectedHistoryEntry.fish || "пациент"}_${new Date(selectedHistoryEntry.yuborilgan_vaqt || selectedHistoryEntry.kelgan_vaqti).toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "PDF скачан",
        description: "История болезни с анализом успешно сохранена в PDF",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error generating history PDF:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF файл",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingHistoryPDF(false)
    }
  }

  // Function to download PDF from history entry data
  const handleDownloadHistoryEntryPDF = async () => {
    if (!selectedHistoryEntry) return

    setIsGeneratingHistoryPDF(true)
    try {
      // Convert history entry to form data format
      const formDataFromHistory: MedicalFormData = {
        fullName: selectedHistoryEntry.fish || "",
        passport: selectedHistoryEntry.passport || "",
        birthDate: selectedHistoryEntry.tugilgan_sana ? new Date(selectedHistoryEntry.tugilgan_sana).toISOString().split("T")[0] : "",
        gender: selectedHistoryEntry.jinsi || "",
        maritalStatus: selectedHistoryEntry.oila_holati || "",
        education: selectedHistoryEntry.malumoti || "",
        job: selectedHistoryEntry.kasbi || "",
        nationality: selectedHistoryEntry.millati || "",
        profession: selectedHistoryEntry.kasbi || "",
        position: selectedHistoryEntry.ish_vazifasi || "",
        address: selectedHistoryEntry.uy_manzili || "",
        mainComplaints: selectedHistoryEntry.shikoyatlar || "",
        previousDiagnosis: selectedHistoryEntry.asosiy_kasalliklar || "",
        respiratory: selectedHistoryEntry.nafas_tizimi || "",

        cardiovascular: selectedHistoryEntry.yurak_qon_shikoyatlari || "",

        abdomen: selectedHistoryEntry.hazm_tizimi || "",

        // anusSymptoms: selectedHistoryEntry.anus_shikoyatlar || "",


        musculoskeletal: selectedHistoryEntry.tayanch_tizimi || "",
        // nervousSystem and endocrineSystem are not in MedicalFormData schema so we skip them
        // endocrineSystem: selectedHistoryEntry.endokrin_tizimi || "",
        // nervousSystem: selectedHistoryEntry.asab_tizimi || "",
        badHabits: selectedHistoryEntry.zararli_odatlar || "",
        familyHistory: selectedHistoryEntry.oilaviy_anamnez || "",
        allergies: selectedHistoryEntry.allergiyalar || "",
        pastDiseases: selectedHistoryEntry.otkazilgan_kasalliklar || "",

        // Restore Examination
        generalExamination: selectedHistoryEntry.umumiy_korik || "",
        headNeck: selectedHistoryEntry.bosh_boyin || "",
        skin: selectedHistoryEntry.teri || "",
        lymphNodes: selectedHistoryEntry.limfa_tugunlari || "",
        abdomenPalpation: selectedHistoryEntry.qorin_palpatsiyasi || "",
        percussion: selectedHistoryEntry.perkussiya || "",
        lungAuscultation: selectedHistoryEntry.opka_auskultatsiyasi || "",
        heartAuscultation: selectedHistoryEntry.yurak_auskultatsiyasi || "",
        abdomenAuscultation: selectedHistoryEntry.qorin_auskultatsiyasi || "",
        
        // Parse instrumental research from doktor_tavsiyalari
        instrumental_research: (() => {
          if (!selectedHistoryEntry.doktor_tavsiyalari || !selectedHistoryEntry.doktor_tavsiyalari.includes('=== ИНСТРУМЕНТАЛЬНЫЕ ИССЛЕДОВАНИЯ ===')) {
            return []
          }
          
          const instrumentalSection = selectedHistoryEntry.doktor_tavsiyalari.split('=== ИНСТРУМЕНТАЛЬНЫЕ ИССЛЕДОВАНИЯ ===')[1]?.split('===')[0]?.trim() || ''
          if (!instrumentalSection) return []
          
          const researchItems = instrumentalSection.split('='.repeat(50)).filter((item: string) => item.trim())
          
          return researchItems.map((item: string) => {
            const lines = item.trim().split('\n').filter((line: string) => line.trim())
            if (lines.length === 0) return null
            
            const researchType = lines[0] || 'Исследование'
            const researchData: any = {
              type: researchType,
              images: [],
              imageAnalyses: [],
            }
            
            let currentImageIndex = -1
            let isInAIAnalysis = false
            let currentAIAnalysis = ''
            
            lines.slice(1).forEach((line: string) => {
              if (line.startsWith('Дата:')) {
                researchData.date = line.replace('Дата:', '').trim()
              } else if (line.startsWith('Врач-выполняющий:')) {
                researchData.performingDoctor = line.replace('Врач-выполняющий:', '').trim()
              } else if (line.startsWith('Учреждение:')) {
                researchData.institution = line.replace('Учреждение:', '').trim()
              } else if (line.startsWith('Комментарий врача:')) {
                researchData.comment = line.replace('Комментарий врача:', '').trim()
              } else if (line.includes('🖼️ Изображение')) {
                currentImageIndex++
                researchData.images.push('') // Placeholder for image
              } else if (line.includes('🤖 AI Tahlil:')) {
                isInAIAnalysis = true
                currentAIAnalysis = ''
              } else if (isInAIAnalysis) {
                if (line.trim() && !line.startsWith('Дата:') && !line.startsWith('Врач:') && !line.startsWith('Учреждение:') && !line.startsWith('Комментарий:')) {
                  currentAIAnalysis += line + '\n'
                } else {
                  if (currentAIAnalysis && currentImageIndex >= 0) {
                    researchData.imageAnalyses[currentImageIndex] = currentAIAnalysis.trim()
                    currentAIAnalysis = ''
                  }
                  isInAIAnalysis = false
                }
              }
            })
            
            if (currentAIAnalysis && currentImageIndex >= 0) {
              researchData.imageAnalyses[currentImageIndex] = currentAIAnalysis.trim()
            }
            
            return researchData
            }).filter((item: any) => item !== null) as any[]
        })(),
      }

      const doc = <PDFDocument data={formDataFromHistory} language={language} />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `kasallik_tarixi_${selectedHistoryEntry.fish || "пациент"}_${new Date(selectedHistoryEntry.yuborilgan_vaqt || selectedHistoryEntry.kelgan_vaqti || Date.now()).toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "PDF скачан",
        description: "История болезни успешно сохранена в PDF",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error generating history entry PDF:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF файл",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingHistoryPDF(false)
    }
  }

  // Function to fetch medical history - loads ALL history regardless of patient
  const fetchMedicalHistory = async (patientId?: number) => {
    setIsLoadingHistory(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.log("No access token available")
        setIsLoadingHistory(false)
        setMedicalHistory([])
        return
      }

      // If patientId is provided, filter by patient, otherwise load all history
      const url = patientId
        ? `${API_CONFIG.ENDPOINTS.MEDICAL_HISTORY}?patient_id=${patientId}`
        : API_CONFIG.ENDPOINTS.MEDICAL_HISTORY

      console.log("📋 Fetching medical history:", patientId ? `for patient ${patientId}` : "ALL history")
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("Medical history response:", response.data)
      if (response.data && Array.isArray(response.data)) {
        const sortedHistory = response.data.sort((a: any, b: any) => {
          const dateA = new Date(a.yuborilgan_vaqt || a.kelgan_vaqti || 0).getTime()
          const dateB = new Date(b.yuborilgan_vaqt || b.kelgan_vaqti || 0).getTime()
          return dateB - dateA // Newest first
        })
        console.log("Setting medical history:", sortedHistory.length, "entries")
        setMedicalHistory(sortedHistory)
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // Handle case where API returns object instead of array
        const historyArray = Object.values(response.data)
        if (Array.isArray(historyArray)) {
          const sortedHistory = historyArray.sort((a: any, b: any) => {
            const dateA = new Date(a.yuborilgan_vaqt || a.kelgan_vaqti || 0).getTime()
            const dateB = new Date(b.yuborilgan_vaqt || b.kelgan_vaqti || 0).getTime()
            return dateB - dateA
          })
          setMedicalHistory(sortedHistory)
        } else {
          setMedicalHistory([])
        }
      } else {
        console.log("No medical history data found")
        setMedicalHistory([])
      }
    } catch (error: any) {
      console.error("Error fetching medical history:", error)
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      setMedicalHistory([])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Handle refresh button click
  const handleRefreshHistory = async () => {
    await fetchMedicalHistory()
  }

  // Load ALL medical history on component mount - IMMEDIATELY
  useEffect(() => {
    console.log("🔄 Component mounted, loading ALL medical history")
    // Try to load immediately
    fetchMedicalHistory()

    // Also try after a short delay in case token wasn't ready
    const timer = setTimeout(() => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        console.log("🔄 Retrying to load ALL medical history")
        fetchMedicalHistory()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, []) // Run only on mount

  // Refresh history after saving new entry
  useEffect(() => {
    if (saveStatus === 'success') {
      // Refresh all history after successful save
      setTimeout(() => {
        console.log("🔄 Refreshing ALL medical history after save")
        fetchMedicalHistory()
      }, 500)
    }
  }, [saveStatus])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1PersonalData form={form} />
      case 2: return <Step2ClinicVisit form={form} />
      case 3: return <Step3LifeHistory form={form} />
      case 4: return <Step4Examination form={form} />
      case 5: return <Step5TestResults form={form} />
      case 6: return <Step6InstrumentalResearch form={form} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/40">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side (2 columns on large screens) */}
          <div className="lg:col-span-2">
            <div className="flex justify-end mb-4"><LanguageSwitcher /></div>
            <header className="mb-6 md:mb-8 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 mb-4 shadow-xl shadow-blue-500/30 transition-transform hover:scale-105">
                <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">{t.title}</h1>
              <p className="text-gray-600 text-sm md:text-base">{t.subtitle}</p>
            </header>

            <div className="mb-8">
              <StepNavigation
                steps={STEPS.map((step) => ({ id: step.id, title: step.title, description: step.description, icon: <step.icon className="w-4 h-4" /> }))}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </div>

            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); if (currentStep === STEPS.length) { form.handleSubmit(onSubmit)(e) } return false }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentStep !== STEPS.length) {
                    const target = e.target as HTMLElement
                    if (target.tagName !== "TEXTAREA" && target.tagName !== "BUTTON") {
                      e.preventDefault(); e.stopPropagation()
                    }
                  }
                }}
                className="space-y-6"
              >
                <div className="min-h-[500px] animate-fade-in">{renderStepContent()}</div>

                <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl rounded-t-2xl p-4 md:p-6 mt-8 -mx-4 md:mx-0 md:rounded-xl">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="flex-1 sm:flex-none min-w-[120px] transition-all duration-200 hover:shadow-md">
                        <ArrowLeft className="w-4 h-4 mr-2" />{t.buttons.back}
                      </Button>
                      {currentStep < STEPS.length ? (
                        <Button type="button" onClick={handleNext} className="flex-1 sm:flex-none min-w-[120px] bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                          {t.buttons.next}<ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button type="submit" className="flex-1 sm:flex-none min-w-[120px] bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                          <Send className="w-4 h-4 mr-2" />{t.buttons.submit}
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto flex-wrap">
                      <Button type="button" variant="outline" onClick={handleSaveClick} className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md">
                        <Save className="w-4 h-4 mr-2" />{t.buttons.save}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClearForm}
                        className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Tozalash
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Medical History Sidebar - Right Side (1 column on large screens) */}
          <div className="lg:col-span-1 order-2 lg:order-3">
            <Card className="sticky top-6 h-[calc(100vh-3rem)] flex flex-col shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-600" />
                    <span>So'rovlar tarixi</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshHistory}
                    disabled={isLoadingHistory}
                    className="h-8 w-8 p-0"
                    title="Yangilash"
                  >
                    {isLoadingHistory ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : medicalHistory.length > 0 ? (
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {medicalHistory.map((entry: any, index: number) => {
                        const entryDate = entry.yuborilgan_vaqt || entry.kelgan_vaqti
                        const formattedDate = entryDate
                          ? new Date(entryDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                          : 'Дата не указана'

                        return (
                          <div
                            key={entry.id || index}
                            onClick={() => {
                              setSelectedHistoryEntry(entry)
                              setShowHistoryDialog(true)
                            }}
                            className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-semibold text-gray-800">
                                  {formattedDate}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Kasallik tarixi
                              </Badge>
                            </div>

                            {entry.fish && (
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {entry.fish}
                              </p>
                            )}

                            {entry.shikoyatlar && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 mb-1 font-medium">
                                  Shikoyatlar:
                                </p>
                                <p className="text-xs text-gray-700 line-clamp-3">
                                  {entry.shikoyatlar.length > 150
                                    ? entry.shikoyatlar.substring(0, 150) + '...'
                                    : entry.shikoyatlar}
                                </p>
                              </div>
                            )}

                            {entry.doktor_tavsiyalari && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs text-gray-600 mb-1 font-medium">
                                  Doktor tavsiyalari:
                                </p>
                                <p className="text-xs text-gray-700 line-clamp-2">
                                  {entry.doktor_tavsiyalari.length > 100
                                    ? entry.doktor_tavsiyalari.substring(0, 100) + '...'
                                    : entry.doktor_tavsiyalari}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <History className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">
                      Kasalliklar tarixi mavjud emas
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Birinchi yozuv qo'shilgandan keyin bu yerda ko'rinadi
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical History Detail Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Kasallik tarixi - Batafsil ma'lumot
              </DialogTitle>
              <DialogDescription>
                {selectedHistoryEntry?.fish && (
                  <span className="text-base font-medium text-gray-700">
                    {selectedHistoryEntry.fish}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {selectedHistoryEntry && (
              <div className="mt-4 space-y-4">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Asosiy ma'lumotlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">F.I.SH</p>
                        <p className="text-sm text-gray-900">{selectedHistoryEntry.fish || "Kiritilmagan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tug'ilgan sana</p>
                        <p className="text-sm text-gray-900">
                          {selectedHistoryEntry.tugilgan_sana
                            ? new Date(selectedHistoryEntry.tugilgan_sana).toLocaleDateString('ru-RU')
                            : "Kiritilmagan"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Millati</p>
                        <p className="text-sm text-gray-900">{selectedHistoryEntry.millati || "Kiritilmagan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ma'lumoti</p>
                        <p className="text-sm text-gray-900">{selectedHistoryEntry.malumoti || "Kiritilmagan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Kasbi</p>
                        <p className="text-sm text-gray-900">{selectedHistoryEntry.kasbi || "Kiritilmagan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ish joyi</p>
                        <p className="text-sm text-gray-900">{selectedHistoryEntry.ish_joyi || "Kiritilmagan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ish vazifasi</p>
                        <p className="text-sm text-gray-900">{selectedHistoryEntry.ish_vazifasi || "Kiritilmagan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Uy manzili</p>
                        <p className="text-sm text-gray-900">{selectedHistoryEntry.uy_manzili || "Kiritilmagan"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Kelgan vaqti</p>
                        <p className="text-sm text-gray-900">
                          {selectedHistoryEntry.kelgan_vaqti
                            ? new Date(selectedHistoryEntry.kelgan_vaqti).toLocaleDateString('ru-RU')
                            : "Kiritilmagan"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Yuborilgan vaqti</p>
                        <p className="text-sm text-gray-900">
                          {selectedHistoryEntry.yuborilgan_vaqt
                            ? new Date(selectedHistoryEntry.yuborilgan_vaqt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                            : "Kiritilmagan"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Complaints */}
                {selectedHistoryEntry.shikoyatlar && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kelgan vaqtdagi shikoyatlari</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedHistoryEntry.shikoyatlar}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Main Diseases */}
                {selectedHistoryEntry.asosiy_kasalliklar && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Asosiy tizimli kasalliklari</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedHistoryEntry.asosiy_kasalliklar}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Respiratory System */}
                {(selectedHistoryEntry.nafas_tizimi || selectedHistoryEntry.yotal || selectedHistoryEntry.balgam ||
                  selectedHistoryEntry.qon_tuflash || selectedHistoryEntry.kokrak_ogriq || selectedHistoryEntry.nafas_qisishi) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Nafas tizimiga oid shikoyatlari</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedHistoryEntry.nafas_tizimi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Umumiy shikoyatlar</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.nafas_tizimi}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.yotal && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Yo'tal</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.yotal}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.balgam && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Balg'am</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.balgam}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.qon_tuflash && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Qon tuflash</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.qon_tuflash}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.kokrak_ogriq && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Ko'krak qafasidagi og'riq</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.kokrak_ogriq}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.nafas_qisishi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nafas qisishi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.nafas_qisishi}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Cardiovascular System */}
                {(selectedHistoryEntry.yurak_qon_shikoyatlari || selectedHistoryEntry.yurak_ogriq ||
                  selectedHistoryEntry.yurak_urishi_ozgarishi || selectedHistoryEntry.yurak_urishi_sezish) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Yurak qon aylanishi tizimi faoliyatiga oid shikoyatlari</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedHistoryEntry.yurak_qon_shikoyatlari && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Umumiy shikoyatlar</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.yurak_qon_shikoyatlari}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.yurak_ogriq && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Yurak sohasidagi og'riq</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.yurak_ogriq}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.yurak_urishi_ozgarishi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Yurak urishining o'zgarishi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.yurak_urishi_ozgarishi}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.yurak_urishi_sezish && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Yurak urishini bemor his qilishi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.yurak_urishi_sezish}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Digestive System */}
                {(selectedHistoryEntry.hazm_tizimi || selectedHistoryEntry.qusish || selectedHistoryEntry.qorin_ogriq ||
                  selectedHistoryEntry.ich_ozgarishi || selectedHistoryEntry.anus_shikoyatlar) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Hazm tizimi faoliyatiga oid shikoyatlari</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedHistoryEntry.hazm_tizimi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Umumiy shikoyatlar</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.hazm_tizimi}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.qusish && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Qusish</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.qusish}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.qorin_ogriq && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Qorin og'riqi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.qorin_ogriq}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.ich_ozgarishi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Ich kelishining o'zgarishi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.ich_ozgarishi}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.anus_shikoyatlar && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Anus sohasidagi simptomlar</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.anus_shikoyatlar}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Other Systems */}
                {(selectedHistoryEntry.siydik_tizimi || selectedHistoryEntry.endokrin_tizimi ||
                  selectedHistoryEntry.tayanch_tizimi || selectedHistoryEntry.asab_tizimi) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Boshqa tizimlar</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedHistoryEntry.siydik_tizimi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Siydik ajratish tizimi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.siydik_tizimi}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.endokrin_tizimi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Endokrin tizimi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.endokrin_tizimi}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.tayanch_tizimi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tayanch tizimi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.tayanch_tizimi}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.asab_tizimi && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Asab tizimi</p>
                            <p className="text-sm text-gray-700">{selectedHistoryEntry.asab_tizimi}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Instrumental Research Section */}
                {selectedHistoryEntry.doktor_tavsiyalari && selectedHistoryEntry.doktor_tavsiyalari.includes('=== ИНСТРУМЕНТАЛЬНЫЕ ИССЛЕДОВАНИЯ ===') && (
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Scan className="h-5 w-5 text-purple-600" />
                        Инструментальные методы исследования
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Parse instrumental research from doktor_tavsiyalari
                        const instrumentalSection = selectedHistoryEntry.doktor_tavsiyalari.split('=== ИНСТРУМЕНТАЛЬНЫЕ ИССЛЕДОВАНИЯ ===')[1]?.split('===')[0]?.trim() || ''
                        if (!instrumentalSection) return null
                        
                        // Split by separator
                        const researchItems = instrumentalSection.split('='.repeat(50)).filter((item: string) => item.trim())
                        
                        return (
                          <div className="space-y-4">
                            {researchItems.map((item: string, index: number) => {
                              const lines = item.trim().split('\n').filter((line: string) => line.trim())
                              if (lines.length === 0) return null
                              
                              const researchType = lines[0] || 'Исследование'
                              const researchData: Record<string, string> = {}
                              const images: string[] = []
                              const aiAnalyses: string[] = []
                              
                              let currentImageIndex = -1
                              let isInImageSection = false
                              let isInAIAnalysis = false
                              let currentAIAnalysis = ''
                              
                              lines.slice(1).forEach((line: string) => {
                                if (line.includes('📷 Изображения')) {
                                  isInImageSection = true
                                  return
                                }
                                if (line.includes('🖼️ Изображение')) {
                                  currentImageIndex++
                                  isInImageSection = true
                                  return
                                }
                                if (line.includes('🤖 AI Tahlil:')) {
                                  isInAIAnalysis = true
                                  currentAIAnalysis = ''
                                  return
                                }
                                if (isInAIAnalysis) {
                                  if (line.trim() && !line.includes('Дата:') && !line.includes('Врач:') && !line.includes('Учреждение:') && !line.includes('Комментарий:')) {
                                    currentAIAnalysis += line + '\n'
                                  } else {
                                    if (currentAIAnalysis) {
                                      aiAnalyses[currentImageIndex] = currentAIAnalysis.trim()
                                      currentAIAnalysis = ''
                                    }
                                    isInAIAnalysis = false
                                  }
                                }
                                if (line.startsWith('Дата:')) researchData.date = line.replace('Дата:', '').trim()
                                if (line.startsWith('Врач-выполняющий:')) researchData.doctor = line.replace('Врач-выполняющий:', '').trim()
                                if (line.startsWith('Учреждение:')) researchData.institution = line.replace('Учреждение:', '').trim()
                                if (line.startsWith('Комментарий врача:')) researchData.comment = line.replace('Комментарий врача:', '').trim()
                              })
                              
                              if (currentAIAnalysis && currentImageIndex >= 0) {
                                aiAnalyses[currentImageIndex] = currentAIAnalysis.trim()
                              }
                              
                              return (
                                <div key={index} className="border rounded-lg p-4 bg-white">
                                  <h4 className="font-semibold text-gray-900 mb-3">{researchType}</h4>
                                  <div className="space-y-2 mb-3">
                                    {researchData.date && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">Дата: </span>
                                        <span className="text-sm text-gray-700">{researchData.date}</span>
                                      </div>
                                    )}
                                    {researchData.doctor && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">Врач-выполняющий: </span>
                                        <span className="text-sm text-gray-700">{researchData.doctor}</span>
                                      </div>
                                    )}
                                    {researchData.institution && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">Учреждение: </span>
                                        <span className="text-sm text-gray-700">{researchData.institution}</span>
                                      </div>
                                    )}
                                    {researchData.comment && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">Комментарий: </span>
                                        <span className="text-sm text-gray-700">{researchData.comment}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* AI Analyses */}
                                  {aiAnalyses.length > 0 && (
                                    <div className="space-y-3 mt-4">
                                      {aiAnalyses.map((analysis, aiIndex) => (
                                        analysis && (
                                          <div key={aiIndex} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Brain className="w-5 h-5 text-purple-600" />
                                              <h5 className="text-sm font-semibold text-gray-900">AI Tahlil (Изображение {aiIndex + 1}):</h5>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-purple-200 max-h-60 overflow-y-auto prose prose-sm max-w-none">
                                              <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                  h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-3 mb-2 text-gray-900" {...props} />,
                                                  h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-2 text-gray-900" {...props} />,
                                                  h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mt-2 mb-1 text-gray-800" {...props} />,
                                                  p: ({ node, ...props }) => <p className="mb-2 text-gray-700 leading-relaxed" {...props} />,
                                                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                                  li: ({ node, ...props }) => <li className="ml-2 text-gray-700" {...props} />,
                                                  strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                                                  em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                                                  code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                                                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-300 pl-3 italic text-gray-600 my-2" {...props} />,
                                                  table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-2">
                                                      <table className="min-w-full border border-gray-300" {...props} />
                                                    </div>
                                                  ),
                                                  th: ({ node, ...props }) => <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold text-left" {...props} />,
                                                  td: ({ node, ...props }) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                                                }}
                                              >
                                                {analysis}
                                              </ReactMarkdown>
                                            </div>
                                          </div>
                                        )
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                )}

                {/* Doctor Recommendations (without instrumental research) */}
                {selectedHistoryEntry.doktor_tavsiyalari && (() => {
                  const recommendations = selectedHistoryEntry.doktor_tavsiyalari.split('=== ИНСТРУМЕНТАЛЬНЫЕ ИССЛЕДОВАНИЯ ===')[0]?.trim() || ''
                  if (!recommendations) return null
                  
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Doktor tavsiyalari</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {recommendations}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })()}

                {/* AI Analysis Results */}
                {analysisResult && formDataForSave && (
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        Результаты анализа данных пациента
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                            {analysisResult}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteHistory}
                    className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    O'chirish
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadHistoryEntryPDF}
                    disabled={isGeneratingHistoryPDF}
                    className="flex-1 sm:flex-none min-w-[140px] transition-all duration-200 hover:shadow-md"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingHistoryPDF ? t.buttons.generating : t.buttons.pdf}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFillFormFromHistory}
                    className="flex-1 sm:flex-none min-w-[180px] transition-all duration-200 hover:shadow-md bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white border-0"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Maʼlumotlarni tahrirlash
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Analysis Results Dialog */}
        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                {t.analysis.title}
              </DialogTitle>
              <DialogDescription>
                {t.analysis.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600">{t.analysis.analyzing}</p>
                  <p className="text-sm text-gray-500 mt-2">{t.analysis.analyzingSubtext}</p>
                </div>
              ) : analysisResult ? (
                <>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30 rounded-xl p-6 sm:p-8 border border-blue-200/50 shadow-lg">
                      {/* Decorative top border */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-emerald-500 rounded-t-xl"></div>

                      {/* Content with beautiful typography */}
                      <div className="relative z-10 space-y-1">
                        {formatAnalysisText(analysisResult)}
                      </div>
                    </div>
                  </div>

                  {/* Download PDF Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleDownloadAnalysisPDF}
                      disabled={isGeneratingAnalysisPDF}
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                    >
                      {isGeneratingAnalysisPDF ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t.analysis.generatingPDF}
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          {t.analysis.downloadPDF}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Save Status Section */}
                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{t.analysis.saving}</h3>
                      {saveStatus === 'saving' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">{t.analysis.savingText}</span>
                        </div>
                      )}
                      {saveStatus === 'success' && (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">{t.analysis.saved}</span>
                        </div>
                      )}
                      {saveStatus === 'error' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">{t.analysis.error}</span>
                        </div>
                      )}
                    </div>

                    {saveStatus === 'saving' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          {t.analysis.savingData}
                        </p>
                      </div>
                    )}

                    {saveStatus === 'success' && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-emerald-800">
                              {t.analysis.savedSuccess}
                            </p>
                            <p className="text-xs text-emerald-700 mt-1">
                              {t.analysis.savedSuccessSubtext}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {saveStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">
                              {t.analysis.errorText}
                            </p>
                            {saveError && (
                              <p className="text-xs text-red-700 mt-1">
                                {saveError}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={retrySaveMedicalHistory}
                          disabled={isSaving}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {t.analysis.savingText}
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              {t.analysis.retry}
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Не удалось получить анализ
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Step 1: Personal Data
function Step1PersonalData({ form }: { form: ReturnType<typeof useForm<MedicalFormData>> }) {
  const { t } = useI18n()
  return (
    <FormSection title={t.personalData.title} icon={User}>
      <FormField control={form.control} name="fullName" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">{t.personalData.fullName} <span className="text-red-500">{t.personalData.required}</span></FormLabel>
          <FormControl><Input title={t.personalData.fullName} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="passport" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">{t.personalData.passport}</FormLabel>
          <FormControl><Input title={t.personalData.passport} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField control={form.control} name="birthDate" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">{t.personalData.birthDate}</FormLabel>
            <FormControl><Input type="date" className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="nationality" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">{t.personalData.nationality}</FormLabel>
            <FormControl><Input title={t.personalData.nationality} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name="gender" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">{t.personalData.gender}</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value as string} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={t.personalData.male} id="male" />
                <label htmlFor="male" className="text-sm font-normal leading-none cursor-pointer hover:text-blue-600 transition-colors">{t.personalData.male}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={t.personalData.female} id="female" />
                <label htmlFor="female" className="text-sm font-normal leading-none cursor-pointer hover:text-blue-600 transition-colors">{t.personalData.female}</label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="maritalStatus" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.personalData.maritalStatus}</b></FormLabel>
          <FormControl><Input title={t.personalData.maritalStatusHint} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.personalData.maritalStatusHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="education" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.personalData.education}</b></FormLabel>
          <FormControl><Input title={t.personalData.educationHint} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.personalData.educationHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField control={form.control} name="profession" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium"><b>{t.personalData.profession}</b></FormLabel>
            <FormControl><Input title={t.personalData.profession} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="position" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium"><b>{t.personalData.position}</b></FormLabel>
            <FormControl><Input title={t.personalData.position} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name="job" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.personalData.job}</b></FormLabel>
          <FormControl><Textarea title={t.personalData.jobHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.personalData.jobHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="address" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.personalData.address}</b></FormLabel>
          <FormControl><Input title={t.personalData.addressHint} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.personalData.addressHint}</p>
          <FormMessage />
        </FormItem>
      )} />
    </FormSection>
  )
}

function Step2ClinicVisit({ form }: { form: ReturnType<typeof useForm<MedicalFormData>> }) {
  const { t } = useI18n()
  return (
    <FormSection title={t.clinicVisit.title} icon={Calendar}>
      <FormField control={form.control} name="admissionDate" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.admissionDate}</b> {t.clinicVisit.admissionDateOptional}</FormLabel>
          <FormControl><Input type="date" title={t.clinicVisit.admissionDateHint} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.admissionDateHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="referralDiagnosis" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.referralDiagnosis}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.referralDiagnosisHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.referralDiagnosisHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="mainComplaints" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.mainComplaints}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.mainComplaintsHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.mainComplaintsHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="mainComplaintsDetail" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.mainComplaintsDetail}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.mainComplaintsDetailHint} rows={6} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.mainComplaintsDetailHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="generalComplaints" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.generalComplaints}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.generalComplaintsHint} rows={4} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.generalComplaintsHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="additionalComplaints" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.additionalComplaints}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.additionalComplaintsHint} rows={4} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.additionalComplaintsHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="firstSymptomsDate" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.firstSymptomsDate}</b></FormLabel>
          <FormControl><Input title={t.clinicVisit.firstSymptomsDateHint} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.firstSymptomsDateHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="firstSymptoms" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.firstSymptoms}</b></FormLabel>
          <FormControl><Input title={t.clinicVisit.firstSymptomsHint} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.firstSymptomsHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="triggers" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.triggers}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.triggersHint} rows={4} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.triggersHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="symptomsDynamic" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.symptomsDynamic}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.symptomsDynamicHint} rows={4} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.symptomsDynamicHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="previousDiagnosis" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.previousDiagnosis}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.previousDiagnosisHint} rows={6} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.previousDiagnosisHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="currentState" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.clinicVisit.currentState}</b></FormLabel>
          <FormControl><Textarea title={t.clinicVisit.currentStateHint} rows={4} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.clinicVisit.currentStateHint}</p>
          <FormMessage />
        </FormItem>
      )} />
    </FormSection>
  )
}

function Step3LifeHistory({ form }: { form: ReturnType<typeof useForm<MedicalFormData>> }) {
  const { t } = useI18n()
  return (
    <FormSection title={t.lifeHistory.title} icon={FileText}>
      <FormField control={form.control} name="badHabits" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.lifeHistory.badHabits}</b></FormLabel>
          <FormControl><Textarea title={t.lifeHistory.badHabitsHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.lifeHistory.badHabitsHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="familyHistory" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.lifeHistory.familyHistory}</b></FormLabel>
          <FormControl><Textarea title={t.lifeHistory.familyHistoryHint} rows={4} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.lifeHistory.familyHistoryHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="allergies" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.lifeHistory.allergies}</b></FormLabel>
          <FormControl><Textarea title={t.lifeHistory.allergiesHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.lifeHistory.allergiesHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="pastDiseases" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.lifeHistory.pastDiseases}</b></FormLabel>
          <FormControl><Textarea title={t.lifeHistory.pastDiseasesHint} rows={6} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.lifeHistory.pastDiseasesHint}</p>
          <FormMessage />
        </FormItem>
      )} />
    </FormSection>
  )
}

function Step4Examination({ form }: { form: ReturnType<typeof useForm<MedicalFormData>> }) {
  const { t } = useI18n()
  return (
    <FormSection title={t.examination.title} icon={Stethoscope}>
      <FormField control={form.control} name="generalExamination" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.generalExamination}</b></FormLabel>
          <FormControl><Textarea title={t.examination.generalExaminationHint} rows={5} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.generalExaminationHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="headNeck" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.headNeck}</b></FormLabel>
          <FormControl><Textarea title={t.examination.headNeckHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.headNeckHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="skin" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.skin}</b></FormLabel>
          <FormControl><Textarea title={t.examination.skinHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.skinHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="respiratory" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.respiratory}</b></FormLabel>
          <FormControl><Textarea title={t.examination.respiratoryHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.respiratoryHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="cardiovascular" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.cardiovascular}</b></FormLabel>
          <FormControl><Textarea title={t.examination.cardiovascularHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.cardiovascularHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="abdomen" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.abdomen}</b></FormLabel>
          <FormControl><Textarea title={t.examination.abdomenHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.abdomenHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="musculoskeletal" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.musculoskeletal}</b></FormLabel>
          <FormControl><Textarea title={t.examination.musculoskeletalHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.musculoskeletalHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="lymphNodes" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.lymphNodes}</b></FormLabel>
          <FormControl><Textarea title={t.examination.lymphNodesHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.lymphNodesHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="abdomenPalpation" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.abdomenPalpation}</b></FormLabel>
          <FormControl><Textarea title={t.examination.abdomenPalpationHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.abdomenPalpationHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="percussion" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.percussion}</b></FormLabel>
          <FormControl><Textarea title={t.examination.percussionHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.percussionHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="lungAuscultation" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.lungAuscultation}</b></FormLabel>
          <FormControl><Textarea title={t.examination.lungAuscultationHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.lungAuscultationHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="heartAuscultation" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.heartAuscultation}</b></FormLabel>
          <FormControl><Textarea title={t.examination.heartAuscultationHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.heartAuscultationHint}</p>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="abdomenAuscultation" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium"><b>{t.examination.abdomenAuscultation}</b></FormLabel>
          <FormControl><Textarea title={t.examination.abdomenAuscultationHint} rows={3} className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-blue-500/20" {...field} /></FormControl>
          <p className="text-xs text-gray-500 italic">{t.examination.abdomenAuscultationHint}</p>
          <FormMessage />
        </FormItem>
      )} />
    </FormSection>
  )
}

function Step5TestResults({ form }: { form: ReturnType<typeof useForm<MedicalFormData>> }) {
  const { t } = useI18n()
  return (
    <FormSection title={t.testResults.title} icon={TestTube}>
      <TestResultsTable
        form={form}
        title={t.testResults.oak}
        conclusionFieldName="oak_conclusion"
        rows={[
          { name: t.testResults.oak_wbc, fieldName: "oak_wbc", unit: "×10⁹/л", reference: "3.89 – 9.23" },
          { name: t.testResults.oak_rbc, fieldName: "oak_rbc", unit: "×10¹²/л", reference: "3.66 – 4.76" },
          { name: t.testResults.oak_hgb, fieldName: "oak_hgb", unit: "г/л", reference: "115.5 – 142.0" },
          { name: t.testResults.oak_hct, fieldName: "oak_hct", unit: "%", reference: "34.26 – 43.45" },
          { name: t.testResults.oak_mcv, fieldName: "oak_mcv", unit: "фл", reference: "86.5 – 101.79" },
          { name: t.testResults.oak_mch, fieldName: "oak_mch", unit: "пг", reference: "27.23 – 33.76" },
          { name: t.testResults.oak_mchc, fieldName: "oak_mchc", unit: "г/л", reference: "30.59 – 33.76" },
          { name: t.testResults.oak_rdw_cv, fieldName: "oak_rdw_cv", unit: "%", reference: "11.63 – 14.87" },
          { name: t.testResults.oak_rdw_sd, fieldName: "oak_rdw_sd", unit: "фл", reference: "38.3 – 51.62" },
          { name: t.testResults.oak_plt, fieldName: "oak_plt", unit: "×10⁹/л", reference: "131.0 – 362.0" },
          { name: t.testResults.oak_pct, fieldName: "oak_pct", unit: "%", reference: "0.17 – 0.39" },
          { name: t.testResults.oak_mpv, fieldName: "oak_mpv", unit: "фл", reference: "9.0 – 13.0" },
          { name: t.testResults.oak_pdw, fieldName: "oak_pdw", unit: "%", reference: "9.3 – 16.7" },
        ]}
      />

      <TestResultsTable
        form={form}
        title={t.testResults.oam}
        conclusionFieldName="oam_conclusion"
        rows={[
          { name: t.testResults.oam_color, fieldName: "oam_color", unit: t.testResults.unit_none, reference: t.testResults.ref_yellow },
          { name: t.testResults.oam_transparency, fieldName: "oam_transparency", unit: t.testResults.unit_none, reference: t.testResults.ref_transparent },
          { name: t.testResults.oam_sediment, fieldName: "oam_sediment", unit: t.testResults.unit_none, reference: t.testResults.ref_insignificant },
          { name: t.testResults.oam_ph_reaction, fieldName: "oam_ph_reaction", unit: t.testResults.unit_none, reference: t.testResults.ref_weakly_acidic },
          { name: t.testResults.oam_bilirubin, fieldName: "oam_bilirubin", unit: t.testResults.unit_umol_l, reference: "0 – 3.4" },
          { name: t.testResults.oam_urobilinogen, fieldName: "oam_urobilinogen", unit: t.testResults.unit_umol_l, reference: "0 – 17" },
          { name: t.testResults.oam_ketones, fieldName: "oam_ketones", unit: t.testResults.unit_mmol_l, reference: "0 – 0.5" },
          { name: t.testResults.oam_ascorbic_acid, fieldName: "oam_ascorbic_acid", unit: t.testResults.unit_mg_l, reference: t.testResults.ref_absent },
          { name: t.testResults.oam_glucose, fieldName: "oam_glucose", unit: t.testResults.unit_mmol_l, reference: "0 – 1.7" },
          { name: t.testResults.oam_protein, fieldName: "oam_protein", unit: t.testResults.unit_g_l, reference: "0 – 0.1" },
          { name: t.testResults.oam_blood, fieldName: "oam_blood", unit: t.testResults.unit_er_mkl, reference: "0 – 5" },
          { name: t.testResults.oam_ph, fieldName: "oam_ph", unit: t.testResults.unit_none, reference: "4.8 – 7.4" },
          { name: t.testResults.oam_nitrites, fieldName: "oam_nitrites", unit: t.testResults.unit_none, reference: t.testResults.ref_negative },
          { name: t.testResults.oam_leukocytes_digital, fieldName: "oam_leukocytes_digital", unit: t.testResults.unit_leuk_mkl, reference: "0 – 10" },
          { name: t.testResults.oam_specific_gravity, fieldName: "oam_specific_gravity", unit: t.testResults.unit_none, reference: "1016 – 1022" },
          { name: t.testResults.oam_epithelium, fieldName: "oam_epithelium", unit: t.testResults.unit_in_field, reference: "< 5" },
          { name: t.testResults.oam_leukocytes_microscopy, fieldName: "oam_leukocytes_microscopy", unit: t.testResults.unit_in_field, reference: "0 – 5" },
          { name: t.testResults.oam_erythrocytes_unchanged, fieldName: "oam_erythrocytes_unchanged", unit: t.testResults.unit_in_field, reference: t.testResults.ref_not_found },
          { name: t.testResults.oam_erythrocytes_changed, fieldName: "oam_erythrocytes_changed", unit: t.testResults.unit_in_field, reference: "0 – 2" },
          { name: t.testResults.oam_bacteria, fieldName: "oam_bacteria", unit: t.testResults.unit_in_field, reference: t.testResults.ref_not_found },
          { name: t.testResults.oam_mucus, fieldName: "oam_mucus", unit: t.testResults.unit_in_field, reference: t.testResults.ref_insignificant },
        ]}
      />

      <TestResultsTable
        form={form}
        title={t.testResults.bio}
        conclusionFieldName="bio_conclusion"
        rows={[
          { name: t.testResults.bio_bilt, fieldName: "bio_bilt", unit: t.testResults.unit_umol_l, reference: "2.00 – 13.50" },
          { name: t.testResults.bio_bild, fieldName: "bio_bild", unit: t.testResults.unit_umol_l, reference: "0.00 – 5.50" },
          { name: t.testResults.bio_ast, fieldName: "bio_ast", unit: t.testResults.unit_u_l, reference: "8.0 – 42.0" },
          { name: t.testResults.bio_alt, fieldName: "bio_alt", unit: t.testResults.unit_u_l, reference: "10.0 – 58.0" },
          { name: t.testResults.bio_urea, fieldName: "bio_urea", unit: t.testResults.unit_mmol_l, reference: "3.50 – 9.20" },
          { name: t.testResults.bio_crea, fieldName: "bio_crea", unit: t.testResults.unit_umol_l, reference: "26.0 – 130.0" },
          { name: t.testResults.bio_tp, fieldName: "bio_tp", unit: t.testResults.unit_g_l, reference: "55.0 – 75.0" },
          { name: t.testResults.bio_alb, fieldName: "bio_alb", unit: t.testResults.unit_g_l, reference: "25.0 – 39.0" },
          { name: t.testResults.bio_alp, fieldName: "bio_alp", unit: t.testResults.unit_u_l, reference: "10 – 70" },
          { name: t.testResults.bio_amy, fieldName: "bio_amy", unit: t.testResults.unit_u_l, reference: "300 – 1500" },
          { name: t.testResults.bio_glue, fieldName: "bio_glue", unit: t.testResults.unit_mmol_l, reference: "4.30 – 7.30" },
          { name: t.testResults.bio_ldh, fieldName: "bio_ldh", unit: t.testResults.unit_u_l, reference: "23 – 220" },
          { name: t.testResults.bio_glob, fieldName: "bio_glob", unit: t.testResults.unit_g_l, reference: "30.00 – 36.00" },
          { name: t.testResults.bio_alb_glob, fieldName: "bio_alb_glob", unit: t.testResults.unit_none, reference: "0.600 – 1.300" },
          { name: t.testResults.bio_ritis, fieldName: "bio_ritis", unit: t.testResults.unit_none, reference: t.testResults.unit_none },
        ]}
      />

      <TestResultsTable
        form={form}
        title={t.testResults.imm}
        conclusionFieldName="imm_conclusion"
        hideUnitColumn={true}
        rows={[
          { name: t.testResults.imm_cd3, fieldName: "imm_cd3", unit: "", reference: "58–85" },
          { name: t.testResults.imm_cd3_hla_dr, fieldName: "imm_cd3_hla_dr", unit: "", reference: "3–15" },
          { name: t.testResults.imm_cd4_cd8_minus, fieldName: "imm_cd4_cd8_minus", unit: "", reference: "30–56" },
          { name: t.testResults.imm_cd4_minus_cd8, fieldName: "imm_cd4_minus_cd8", unit: "", reference: "18–45" },
          { name: t.testResults.imm_cd4_cd8_ratio, fieldName: "imm_cd4_cd8_ratio", unit: "", reference: "0,6–2,3" },
          { name: t.testResults.imm_cd3_minus_cd8, fieldName: "imm_cd3_minus_cd8", unit: "", reference: "0–1" },
          { name: t.testResults.imm_cd4_minus_cd8_alt, fieldName: "imm_cd4_minus_cd8_alt", unit: "", reference: "0–1" },
          { name: t.testResults.imm_cd19, fieldName: "imm_cd19", unit: "", reference: "7–20" },
          { name: t.testResults.imm_cd16_cd56, fieldName: "imm_cd16_cd56", unit: "", reference: "5–25" },
          { name: t.testResults.imm_cd3_cd16_cd56, fieldName: "imm_cd3_cd16_cd56", unit: "", reference: "0–5" },
          { name: t.testResults.imm_cd3_cd25, fieldName: "imm_cd3_cd25", unit: "", reference: "—" },
          { name: t.testResults.imm_cd8_hla_dr, fieldName: "imm_cd8_hla_dr", unit: "", reference: "—" },
          { name: t.testResults.imm_cd19_cd27_igd, fieldName: "imm_cd19_cd27_igd", unit: "", reference: "—" },
          { name: t.testResults.imm_leukocytes, fieldName: "imm_leukocytes", unit: "", reference: "4–9" },
          { name: t.testResults.imm_lymphocytes_percent, fieldName: "imm_lymphocytes_percent", unit: "", reference: "19–37" },
          { name: t.testResults.imm_igg, fieldName: "imm_igg", unit: "", reference: "7,2–16,3" },
          { name: t.testResults.imm_igm, fieldName: "imm_igm", unit: "", reference: "1,9–5,3" },
          { name: t.testResults.imm_iga, fieldName: "imm_iga", unit: "", reference: "0,6–2,0" },
        ]}
      />

      <SerologicalTestTable form={form} />

      <TestResultsTable
        form={form}
        title={t.testResults.pcr}
        conclusionFieldName="pcr_conclusion"
        hideUnitColumn={true}
        rows={[
          { name: t.testResults.pcr_chlamydia, fieldName: "pcr_chlamydia", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_ureaplasma, fieldName: "pcr_ureaplasma", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_mycoplasma_hominis, fieldName: "pcr_mycoplasma_hominis", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_mycoplasma_genitalium, fieldName: "pcr_mycoplasma_genitalium", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_herpes, fieldName: "pcr_herpes", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_cmv, fieldName: "pcr_cmv", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_gonorrhea, fieldName: "pcr_gonorrhea", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_trichomonas, fieldName: "pcr_trichomonas", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_gardnerella, fieldName: "pcr_gardnerella", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_candida, fieldName: "pcr_candida", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_hpv_high, fieldName: "pcr_hpv_high", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_hpv_low, fieldName: "pcr_hpv_low", unit: "", reference: t.testResults.referenceNormal },
          { name: t.testResults.pcr_streptococcus, fieldName: "pcr_streptococcus", unit: "", reference: t.testResults.referenceNormal },
        ]}
      />
    </FormSection>
  )
}



