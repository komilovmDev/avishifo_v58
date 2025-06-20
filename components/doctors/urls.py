from django.urls import path
from .views import (
    DoctorListView, DoctorDetailView, DoctorCreateView,
    DoctorProfileView, doctor_dashboard_stats, doctor_schedule,
    doctor_specialties_list, doctor_contacts, doctor_reviews, doctor_analytics
)

urlpatterns = [
    path('', DoctorListView.as_view(), name='doctor-list'),
    path('create/', DoctorCreateView.as_view(), name='doctor-create'),
    path('specialties/', doctor_specialties_list, name='doctor-specialties'),
    path('profile/', DoctorProfileView.as_view(), name='doctor-profile'),
    path('profile/schedule/', doctor_schedule, name='doctor-schedule-own'),
    path('profile/contacts/', doctor_contacts, name='doctor-contacts-own'),
    path('profile/reviews/', doctor_reviews, name='doctor-reviews-own'),
    path('profile/analytics/', doctor_analytics, name='doctor-analytics-own'),
    path('<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('<int:pk>/stats/', doctor_dashboard_stats, name='doctor-stats'),
    path('<int:pk>/schedule/', doctor_schedule, name='doctor-schedule'),
    path('<int:pk>/contacts/', doctor_contacts, name='doctor-contacts'),
    path('<int:pk>/reviews/', doctor_reviews, name='doctor-reviews'),
    path('<int:pk>/analytics/', doctor_analytics, name='doctor-analytics'),
]
