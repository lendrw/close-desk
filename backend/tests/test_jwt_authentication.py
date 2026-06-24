from rest_framework import status
from rest_framework.test import APIClient


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
