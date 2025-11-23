"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// UI Components
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

// API Configuration
import { API_CONFIG } from "@/config/api";

// Page-specific Components
import DoctorProfileHeader from "./Сomponents/DoctorProfileHeader";
import DoctorStats from "./Сomponents/DoctorStats";
import NavigationTabs from "./Сomponents/NavigationTabs";
import PersonalInfo from "./Сomponents/PersonalInfo";
import ProfessionalInfo from "./Сomponents/ProfessionalInfo";
import ScheduleInfo from "./Сomponents/Schedule";
import ContactInfo from "./Сomponents/ContactInfo";

// Modals
import LanguageModal from "./Сomponents/Modals/LanguageModal";
import SpecializationModal from "./Сomponents/Modals/SpecializationModal";
import WorkingHoursModal from "./Сomponents/Modals/WorkingHoursModal";
import AvailabilityModal from "./Сomponents/Modals/AvailabilityModal";

// API Endpoints
const API_BASE_URL = API_CONFIG.BASE_URL;
const DOCTOR_PROFILE_PAGE_API = `${API_BASE_URL}/api/doctors/profile/page/`;
const DOCTOR_PROFILE_OPTIONS_API = `${API_BASE_URL}/api/doctors/profile/options/`;
const DOCTOR_SPECIALTIES_API = `${API_BASE_URL}/api/doctors/specialties/`;

// Helper Functions & Constants
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

const DEFAULT_DOCTOR_DATA = {
  full_name: "",
  first_name: "",
  last_name: "",
  profile_picture: null,
  email: "",
  phone: "",
  specialization: "Врач",
  experience: "Опыт не указан",
  education: "",
  location: "Адрес не указан",
  country: "",
  region: "",
  district: "",
  bio: "",
  languages: [],
  certifications: "",
  date_of_birth: null,
  gender: "",
  address: "",
  emergency_contact: "",
  medical_license: "",
  insurance: "",
  working_hours: "",
  consultation_fee: "Не указано",
  availability: "",
  total_patients: 0,
  monthly_consultations: 0,
  rating: "4.9",
  total_reviews: 0,
  years_experience: 0,
  completed_treatments: 0,
  active_patients: 0,
  monthly_income: 0,
  languages_spoken: [],
  specializations: [],
  awards: [],
  research_papers: 0,
  conferences_attended: 0,
};

export default function DoctorProfilePage() {
  const router = useRouter();

  // Component State
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(DEFAULT_DOCTOR_DATA);
  const [formData, setFormData] = useState(DEFAULT_DOCTOR_DATA);

  // Loading & Error State
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Modal State
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSpecializationModalOpen, setIsSpecializationModalOpen] =
    useState(false);
  const [isWorkingHoursModalOpen, setIsWorkingHoursModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  // Data for Modals
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [availableWorkingHours, setAvailableWorkingHours] = useState([]);
  const [availableAvailability, setAvailableAvailability] = useState([]);

  // --- DATA FETCHING & SIDE EFFECTS ---
  useEffect(() => {
    loadProfileOptions();
    checkAuth();
  }, []);

  const loadProfileOptions = async () => {
    try {
      if (!isAuthenticated()) return;
      const [optionsRes, specialtiesRes] = await Promise.all([
        axios.get(DOCTOR_PROFILE_OPTIONS_API, { headers: getAuthHeaders() }),
        axios.get(DOCTOR_SPECIALTIES_API),
      ]);

      if (optionsRes.data.success) {
        const options = optionsRes.data.data;
        setAvailableLanguages(options.languages || []);
        setAvailableWorkingHours(options.working_hours || []);
        setAvailableAvailability(options.availability || []);
      }

      if (specialtiesRes.data.success) {
        setAvailableSpecializations(
          specialtiesRes.data.data.map((spec) => spec.label)
        );
      }
    } catch (error) {
      console.error("❌ Error loading profile options:", error);
      // Fallback options can be set here if needed
    }
  };

  const checkAuth = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setIsProfileLoading(true);
    setProfileError(null);
    try {
      const response = await axios.get(DOCTOR_PROFILE_PAGE_API, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        const doctorData = { ...DEFAULT_DOCTOR_DATA, ...response.data.data };
        setUserProfile(doctorData);
        setFormData(doctorData);
      } else {
        throw new Error(response.data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("❌ Error fetching doctor profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
      } else {
        setProfileError(
          `Ошибка загрузки профиля: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(userProfile); // Reset form data to original profile data
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.patch(DOCTOR_PROFILE_PAGE_API, formData, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        const updatedProfile = {
          ...DEFAULT_DOCTOR_DATA,
          ...response.data.data,
        };
        setUserProfile(updatedProfile);
        setFormData(updatedProfile);
        setIsEditing(false);
        alert("✅ Профиль успешно обновлен!");
      } else {
        throw new Error(response.data.message || "Ошибка обновления профиля");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert(
        `❌ Ошибка: ${
          error.response?.data?.detail || error.message || "Неизвестная ошибка"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("profile_picture", file);

    try {
      const response = await axios.patch(
        DOCTOR_PROFILE_PAGE_API,
        uploadFormData,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );
      if (response.data.success) {
        const updatedProfile = { ...userProfile, ...response.data.data };
        setUserProfile(updatedProfile);
        setFormData(updatedProfile);
        alert("✅ Фотография профиля обновлена!");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
      alert("❌ Ошибка загрузки фотографии.");
    }
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    const props = { isEditing, formData, handleInputChange, userProfile };
    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfo
            {...props}
            openLanguageModal={() => setIsLanguageModalOpen(true)}
          />
        );
      case "professional":
        return (
          <ProfessionalInfo
            {...props}
            openSpecializationModal={() => setIsSpecializationModalOpen(true)}
          />
        );
      case "schedule":
        return (
          <ScheduleInfo
            {...props}
            openWorkingHoursModal={() => setIsWorkingHoursModalOpen(true)}
            openAvailabilityModal={() => setIsAvailabilityModalOpen(true)}
          />
        );
      case "contact":
        return <ContactInfo {...props} />;
      default:
        return (
          <PersonalInfo
            {...props}
            openLanguageModal={() => setIsLanguageModalOpen(true)}
          />
        );
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Загрузка профиля доктора...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ошибка загрузки
          </h2>
          <p className="text-gray-600 mb-4 max-w-md">{profileError}</p>
          <Button
            onClick={() => checkAuth()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <DoctorProfileHeader
            userProfile={userProfile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            handleLogout={handleLogout}
            handleProfilePictureChange={handleProfilePictureChange}
            isLoading={isSaving}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-6">
              <NavigationTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <div className="lg:col-span-3 space-y-6">{renderContent()}</div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        availableLanguages={availableLanguages}
        selectedLanguages={formData.languages || []}
        onLanguageToggle={(language) => {
          const newLangs = formData.languages.includes(language)
            ? formData.languages.filter((lang) => lang !== language)
            : [...formData.languages, language];
          handleInputChange("languages", newLangs);
        }}
        onClear={() => handleInputChange("languages", [])}
      />

      <SpecializationModal
        isOpen={isSpecializationModalOpen}
        onClose={() => setIsSpecializationModalOpen(false)}
        availableSpecializations={availableSpecializations}
        selectedSpecializations={formData.specializations || []}
        onSpecializationToggle={(spec) => {
          const newSpecs = formData.specializations.includes(spec)
            ? formData.specializations.filter((s) => s !== spec)
            : [...formData.specializations, spec];
          handleInputChange("specializations", newSpecs);
        }}
        onClear={() => handleInputChange("specializations", [])}
      />

      <WorkingHoursModal
        isOpen={isWorkingHoursModalOpen}
        onClose={() => setIsWorkingHoursModalOpen(false)}
        availableHours={availableWorkingHours}
        selectedHours={formData.working_hours}
        onSelect={(hours) => {
          handleInputChange("working_hours", hours);
          setIsWorkingHoursModalOpen(false);
        }}
        onClear={() => handleInputChange("working_hours", "")}
      />

      <AvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        availableOptions={availableAvailability}
        selectedOption={formData.availability}
        onSelect={(option) => {
          handleInputChange("availability", option);
          setIsAvailabilityModalOpen(false);
        }}
        onClear={() => handleInputChange("availability", "")}
      />
    </>
  );
}
