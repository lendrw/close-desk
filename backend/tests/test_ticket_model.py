import pytest
from django.contrib.auth import get_user_model
from tickets.models import Ticket

pytestmark = pytest.mark.django_db


def create_user():
    return get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )


def test_ticket_model_creates_ticket_with_required_fields_and_defaults():
    user = create_user()

    ticket = Ticket.objects.create(
        title="Problema no login",
        description="Cliente não consegue acessar o sistema.",
        customer_name="Cliente Exemplo",
        created_by=user,
    )

    assert ticket.title == "Problema no login"
    assert ticket.description == "Cliente não consegue acessar o sistema."
    assert ticket.customer_name == "Cliente Exemplo"
    assert ticket.created_by == user
    assert ticket.status == Ticket.Status.OPEN
    assert ticket.priority == Ticket.Priority.MEDIUM
    assert ticket.due_date is None
    assert ticket.created_at is not None
    assert ticket.updated_at is not None
