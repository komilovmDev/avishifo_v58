from django.urls import path
from .views import (
    ChatSessionListCreateView, ChatSessionDetailView,
    add_message_to_session, chat_statistics,
    search_chat_sessions, bulk_delete_sessions,
    export_chat_session
)

app_name = 'chat_history'

urlpatterns = [
    # Основные CRUD операции для сессий
    path('sessions/', ChatSessionListCreateView.as_view(), name='session-list-create'),
    path('sessions/<uuid:id>/', ChatSessionDetailView.as_view(), name='session-detail'),
    
    # Работа с сообщениями
    path('sessions/<uuid:session_id>/messages/', add_message_to_session, name='add-message'),
    
    # Статистика и аналитика
    path('statistics/', chat_statistics, name='statistics'),
    
    # Поиск и фильтрация
    path('search/', search_chat_sessions, name='search'),
    
    # Массовые операции
    path('bulk-delete/', bulk_delete_sessions, name='bulk-delete'),
    
    # Экспорт
    path('sessions/<uuid:session_id>/export/', export_chat_session, name='export-session'),
]
