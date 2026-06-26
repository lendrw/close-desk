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


def test_dashboard_summary_endpoint_counts_tickets_by_status():
    user = create_user()
    client = authenticated_client(user)

    Ticket.objects.create(
        title="Aberto",
        description="Descrição do chamado aberto.",
        customer_name="Cliente Aberto",
        status=Ticket.Status.OPEN,
        created_by=user,
    )
    Ticket.objects.create(
        title="Em andamento",
        description="Descrição do chamado em andamento.",
        customer_name="Cliente Em Andamento",
        status=Ticket.Status.IN_PROGRESS,
        created_by=user,
    )
    Ticket.objects.create(
        title="Resolvido",
        description="Descrição do chamado resolvido.",
        customer_name="Cliente Resolvido",
        status=Ticket.Status.RESOLVED,
        created_by=user,
    )
    Ticket.objects.create(
        title="Fechado",
        description="Descrição do chamado fechado.",
        customer_name="Cliente Fechado",
        status=Ticket.Status.CLOSED,
        created_by=user,
    )

    response = client.get("/api/dashboard/summary/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["by_status"] == {
        "open": 1,
        "in_progress": 1,
        "resolved": 1,
        "closed": 1,
    }


def test_dashboard_summary_endpoint_counts_urgent_tickets_across_statuses():
    user = create_user()
    client = authenticated_client(user)

    Ticket.objects.create(
        title="Urgente aberto",
        description="Descrição do chamado urgente aberto.",
        customer_name="Cliente Aberto",
        status=Ticket.Status.OPEN,
        priority=Ticket.Priority.URGENT,
        created_by=user,
    )
    Ticket.objects.create(
        title="Urgente fechado",
        description="Descrição do chamado urgente fechado.",
        customer_name="Cliente Fechado",
        status=Ticket.Status.CLOSED,
        priority=Ticket.Priority.URGENT,
        created_by=user,
    )
    Ticket.objects.create(
        title="Normal aberto",
        description="Descrição do chamado normal aberto.",
        customer_name="Cliente Normal",
        status=Ticket.Status.OPEN,
        priority=Ticket.Priority.MEDIUM,
        created_by=user,
    )

    response = client.get("/api/dashboard/summary/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["urgent"] == 2