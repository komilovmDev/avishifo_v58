import { TestMedicalHistoryForm } from "@/components/components/Doctors/PatientHistorySection/TestMedicalHistoryForm"

export default function TestMedicalHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Test Medical History Form
        </h1>
        <p className="text-gray-600 text-center mb-8">
          This page is for testing the medical history form functionality. 
          Fill out the form and submit to see if it works correctly.
        </p>
        <TestMedicalHistoryForm />
      </div>
    </div>
  )
}
