import pytest
from django.contrib.auth import get_user_model
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
    }

    assert "password" not in response.json()

    user = get_user_model().objects.get(email="ada@example.com")
    assert user.name == "Ada Lovelace"
    assert user.check_password("securepass123")


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
