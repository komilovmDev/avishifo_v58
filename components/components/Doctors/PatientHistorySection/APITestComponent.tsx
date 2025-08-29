"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function APITestComponent() {
  const [patientsResult, setPatientsResult] = useState<string>("")
  const [historyResult, setHistoryResult] = useState<string>("")
  const [patientId, setPatientId] = useState<string>("1")
  const [isLoading, setIsLoading] = useState(false)

  const testPatientsAPI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://new.avishifo.uz/api/patients/patientlar/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      })

      const data = await response.json()
      setPatientsResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setPatientsResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMedicalHistoryAPI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://new.avishifo.uz/api/patients/kasallik-tarixi/?patient_id=${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })

      const data = await response.json()
      setHistoryResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setHistoryResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">API Test Component</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Patients API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testPatientsAPI} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Testing..." : "Test Patients API"}
            </Button>
            {patientsResult && (
              <div className="mt-4">
                <Label>Result:</Label>
                <pre className="mt-2 p-3 bg-gray-100 rounded-md text-xs overflow-auto max-h-96">
                  {patientsResult}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Medical History API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="patient-id">Patient ID:</Label>
              <Input
                id="patient-id"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
                className="mt-1"
              />
            </div>
            <Button 
              onClick={testMedicalHistoryAPI} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Testing..." : "Test Medical History API"}
            </Button>
            {historyResult && (
              <div className="mt-4">
                <Label>Result:</Label>
                <pre className="mt-2 p-3 bg-gray-100 rounded-md text-xs overflow-auto max-h-96">
                  {historyResult}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Endpoints Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Patients API:</strong> 
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                GET https://new.avishifo.uz/api/patients/patientlar/
              </code>
            </div>
            <div>
              <strong>Medical History API:</strong> 
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                GET https://new.avishifo.uz/api/patients/kasallik-tarixi/?patient_id={id}
              </code>
            </div>
            <div>
              <strong>Create Patient API:</strong> 
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                POST https://new.avishifo.uz/api/patients/create/
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
