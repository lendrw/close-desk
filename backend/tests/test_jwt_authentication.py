import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient


def create_user():
    return get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )


def test_token_endpoint_rejects_empty_credentials():
    response = APIClient().post("/api/auth/token/", {}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "error": {
            "code": "validation_error",
            "message": "Os dados enviados são inválidos.",
            "details": {
                "email": ["This field is required."],
                "password": ["This field is required."],
            },
        },
    }


def test_token_refresh_endpoint_rejects_empty_payload():
    response = APIClient().post("/api/auth/token/refresh/", {}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "error": {
            "code": "validation_error",
            "message": "Os dados enviados são inválidos.",
            "details": {
                "refresh": ["This field is required."],
            },
        },
    }


@pytest.mark.django_db
def test_token_endpoint_returns_tokens_for_valid_credentials():
    get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )

    response = APIClient().post(
        "/api/auth/token/",
        {
            "email": "ada@example.com",
            "password": "securepass123",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.json()
    assert "refresh" in response.json()


@pytest.mark.django_db
def test_token_endpoint_returns_generic_error_for_invalid_credentials():
    get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )

    response = APIClient().post(
        "/api/auth/token/",
        {
            "email": "ada@example.com",
            "password": "wrong-password",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "error": {
            "code": "authentication_error",
            "message": "Autenticação necessária.",
            "details": {},
        },
    }


@pytest.mark.django_db
def test_token_refresh_endpoint_returns_new_access_token():
    create_user()

    token_response = APIClient().post(
        "/api/auth/token/",
        {
            "email": "ada@example.com",
            "password": "securepass123",
        },
        format="json",
    )

    response = APIClient().post(
        "/api/auth/token/refresh/",
        {"refresh": token_response.json()["refresh"]},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.json()
    assert "refresh" not in response.json()


def test_token_refresh_endpoint_returns_standard_error_for_invalid_token():
    response = APIClient().post(
        "/api/auth/token/refresh/",
        {"refresh": "invalid-token"},
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "error": {
            "code": "authentication_error",
            "message": "Autenticação necessária.",
            "details": {},
        },
    }
