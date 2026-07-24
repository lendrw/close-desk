import pytest
from accounts.serializers import (
    EMAIL_VERIFICATION_CONFIRM_MESSAGE,
    EMAIL_VERIFICATION_INVALID_LINK_MESSAGE,
    EMAIL_VERIFICATION_REQUEST_MESSAGE,
)
from accounts.tokens import email_verification_token_generator
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

pytestmark = pytest.mark.django_db


def create_user():
    return get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )


def authenticated_client(user):
    access_token = str(RefreshToken.for_user(user).access_token)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    return client


def make_email_verification_payload(user):
    return {
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": email_verification_token_generator.make_token(user),
    }


def test_email_verification_request_sends_new_link_for_pending_user():
    user = create_user()
    client = authenticated_client(user)

    response = client.post("/api/auth/email-verification/", {}, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": EMAIL_VERIFICATION_REQUEST_MESSAGE}
    assert len(mail.outbox) == 1
    assert mail.outbox[0].to == ["ada@example.com"]
    assert mail.outbox[0].subject == "Verificação de e-mail do CloseDesk"
    assert "http://localhost:5173/verify-email/" in mail.outbox[0].body
    assert "token" not in response.content.decode().lower()


def test_email_verification_request_does_not_send_email_for_verified_user():
    user = create_user()
    user.is_email_verified = True
    user.save(update_fields=["is_email_verified"])
    client = authenticated_client(user)

    response = client.post("/api/auth/email-verification/", {}, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": EMAIL_VERIFICATION_REQUEST_MESSAGE}
    assert len(mail.outbox) == 0


def test_email_verification_request_requires_authentication():
    response = APIClient().post("/api/auth/email-verification/", {}, format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "error": {
            "code": "authentication_error",
            "message": "Autenticação necessária.",
            "details": {},
        },
    }


def test_email_verification_confirm_marks_email_as_verified_for_valid_token():
    user = create_user()
    payload = make_email_verification_payload(user)

    response = APIClient().post(
        "/api/auth/email-verification/confirm/",
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": EMAIL_VERIFICATION_CONFIRM_MESSAGE}
    assert "token" not in response.content.decode().lower()

    user.refresh_from_db()
    assert user.is_email_verified is True


def test_email_verification_confirm_rejects_invalid_token():
    user = create_user()
    payload = make_email_verification_payload(user)
    payload["token"] = "invalid-token"

    response = APIClient().post(
        "/api/auth/email-verification/confirm/",
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "error": {
            "code": "validation_error",
            "message": "Os dados enviados são inválidos.",
            "details": {
                "token": [EMAIL_VERIFICATION_INVALID_LINK_MESSAGE],
            },
        },
    }

    user.refresh_from_db()
    assert user.is_email_verified is False


def test_email_verification_confirm_rejects_invalid_uid():
    user = create_user()
    payload = make_email_verification_payload(user)
    payload["uid"] = "invalid-uid"

    response = APIClient().post(
        "/api/auth/email-verification/confirm/",
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["error"]["details"] == {
        "token": [EMAIL_VERIFICATION_INVALID_LINK_MESSAGE],
    }

    user.refresh_from_db()
    assert user.is_email_verified is False


def test_email_verification_confirm_rejects_reused_token():
    user = create_user()
    payload = make_email_verification_payload(user)

    first_response = APIClient().post(
        "/api/auth/email-verification/confirm/",
        payload,
        format="json",
    )
    second_response = APIClient().post(
        "/api/auth/email-verification/confirm/",
        payload,
        format="json",
    )

    assert first_response.status_code == status.HTTP_200_OK
    assert second_response.status_code == status.HTTP_400_BAD_REQUEST
    assert second_response.json()["error"]["details"] == {
        "token": [EMAIL_VERIFICATION_INVALID_LINK_MESSAGE],
    }
