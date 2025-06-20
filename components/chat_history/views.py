from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
import uuid

from .models import ChatSession, ChatMessage, ChatAnalytics
from .serializers import (
    ChatSessionListSerializer, ChatSessionDetailSerializer,
    ChatSessionCreateSerializer, ChatMessageSerializer,
    ChatMessageCreateSerializer, ChatAnalyticsSerializer,
    ChatStatsSerializer
)


class ChatSessionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ChatSessionListCreateView(generics.ListCreateAPIView):
    """Список сессий чата и создание новой сессии"""
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ChatSessionPagination
    
    def get_queryset(self):
        return ChatSession.objects.filter(
            user=self.request.user,
            is_active=True
        ).select_related('user')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChatSessionCreateSerializer
        return ChatSessionListSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Детальная информация о сессии чата"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatSessionDetailSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)
    
    def perform_destroy(self, instance):
        # Мягкое удаление - помечаем как неактивную
        instance.is_active = False
        instance.save()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_message_to_session(request, session_id):
    """Добавить сообщение в существующую сессию"""
    try:
        session = get_object_or_404(
            ChatSession, 
            id=session_id, 
            user=request.user,
            is_active=True
        )
        
        serializer = ChatMessageCreateSerializer(
            data=request.data,
            context={'session_id': session.id}
        )
        
        if serializer.is_valid():
            message = serializer.save(session=session)
            
            # Обновляем заголовок сессии если это первое пользовательское сообщение
            if (session.total_messages <= 2 and 
                message.role == 'user' and 
                len(message.content.strip()) > 0):
                session.title = message.content[:50] + ('...' if len(message.content) > 50 else '')
                session.save(update_fields=['title'])
            
            return Response(
                ChatMessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def chat_statistics(request):
    """Получить статистику чатов пользователя"""
    try:
        user = request.user
        
        # Основная статистика
        total_sessions = ChatSession.objects.filter(user=user, is_active=True).count()
        total_messages = ChatMessage.objects.filter(session__user=user, session__is_active=True).count()
        total_tokens = ChatMessage.objects.filter(
            session__user=user, 
            session__is_active=True
        ).aggregate(Sum('tokens_used'))['tokens_used__sum'] or 0
        
        # Средние значения
        avg_messages = ChatSession.objects.filter(
            user=user, 
            is_active=True
        ).aggregate(Avg('total_messages'))['total_messages__avg'] or 0
        
        # Активность по дням
        week_ago = timezone.now() - timedelta(days=7)
        month_ago = timezone.now() - timedelta(days=30)
        
        sessions_this_week = ChatSession.objects.filter(
            user=user,
            is_active=True,
            created_at__gte=week_ago
        ).count()
        
        sessions_this_month = ChatSession.objects.filter(
            user=user,
            is_active=True,
            created_at__gte=month_ago
        ).count()
        
        # Самый активный день
        most_active = ChatSession.objects.filter(
            user=user,
            is_active=True
        ).extra(
            select={'day': 'DATE(created_at)'}
        ).values('day').annotate(
            count=Count('id')
        ).order_by('-count').first()
        
        most_active_day = most_active['day'] if most_active else 'Нет данных'
        
        stats_data = {
            'total_sessions': total_sessions,
            'total_messages': total_messages,
            'total_tokens': total_tokens,
            'avg_messages_per_session': round(avg_messages, 1),
            'most_active_day': most_active_day,
            'sessions_this_week': sessions_this_week,
            'sessions_this_month': sessions_this_month,
        }
        
        serializer = ChatStatsSerializer(stats_data)
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
@permission_classes([permissions.IsAuthenticated])
def search_chat_sessions(request):
    """Поиск по сессиям чата"""
    try:
        query = request.GET.get('q', '').strip()
        if not query:
            return Response({
                'success': False,
                'error': 'Параметр поиска q обязателен'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        sessions = ChatSession.objects.filter(
            user=request.user,
            is_active=True
        ).filter(
            Q(title__icontains=query) |
            Q(last_message_preview__icontains=query) |
            Q(messages__content__icontains=query)
        ).distinct().order_by('-updated_at')[:20]
        
        serializer = ChatSessionListSerializer(sessions, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': len(serializer.data)
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_delete_sessions(request):
    """Массовое удаление сессий"""
    try:
        session_ids = request.data.get('session_ids', [])
        if not session_ids:
            return Response({
                'success': False,
                'error': 'Список session_ids обязателен'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверяем что все сессии принадлежат пользователю
        sessions = ChatSession.objects.filter(
            id__in=session_ids,
            user=request.user,
            is_active=True
        )
        
        if sessions.count() != len(session_ids):
            return Response({
                'success': False,
                'error': 'Некоторые сессии не найдены или не принадлежат вам'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Мягкое удаление
        updated_count = sessions.update(is_active=False)
        
        return Response({
            'success': True,
            'deleted_count': updated_count
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def export_chat_session(request, session_id):
    """Экспорт сессии чата в различных форматах"""
    try:
        session = get_object_or_404(
            ChatSession,
            id=session_id,
            user=request.user,
            is_active=True
        )
        
        export_format = request.data.get('format', 'json')  # json, txt, md
        
        if export_format == 'json':
            serializer = ChatSessionDetailSerializer(session)
            return Response({
                'success': True,
                'data': serializer.data,
                'format': 'json'
            })
        
        elif export_format == 'txt':
            messages = session.messages.order_by('created_at')
            content = f"Чат: {session.title}\nДата: {session.created_at.strftime('%Y-%m-%d %H:%M')}\n\n"
            
            for msg in messages:
                role_name = "Врач" if msg.role == "user" else "Avishifo.ai"
                content += f"[{msg.created_at.strftime('%H:%M')}] {role_name}:\n{msg.content}\n\n"
            
            return Response({
                'success': True,
                'data': content,
                'format': 'txt'
            })
        
        elif export_format == 'md':
            messages = session.messages.order_by('created_at')
            content = f"# {session.title}\n\n**Дата:** {session.created_at.strftime('%Y-%m-%d %H:%M')}\n\n"
            
            for msg in messages:
                role_name = "**Врач**" if msg.role == "user" else "**Avishifo.ai**"
                content += f"### {role_name} ({msg.created_at.strftime('%H:%M')})\n\n{msg.content}\n\n---\n\n"
            
            return Response({
                'success': True,
                'data': content,
                'format': 'md'
            })
        
        else:
            return Response({
                'success': False,
                'error': 'Неподдерживаемый формат. Доступны: json, txt, md'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
