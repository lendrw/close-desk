import pytest
from accounts.serializers import (
    EMAIL_VERIFICATION_CONFIRM_MESSAGE,
    EMAIL_VERIFICATION_INVALID_LINK_MESSAGE,
)
from accounts.tokens import email_verification_token_generator
from django.contrib.auth import get_user_model
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


def make_email_verification_payload(user):
    return {
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": email_verification_token_generator.make_token(user),
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
