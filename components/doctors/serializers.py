from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Hospital
from django.utils import timezone
from datetime import datetime

User = get_user_model()

class DoctorProfileSerializer(serializers.ModelSerializer):
    # Основная информация пользователя
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    avatar = serializers.SerializerMethodField()
    
    # Профессиональная информация
    specialty_display = serializers.CharField(source='get_specialty_display', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    experience_text = serializers.SerializerMethodField()
    education_formatted = serializers.SerializerMethodField()
    certifications_list = serializers.SerializerMethodField()
    
    # Рейтинг и статистика
    rating_display = serializers.SerializerMethodField()
    total_patients = serializers.SerializerMethodField()
    total_consultations = serializers.SerializerMethodField()
    
    # Статусы и даты
    last_active = serializers.SerializerMethodField()
    profile_completion = serializers.SerializerMethodField()
    verification_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = [
            'doctor_id', 'full_name', 'email', 'phone', 'avatar',
            'specialty', 'specialty_display', 'license_number',
            'hospital_name', 'years_of_experience', 'experience_text',
            'education', 'education_formatted', 'certifications', 'certifications_list',
            'consultation_fee', 'is_available', 'rating', 'rating_display',
            'total_patients', 'total_consultations', 'last_active',
            'profile_completion', 'verification_status', 'created_at'
        ]
    
    def get_avatar(self, obj):
        if hasattr(obj.user, 'avatar') and obj.user.avatar:
            return obj.user.avatar.url
        return f"/placeholder.svg?height=100&width=100&text={obj.user.full_name[0] if obj.user.full_name else 'Dr'}"
    
    def get_experience_text(self, obj):
        if obj.years_of_experience:
            if obj.years_of_experience == 1:
                return "1 год опыта"
            elif obj.years_of_experience < 5:
                return f"{obj.years_of_experience} года опыта"
            else:
                return f"{obj.years_of_experience} лет опыта"
        return "Опыт не указан"
    
    def get_education_formatted(self, obj):
        if obj.education and obj.education.strip():
            return obj.education
        return "Образование не указано"
    
    def get_certifications_list(self, obj):
        if obj.certifications and obj.certifications.strip():
            # Разделяем сертификаты по переносам строк или точкам с запятой
            certs = [cert.strip() for cert in obj.certifications.replace(';', '\n').split('\n') if cert.strip()]
            return certs if certs else ["Сертификаты не указаны"]
        return ["Сертификаты не указаны"]
    
    def get_rating_display(self, obj):
        if obj.rating and obj.rating > 0:
            return {
                'value': float(obj.rating),
                'text': f"{obj.rating:.1f} из 5.0",
                'stars': int(obj.rating)
            }
        return {
            'value': 0,
            'text': "Рейтинг не установлен",
            'stars': 0
        }
    
    def get_total_patients(self, obj):
        # Здесь должна быть логика подсчета пациентов
        # Пока возвращаем заглушку
        return 0
    
    def get_total_consultations(self, obj):
        # Здесь должна быть логика подсчета консультаций
        # Пока возвращаем заглушку
        return 0
    
    def get_last_active(self, obj):
        if hasattr(obj.user, 'last_login') and obj.user.last_login:
            return obj.user.last_login.isoformat()
        return obj.updated_at.isoformat()
    
    def get_profile_completion(self, obj):
        total_fields = 10
        completed_fields = 0
        
        # Проверяем заполненность основных полей
        if obj.user.full_name: completed_fields += 1
        if obj.user.email: completed_fields += 1
        if obj.user.phone: completed_fields += 1
        if obj.specialty: completed_fields += 1
        if obj.license_number: completed_fields += 1
        if obj.hospital: completed_fields += 1
        if obj.years_of_experience > 0: completed_fields += 1
        if obj.education and obj.education.strip(): completed_fields += 1
        if obj.certifications and obj.certifications.strip(): completed_fields += 1
        if obj.consultation_fee > 0: completed_fields += 1
        
        percentage = int((completed_fields / total_fields) * 100)
        
        return {
            'percentage': percentage,
            'completed_fields': completed_fields,
            'total_fields': total_fields,
            'status': 'complete' if percentage >= 90 else 'incomplete' if percentage >= 50 else 'minimal'
        }
    
    def get_verification_status(self, obj):
        # Здесь должна быть логика проверки верификации документов
        return {
            'is_verified': bool(obj.license_number),
            'documents_uploaded': bool(obj.license_number and obj.certifications),
            'last_verification': obj.updated_at.isoformat(),
            'status_text': "Верифицирован" if obj.license_number else "Требуется верификация"
        }


class DoctorScheduleSerializer(serializers.Serializer):
    day = serializers.CharField()
    day_name = serializers.CharField()
    is_working = serializers.BooleanField()
    start_time = serializers.TimeField(allow_null=True)
    end_time = serializers.TimeField(allow_null=True)
    break_start = serializers.TimeField(allow_null=True)
    break_end = serializers.TimeField(allow_null=True)
    online_consultations = serializers.BooleanField(default=False)


class DoctorContactsSerializer(serializers.Serializer):
    work_email = serializers.EmailField(allow_null=True)
    work_phone = serializers.CharField(allow_null=True)
    linkedin = serializers.URLField(allow_null=True)
    researchgate = serializers.URLField(allow_null=True)
    orcid = serializers.CharField(allow_null=True)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Заменяем None на понятные сообщения
        for key, value in data.items():
            if value is None:
                if key == 'work_email':
                    data[key] = "Рабочий email не указан"
                elif key == 'work_phone':
                    data[key] = "Рабочий телефон не указан"
                elif key == 'linkedin':
                    data[key] = "LinkedIn профиль не указан"
                elif key == 'researchgate':
                    data[key] = "ResearchGate профиль не указан"
                elif key == 'orcid':
                    data[key] = "ORCID не указан"
        return data
