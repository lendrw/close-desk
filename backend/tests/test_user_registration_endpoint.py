import logging

import pytest
from django.contrib.auth import get_user_model
from django.core import mail
from rest_framework import status
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def test_register_endpoint_creates_user_without_exposing_password():
    response = APIClient().post(
        "/api/auth/register/",
        {
            "name": "Ada Lovelace",
            "email": "ADA@Example.COM",
            "password": "securepass123",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json() == {
        "id": response.json()["id"],
        "name": "Ada Lovelace",
        "email": "ada@example.com",
        "is_email_verified": False,
    }

    assert "password" not in response.json()
    assert "token" not in response.content.decode().lower()

    user = get_user_model().objects.get(email="ada@example.com")
    assert user.name == "Ada Lovelace"
    assert user.is_email_verified is False
    assert user.check_password("securepass123")
    assert len(mail.outbox) == 1
    assert mail.outbox[0].to == ["ada@example.com"]
    assert mail.outbox[0].subject == "Verificação de e-mail do CloseDesk"
    assert "http://localhost:5173/verify-email/" in mail.outbox[0].body
    assert "securepass123" not in mail.outbox[0].body


def test_register_endpoint_logs_email_verification_failure_without_sensitive_data(
    caplog, monkeypatch
):
    def fail_send_mail(**kwargs):
        raise RuntimeError("smtp failure")

    monkeypatch.setattr("accounts.emails.send_mail", fail_send_mail)

    with caplog.at_level(logging.ERROR, logger="accounts.emails"):
        response = APIClient().post(
            "/api/auth/register/",
            {
                "name": "Ada Lovelace",
                "email": "ada@example.com",
                "password": "securepass123",
            },
            format="json",
        )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["email"] == "ada@example.com"
    assert get_user_model().objects.filter(email="ada@example.com").exists()
    assert "Falha ao enviar e-mail de conta." in caplog.text
    assert "flow=email_verification" in caplog.text
    assert "recipient_domain=example.com" in caplog.text
    assert "verify-email" not in caplog.text
    assert "ada@example.com" not in caplog.text
    assert "securepass123" not in caplog.text


def test_register_endpoint_returns_standard_error_for_missing_fields():
    response = APIClient().post("/api/auth/register/", {}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "error": {
            "code": "validation_error",
            "message": "Os dados enviados são inválidos.",
            "details": {
                "name": ["This field is required."],
                "email": ["This field is required."],
                "password": ["This field is required."],
            },
        },
    }
