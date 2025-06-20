from rest_framework import serializers
from django.utils import timezone
from .models import ChatSession, ChatMessage, ChatAnalytics
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatMessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'role', 'content', 'created_at', 'timestamp',
            'tokens_used', 'is_error', 'is_fallback', 
            'response_time_ms', 'metadata'
        ]
        read_only_fields = ['id', 'created_at', 'timestamp']
    
    def get_timestamp(self, obj):
        """Возвращает время в формате HH:MM для фронтенда"""
        return obj.created_at.strftime('%H:%M')


class ChatSessionListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка сессий (краткая информация)"""
    date = serializers.SerializerMethodField()
    last_message = serializers.CharField(source='last_message_preview', read_only=True)
    messages_count = serializers.IntegerField(source='total_messages', read_only=True)
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'title', 'date', 'created_at', 'updated_at',
            'last_message', 'messages_count', 'total_tokens_used'
        ]
    
    def get_date(self, obj):
        """Возвращает дату в формате YYYY-MM-DD"""
        return obj.created_at.strftime('%Y-%m-%d')


class ChatSessionDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о сессии"""
    messages = ChatMessageSerializer(many=True, read_only=True)
    date = serializers.SerializerMethodField()
    last_message = serializers.CharField(source='last_message_preview', read_only=True)
    messages_count = serializers.IntegerField(source='total_messages', read_only=True)
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'title', 'date', 'created_at', 'updated_at',
            'last_message', 'messages_count', 'total_tokens_used',
            'messages', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_messages', 'total_tokens_used']
    
    def get_date(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')


class ChatSessionCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания новой сессии"""
    
    class Meta:
        model = ChatSession
        fields = ['title']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания нового сообщения"""
    
    class Meta:
        model = ChatMessage
        fields = [
            'role', 'content', 'tokens_used', 'is_error', 
            'is_fallback', 'response_time_ms', 'metadata'
        ]
    
    def create(self, validated_data):
        session_id = self.context.get('session_id')
        if session_id:
            validated_data['session_id'] = session_id
        return super().create(validated_data)


class ChatAnalyticsSerializer(serializers.ModelSerializer):
    """Сериализатор для аналитики чатов"""
    
    class Meta:
        model = ChatAnalytics
        fields = [
            'date', 'total_sessions', 'total_messages', 'total_tokens',
            'total_response_time_ms', 'user_messages', 'assistant_messages',
            'error_messages', 'fallback_messages'
        ]
        read_only_fields = ['date']


class ChatStatsSerializer(serializers.Serializer):
    """Сериализатор для общей статистики пользователя"""
    total_sessions = serializers.IntegerField()
    total_messages = serializers.IntegerField()
    total_tokens = serializers.IntegerField()
    avg_messages_per_session = serializers.FloatField()
    most_active_day = serializers.CharField()
    sessions_this_week = serializers.IntegerField()
    sessions_this_month = serializers.IntegerField()
