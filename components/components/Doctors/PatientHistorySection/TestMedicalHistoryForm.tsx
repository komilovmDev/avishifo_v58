"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MedicalHistoryForm {
  fish: string
  birthDate: string
  nationality: string
  education: string
  profession: string
  workplace: string
  workPosition: string
  homeAddress: string
  visitDate: string
  mainComplaints: string
  systemicDiseases: string
  respiratoryComplaints: string
  cough: string
  sputum: string
  hemoptysis: string
  chestPain: string
  dyspnea: string
  cardiovascularComplaints: string
  heartPain: string
  heartRhythm: string
  palpitations: string
  digestiveComplaints: string
  vomiting: string
  abdominalPain: string
  epigastricPain: string
  bowelMovements: string
  analSymptoms: string
  urinaryComplaints: string
  endocrineComplaints: string
  musculoskeletalComplaints: string
  nervousSystemComplaints: string
  doctorRecommendations: string
}

export function TestMedicalHistoryForm() {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryForm>({
    fish: "Test Patient",
    birthDate: "",
    nationality: "Uzbek",
    education: "Oliy",
    profession: "Test",
    workplace: "Test Hospital",
    workPosition: "Test Position",
    homeAddress: "Test Address",
    visitDate: new Date().toISOString().split('T')[0],
    mainComplaints: "Test complaints",
    systemicDiseases: "Yuq",
    respiratoryComplaints: "Yuq",
    cough: "Yuq",
    sputum: "Yuq",
    hemoptysis: "Yuq",
    chestPain: "Yuq",
    dyspnea: "Yuq",
    cardiovascularComplaints: "Yuq",
    heartPain: "Yuq",
    heartRhythm: "Yuq",
    palpitations: "Yuq",
    digestiveComplaints: "Yuq",
    vomiting: "Yuq",
    abdominalPain: "Yuq",
    epigastricPain: "Yuq",
    bowelMovements: "Yuq",
    analSymptoms: "Yuq",
    urinaryComplaints: "Yuq",
    endocrineComplaints: "Yuq",
    musculoskeletalComplaints: "Yuq",
    nervousSystemComplaints: "Yuq",
    doctorRecommendations: "Test recommendations"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted successfully!")
    console.log("Medical History Data:", medicalHistory)
    
    // Simulate the comprehensive notes creation
    const comprehensiveNotes = `
ASOSIY MA'LUMOTLAR:
F.I.SH: ${medicalHistory.fish}
Tug'ilgan sanasi: ${medicalHistory.birthDate}
Millati: ${medicalHistory.nationality}
Ma'lumoti: ${medicalHistory.education}
Kasbi: ${medicalHistory.profession}
Ish joyi: ${medicalHistory.workplace}
Ish joyidagi vazifasi: ${medicalHistory.workPosition}
Uy manzili: ${medicalHistory.homeAddress}

KELGAN VAQTDAGI SHIKOYATLARI:
${medicalHistory.mainComplaints}

BEMORNING ASOSIY TIZIMLI KASALLIKLARI:
${medicalHistory.systemicDiseases}

NAFAS TIZIMIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${medicalHistory.respiratoryComplaints}
Yo'tal: ${medicalHistory.cough}
Balg'am: ${medicalHistory.sputum}
Qon tuflash: ${medicalHistory.hemoptysis}
Ko'krak qafasidagi og'riq: ${medicalHistory.chestPain}
Nafas qisishi: ${medicalHistory.dyspnea}

YURAK QON AYLANISHI TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${medicalHistory.cardiovascularComplaints}
Yurak sohasidagi og'riq: ${medicalHistory.heartPain}
Yurak urishining o'zgarishi: ${medicalHistory.heartRhythm}
Yurak urishini bemor his qilishi: ${medicalHistory.palpitations}

HAZM TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
Umumiy shikoyatlar: ${medicalHistory.digestiveComplaints}
Qusish: ${medicalHistory.vomiting}
Qorin og'riqi: ${medicalHistory.abdominalPain}
To'sh osti va boshqa sohalarda og'riq: ${medicalHistory.epigastricPain}
Ich kelishining o'zgarishi: ${medicalHistory.bowelMovements}
Anus sohasidagi simptomlar: ${medicalHistory.analSymptoms}

SIYDIK AJRATISH TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${medicalHistory.urinaryComplaints}

ENDOKRIN TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${medicalHistory.endocrineComplaints}

TAYANCH HARAKAT TIZIMI FAOLIYATIGA OID SHIKOYATLARI:
${medicalHistory.musculoskeletalComplaints}

ASAB TIZIMI:
${medicalHistory.nervousSystemComplaints}

DOKTOR TAVSIYALARI:
${medicalHistory.doctorRecommendations}
    `.trim()

    console.log("Comprehensive Notes:", comprehensiveNotes)
    
    // Create the history entry
    const newEntry = {
      id: `hist-${Date.now()}`,
      date: medicalHistory.visitDate,
      type: "Kasallik tarixi (Uzbek)",
      doctor: "Joriy shifokor",
      diagnosis: medicalHistory.mainComplaints.split("\n")[0] || "Kompleks tekshiruv",
      notes: comprehensiveNotes,
      documents: [],
    }
    
    console.log("New History Entry:", newEntry)
    alert("Test form submitted successfully! Check console for details.")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Medical History Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
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
                  <Label htmlFor="visitDate">Visit Date</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={medicalHistory.visitDate}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, visitDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mainComplaints">Main Complaints</Label>
                  <Textarea
                    id="mainComplaints"
                    value={medicalHistory.mainComplaints}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, mainComplaints: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="doctorRecommendations">Doctor Recommendations</Label>
                  <Textarea
                    id="doctorRecommendations"
                    value={medicalHistory.doctorRecommendations}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, doctorRecommendations: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Test Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
