from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers

from accounts.emails import build_frontend_url, send_account_email
from accounts.tokens import email_verification_token_generator

PASSWORD_RESET_REQUEST_MESSAGE = (
    "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha."
)
PASSWORD_RESET_CONFIRM_MESSAGE = "Senha redefinida com sucesso."
PASSWORD_RESET_INVALID_LINK_MESSAGE = "Link de redefinição inválido ou expirado."
EMAIL_VERIFICATION_CONFIRM_MESSAGE = "E-mail verificado com sucesso."
EMAIL_VERIFICATION_INVALID_LINK_MESSAGE = "Link de verificação inválido ou expirado."


class UserRegistrationSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(min_length=2, max_length=100)
    email = serializers.EmailField()
    is_email_verified = serializers.BooleanField(read_only=True)
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, value):
        normalized_email = (
            get_user_model().objects.normalize_email(value.strip()).lower()
        )

        if get_user_model().objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError(
                "Já existe um usuário cadastrado com este e-mail."
            )

        return normalized_email

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)


class CurrentUserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    is_email_verified = serializers.BooleanField(read_only=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return get_user_model().objects.normalize_email(value.strip()).lower()

    def save(self, **kwargs):
        email = self.validated_data["email"]
        user = get_user_model().objects.filter(email=email, is_active=True).first()

        if user is None:
            return None

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = build_frontend_url(f"reset-password/{uid}/{token}")

        send_account_email(
            flow="password_reset",
            subject="Redefinição de senha do CloseDesk",
            message=(
                "Recebemos uma solicitação para redefinir sua senha no CloseDesk.\n\n"
                f"Acesse o link abaixo para criar uma nova senha:\n{reset_url}\n\n"
                "Se você não solicitou essa alteração, ignore este e-mail."
            ),
            recipient=user.email,
        )

        return user


class PasswordResetRequestResponseSerializer(serializers.Serializer):
    message = serializers.CharField(read_only=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        user = self.get_user(attrs["uid"])

        if user is None or not default_token_generator.check_token(
            user, attrs["token"]
        ):
            raise serializers.ValidationError(
                {"token": [PASSWORD_RESET_INVALID_LINK_MESSAGE]}
            )

        attrs["user"] = user

        return attrs

    def get_user(self, uid):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            return get_user_model().objects.get(pk=user_id, is_active=True)
        except (
            TypeError,
            ValueError,
            OverflowError,
            UnicodeDecodeError,
            get_user_model().DoesNotExist,
        ):
            return None

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["password"])
        user.save(update_fields=["password"])

        return user


class PasswordResetConfirmResponseSerializer(serializers.Serializer):
    message = serializers.CharField(read_only=True)


class EmailVerificationConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.get_user(attrs["uid"])

        if user is None or not email_verification_token_generator.check_token(
            user, attrs["token"]
        ):
            raise serializers.ValidationError(
                {"token": [EMAIL_VERIFICATION_INVALID_LINK_MESSAGE]}
            )

        attrs["user"] = user

        return attrs

    def get_user(self, uid):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            return get_user_model().objects.get(pk=user_id, is_active=True)
        except (
            TypeError,
            ValueError,
            OverflowError,
            UnicodeDecodeError,
            get_user_model().DoesNotExist,
        ):
            return None

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        return user


class EmailVerificationConfirmResponseSerializer(serializers.Serializer):
    message = serializers.CharField(read_only=True)
