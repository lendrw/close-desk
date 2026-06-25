from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.db import models
from django.utils import timezone


class Ticket(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Aberto"
        IN_PROGRESS = "in_progress", "Em andamento"
        RESOLVED = "resolved", "Resolvido"
        CLOSED = "closed", "Fechado"

    class Priority(models.TextChoices):
        LOW = "low", "Baixa"
        MEDIUM = "medium", "Média"
        HIGH = "high", "Alta"
        URGENT = "urgent", "Urgente"

    title = models.CharField(
        max_length=120,
        validators=[MinLengthValidator(3)],
    )
    description = models.TextField(
        max_length=2000,
        validators=[
            MinLengthValidator(10),
            MaxLengthValidator(2000),
        ],
    )
    customer_name = models.CharField(
        max_length=120,
        validators=[MinLengthValidator(2)],
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )
    due_date = models.DateField(blank=True, null=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tickets",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        super().clean()

        if (
            self._state.adding
            and self.due_date
            and self.due_date < timezone.localdate()
        ):
            raise ValidationError(
                {"due_date": "O prazo não pode ser anterior à data atual."}
            )

    def __str__(self):
        return self.title
