from django.contrib import admin
from django.utils.html import format_html
from .models import ChatSession, ChatMessage, ChatAnalytics


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = [
        'title_short', 'user_name', 'total_messages', 
        'total_tokens_used', 'is_active', 'created_at'
    ]
    list_filter = ['is_active', 'created_at', 'updated_at']
    search_fields = ['title', 'user__username', 'user__email', 'last_message_preview']
    readonly_fields = ['id', 'created_at', 'updated_at', 'total_messages']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('id', 'user', 'title', 'is_active')
        }),
        ('Статистика', {
            'fields': ('total_messages', 'total_tokens_used', 'last_message_preview')
        }),
        ('Временные метки', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def title_short(self, obj):
        return obj.title[:50] + ('...' if len(obj.title) > 50 else '')
    title_short.short_description = 'Заголовок'
    
    def user_name(self, obj):
        return obj.user.get_full_name() if hasattr(obj.user, 'get_full_name') else obj.user.username
    user_name.short_description = 'Пользователь'


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = [
        'session_title', 'role', 'content_short', 
        'tokens_used', 'is_error', 'is_fallback', 'created_at'
    ]
    list_filter = ['role', 'is_error', 'is_fallback', 'created_at']
    search_fields = ['content', 'session__title', 'session__user__username']
    readonly_fields = ['id', 'created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('id', 'session', 'role', 'content')
        }),
        ('Метаданные', {
            'fields': ('tokens_used', 'is_error', 'is_fallback', 'response_time_ms', 'metadata')
        }),
        ('Временные метки', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def session_title(self, obj):
        return obj.session.title[:30] + ('...' if len(obj.session.title) > 30 else '')
    session_title.short_description = 'Сессия'
    
    def content_short(self, obj):
        return obj.content[:100] + ('...' if len(obj.content) > 100 else '')
    content_short.short_description = 'Содержимое'


@admin.register(ChatAnalytics)
class ChatAnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'date', 'total_sessions', 'total_messages', 
        'total_tokens', 'error_rate'
    ]
    list_filter = ['date']
    search_fields = ['user__username', 'user__email']
    date_hierarchy = 'date'
    
    def error_rate(self, obj):
        if obj.total_messages > 0:
            rate = (obj.error_messages / obj.total_messages) * 100
            color = 'red' if rate > 10 else 'orange' if rate > 5 else 'green'
            return format_html(
                '<span style="color: {};">{:.1f}%</span>',
                color, rate
            )
        return '0%'
    error_rate.short_description = 'Процент ошибок'
