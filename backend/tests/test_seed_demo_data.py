import pytest
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from tickets.management.commands.seed_demo_data import (
    DEMO_PASSWORD_ENV,
    DEMO_USER_EMAIL,
    DEMO_USER_NAME,
)
from tickets.models import Ticket

pytestmark = pytest.mark.django_db


def test_seed_demo_data_requires_password_environment_variable(monkeypatch):
    monkeypatch.delenv(DEMO_PASSWORD_ENV, raising=False)

    with pytest.raises(CommandError) as error:
        call_command("seed_demo_data")

    assert str(error.value) == (
        f"Defina a variável {DEMO_PASSWORD_ENV} antes de criar a demo."
    )


def test_seed_demo_data_creates_demo_user_and_tickets(monkeypatch):
    monkeypatch.setenv(DEMO_PASSWORD_ENV, "demo-password-123")

    call_command("seed_demo_data")

    user = get_user_model().objects.get(email=DEMO_USER_EMAIL)

    assert user.name == DEMO_USER_NAME
    assert user.check_password("demo-password-123")
    assert Ticket.objects.filter(created_by=user).count() == 5
    ticket_statuses = set(
        Ticket.objects.filter(created_by=user).values_list("status", flat=True)
    )

    assert ticket_statuses == {
        Ticket.Status.CLOSED,
        Ticket.Status.IN_PROGRESS,
        Ticket.Status.OPEN,
        Ticket.Status.RESOLVED,
    }


def test_seed_demo_data_is_idempotent(monkeypatch):
    monkeypatch.setenv(DEMO_PASSWORD_ENV, "demo-password-123")

    call_command("seed_demo_data")
    call_command("seed_demo_data")

    user = get_user_model().objects.get(email=DEMO_USER_EMAIL)

    assert Ticket.objects.filter(created_by=user).count() == 5
