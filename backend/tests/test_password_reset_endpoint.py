import pytest
from accounts.serializers import PASSWORD_RESET_REQUEST_MESSAGE
from django.contrib.auth import get_user_model
from django.core import mail
from rest_framework import status
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def create_user():
    return get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )


def test_password_reset_request_returns_generic_response_and_sends_email():
    create_user()

    response = APIClient().post(
        "/api/auth/password-reset/",
        {"email": "ADA@Example.COM"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": PASSWORD_RESET_REQUEST_MESSAGE}
    assert len(mail.outbox) == 1
    assert mail.outbox[0].to == ["ada@example.com"]
    assert mail.outbox[0].subject == "Redefinição de senha do CloseDesk"
    assert "http://localhost:5173/reset-password/" in mail.outbox[0].body
    assert "securepass123" not in mail.outbox[0].body
    assert "token" not in response.content.decode().lower()


def test_password_reset_request_returns_same_response_for_unknown_email():
    response = APIClient().post(
        "/api/auth/password-reset/",
        {"email": "unknown@example.com"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": PASSWORD_RESET_REQUEST_MESSAGE}
    assert len(mail.outbox) == 0


def test_password_reset_request_returns_standard_error_for_invalid_email():
    response = APIClient().post(
        "/api/auth/password-reset/",
        {"email": "invalid-email"},
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "error": {
            "code": "validation_error",
            "message": "Os dados enviados são inválidos.",
            "details": {
                "email": ["Enter a valid email address."],
            },
        },
    }
