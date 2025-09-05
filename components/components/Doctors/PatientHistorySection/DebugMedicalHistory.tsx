"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { API_CONFIG } from "../../../config/api"

export default function DebugMedicalHistory() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearResults = () => {
    setResults([])
  }

  const testStep1 = async () => {
    setLoading(true)
    addResult("Step 1: Checking localStorage for access token...")
    
    try {
      const token = localStorage.getItem("accessToken")
      if (token) {
        addResult(`✅ Token found: ${token.substring(0, 20)}...`)
      } else {
        addResult("❌ No access token found in localStorage")
        setLoading(false)
        return
      }
    } catch (error) {
      addResult(`❌ Error accessing localStorage: ${error}`)
      setLoading(false)
      return
    }
    
    setLoading(false)
  }

  const testStep2 = async () => {
    setLoading(true)
    addResult("Step 2: Testing basic API connectivity...")
    
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        addResult("❌ No token available for this test")
        setLoading(false)
        return
      }

      addResult("Making GET request to patients API...")
      
      const response = await fetch(API_CONFIG.ENDPOINTS.PATIENTS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
      })

      addResult(`Response status: ${response.status}`)
      addResult(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`)

      if (response.ok) {
        const data = await response.json()
        addResult(`✅ API call successful. Data type: ${typeof data}, Length: ${Array.isArray(data) ? data.length : 'N/A'}`)
        if (Array.isArray(data) && data.length > 0) {
          addResult(`First patient: ID=${data[0].id}, Name=${data[0].full_name}`)
        }
      } else {
        const errorText = await response.text()
        addResult(`❌ API call failed: ${errorText}`)
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`)
    }
    
    setLoading(false)
  }

  const testStep3 = async () => {
    setLoading(true)
    addResult("Step 3: Testing medical history API...")
    
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        addResult("❌ No token available for this test")
        setLoading(false)
        return
      }

      // First get a patient ID
      const patientsResponse = await fetch(API_CONFIG.ENDPOINTS.PATIENTS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
      })

      if (!patientsResponse.ok) {
        addResult("❌ Cannot get patients list for testing")
        setLoading(false)
        return
      }

      const patients = await patientsResponse.json()
      if (!Array.isArray(patients) || patients.length === 0) {
        addResult("❌ No patients available for testing")
        setLoading(false)
        return
      }

      const testPatientId = patients[0].id
      addResult(`Using patient ID: ${testPatientId} for testing`)

      // Test GET medical history
      addResult("Testing GET medical history...")
      const getResponse = await fetch(`${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/?patient_id=${testPatientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
      })

      addResult(`GET response status: ${getResponse.status}`)
      if (getResponse.ok) {
        const data = await getResponse.json()
        addResult(`✅ GET successful. Data: ${JSON.stringify(data)}`)
      } else {
        const errorText = await getResponse.text()
        addResult(`❌ GET failed: ${errorText}`)
      }

    } catch (error) {
      addResult(`❌ Error in step 3: ${error}`)
    }
    
    setLoading(false)
  }

  const testStep4 = async () => {
    setLoading(true)
    addResult("Step 4: Testing medical history creation...")
    
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        addResult("❌ No token available for this test")
        setLoading(false)
        return
      }

      // First get a patient ID
      const patientsResponse = await fetch(API_CONFIG.ENDPOINTS.PATIENTS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
      })

      if (!patientsResponse.ok) {
        addResult("❌ Cannot get patients list for testing")
        setLoading(false)
        return
      }

      const patients = await patientsResponse.json()
      if (!Array.isArray(patients) || patients.length === 0) {
        addResult("❌ No patients available for testing")
        setLoading(false)
        return
      }

      const testPatientId = patients[0].id
      addResult(`Using patient ID: ${testPatientId} for testing`)

      // Test POST medical history
      const testData = {
        patient: testPatientId,
        fish: "Test Patient Debug",
        tugilgan_sana: "1990-01-01",
        kelgan_vaqti: "2024-01-15",
        shikoyatlar: "Test complaints for debugging",
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
        doktor_tavsiyalari: "Test recommendations"
      }

      addResult(`Sending test data: ${JSON.stringify(testData, null, 2)}`)

      const postResponse = await fetch(`${API_CONFIG.BASE_URL}/api/patients/kasallik-tarixi/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
        body: JSON.stringify(testData),
      })

      addResult(`POST response status: ${postResponse.status}`)
      addResult(`POST response headers: ${JSON.stringify(Object.fromEntries(postResponse.headers.entries()))}`)

      if (postResponse.ok) {
        const data = await postResponse.json()
        addResult(`✅ POST successful. Response: ${JSON.stringify(data)}`)
      } else {
        const errorText = await postResponse.text()
        addResult(`❌ POST failed: ${errorText}`)
      }

    } catch (error) {
      addResult(`❌ Error in step 4: ${error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug Medical History API</CardTitle>
          <CardDescription>
            Step-by-step debugging to identify the exact issue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testStep1} disabled={loading} variant="outline">
              Step 1: Check Token
            </Button>
            <Button onClick={testStep2} disabled={loading} variant="outline">
              Step 2: Test Patients API
            </Button>
            <Button onClick={testStep3} disabled={loading} variant="outline">
              Step 3: Test GET Medical History
            </Button>
            <Button onClick={testStep4} disabled={loading} variant="outline">
              Step 4: Test POST Medical History
            </Button>
            <Button onClick={clearResults} variant="destructive">
              Clear Results
            </Button>
          </div>

          <div className="p-4 bg-gray-50 border rounded-md">
            <h3 className="font-medium mb-2">Debug Results:</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500">Click a step to start debugging...</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
