"use client";

import { useState, useRef } from "react";
import { MedicalHistoryForm } from "../../types";
import { API_CONFIG } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Activity,
  ChevronUp,
  ChevronDown,
  Plus,
  FileTextIcon,
  Paperclip,
  X,
} from "lucide-react";

interface AddHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicalHistory: MedicalHistoryForm;
  setMedicalHistory: (form: MedicalHistoryForm) => void;
  patientId: number | undefined; // Allow undefined with a default or check
  onSubmitSuccess?: () => void; // Optional callback for success
}

import { FileAttachment } from "./FileAttachment";

export function AddHistoryDialog({
  open,
  onOpenChange,
  medicalHistory,
  setMedicalHistory,
  patientId,
  onSubmitSuccess,
}: AddHistoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (
    field: keyof MedicalHistoryForm,
    value: string
  ) => {
    setMedicalHistory({ ...medicalHistory, [field]: value });
  };

  const handleFileChange = (
    field: keyof MedicalHistoryForm,
    files: FileList | null
  ) => {
    if (files) {
      const existingFiles = (medicalHistory[field] as File[] | undefined) || [];
      const newFiles = Array.from(files);
      setMedicalHistory({
        ...medicalHistory,
        [field]: [...existingFiles, ...newFiles],
      });
    }
  };

  const handleRemoveFile = (
    field: keyof MedicalHistoryForm,
    fileIndex: number
  ) => {
    const existingFiles = (medicalHistory[field] as File[] | undefined) || [];
    const updatedFiles = existingFiles.filter(
      (_, index) => index !== fileIndex
    );
    setMedicalHistory({ ...medicalHistory, [field]: updatedFiles });
  };

  const isSubmitDisabled =
    !medicalHistory.visitDate || !medicalHistory.mainComplaints;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!patientId) {
      setError("Patient ID is required to save medical history.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();

    // Add patient ID
    formData.append("patient", patientId.toString());

    // Map text fields
    formData.append("fish", medicalHistory.fish || "");
    formData.append("tugilgan_sana", medicalHistory.birthDate || "");
    formData.append("millati", medicalHistory.nationality || "");
    formData.append("malumoti", medicalHistory.education || "");
    formData.append("kasbi", medicalHistory.profession || "");
    formData.append("ish_joyi", medicalHistory.workplace || "");
    formData.append("ish_vazifasi", medicalHistory.workPosition || "");
    formData.append("uy_manzili", medicalHistory.homeAddress || "");
    formData.append("kelgan_vaqti", medicalHistory.visitDate || "");
    formData.append("shikoyatlar", medicalHistory.mainComplaints || "");
    formData.append("asosiy_kasalliklar", medicalHistory.systemicDiseases || "");

    // Respiratory system
    formData.append("nafas_tizimi", medicalHistory.respiratoryComplaints || "");
    (medicalHistory.respiratoryFiles || []).forEach((file, index) =>
      formData.append("nafas_tizimi_hujjat", file)
    );
    formData.append("yotal", medicalHistory.cough || "");
    (medicalHistory.respiratoryFiles || []).forEach((file, index) =>
      formData.append("yotal_hujjat", file)
    );
    formData.append("balgam", medicalHistory.sputum || "");
    (medicalHistory.respiratoryFiles || []).forEach((file, index) =>
      formData.append("balgam_hujjat", file)
    );
    formData.append("qon_tuflash", medicalHistory.hemoptysis || "");
    (medicalHistory.respiratoryFiles || []).forEach((file, index) =>
      formData.append("qon_tuflash_hujjat", file)
    );
    formData.append("kokrak_ogriq", medicalHistory.chestPain || "");
    (medicalHistory.respiratoryFiles || []).forEach((file, index) =>
      formData.append("kokrak_ogriq_hujjat", file)
    );
    formData.append("nafas_qisishi", medicalHistory.dyspnea || "");
    (medicalHistory.respiratoryFiles || []).forEach((file, index) =>
      formData.append("nafas_qisishi_hujjat", file)
    );

    // Cardiovascular system
    formData.append(
      "yurak_qon_shikoyatlari",
      medicalHistory.cardiovascularComplaints || ""
    );
    (medicalHistory.cardiovascularFiles || []).forEach((file, index) =>
      formData.append("yurak_qon_shikoyatlari_hujjat", file)
    );
    formData.append("yurak_ogriq", medicalHistory.heartPain || "");
    (medicalHistory.cardiovascularFiles || []).forEach((file, index) =>
      formData.append("yurak_ogriq_hujjat", file)
    );
    formData.append("yurak_urishi_ozgarishi", medicalHistory.heartRhythm || "");
    (medicalHistory.cardiovascularFiles || []).forEach((file, index) =>
      formData.append("yurak_urishi_ozgarishi_hujjat", file)
    );
    formData.append("yurak_urishi_sezish", medicalHistory.palpitations || "");
    (medicalHistory.cardiovascularFiles || []).forEach((file, index) =>
      formData.append("yurak_urishi_sezish_hujjat", file)
    );

    // Digestive system
    formData.append("hazm_tizimi", medicalHistory.digestiveComplaints || "");
    (medicalHistory.digestiveFiles || []).forEach((file, index) =>
      formData.append("hazm_tizimi_hujjat", file)
    );
    formData.append("qusish", medicalHistory.vomiting || "");
    (medicalHistory.digestiveFiles || []).forEach((file, index) =>
      formData.append("qusish_hujjat", file)
    );
    formData.append("qorin_ogriq", medicalHistory.abdominalPain || "");
    (medicalHistory.digestiveFiles || []).forEach((file, index) =>
      formData.append("qorin_ogriq_hujjat", file)
    );
    formData.append("qorin_shish", medicalHistory.epigastricPain || "");
    (medicalHistory.digestiveFiles || []).forEach((file, index) =>
      formData.append("qorin_shish_hujjat", file)
    );
    formData.append("ich_ozgarishi", medicalHistory.bowelMovements || "");
    (medicalHistory.digestiveFiles || []).forEach((file, index) =>
      formData.append("ich_ozgarishi_hujjat", file)
    );
    formData.append("anus_shikoyatlar", medicalHistory.analSymptoms || "");
    (medicalHistory.digestiveFiles || []).forEach((file, index) =>
      formData.append("anus_shikoyatlar_hujjat", file)
    );

    // Urinary system
    formData.append("siydik_tizimi", medicalHistory.urinaryComplaints || "");
    (medicalHistory.urinaryFiles || []).forEach((file, index) =>
      formData.append("siydik_tizimi_hujjat", file)
    );

    // Endocrine system
    formData.append("endokrin_tizimi", medicalHistory.endocrineComplaints || "");
    (medicalHistory.endocrineFiles || []).forEach((file, index) =>
      formData.append("endokrin_tizimi_hujjat", file)
    );

    // Musculoskeletal system
    formData.append(
      "tayanch_harakat",
      medicalHistory.musculoskeletalComplaints || ""
    );
    (medicalHistory.musculoskeletalFiles || []).forEach((file, index) =>
      formData.append("tayanch_harat_hujjat", file)
    );

    // Nervous system
    formData.append(
      "asab_tizimi",
      medicalHistory.nervousSystemComplaints || ""
    );
    (medicalHistory.nervousSystemFiles || []).forEach((file, index) =>
      formData.append("asab_tizimi_hujjat", file)
    );

    // Doctor recommendations
    formData.append(
      "doctor_recommendations",
      medicalHistory.doctorRecommendations || ""
    );

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add authentication token
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit medical history");
      }

      onOpenChange(false); // Close dialog on success
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Kasallik tarixi (Подробная история болезни)
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
                      onChange={(e) =>
                        handleInputChange("fish", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="birth-date">Bemorni tug'ilgan sanasi</Label>
                    <Input
                      id="birth-date"
                      type="date"
                      value={medicalHistory.birthDate}
                      onChange={(e) =>
                        handleInputChange("birthDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Millati</Label>
                    <Input
                      id="nationality"
                      value={medicalHistory.nationality}
                      onChange={(e) =>
                        handleInputChange("nationality", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="education">Ma'lumoti</Label>
                    <Input
                      id="education"
                      value={medicalHistory.education}
                      onChange={(e) =>
                        handleInputChange("education", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Kasbi</Label>
                    <Input
                      id="profession"
                      value={medicalHistory.profession}
                      onChange={(e) =>
                        handleInputChange("profession", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="workplace">Ish joyi</Label>
                    <Input
                      id="workplace"
                      value={medicalHistory.workplace}
                      onChange={(e) =>
                        handleInputChange("workplace", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="work-position">Ish joyidagi vazifasi</Label>
                    <Input
                      id="work-position"
                      value={medicalHistory.workPosition}
                      onChange={(e) =>
                        handleInputChange("workPosition", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="home-address">Uy manzili</Label>
                    <Input
                      id="home-address"
                      value={medicalHistory.homeAddress}
                      onChange={(e) =>
                        handleInputChange("homeAddress", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("visitDate", e.target.value)
                      }
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
                    onChange={(e) =>
                      handleInputChange("mainComplaints", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("systemicDiseases", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("respiratoryComplaints", e.target.value)
                    }
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
                    onChange={(e) => handleInputChange("cough", e.target.value)}
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
                    onChange={(e) =>
                      handleInputChange("sputum", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("hemoptysis", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("chestPain", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("dyspnea", e.target.value)
                    }
                  />
                </div>
                <FileAttachment
                  id="respiratory-files"
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
                    onChange={(e) =>
                      handleInputChange(
                        "cardiovascularComplaints",
                        e.target.value
                      )
                    }
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
                    onChange={(e) =>
                      handleInputChange("heartPain", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("heartRhythm", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("palpitations", e.target.value)
                    }
                  />
                </div>
                <FileAttachment
                  id="cardiovascular-files"
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
                    onChange={(e) =>
                      handleInputChange("digestiveComplaints", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("vomiting", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("abdominalPain", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("epigastricPain", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("bowelMovements", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("analSymptoms", e.target.value)
                    }
                  />
                </div>
                <FileAttachment
                  id="digestive-files"
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
                    onChange={(e) =>
                      handleInputChange("urinaryComplaints", e.target.value)
                    }
                  />
                </div>
                <FileAttachment
                  id="urinary-files"
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
                    onChange={(e) =>
                      handleInputChange("endocrineComplaints", e.target.value)
                    }
                  />
                </div>
                <FileAttachment
                  id="endocrine-files"
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
                    onChange={(e) =>
                      handleInputChange(
                        "musculoskeletalComplaints",
                        e.target.value
                      )
                    }
                  />
                </div>
                <FileAttachment
                  id="musculoskeletal-files"
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
                    onChange={(e) =>
                      handleInputChange(
                        "nervousSystemComplaints",
                        e.target.value
                      )
                    }
                  />
                </div>
                <FileAttachment
                  id="nervous-system-files"
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
                  onChange={(e) =>
                    handleInputChange("doctorRecommendations", e.target.value)
                  }
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
            disabled={isSubmitDisabled || isSubmitting}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          >
            {isSubmitting ? (
              "Saqlanmoqda..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Kasallik tarixini saqlash
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}