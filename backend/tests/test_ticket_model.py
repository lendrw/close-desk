import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from tickets.models import Ticket

pytestmark = pytest.mark.django_db


def create_user():
    return get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )


def make_ticket(**overrides):
    data = {
        "title": "Problema no login",
        "description": "Cliente não consegue acessar o sistema.",
        "customer_name": "Cliente Exemplo",
        "created_by": create_user(),
    }
    data.update(overrides)

    return Ticket(**data)


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


def test_ticket_model_accepts_allowed_status_and_priority():
    user = create_user()

    ticket = Ticket(
        title="Problema no login",
        description="Cliente não consegue acessar o sistema.",
        customer_name="Cliente Exemplo",
        status=Ticket.Status.IN_PROGRESS,
        priority=Ticket.Priority.URGENT,
        created_by=user,
    )

    ticket.full_clean()

    assert ticket.status == Ticket.Status.IN_PROGRESS
    assert ticket.priority == Ticket.Priority.URGENT


def test_ticket_model_rejects_invalid_status():
    user = create_user()

    ticket = Ticket(
        title="Problema no login",
        description="Cliente não consegue acessar o sistema.",
        customer_name="Cliente Exemplo",
        status="invalid",
        created_by=user,
    )

    with pytest.raises(ValidationError):
        ticket.full_clean()


def test_ticket_model_rejects_invalid_priority():
    user = create_user()

    ticket = Ticket(
        title="Problema no login",
        description="Cliente não consegue acessar o sistema.",
        customer_name="Cliente Exemplo",
        priority="invalid",
        created_by=user,
    )

    with pytest.raises(ValidationError):
        ticket.full_clean()


def test_ticket_model_rejects_short_title():
    ticket = make_ticket(title="AB")

    with pytest.raises(ValidationError):
        ticket.full_clean()


def test_ticket_model_rejects_long_title():
    ticket = make_ticket(title="A" * 121)

    with pytest.raises(ValidationError):
        ticket.full_clean()


def test_ticket_model_rejects_short_description():
    ticket = make_ticket(description="Curta")

    with pytest.raises(ValidationError):
        ticket.full_clean()


def test_ticket_model_rejects_long_description():
    ticket = make_ticket(description="A" * 2001)

    with pytest.raises(ValidationError):
        ticket.full_clean()


def test_ticket_model_rejects_short_customer_name():
    ticket = make_ticket(customer_name="A")

    with pytest.raises(ValidationError):
        ticket.full_clean()


def test_ticket_model_rejects_long_customer_name():
    ticket = make_ticket(customer_name="A" * 121)

    with pytest.raises(ValidationError):
        ticket.full_clean()
