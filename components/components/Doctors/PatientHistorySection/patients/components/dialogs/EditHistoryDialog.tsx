"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FileAttachment } from "./FileAttachment"
import { MedicalHistoryForm, HistoryEntry } from "../../types"
import {
  User,
  Activity,
  ChevronUp,
  ChevronDown,
  FileTextIcon,
} from "lucide-react"


interface EditHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  historyEntry: HistoryEntry | null
  onSubmit: (updatedHistory: MedicalHistoryForm) => Promise<void>
}

export function EditHistoryDialog({
  open,
  onOpenChange,
  historyEntry,
  onSubmit,
}: EditHistoryDialogProps) {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryForm>({
    fish: "",
    birthDate: "",
    nationality: "",
    education: "",
    profession: "",
    workplace: "",
    workPosition: "",
    homeAddress: "",
    visitDate: "",
    mainComplaints: "",
    systemicDiseases: "",
    respiratoryComplaints: "",
    cough: "",
    sputum: "",
    hemoptysis: "",
    chestPain: "",
    dyspnea: "",
    cardiovascularComplaints: "",
    heartPain: "",
    heartRhythm: "",
    palpitations: "",
    digestiveComplaints: "",
    vomiting: "",
    abdominalPain: "",
    epigastricPain: "",
    bowelMovements: "",
    analSymptoms: "",
    urinaryComplaints: "",
    endocrineComplaints: "",
    musculoskeletalComplaints: "",
    nervousSystemComplaints: "",
    doctorRecommendations: "",
    respiratoryFiles: [],
    cardiovascularFiles: [],
    digestiveFiles: [],
    urinaryFiles: [],
    endocrineFiles: [],
    musculoskeletalFiles: [],
    nervousSystemFiles: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basic: true,
    respiratory: false,
    cardiovascular: false,
    digestive: false,
    urinary: false,
    endocrine: false,
    musculoskeletal: false,
    nervous: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Parse existing history entry data when dialog opens
  useEffect(() => {
    if (historyEntry && open) {
      // Parse the notes field to extract individual values
      const notes = historyEntry.notes || ""
      
      // Extract values using regex patterns
      const extractValue = (pattern: RegExp, defaultValue: string = "") => {
        const match = notes.match(pattern)
        return match ? match[1].trim() : defaultValue
      }

      setMedicalHistory({
        fish: extractValue(/F\.I\.SH:\s*(.+?)(?:\n|$)/),
        birthDate: extractValue(/Tug'ilgan sanasi:\s*(.+?)(?:\n|$)/),
        nationality: extractValue(/Millati:\s*(.+?)(?:\n|$)/),
        education: extractValue(/Ma'lumoti:\s*(.+?)(?:\n|$)/),
        profession: extractValue(/Kasbi:\s*(.+?)(?:\n|$)/),
        workplace: extractValue(/Ish joyi:\s*(.+?)(?:\n|$)/),
        workPosition: extractValue(/Ish joyidagi vazifasi:\s*(.+?)(?:\n|$)/),
        homeAddress: extractValue(/Uy manzili:\s*(.+?)(?:\n|$)/),
        visitDate: new Date().toISOString().split('T')[0], // Current date for edited entry
        mainComplaints: extractValue(/KELGAN VAQTDAGI SHIKOYATLARI:\s*(.+?)(?:\n|$)/),
        systemicDiseases: extractValue(/BEMORNING ASOSIY TIZIMLI KASALLIKLARI:\s*(.+?)(?:\n|$)/),
        respiratoryComplaints: extractValue(/Umumiy shikoyatlar:\s*(.+?)(?:\n|$)/),
        cough: extractValue(/Yo'tal:\s*(.+?)(?:\n|$)/),
        sputum: extractValue(/Balg'am:\s*(.+?)(?:\n|$)/),
        hemoptysis: extractValue(/Qon tuflash:\s*(.+?)(?:\n|$)/),
        chestPain: extractValue(/Ko'krak qafasidagi og'riq:\s*(.+?)(?:\n|$)/),
        dyspnea: extractValue(/Nafas qisishi:\s*(.+?)(?:\n|$)/),
        cardiovascularComplaints: extractValue(/YURAK QON AYLANISHI TIZIMI FAOLIYATIGA OID SHIKOYATLARI:\s*Umumiy shikoyatlar:\s*(.+?)(?:\n|$)/),
        heartPain: extractValue(/Yurak sohasidagi og'riq:\s*(.+?)(?:\n|$)/),
        heartRhythm: extractValue(/Yurak urishining o'zgarishi:\s*(.+?)(?:\n|$)/),
        palpitations: extractValue(/Yurak urishini bemor his qilishi:\s*(.+?)(?:\n|$)/),
        digestiveComplaints: extractValue(/HAZM TIZIMI FAOLIYATIGA OID SHIKOYATLARI:\s*Umumiy shikoyatlar:\s*(.+?)(?:\n|$)/),
        vomiting: extractValue(/Qusish:\s*(.+?)(?:\n|$)/),
        abdominalPain: extractValue(/Qorin og'riqi:\s*(.+?)(?:\n|$)/),
        epigastricPain: extractValue(/To'sh osti va boshqa sohalarda og'riq:\s*(.+?)(?:\n|$)/),
        bowelMovements: extractValue(/Ich kelishining o'zgarishi:\s*(.+?)(?:\n|$)/),
        analSymptoms: extractValue(/Anus sohasidagi simptomlar:\s*(.+?)(?:\n|$)/),
        urinaryComplaints: extractValue(/SIYDIK AJRATISH TIZIMI FAOLIYATIGA OID SHIKOYATLARI:\s*(.+?)(?:\n|$)/),
        endocrineComplaints: extractValue(/ENDOKRIN TIZIMI FAOLIYATIGA OID SHIKOYATLARI:\s*(.+?)(?:\n|$)/),
        musculoskeletalComplaints: extractValue(/TAYANCH HARAKAT TIZIMI FAOLIYATIGA OID SHIKOYATLARI:\s*(.+?)(?:\n|$)/),
        nervousSystemComplaints: extractValue(/ASAB TIZIMI:\s*(.+?)(?:\n|$)/),
        doctorRecommendations: extractValue(/DOKTOR TAVSIYALARI:\s*(.+?)(?:\n|$)/),
        respiratoryFiles: [],
        cardiovascularFiles: [],
        digestiveFiles: [],
        urinaryFiles: [],
        endocrineFiles: [],
        musculoskeletalFiles: [],
        nervousSystemFiles: [],
      })
    }
  }, [historyEntry, open])

  const handleSubmit = async () => {
    if (!medicalHistory.visitDate || !medicalHistory.mainComplaints) {
      setError("Visit date and main complaints are required.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(medicalHistory)
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update medical history")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (field: keyof Pick<MedicalHistoryForm, 'respiratoryFiles' | 'cardiovascularFiles' | 'digestiveFiles' | 'urinaryFiles' | 'endocrineFiles' | 'musculoskeletalFiles' | 'nervousSystemFiles'>, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setMedicalHistory(prev => ({
        ...prev,
        [field]: fileArray
      }))
    }
  }

  const handleRemoveFile = (field: keyof Pick<MedicalHistoryForm, 'respiratoryFiles' | 'cardiovascularFiles' | 'digestiveFiles' | 'urinaryFiles' | 'endocrineFiles' | 'musculoskeletalFiles' | 'nervousSystemFiles'>, index: number) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  if (!historyEntry) return null

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Tahrirlash: Kasallik tarixi (Подробная история болезни)
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            {/* --- Основная информация --- */}
            <Collapsible
              open={expandedSections.basic}
              onOpenChange={() => toggleSection("basic")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" /> Asosiy ma'lumotlar
                  </h3>
                  {expandedSections.basic ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fish">F.I.SH</Label>
                    <Input
                      id="fish"
                      value={medicalHistory.fish}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, fish: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birth-date">Bemorni tug'ilgan sanasi</Label>
                    <Input
                      id="birth-date"
                      type="date"
                      value={medicalHistory.birthDate}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, birthDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Millati</Label>
                    <Input
                      id="nationality"
                      value={medicalHistory.nationality}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, nationality: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="education">Ma'lumoti</Label>
                    <Input
                      id="education"
                      value={medicalHistory.education}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, education: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Kasbi</Label>
                    <Input
                      id="profession"
                      value={medicalHistory.profession}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, profession: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workplace">Ish joyi</Label>
                    <Input
                      id="workplace"
                      value={medicalHistory.workplace}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, workplace: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="work-position">Ish joyidagi vazifasi</Label>
                    <Input
                      id="work-position"
                      value={medicalHistory.workPosition}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, workPosition: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="home-address">Uy manzili</Label>
                    <Input
                      id="home-address"
                      value={medicalHistory.homeAddress}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, homeAddress: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="visit-date">
                      Kelgan vaqti <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="visit-date"
                      type="date"
                      value={medicalHistory.visitDate}
                      onChange={(e) => setMedicalHistory({ ...medicalHistory, visitDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="main-complaints">
                    Kelgan vaqtdagi shikoyatlari{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="main-complaints"
                    rows={3}
                    value={medicalHistory.mainComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, mainComplaints: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="systemic-diseases">
                    Bemorning asosiy tizimli kasalliklari
                  </Label>
                  <Textarea
                    id="systemic-diseases"
                    rows={3}
                    value={medicalHistory.systemicDiseases}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, systemicDiseases: e.target.value })}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* --- Дыхательная система --- */}
            <Collapsible
              open={expandedSections.respiratory}
              onOpenChange={() => toggleSection("respiratory")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" /> Nafas tizimi
                  </h3>
                  {expandedSections.respiratory ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="respiratory-complaints">
                    Nafas tizimiga oid shikoyatlari
                  </Label>
                  <Textarea
                    id="respiratory-complaints"
                    rows={3}
                    value={medicalHistory.respiratoryComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, respiratoryComplaints: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cough">Yo'tal</Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Quruq/balg'amli; vaqti; davomiyligi; xarakteri; paydo
                    bo'lish sharoitlari.
                  </p>
                  <Textarea
                    id="cough"
                    rows={4}
                    value={medicalHistory.cough}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, cough: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sputum">Balg'amning mavjudligi</Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Miqdori; bartaraf bo'lishi; hidi; quyuq-suyuqligi; qatlami.
                  </p>
                  <Textarea
                    id="sputum"
                    rows={3}
                    value={medicalHistory.sputum}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, sputum: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hemoptysis">Qon tuflashning mavjudligi</Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Intensivligi; rangi; davriyligi.
                  </p>
                  <Textarea
                    id="hemoptysis"
                    rows={2}
                    value={medicalHistory.hemoptysis}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, hemoptysis: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="chest-pain">
                    Ko'krak qafasidagi og'riq mavjudligi
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Xarakteri; joylashuvi; nafas olishga bog'liqligi;
                    tarqalishi; yengillashtiruvchi vositalar.
                  </p>
                  <Textarea
                    id="chest-pain"
                    rows={3}
                    value={medicalHistory.chestPain}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, chestPain: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dyspnea">Nafas qisishi</Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Doimiy/zo'riqishda; xarakteri (inspiratorli/ekspiratorli);
                    bo'g'ilish.
                  </p>
                  <Textarea
                    id="dyspnea"
                    rows={4}
                    value={medicalHistory.dyspnea}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, dyspnea: e.target.value })}
                  />
                </div>
                <FileAttachment
                  id="respiratory-files-edit"
                  field="respiratoryFiles"
                  files={medicalHistory.respiratoryFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* --- Сердечно-сосудистая система --- */}
            <Collapsible
              open={expandedSections.cardiovascular}
              onOpenChange={() => toggleSection("cardiovascular")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-500" /> Yurak qon
                    aylanishi tizimi
                  </h3>
                  {expandedSections.cardiovascular ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="cardiovascular-complaints">
                    Yurak qon aylanishi tizimi faoliyatiga oid shikoyatlari
                    (Nafas siqishi)
                  </Label>
                  <Textarea
                    id="cardiovascular-complaints"
                    rows={3}
                    value={medicalHistory.cardiovascularComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, cardiovascularComplaints: e.target.value })}
                    placeholder="Oldingi punktdagi ma'lumotlar so'raladi..."
                  />
                </div>
                <div>
                  <Label htmlFor="heart-pain">Yurak sohasidagi og'riq</Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Doimiy/xurujli; tarqalishi; xarakteri; vahima bilan
                    bog'liqligi; intensivligi; davomiyligi; yordam effektivligi.
                  </p>
                  <Textarea
                    id="heart-pain"
                    rows={4}
                    value={medicalHistory.heartPain}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, heartPain: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="heart-rhythm">
                    Yurak urishining o'zgarishi
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Xarakteri (tezlashishi); paydo bo'lish sharoitlari; hamroh
                    simptomlar.
                  </p>
                  <Textarea
                    id="heart-rhythm"
                    rows={3}
                    value={medicalHistory.heartRhythm}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, heartRhythm: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="palpitations">
                    Yurak urishini bemor his qilishi
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Periferik qon tomirlari belgilari; shish; bosh og'rig'i
                    xarakteri.
                  </p>
                  <Textarea
                    id="palpitations"
                    rows={3}
                    value={medicalHistory.palpitations}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, palpitations: e.target.value })}
                  />
                </div>
                <FileAttachment
                  id="cardiovascular-files-edit"
                  field="cardiovascularFiles"
                  files={medicalHistory.cardiovascularFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* --- Пищеварительная система --- */}
            <Collapsible
              open={expandedSections.digestive}
              onOpenChange={() => toggleSection("digestive")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-orange-500" /> Hazm tizimi
                  </h3>
                  {expandedSections.digestive ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="digestive-complaints">
                    Hazm tizimi faoliyatiga oid shikoyatlari
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Ishtaha; chanqash; og'izdagi ta'm; yutinish; so'lak;
                    kekirish; jig'ildon qaynashi; ko'ngil aynashi.
                  </p>
                  <Textarea
                    id="digestive-complaints"
                    rows={4}
                    value={medicalHistory.digestiveComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, digestiveComplaints: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vomiting">Qusish mavjudligi</Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Ovqatga bog'liqligi; qusuq moddasining xususiyatlari va
                    hidi.
                  </p>
                  <Textarea
                    id="vomiting"
                    rows={3}
                    value={medicalHistory.vomiting}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, vomiting: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="abdominal-pain">
                    Qorin og'riqi mavjudligi va uning xususiyatlari
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Joylashuvi; boshlanishi; ovqatga bog'liqligi; xarakteri;
                    davomiyligi; hamroh simptomlar.
                  </p>
                  <Textarea
                    id="abdominal-pain"
                    rows={4}
                    value={medicalHistory.abdominalPain}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, abdominalPain: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="epigastric-pain">
                    To'sh osti va boshqa sohalarda og'riq, qorinning
                    shishganligi
                  </Label>
                  <Textarea
                    id="epigastric-pain"
                    rows={2}
                    value={medicalHistory.epigastricPain}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, epigastricPain: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bowel-movements">
                    Ich kelishining o'zgarishi
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Muntazamligi; ich qotishi/ketishi; tenezmalar; ahlat
                    massasining xarakteri; aralashmalar.
                  </p>
                  <Textarea
                    id="bowel-movements"
                    rows={3}
                    value={medicalHistory.bowelMovements}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, bowelMovements: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="anal-symptoms">
                    Anus sohasidagi simptomlar
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Og'riq, qizish, qichish, bavosir, ichak chiqishi.
                  </p>
                  <Textarea
                    id="anal-symptoms"
                    rows={2}
                    value={medicalHistory.analSymptoms}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, analSymptoms: e.target.value })}
                  />
                </div>
                <FileAttachment
                  id="digestive-files-edit"
                  field="digestiveFiles"
                  files={medicalHistory.digestiveFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* --- Мочевыделительная система --- */}
            <Collapsible
              open={expandedSections.urinary}
              onOpenChange={() => toggleSection("urinary")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" /> Siydik
                    ajratish tizimi
                  </h3>
                  {expandedSections.urinary ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="urinary-complaints">
                    Siydik ajratish tizimi faoliyatiga oid shikoyatlari
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Bel og'rig'i; siydik chiqishi (qiyin/oson); og'riq;
                    takrorlanishi; miqdori; rangi; tutib tura olmaslik.
                  </p>
                  <Textarea
                    id="urinary-complaints"
                    rows={4}
                    value={medicalHistory.urinaryComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, urinaryComplaints: e.target.value })}
                  />
                </div>
                <FileAttachment
                  id="urinary-files-edit"
                  field="urinaryFiles"
                  files={medicalHistory.urinaryFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* --- Эндокринная система --- */}
            <Collapsible
              open={expandedSections.endocrine}
              onOpenChange={() => toggleSection("endocrine")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" /> Endokrin
                    tizimi
                  </h3>
                  {expandedSections.endocrine ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="endocrine-complaints">
                    Endokrin tizimi faoliyatiga oid shikoyatlari
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Asabiylik; bo'y/tana o'zgarishi; vazn o'zgarishi; teri
                    o'zgarishi; jinsiy belgilar; soch/tuklar; chanqash.
                  </p>
                  <Textarea
                    id="endocrine-complaints"
                    rows={4}
                    value={medicalHistory.endocrineComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, endocrineComplaints: e.target.value })}
                  />
                </div>
                <FileAttachment
                  id="endocrine-files-edit"
                  field="endocrineFiles"
                  files={medicalHistory.endocrineFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* --- Опорно-двигательная система --- */}
            <Collapsible
              open={expandedSections.musculoskeletal}
              onOpenChange={() => toggleSection("musculoskeletal")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-500" /> Tayanch
                    harakat tizimi
                  </h3>
                  {expandedSections.musculoskeletal ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="musculoskeletal-complaints">
                    Tayanch harakat tizimi faoliyatiga oid shikoyatlari
                  </Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Suyak/bo'g'imlardagi og'riq (xarakteri, sharoiti);
                    shishganlik; harakat qiyinlashuvi; umurtqa og'rig'i.
                  </p>
                  <Textarea
                    id="musculoskeletal-complaints"
                    rows={4}
                    value={medicalHistory.musculoskeletalComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, musculoskeletalComplaints: e.target.value })}
                  />
                </div>
                <FileAttachment
                  id="musculoskeletal-files-edit"
                  field="musculoskeletalFiles"
                  files={medicalHistory.musculoskeletalFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* --- Нервная система --- */}
            <Collapsible
              open={expandedSections.nervous}
              onOpenChange={() => toggleSection("nervous")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-pink-500" /> Asab tizimi
                  </h3>
                  {expandedSections.nervous ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="nervous-system-complaints">Asab tizimi</Label>
                  <p className="text-sm text-gray-500 mb-1">
                    Ruhiy holat, hush, intellekt, diqqat; meningeal simptomlar;
                    parez/paralichlar.
                  </p>
                  <Textarea
                    id="nervous-system-complaints"
                    rows={4}
                    value={medicalHistory.nervousSystemComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, nervousSystemComplaints: e.target.value })}
                  />
                </div>
                <FileAttachment
                  id="nervous-system-files-edit"
                  field="nervousSystemFiles"
                  files={medicalHistory.nervousSystemFiles}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* --- Рекомендации врача --- */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2 pt-4 border-t">
                <FileTextIcon className="h-5 w-5 text-teal-500" /> Doktor
                tavsiyalari
              </h3>
              <div>
                <Label htmlFor="doctor-recommendations">
                  Tavsiyalar va tayinlanmalar
                </Label>
                <Textarea
                  id="doctor-recommendations"
                  rows={4}
                  value={medicalHistory.doctorRecommendations}
                  onChange={(e) => setMedicalHistory({ ...medicalHistory, doctorRecommendations: e.target.value })}
                  placeholder="Shifokor tavsiyalari, tayinlanmalar, davolash rejasi..."
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </ScrollArea>

                <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          >
            {isSubmitting ? "Saqlanmoqda..." : "Tahrirlash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
