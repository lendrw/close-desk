import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from tickets.models import Ticket

pytestmark = pytest.mark.django_db


def create_user(email="ada@example.com"):
    return get_user_model().objects.create_user(
        name="Ada Lovelace",
        email=email,
        password="securepass123",
    )


def authenticated_client(user):
    access_token = str(RefreshToken.for_user(user).access_token)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    return client


def test_dashboard_summary_endpoint_returns_zero_indicators():
    user = create_user()
    client = authenticated_client(user)

    response = client.get("/api/dashboard/summary/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "total": 0,
        "by_status": {
            "open": 0,
            "in_progress": 0,
            "resolved": 0,
            "closed": 0,
        },
        "urgent": 0,
    }


def test_dashboard_summary_endpoint_returns_total_tickets():
    user = create_user()
    client = authenticated_client(user)

    Ticket.objects.create(
        title="Chamado 1",
        description="Descrição do chamado 1.",
        customer_name="Cliente 1",
        created_by=user,
    )
    Ticket.objects.create(
        title="Chamado 2",
        description="Descrição do chamado 2.",
        customer_name="Cliente 2",
        created_by=user,
    )

    response = client.get("/api/dashboard/summary/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total"] == 2
