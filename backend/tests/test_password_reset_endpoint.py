import pytest
from accounts.serializers import (
    PASSWORD_RESET_CONFIRM_MESSAGE,
    PASSWORD_RESET_INVALID_LINK_MESSAGE,
    PASSWORD_RESET_REQUEST_MESSAGE,
)
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def create_user():
    return get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )


def make_password_reset_payload(user, password="newpass123"):
    return {
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": default_token_generator.make_token(user),
        "password": password,
    }


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


def test_password_reset_confirm_changes_password_for_valid_token():
    user = create_user()
    payload = make_password_reset_payload(user)

    response = APIClient().post(
        "/api/auth/password-reset/confirm/",
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": PASSWORD_RESET_CONFIRM_MESSAGE}
    assert "token" not in response.content.decode().lower()

    user.refresh_from_db()
    assert user.check_password("newpass123")
    assert not user.check_password("securepass123")


def test_password_reset_confirm_rejects_invalid_token_without_changing_password():
    user = create_user()
    payload = make_password_reset_payload(user)
    payload["token"] = "invalid-token"

    response = APIClient().post(
        "/api/auth/password-reset/confirm/",
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "error": {
            "code": "validation_error",
            "message": "Os dados enviados são inválidos.",
            "details": {
                "token": [PASSWORD_RESET_INVALID_LINK_MESSAGE],
            },
        },
    }

    user.refresh_from_db()
    assert user.check_password("securepass123")


def test_password_reset_confirm_rejects_invalid_uid_without_changing_password():
    user = create_user()
    payload = make_password_reset_payload(user)
    payload["uid"] = "invalid-uid"

    response = APIClient().post(
        "/api/auth/password-reset/confirm/",
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["error"]["details"] == {
        "token": [PASSWORD_RESET_INVALID_LINK_MESSAGE],
    }

    user.refresh_from_db()
    assert user.check_password("securepass123")


def test_password_reset_confirm_rejects_short_password():
    user = create_user()
    payload = make_password_reset_payload(user, password="short")

    response = APIClient().post(
        "/api/auth/password-reset/confirm/",
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["error"]["details"] == {
        "password": ["Ensure this field has at least 8 characters."],
    }

    user.refresh_from_db()
    assert user.check_password("securepass123")
