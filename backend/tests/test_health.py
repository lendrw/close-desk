from rest_framework import status
from rest_framework.test import APIClient


def test_health_check_returns_api_status():
    response = APIClient().get("/api/health/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok"}


def test_health_check_rejects_unsupported_methods():
    response = APIClient().post("/api/health/")

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
