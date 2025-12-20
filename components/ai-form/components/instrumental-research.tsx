"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useFormContext } from "react-hook-form"
import { FormSection } from "@/ai-form/components/form-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Plus, Eye, Edit, Trash2, Download, X, Scan, Loader2, Brain, RefreshCw } from "lucide-react"
import { useI18n } from "@/ai-form/lib/i18n"
import type { MedicalFormData } from "@/ai-form/lib/validation"
import { API_CONFIG } from "@/config/api"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ResearchItem {
  id?: string
  type: string
  date?: string
  performingDoctor?: string
  institution?: string
  images?: string[]
  imageAnalyses?: string[] // AI tahlil natijalari har bir rasm uchun
  comment?: string
}

export function Step6InstrumentalResearch({ form }: { form: ReturnType<typeof useFormContext<MedicalFormData>> }) {
  const { t, language } = useI18n()
  const researches = form.watch("instrumental_research") || []
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [viewingIndex, setViewingIndex] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const ir = (t as any).instrumentalResearch || {}

  const researchTypes = [
    { value: "xray", label: ir.typeXray },
    { value: "fluoroscopy", label: ir.typeFluoroscopy },
    { value: "contrast", label: ir.typeContrast },
    { value: "ct", label: ir.typeCT },
    { value: "mri", label: ir.typeMRI },
    { value: "ultrasound", label: ir.typeUltrasound },
    { value: "echocardiography", label: ir.typeEchocardiography },
    { value: "ecg", label: ir.typeECG },
    { value: "eeg", label: ir.typeEEG },
    { value: "pft", label: ir.typePFT },
    { value: "other", label: ir.typeOther },
  ]

  const handleAddResearch = (data: ResearchItem) => {
    const current = form.getValues("instrumental_research") || []
    form.setValue("instrumental_research", [...current, { ...data, id: Date.now().toString() }])
    setShowAddForm(false)
  }

  const handleEditResearch = (index: number, data: ResearchItem) => {
    const current = form.getValues("instrumental_research") || []
    const updated = [...current]
    updated[index] = { ...data, id: current[index]?.id || Date.now().toString() }
    form.setValue("instrumental_research", updated)
    setEditingIndex(null)
  }

  const handleDeleteResearch = (index: number) => {
    if (confirm(ir.deleteConfirm)) {
      const current = form.getValues("instrumental_research") || []
      const updated = current.filter((_, i) => i !== index)
      form.setValue("instrumental_research", updated)
    }
  }

  const downloadImage = (image: string, type: string, imageIndex: number) => {
    const link = document.createElement("a")
    link.href = image
    link.download = `research-${type}-${Date.now()}-${imageIndex}.jpg`
    link.click()
  }

  const removeImage = (researchIndex: number, imageIndex: number) => {
    const current = form.getValues("instrumental_research") || []
    const updated = [...current]
    const images = updated[researchIndex]?.images || []
    images.splice(imageIndex, 1)
    updated[researchIndex] = { ...updated[researchIndex], images }
    form.setValue("instrumental_research", updated)
  }

  return (
    <FormSection title={ir.title} icon={Scan}>
      <div className="space-y-4">
        {!showAddForm && editingIndex === null && (
          <Button type="button" onClick={() => setShowAddForm(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {ir.addResearch}
          </Button>
        )}

        {showAddForm && (
          <ResearchForm
            form={form}
            researchTypes={researchTypes}
            onSubmit={handleAddResearch}
            onCancel={() => setShowAddForm(false)}
            ir={ir || {}}
            languageProp={language}
          />
        )}

        {editingIndex !== null && (
          <ResearchForm
            form={form}
            researchTypes={researchTypes}
            initialData={researches[editingIndex]}
            onSubmit={(data) => handleEditResearch(editingIndex, data)}
            onCancel={() => setEditingIndex(null)}
            ir={ir || {}}
            languageProp={language}
          />
        )}

        {researches.length === 0 && !showAddForm && editingIndex === null && (
          <p className="text-gray-500 text-center py-8">{ir.noResearch}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researches.map((research, index) => (
            <ResearchCard
              key={research.id || index}
              research={research}
              researchTypes={researchTypes}
              onView={() => setViewingIndex(index)}
              onEdit={() => setEditingIndex(index)}
              onDelete={() => handleDeleteResearch(index)}
              onDownload={(imageIndex) => {
                const images = research.images || []
                if (images[imageIndex]) {
                  downloadImage(images[imageIndex], research.type, imageIndex)
                }
              }}
              ir={ir || {}}
              researchIndex={index}
              onRemoveImage={(imageIndex) => removeImage(index, imageIndex)}
            />
          ))}
        </div>

        {viewingIndex !== null && researches[viewingIndex] && (
          <ResearchModal
            research={researches[viewingIndex]}
            researchTypes={researchTypes}
            onClose={() => setViewingIndex(null)}
            onDownload={(imageIndex) => {
              const images = researches[viewingIndex].images || []
              if (images[imageIndex]) {
                downloadImage(images[imageIndex], researches[viewingIndex].type, imageIndex)
              }
            }}
            ir={ir || {}}
            researchIndex={viewingIndex}
            onRemoveImage={(imageIndex) => removeImage(viewingIndex, imageIndex)}
          />
        )}
      </div>
    </FormSection>
  )
}

function ResearchCard({
  research,
  researchTypes,
  onView,
  onEdit,
  onDelete,
  onDownload,
  ir,
  researchIndex,
  onRemoveImage,
}: {
  research: ResearchItem
  researchTypes: { value: string; label: string }[]
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onDownload: (imageIndex: number) => void
  ir: any
  researchIndex: number
  onRemoveImage: (imageIndex: number) => void
}) {
  const typeLabel = researchTypes.find((rt) => rt.value === research.type)?.label || research.type
  const images = research.images || []

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{typeLabel}</h4>
        {images.length > 0 && <span className="text-xs text-gray-500">{images.length} {ir.image || "rasm"}</span>}
      </div>

      {research.date && (
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">{ir.researchDate}:</span> {research.date}
        </p>
      )}

      {images.length > 0 && (
        <div className="mb-2 grid grid-cols-2 gap-2">
          {images.slice(0, 2).map((image, idx) => (
            <div key={idx} className="relative rounded overflow-hidden">
              <Image src={image} alt={`${typeLabel} ${idx + 1}`} width={100} height={75} className="w-full h-20 object-cover" />
            </div>
          ))}
          {images.length > 2 && (
            <div className="relative rounded overflow-hidden bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-600">+{images.length - 2}</span>
            </div>
          )}
        </div>
      )}

      {research.comment && <p className="text-sm text-gray-700 mb-2 line-clamp-2">{research.comment}</p>}

      <div className="flex gap-2 mt-3">
        <Button type="button" variant="outline" size="sm" onClick={onView} className="flex-1">
          <Eye className="w-4 h-4 mr-1" />
          {ir.view}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="w-4 h-4 mr-1" />
          {ir.edit}
        </Button>
        <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function ResearchForm({
  form,
  researchTypes,
  initialData,
  onSubmit,
  onCancel,
  ir,
  languageProp,
}: {
  form: ReturnType<typeof useFormContext<MedicalFormData>>
  researchTypes: { value: string; label: string }[]
  initialData?: ResearchItem
  onSubmit: (data: ResearchItem) => void
  onCancel: () => void
  ir: any
  languageProp?: string
}) {
  const { language: i18nLanguage } = useI18n()
  const language = languageProp || i18nLanguage || "ru"
  const [formData, setFormData] = useState<ResearchItem>(
    initialData || { type: "", date: "", performingDoctor: "", institution: "", images: [], imageAnalyses: [], comment: "" }
  )
  const [otherType, setOtherType] = useState(initialData?.type === "other" ? initialData.type : "")
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || [])
  const [imageAnalyses, setImageAnalyses] = useState<string[]>(initialData?.imageAnalyses || [])
  const [analyzingImages, setAnalyzingImages] = useState<boolean[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!formData.type) {
      alert(ir.typeRequired)
      return
    }
    if ((!uploadedImages || uploadedImages.length === 0) && !formData.comment) {
      alert(ir.imageOrCommentRequired)
      return
    }
    onSubmit({ 
      ...formData, 
      type: formData.type === "other" ? otherType : formData.type, 
      images: uploadedImages,
      imageAnalyses: imageAnalyses
    })
  }

  useEffect(() => {
    if (initialData?.images) setUploadedImages(initialData.images)
    else setUploadedImages([])
    if (initialData?.imageAnalyses) setImageAnalyses(initialData.imageAnalyses)
    else setImageAnalyses([])
  }, [initialData])

  // Analyze image with AI
  const analyzeImage = async (imageBase64: string, imageIndex: number) => {
    try {
      // Set analyzing state for this image
      const newAnalyzing = [...analyzingImages]
      newAnalyzing[imageIndex] = true
      setAnalyzingImages(newAnalyzing)

      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("Требуется авторизация")
      }

      // Convert base64 to blob for FormData
      const base64Data = imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })
      const file = new File([blob], `image-${imageIndex}.jpg`, { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append("image", file)
      formData.append("language", language || "ru") // Add language parameter

      const response = await axios.post(
        API_CONFIG.ENDPOINTS.ANALYZE_INSTRUMENTAL_IMAGE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.status === "success" && response.data.analysis) {
        // Update analysis for this image
        const newAnalyses = [...imageAnalyses]
        newAnalyses[imageIndex] = response.data.analysis
        setImageAnalyses(newAnalyses)
      } else {
        throw new Error("Не удалось получить анализ")
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      // Set error analysis
      const newAnalyses = [...imageAnalyses]
      newAnalyses[imageIndex] = "Ошибка при анализе изображения. Попробуйте еще раз."
      setImageAnalyses(newAnalyses)
    } finally {
      // Clear analyzing state
      const newAnalyzing = [...analyzingImages]
      newAnalyzing[imageIndex] = false
      setAnalyzingImages(newAnalyzing)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 bg-gray-50 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {ir.researchType} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">{ir.researchType}</option>
            {researchTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {formData.type === "other" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ir.typeOther}</label>
            <Input value={otherType} onChange={(e) => setOtherType(e.target.value)} placeholder={ir.typeOther} />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{ir.researchDate}</label>
          <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{ir.performingDoctor}</label>
          <Input value={formData.performingDoctor} onChange={(e) => setFormData({ ...formData, performingDoctor: e.target.value })} placeholder={ir.performingDoctor} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{ir.institution}</label>
          <Input value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} placeholder={ir.institution} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{ir.image} ({uploadedImages.length})</label>
          <Input
            id="research-image"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            multiple
            onChange={(e) => {
              const files = e.target.files
              if (!files || files.length === 0) return
              const validFiles: File[] = []
              for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) { alert(ir.fileTypeError); continue }
                if (file.size > 10 * 1024 * 1024) { alert(ir.fileSizeError); continue }
                validFiles.push(file)
              }
              if (validFiles.length === 0) return
              const readers = validFiles.map((file) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(file)
              }))
              Promise.all(readers).then((base64Strings) => {
                const newImages = [...uploadedImages, ...base64Strings]
                setUploadedImages(newImages)
                // Initialize analyzing states
                setAnalyzingImages([...analyzingImages, ...new Array(base64Strings.length).fill(false)])
                // Initialize empty analyses for new images
                setImageAnalyses([...imageAnalyses, ...new Array(base64Strings.length).fill("")])
                
                // Automatically analyze each new image
                base64Strings.forEach((base64String, index) => {
                  const imageIndex = uploadedImages.length + index
                  analyzeImage(base64String, imageIndex)
                })
              })
            }}
          />
          {uploadedImages.length > 0 && (
            <div className="mt-2 space-y-4 w-full">
              {uploadedImages.map((image, idx) => (
                <div key={idx} className="border rounded-lg p-4 md:p-6 bg-white w-full">
                  <div className="relative group mb-3">
                    <Image src={image} alt={`Preview ${idx + 1}`} width={400} height={300} className="rounded border w-full h-48 md:h-64 object-contain bg-gray-50" />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImages(uploadedImages.filter((_, i) => i !== idx))
                        setImageAnalyses(imageAnalyses.filter((_, i) => i !== idx))
                        setAnalyzingImages(analyzingImages.filter((_, i) => i !== idx))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* AI Analysis Section */}
                  <div className="mt-3">
                    {analyzingImages[idx] ? (
                      <div className="flex items-center gap-2 text-sm text-blue-600 py-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>AI tahlil qilmoqda...</span>
                      </div>
                    ) : imageAnalyses[idx] ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                          <Brain className="w-5 h-5 text-purple-600" />
                          <span>AI Tahlil:</span>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 md:p-6 text-sm md:text-base text-gray-700 max-h-96 overflow-y-auto prose prose-sm md:prose-base max-w-none w-full">
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
                            {imageAnalyses[idx]}
                          </ReactMarkdown>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeImage(image, idx)}
                          className="w-full"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Qayta tahlil qilish
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => analyzeImage(image, idx)}
                        className="w-full"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        AI tahlil qilish
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {ir.comment}{(!uploadedImages || uploadedImages.length === 0) && <span className="text-red-500">*</span>}
        </label>
        <Textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} placeholder={ir.commentPlaceholder} rows={4} />
        {(!uploadedImages || uploadedImages.length === 0) && <p className="text-xs text-gray-500 mt-1">{ir.commentRequired}</p>}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancel() }}>
          {ir.cancel}
        </Button>
        <Button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit(e) }}>
          {ir.save}
        </Button>
      </div>
    </form>
  )
}

function ResearchModal({
  research,
  researchTypes,
  onClose,
  onDownload,
  ir,
  onRemoveImage,
  researchIndex,
}: {
  research: ResearchItem
  researchTypes: { value: string; label: string }[]
  onClose: () => void
  onDownload: (imageIndex: number) => void
  ir: any
  onRemoveImage: (imageIndex: number) => void
  researchIndex: number
}) {
  const typeLabel = researchTypes.find((rt) => rt.value === research.type)?.label || research.type
  const images = research.images || []
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); return () => setMounted(false) }, [])

  const modalContent = (
    <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', margin: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) { onClose() } }}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{typeLabel}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {(research.date || research.performingDoctor || research.institution) && (
            <div className="mb-6 space-y-3">
              {research.date && (<div><span className="text-sm text-gray-500">{ir.researchDate}:</span><span className="ml-2 text-gray-900 font-medium">{research.date}</span></div>)}
              {research.performingDoctor && (<div><span className="text-sm text-gray-500">{ir.performingDoctor}:</span><span className="ml-2 text-gray-900 font-medium">{research.performingDoctor}</span></div>)}
              {research.institution && (<div><span className="text-sm text-gray-500">{ir.institution}:</span><span className="ml-2 text-gray-900 font-medium">{research.institution}</span></div>)}
            </div>
          )}

          {images.length > 0 && (
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">{ir.image} ({images.length})</h4>
              <div className="space-y-6">
                {images.map((image, idx) => {
                  const analysis = research.imageAnalyses?.[idx] || ""
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="relative group bg-gray-50">
                        <div className="aspect-video flex items-center justify-center p-4">
                          <Image src={image} alt={`${typeLabel} ${idx + 1}`} width={500} height={350} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => onDownload(idx)} className="bg-white/90 hover:bg-white">
                            <Download className="w-4 h-4 mr-1" />
                            {ir.download}
                          </Button>
                        </div>
                      </div>
                      
                      {/* AI Analysis Section */}
                      {analysis && (
                        <div className="p-4 border-t border-gray-200 bg-purple-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-5 h-5 text-purple-600" />
                            <h5 className="text-sm font-semibold text-gray-900">AI Tahlil:</h5>
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
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {research.comment && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">{ir.comment}</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{research.comment}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}


