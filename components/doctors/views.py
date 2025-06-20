from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Doctor
from .serializers import DoctorProfileSerializer, DoctorScheduleSerializer, DoctorContactsSerializer

class DoctorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        try:
            return Doctor.objects.select_related('user', 'hospital').get(user=self.request.user)
        except Doctor.DoesNotExist:
            return None
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response({
                'success': False,
                'error': 'Профиль врача не найден'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_schedule(request, pk=None):
    """Получить расписание врача"""
    try:
        if pk:
            doctor = get_object_or_404(Doctor, pk=pk)
        else:
            doctor = get_object_or_404(Doctor, user=request.user)
        
        # Заглушка для расписания - в реальном проекте это должно быть в отдельной модели
        schedule_data = [
            {
                'day': 'monday',
                'day_name': 'Понедельник',
                'is_working': True,
                'start_time': '09:00',
                'end_time': '18:00',
                'break_start': '13:00',
                'break_end': '14:00',
                'online_consultations': True
            },
            {
                'day': 'tuesday',
                'day_name': 'Вторник',
                'is_working': True,
                'start_time': '09:00',
                'end_time': '18:00',
                'break_start': '13:00',
                'break_end': '14:00',
                'online_consultations': True
            },
            {
                'day': 'wednesday',
                'day_name': 'Среда',
                'is_working': True,
                'start_time': '09:00',
                'end_time': '18:00',
                'break_start': '13:00',
                'break_end': '14:00',
                'online_consultations': False
            },
            {
                'day': 'thursday',
                'day_name': 'Четверг',
                'is_working': True,
                'start_time': '09:00',
                'end_time': '18:00',
                'break_start': '13:00',
                'break_end': '14:00',
                'online_consultations': True
            },
            {
                'day': 'friday',
                'day_name': 'Пятница',
                'is_working': True,
                'start_time': '09:00',
                'end_time': '17:00',
                'break_start': '13:00',
                'break_end': '14:00',
                'online_consultations': True
            },
            {
                'day': 'saturday',
                'day_name': 'Суббота',
                'is_working': False,
                'start_time': None,
                'end_time': None,
                'break_start': None,
                'break_end': None,
                'online_consultations': False
            },
            {
                'day': 'sunday',
                'day_name': 'Воскресенье',
                'is_working': False,
                'start_time': None,
                'end_time': None,
                'break_start': None,
                'break_end': None,
                'online_consultations': False
            }
        ]
        
        return Response({
            'success': True,
            'data': schedule_data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_contacts(request, pk=None):
    """Получить дополнительные контакты врача"""
    try:
        if pk:
            doctor = get_object_or_404(Doctor, pk=pk)
        else:
            doctor = get_object_or_404(Doctor, user=request.user)
        
        # Заглушка для контактов - в реальном проекте это должно быть в отдельной модели
        contacts_data = {
            'work_email': getattr(doctor, 'work_email', None),
            'work_phone': getattr(doctor, 'work_phone', None),
            'linkedin': getattr(doctor, 'linkedin', None),
            'researchgate': getattr(doctor, 'researchgate', None),
            'orcid': getattr(doctor, 'orcid', None),
        }
        
        serializer = DoctorContactsSerializer(contacts_data)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_reviews(request, pk=None):
    """Получить отзывы о враче"""
    try:
        if pk:
            doctor = get_object_or_404(Doctor, pk=pk)
        else:
            doctor = get_object_or_404(Doctor, user=request.user)
        
        # Заглушка для отзывов
        reviews_data = {
            'average_rating': float(doctor.rating) if doctor.rating else 0,
            'total_reviews': 0,
            'rating_breakdown': {
                '5': 0, '4': 0, '3': 0, '2': 0, '1': 0
            },
            'recent_reviews': []
        }
        
        return Response({
            'success': True,
            'data': reviews_data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_analytics(request, pk=None):
    """Получить аналитику врача"""
    try:
        if pk:
            doctor = get_object_or_404(Doctor, pk=pk)
        else:
            doctor = get_object_or_404(Doctor, user=request.user)
        
        # Заглушка для аналитики
        analytics_data = {
            'total_patients': 0,
            'total_consultations': 0,
            'online_consultations': 0,
            'this_month_patients': 0,
            'last_consultation': None,
            'profile_views': 0
        }
        
        return Response({
            'success': True,
            'data': analytics_data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
