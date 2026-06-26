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


def test_create_ticket_endpoint_requires_authentication():
    response = APIClient().post(
        "/api/tickets/",
        {
            "title": "Problema no login",
            "description": "Cliente não consegue acessar o sistema.",
            "customer_name": "Cliente Exemplo",
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


def test_create_ticket_endpoint_ignores_automatic_fields_from_client():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")
    client = authenticated_client(owner)

    response = client.post(
        "/api/tickets/",
        {
            "title": "Problema no login",
            "description": "Cliente não consegue acessar o sistema.",
            "customer_name": "Cliente Exemplo",
            "created_by": other_user.id,
            "created_at": "2000-01-01T00:00:00Z",
            "updated_at": "2000-01-01T00:00:00Z",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    ticket = Ticket.objects.get()

    assert ticket.created_by == owner
    assert ticket.created_at.isoformat() != "2000-01-01T00:00:00+00:00"
    assert ticket.updated_at.isoformat() != "2000-01-01T00:00:00+00:00"


def test_create_ticket_endpoint_returns_standard_error_for_invalid_fields():
    user = create_user()
    client = authenticated_client(user)

    response = client.post(
        "/api/tickets/",
        {
            "title": "AB",
            "description": "Curta",
            "customer_name": "A",
            "status": "invalid",
            "priority": "invalid",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["error"]["code"] == "validation_error"
    assert response.json()["error"]["message"] == "Os dados enviados são inválidos."
    assert set(response.json()["error"]["details"]) == {
        "title",
        "description",
        "customer_name",
        "status",
        "priority",
    }
