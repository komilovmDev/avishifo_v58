"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { API_CONFIG } from "../../../config/api"

export default function TestMedicalHistoryAPI() {
  const [patients, setPatients] = useState<any[]>([])
  const [testData, setTestData] = useState({
    patient: "", // Test patient ID - will be set after fetching patients
    fish: "Test Patient",
    tugilgan_sana: "1990-01-01",
    millati: "Uzbek",
    malumoti: "Higher",
    kasbi: "Engineer",
    ish_joyi: "Test Company",
    ish_vazifasi: "Developer",
    uy_manzili: "Test Address",
    kelgan_vaqti: "2024-01-15",
    shikoyatlar: "Test complaints",
    asosiy_kasalliklar: "Test diseases",
    nafas_tizimi: "Test respiratory",
    yotal: "Test cough",
    balgam: "Test sputum",
    qon_tuflash: "Test hemoptysis",
    kokrak_ogriq: "Test chest pain",
    nafas_qisishi: "Test dyspnea",
    yurak_qon_shikoyatlari: "Test cardiovascular",
    yurak_ogriq: "Test heart pain",
    yurak_urishi_ozgarishi: "Test heart rhythm",
    yurak_urishi_sezish: "Test palpitations",
    hazm_tizimi: "Test digestive",
    qusish: "Test vomiting",
    qorin_ogriq: "Test abdominal pain",
    qorin_shish: "Test epigastric pain",
    ich_ozgarishi: "Test bowel movements",
    anus_shikoyatlar: "Test anal symptoms",
    siydik_tizimi: "Test urinary",
    endokrin_tizimi: "Test endocrine",
    tayanch_tizimi: "Test musculoskeletal",
    asab_tizimi: "Test nervous system",
    doktor_tavsiyalari: "Test recommendations",
  })

  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchPatients = async () => {
    setLoading(true)
    setError(null)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token found. Please login first.")
        setLoading(false)
        return
      }

      const response = await fetch(API_CONFIG.ENDPOINTS.PATIENTS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        mode: 'cors',
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(`API Error: ${response.status} - ${data.error || data.message || 'Unknown error'}`)
      } else {
        const patientsArray = Array.isArray(data) ? data : data.data || data.results || [data]
        setPatients(patientsArray)
        
        // Set the first patient as default for testing
        if (patientsArray.length > 0) {
          setTestData(prev => ({ ...prev, patient: String(patientsArray[0].id) }))
        }
        
        setResponse(data)
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const createTestPatient = async () => {
    setLoading(true)
    setError(null)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token found. Please login first.")
        setLoading(false)
        return
      }

      const patientData = {
        full_name: "Test Patient API",
        passport_series: "AB",
        passport_number: "1234567",
        phone: "+998901234567",
        birth_date: "1990-01-01",
        gender: "male",
        blood_group: "A+",
        address: "Test Address",
        status: "active"
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/patients/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        mode: 'cors',
        body: JSON.stringify(patientData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(`API Error: ${response.status} - ${data.error || data.message || 'Unknown error'}`)
        setResponse(data)
      } else {
        setResponse(data)
        // Refresh patients list
        await fetchPatients()
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token found. Please login first.")
        setLoading(false)
        return
      }

      console.log("Testing API with data:", testData)

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        mode: 'cors',
        body: JSON.stringify(testData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(`API Error: ${response.status} - ${data.error || data.message || 'Unknown error'}`)
        setResponse(data)
      } else {
        setResponse(data)
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testGetAPI = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token found. Please login first.")
        setLoading(false)
        return
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        mode: 'cors',
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(`API Error: ${response.status} - ${data.error || data.message || 'Unknown error'}`)
        setResponse(data)
      } else {
        setResponse(data)
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Medical History API</CardTitle>
          <CardDescription>
            Test the medical history API endpoints directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={fetchPatients} disabled={loading} variant="outline">
              {loading ? "Loading..." : "Fetch Patients"}
            </Button>
            <Button onClick={createTestPatient} disabled={loading} variant="outline">
              {loading ? "Creating..." : "Create Test Patient"}
            </Button>
          </div>

          {patients.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-medium">Available Patients:</h3>
              <ul className="text-green-600 text-sm">
                {patients.map((patient: any) => (
                  <li key={patient.id} className="flex items-center gap-2">
                    <span>ID: {patient.id}</span>
                    <span>Name: {patient.full_name}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setTestData({...testData, patient: String(patient.id), fish: patient.full_name})}
                    >
                      Select
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patient">Patient ID</Label>
              <Input
                id="patient"
                value={testData.patient}
                onChange={(e) => setTestData({...testData, patient: e.target.value})}
                placeholder="Patient ID"
              />
            </div>
            <div>
              <Label htmlFor="fish">F.I.SH</Label>
              <Input
                id="fish"
                value={testData.fish}
                onChange={(e) => setTestData({...testData, fish: e.target.value})}
                placeholder="Full Name"
              />
            </div>
            <div>
              <Label htmlFor="kelgan_vaqti">Visit Date</Label>
              <Input
                id="kelgan_vaqti"
                type="date"
                value={testData.kelgan_vaqti}
                onChange={(e) => setTestData({...testData, kelgan_vaqti: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="shikoyatlar">Complaints</Label>
              <Textarea
                id="shikoyatlar"
                value={testData.shikoyatlar}
                onChange={(e) => setTestData({...testData, shikoyatlar: e.target.value})}
                placeholder="Patient complaints"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={testAPI} disabled={loading}>
              {loading ? "Testing..." : "Test POST API"}
            </Button>
            <Button onClick={testGetAPI} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Test GET API"}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-medium">Error:</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {response && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-blue-800 font-medium">Response:</h3>
              <pre className="text-blue-600 text-sm overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
