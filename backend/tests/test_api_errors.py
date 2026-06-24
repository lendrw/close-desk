from django.test import override_settings
from django.urls import path
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import (
    NotAuthenticated,
    NotFound,
    PermissionDenied,
    ValidationError,
)
from rest_framework.permissions import AllowAny
from rest_framework.test import APIClient


@api_view(["GET"])
@permission_classes([AllowAny])
def validation_error_view(request):
    raise ValidationError({"email": ["Informe um endereço de e-mail válido."]})


@api_view(["GET"])
@permission_classes([AllowAny])
def authentication_error_view(request):
    raise NotAuthenticated("As credenciais de autenticação não foram fornecidas.")


@api_view(["GET"])
@permission_classes([AllowAny])
def permission_denied_view(request):
    raise PermissionDenied("Você não tem permissão para executar esta ação.")


@api_view(["GET"])
@permission_classes([AllowAny])
def not_found_view(request):
    raise NotFound("Recurso não encontrado.")


@api_view(["GET"])
@permission_classes([AllowAny])
def internal_error_view(request):
    raise RuntimeError("database password leaked in exception")


urlpatterns = [
    path("validation-error/", validation_error_view),
    path("authentication-error/", authentication_error_view),
    path("permission-denied/", permission_denied_view),
    path("not-found/", not_found_view),
    path("internal-error/", internal_error_view),
]


@override_settings(ROOT_URLCONF=__name__)
def test_validation_error_uses_standard_format():
    response = APIClient().get("/validation-error/")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "error": {
            "code": "validation_error",
            "message": "Os dados enviados são inválidos.",
            "details": {
                "email": ["Informe um endereço de e-mail válido."],
            },
        },
    }


@override_settings(ROOT_URLCONF=__name__)
def test_authentication_error_uses_standard_format():
    response = APIClient().get("/authentication-error/")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "error": {
            "code": "authentication_error",
            "message": "Autenticação necessária.",
            "details": {},
        },
    }


@override_settings(ROOT_URLCONF=__name__)
def test_permission_denied_uses_standard_format():
    response = APIClient().get("/permission-denied/")

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json() == {
        "error": {
            "code": "permission_denied",
            "message": "Acesso negado.",
            "details": {},
        },
    }


@override_settings(ROOT_URLCONF=__name__)
def test_not_found_uses_standard_format():
    response = APIClient().get("/not-found/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Recurso não encontrado.",
            "details": {},
        },
    }


@override_settings(ROOT_URLCONF=__name__)
def test_method_not_allowed_uses_standard_format():
    response = APIClient().post("/not-found/")

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    assert response.json() == {
        "error": {
            "code": "method_not_allowed",
            "message": "Método não permitido.",
            "details": {},
        },
    }


@override_settings(ROOT_URLCONF=__name__)
def test_internal_error_uses_standard_format_without_leaking_details():
    client = APIClient()
    client.raise_request_exception = False

    response = client.get("/internal-error/")

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json() == {
        "error": {
            "code": "internal_error",
            "message": "Erro interno do servidor.",
            "details": {},
        },
    }
    assert "database password" not in response.content.decode()
