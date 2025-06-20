from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()

class ChatSession(models.Model):
    """Модель для хранения сессий чата с ИИ"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    title = models.CharField(max_length=200, help_text="Заголовок чата")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # Метаданные сессии
    total_messages = models.PositiveIntegerField(default=0)
    total_tokens_used = models.PositiveIntegerField(default=0)
    last_message_preview = models.TextField(blank=True, help_text="Превью последнего сообщения")
    
    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', '-updated_at']),
            models.Index(fields=['user', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.full_name if hasattr(self.user, 'full_name') else self.user.username} - {self.title[:50]}"
    
    def update_last_message_preview(self):
        """Обновляет превью последнего сообщения"""
        last_message = self.messages.filter(role='assistant').order_by('-created_at').first()
        if last_message:
            self.last_message_preview = last_message.content[:100] + ('...' if len(last_message.content) > 100 else '')
        self.save(update_fields=['last_message_preview', 'updated_at'])
    
    def update_message_count(self):
        """Обновляет счетчик сообщений"""
        self.total_messages = self.messages.count()
        self.save(update_fields=['total_messages', 'updated_at'])


class ChatMessage(models.Model):
    """Модель для хранения сообщений в чате"""
    
    ROLE_CHOICES = [
        ('user', 'Пользователь'),
        ('assistant', 'Ассистент'),
        ('system', 'Система'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField(help_text="Содержимое сообщения")
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Метаданные сообщения
    tokens_used = models.PositiveIntegerField(default=0, help_text="Количество токенов использованных для этого сообщения")
    is_error = models.BooleanField(default=False, help_text="Сообщение об ошибке")
    is_fallback = models.BooleanField(default=False, help_text="Fallback ответ")
    response_time_ms = models.PositiveIntegerField(null=True, blank=True, help_text="Время ответа в миллисекундах")
    
    # Дополнительные данные
    metadata = models.JSONField(default=dict, blank=True, help_text="Дополнительные метаданные")
    
    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),
            models.Index(fields=['session', 'role']),
        ]
    
    def __str__(self):
        return f"{self.get_role_display()} - {self.content[:50]}..."
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Обновляем счетчики в сессии
        self.session.update_message_count()
        if self.role == 'assistant':
            self.session.update_last_message_preview()


class ChatAnalytics(models.Model):
    """Модель для аналитики использования чата"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_analytics')
    date = models.DateField(default=timezone.now)
    
    # Статистика за день
    total_sessions = models.PositiveIntegerField(default=0)
    total_messages = models.PositiveIntegerField(default=0)
    total_tokens = models.PositiveIntegerField(default=0)
    total_response_time_ms = models.PositiveIntegerField(default=0)
    
    # Статистика по типам
    user_messages = models.PositiveIntegerField(default=0)
    assistant_messages = models.PositiveIntegerField(default=0)
    error_messages = models.PositiveIntegerField(default=0)
    fallback_messages = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'chat_analytics'
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user} - {self.date} - {self.total_messages} сообщений"
