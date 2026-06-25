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


def test_create_ticket_endpoint_creates_ticket_for_authenticated_user():
    user = create_user()
    client = authenticated_client(user)

    response = client.post(
        "/api/tickets/",
        {
            "title": "Problema no login",
            "description": "Cliente não consegue acessar o sistema.",
            "customer_name": "Cliente Exemplo",
            "priority": "urgent",
            "due_date": None,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    ticket = Ticket.objects.get()

    assert ticket.created_by == user
    assert ticket.title == "Problema no login"
    assert ticket.description == "Cliente não consegue acessar o sistema."
    assert ticket.customer_name == "Cliente Exemplo"
    assert ticket.status == Ticket.Status.OPEN
    assert ticket.priority == Ticket.Priority.URGENT
    assert ticket.due_date is None

    assert response.json()["id"] == ticket.id
    assert response.json()["created_by"] == user.id
    assert response.json()["status"] == Ticket.Status.OPEN
