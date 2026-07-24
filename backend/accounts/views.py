from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.emails import send_email_verification
from accounts.serializers import (
    EMAIL_VERIFICATION_CONFIRM_MESSAGE,
    EMAIL_VERIFICATION_REQUEST_MESSAGE,
    PASSWORD_RESET_CONFIRM_MESSAGE,
    PASSWORD_RESET_REQUEST_MESSAGE,
    CurrentUserSerializer,
    EmailVerificationConfirmResponseSerializer,
    EmailVerificationConfirmSerializer,
    EmailVerificationRequestResponseSerializer,
    PasswordResetConfirmResponseSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestResponseSerializer,
    PasswordResetRequestSerializer,
    UserRegistrationSerializer,
)


@extend_schema(
    request=UserRegistrationSerializer,
    responses={status.HTTP_201_CREATED: UserRegistrationSerializer},
    summary="Cadastrar usuário",
    tags=["Authentication"],
)
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    send_email_verification(user)

    return Response(
        UserRegistrationSerializer(user).data,
        status=status.HTTP_201_CREATED,
    )


@extend_schema(
    responses={status.HTTP_200_OK: CurrentUserSerializer},
    summary="Consultar usuário atual",
    tags=["Authentication"],
)
@api_view(["GET"])
def current_user(request):
    return Response(CurrentUserSerializer(request.user).data)


@extend_schema(
    responses={status.HTTP_200_OK: EmailVerificationRequestResponseSerializer},
    summary="Reenviar verificação de e-mail",
    tags=["Authentication"],
)
@api_view(["POST"])
def request_email_verification(request):
    if not request.user.is_email_verified:
        send_email_verification(request.user)

    return Response(
        {"message": EMAIL_VERIFICATION_REQUEST_MESSAGE},
        status=status.HTTP_200_OK,
    )


@extend_schema(
    request=PasswordResetRequestSerializer,
    responses={status.HTTP_200_OK: PasswordResetRequestResponseSerializer},
    summary="Solicitar redefinição de senha",
    tags=["Authentication"],
)
@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(
        {"message": PASSWORD_RESET_REQUEST_MESSAGE},
        status=status.HTTP_200_OK,
    )


@extend_schema(
    request=PasswordResetConfirmSerializer,
    responses={status.HTTP_200_OK: PasswordResetConfirmResponseSerializer},
    summary="Confirmar redefinição de senha",
    tags=["Authentication"],
)
@api_view(["POST"])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(
        {"message": PASSWORD_RESET_CONFIRM_MESSAGE},
        status=status.HTTP_200_OK,
    )


@extend_schema(
    request=EmailVerificationConfirmSerializer,
    responses={status.HTTP_200_OK: EmailVerificationConfirmResponseSerializer},
    summary="Confirmar verificação de e-mail",
    tags=["Authentication"],
)
@api_view(["POST"])
@permission_classes([AllowAny])
def confirm_email_verification(request):
    serializer = EmailVerificationConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(
        {"message": EMAIL_VERIFICATION_CONFIRM_MESSAGE},
        status=status.HTTP_200_OK,
    )
