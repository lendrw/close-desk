from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator
from django.db import models
from django.db.models.functions import Lower

from accounts.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2)],
    )
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        ordering = ["email"]
        constraints = [
            models.UniqueConstraint(
                Lower("email"),
                name="unique_user_email_case_insensitive",
            ),
        ]

    def clean(self):
        super().clean()

        self.name = self.name.strip() if self.name else ""
        self.email = (
            self.__class__.objects.normalize_email(self.email.strip()).lower()
            if self.email
            else ""
        )

        if len(self.name) < 2:
            raise ValidationError(
                {"name": "O nome deve possuir pelo menos 2 caracteres."}
            )

    def save(self, *args, **kwargs):
        if self.name:
            self.name = self.name.strip()

        if self.email:
            self.email = (
                self.__class__.objects.normalize_email(self.email.strip()).lower()
                if self.email
                else ""
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
