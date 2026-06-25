import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

pytestmark = pytest.mark.django_db


def test_current_user_endpoint_returns_authenticated_user():
    user = get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )
    access_token = str(RefreshToken.for_user(user).access_token)

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    response = client.get("/api/auth/me/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "id": user.id,
        "name": "Ada Lovelace",
        "email": "ada@example.com",
    }


def test_current_user_endpoint_requires_authentication():
    response = APIClient().get("/api/auth/me/")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "error": {
            "code": "authentication_error",
            "message": "Autenticação necessária.",
            "details": {},
        },
    }
