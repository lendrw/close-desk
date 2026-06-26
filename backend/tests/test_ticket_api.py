from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
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


def set_ticket_created_at(ticket, created_at):
    Ticket.objects.filter(id=ticket.id).update(
        created_at=created_at,
        updated_at=created_at,
    )
    ticket.refresh_from_db()

    return ticket


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


def test_list_tickets_endpoint_returns_only_authenticated_user_tickets():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")

    owner_ticket = Ticket.objects.create(
        title="Chamado do dono",
        description="Descrição do chamado do dono.",
        customer_name="Cliente Dono",
        created_by=owner,
    )
    Ticket.objects.create(
        title="Chamado de outro usuário",
        description="Descrição do chamado de outro usuário.",
        customer_name="Cliente Outro",
        created_by=other_user,
    )

    client = authenticated_client(owner)

    response = client.get("/api/tickets/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 1
    assert response.json()["next"] is None
    assert response.json()["previous"] is None
    assert response.json()["results"] == [
        {
            "id": owner_ticket.id,
            "title": "Chamado do dono",
            "description": "Descrição do chamado do dono.",
            "customer_name": "Cliente Dono",
            "status": Ticket.Status.OPEN,
            "priority": Ticket.Priority.MEDIUM,
            "due_date": None,
            "created_by": owner.id,
            "created_at": response.json()["results"][0]["created_at"],
            "updated_at": response.json()["results"][0]["updated_at"],
        }
    ]


def test_retrieve_ticket_endpoint_returns_owned_ticket():
    owner = create_user(email="owner@example.com")
    ticket = Ticket.objects.create(
        title="Chamado do dono",
        description="Descrição do chamado do dono.",
        customer_name="Cliente Dono",
        created_by=owner,
    )

    client = authenticated_client(owner)

    response = client.get(f"/api/tickets/{ticket.id}/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == ticket.id
    assert response.json()["title"] == "Chamado do dono"
    assert response.json()["created_by"] == owner.id


def test_retrieve_ticket_endpoint_hides_ticket_from_another_user():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")
    ticket = Ticket.objects.create(
        title="Chamado do outro usuário",
        description="Descrição do chamado do outro usuário.",
        customer_name="Cliente Outro",
        created_by=other_user,
    )

    client = authenticated_client(owner)

    response = client.get(f"/api/tickets/{ticket.id}/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Recurso não encontrado.",
            "details": {},
        },
    }


def test_retrieve_ticket_endpoint_returns_not_found_for_missing_ticket():
    owner = create_user(email="owner@example.com")
    client = authenticated_client(owner)

    response = client.get("/api/tickets/999/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Recurso não encontrado.",
            "details": {},
        },
    }


def test_update_ticket_endpoint_partially_updates_owned_ticket():
    owner = create_user(email="owner@example.com")
    ticket = Ticket.objects.create(
        title="Chamado antigo",
        description="Descrição antiga do chamado.",
        customer_name="Cliente Antigo",
        created_by=owner,
    )
    original_updated_at = ticket.updated_at

    client = authenticated_client(owner)

    response = client.patch(
        f"/api/tickets/{ticket.id}/",
        {
            "title": "Chamado atualizado",
            "status": Ticket.Status.IN_PROGRESS,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    ticket.refresh_from_db()

    assert ticket.title == "Chamado atualizado"
    assert ticket.description == "Descrição antiga do chamado."
    assert ticket.status == Ticket.Status.IN_PROGRESS
    assert ticket.updated_at > original_updated_at

    assert response.json()["title"] == "Chamado atualizado"
    assert response.json()["status"] == Ticket.Status.IN_PROGRESS


def test_update_ticket_endpoint_hides_ticket_from_another_user():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")
    ticket = Ticket.objects.create(
        title="Chamado do outro usuário",
        description="Descrição do chamado do outro usuário.",
        customer_name="Cliente Outro",
        created_by=other_user,
    )

    client = authenticated_client(owner)

    response = client.patch(
        f"/api/tickets/{ticket.id}/",
        {"title": "Tentativa de alteração"},
        format="json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Recurso não encontrado.",
            "details": {},
        },
    }


def test_update_ticket_endpoint_ignores_automatic_fields_from_client():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")
    ticket = Ticket.objects.create(
        title="Chamado antigo",
        description="Descrição antiga do chamado.",
        customer_name="Cliente Antigo",
        created_by=owner,
    )
    original_created_at = ticket.created_at

    client = authenticated_client(owner)

    response = client.patch(
        f"/api/tickets/{ticket.id}/",
        {
            "created_by": other_user.id,
            "created_at": "2000-01-01T00:00:00Z",
            "title": "Chamado atualizado",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    ticket.refresh_from_db()

    assert ticket.created_by == owner
    assert ticket.created_at == original_created_at
    assert ticket.title == "Chamado atualizado"


def test_delete_ticket_endpoint_deletes_owned_ticket():
    owner = create_user(email="owner@example.com")
    ticket = Ticket.objects.create(
        title="Chamado para excluir",
        description="Descrição do chamado para excluir.",
        customer_name="Cliente Exemplo",
        created_by=owner,
    )

    client = authenticated_client(owner)

    response = client.delete(f"/api/tickets/{ticket.id}/")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Ticket.objects.filter(id=ticket.id).exists()


def test_delete_ticket_endpoint_hides_ticket_from_another_user():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")
    ticket = Ticket.objects.create(
        title="Chamado do outro usuário",
        description="Descrição do chamado do outro usuário.",
        customer_name="Cliente Outro",
        created_by=other_user,
    )

    client = authenticated_client(owner)

    response = client.delete(f"/api/tickets/{ticket.id}/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Recurso não encontrado.",
            "details": {},
        },
    }
    assert Ticket.objects.filter(id=ticket.id).exists()


def test_delete_ticket_endpoint_returns_not_found_for_missing_ticket():
    owner = create_user(email="owner@example.com")
    client = authenticated_client(owner)

    response = client.delete("/api/tickets/999/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Recurso não encontrado.",
            "details": {},
        },
    }


def test_list_tickets_endpoint_returns_paginated_response_with_10_items():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")

    for index in range(12):
        Ticket.objects.create(
            title=f"Chamado {index}",
            description=f"Descrição do chamado {index}.",
            customer_name="Cliente Exemplo",
            created_by=owner,
        )

    Ticket.objects.create(
        title="Chamado de outro usuário",
        description="Descrição do chamado de outro usuário.",
        customer_name="Cliente Outro",
        created_by=other_user,
    )

    client = authenticated_client(owner)

    response = client.get("/api/tickets/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 12
    assert response.json()["next"] is not None
    assert response.json()["previous"] is None
    assert len(response.json()["results"]) == 10
    assert all(
        ticket["created_by"] == owner.id for ticket in response.json()["results"]
    )


def test_list_tickets_endpoint_uses_newest_first_order_by_default():
    owner = create_user(email="owner@example.com")
    older_ticket = Ticket.objects.create(
        title="Chamado antigo",
        description="Descrição do chamado antigo.",
        customer_name="Cliente Antigo",
        created_by=owner,
    )
    newer_ticket = Ticket.objects.create(
        title="Chamado novo",
        description="Descrição do chamado novo.",
        customer_name="Cliente Novo",
        created_by=owner,
    )
    now = timezone.now()
    set_ticket_created_at(older_ticket, now - timedelta(days=1))
    set_ticket_created_at(newer_ticket, now)

    client = authenticated_client(owner)

    response = client.get("/api/tickets/")

    assert response.status_code == status.HTTP_200_OK
    assert [ticket["id"] for ticket in response.json()["results"]] == [
        newer_ticket.id,
        older_ticket.id,
    ]


def test_list_tickets_endpoint_orders_by_created_at_ascending():
    owner = create_user(email="owner@example.com")
    older_ticket = Ticket.objects.create(
        title="Chamado antigo",
        description="Descrição do chamado antigo.",
        customer_name="Cliente Antigo",
        created_by=owner,
    )
    newer_ticket = Ticket.objects.create(
        title="Chamado novo",
        description="Descrição do chamado novo.",
        customer_name="Cliente Novo",
        created_by=owner,
    )
    now = timezone.now()
    set_ticket_created_at(older_ticket, now - timedelta(days=1))
    set_ticket_created_at(newer_ticket, now)

    client = authenticated_client(owner)

    response = client.get("/api/tickets/?ordering=created_at")

    assert response.status_code == status.HTTP_200_OK
    assert [ticket["id"] for ticket in response.json()["results"]] == [
        older_ticket.id,
        newer_ticket.id,
    ]


def test_list_tickets_endpoint_orders_by_created_at_descending():
    owner = create_user(email="owner@example.com")
    older_ticket = Ticket.objects.create(
        title="Chamado antigo",
        description="Descrição do chamado antigo.",
        customer_name="Cliente Antigo",
        created_by=owner,
    )
    newer_ticket = Ticket.objects.create(
        title="Chamado novo",
        description="Descrição do chamado novo.",
        customer_name="Cliente Novo",
        created_by=owner,
    )
    now = timezone.now()
    set_ticket_created_at(older_ticket, now - timedelta(days=1))
    set_ticket_created_at(newer_ticket, now)

    client = authenticated_client(owner)

    response = client.get("/api/tickets/?ordering=-created_at")

    assert response.status_code == status.HTTP_200_OK
    assert [ticket["id"] for ticket in response.json()["results"]] == [
        newer_ticket.id,
        older_ticket.id,
    ]


def test_list_tickets_endpoint_filters_by_status():
    owner = create_user(email="owner@example.com")
    open_ticket = Ticket.objects.create(
        title="Chamado aberto",
        description="Descrição do chamado aberto.",
        customer_name="Cliente Aberto",
        status=Ticket.Status.OPEN,
        created_by=owner,
    )
    Ticket.objects.create(
        title="Chamado fechado",
        description="Descrição do chamado fechado.",
        customer_name="Cliente Fechado",
        status=Ticket.Status.CLOSED,
        created_by=owner,
    )

    client = authenticated_client(owner)

    response = client.get("/api/tickets/?status=open")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 1
    assert [ticket["id"] for ticket in response.json()["results"]] == [open_ticket.id]


def test_list_tickets_endpoint_filters_by_priority():
    owner = create_user(email="owner@example.com")
    urgent_ticket = Ticket.objects.create(
        title="Chamado urgente",
        description="Descrição do chamado urgente.",
        customer_name="Cliente Urgente",
        priority=Ticket.Priority.URGENT,
        created_by=owner,
    )
    Ticket.objects.create(
        title="Chamado normal",
        description="Descrição do chamado normal.",
        customer_name="Cliente Normal",
        priority=Ticket.Priority.MEDIUM,
        created_by=owner,
    )

    client = authenticated_client(owner)

    response = client.get("/api/tickets/?priority=urgent")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 1
    assert [ticket["id"] for ticket in response.json()["results"]] == [urgent_ticket.id]


def test_list_tickets_endpoint_searches_by_title_case_insensitive():
    owner = create_user(email="owner@example.com")
    matching_ticket = Ticket.objects.create(
        title="Erro no Login",
        description="Descrição do chamado de login.",
        customer_name="Cliente Alpha",
        created_by=owner,
    )
    Ticket.objects.create(
        title="Problema no cadastro",
        description="Descrição do chamado de cadastro.",
        customer_name="Cliente Beta",
        created_by=owner,
    )

    client = authenticated_client(owner)

    response = client.get("/api/tickets/?search=login")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 1
    assert [ticket["id"] for ticket in response.json()["results"]] == [
        matching_ticket.id
    ]


def test_list_tickets_endpoint_searches_by_customer_name_case_insensitive():
    owner = create_user(email="owner@example.com")
    matching_ticket = Ticket.objects.create(
        title="Erro no pagamento",
        description="Descrição do chamado de pagamento.",
        customer_name="Cliente Alpha",
        created_by=owner,
    )
    Ticket.objects.create(
        title="Problema no cadastro",
        description="Descrição do chamado de cadastro.",
        customer_name="Cliente Beta",
        created_by=owner,
    )

    client = authenticated_client(owner)

    response = client.get("/api/tickets/?search=alpha")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 1
    assert [ticket["id"] for ticket in response.json()["results"]] == [
        matching_ticket.id
    ]


def test_list_tickets_endpoint_combines_search_filters_ordering_and_pagination():
    owner = create_user(email="owner@example.com")
    other_user = create_user(email="other@example.com")

    newest_matching_ticket = Ticket.objects.create(
        title="Erro no login urgente",
        description="Descrição do chamado mais novo.",
        customer_name="Cliente Alpha",
        status=Ticket.Status.OPEN,
        priority=Ticket.Priority.URGENT,
        created_by=owner,
    )
    oldest_matching_ticket = Ticket.objects.create(
        title="Erro no login antigo",
        description="Descrição do chamado mais antigo.",
        customer_name="Cliente Alpha",
        status=Ticket.Status.OPEN,
        priority=Ticket.Priority.URGENT,
        created_by=owner,
    )
    Ticket.objects.create(
        title="Erro no cadastro urgente",
        description="Não deve aparecer por causa da busca.",
        customer_name="Cliente Alpha",
        status=Ticket.Status.OPEN,
        priority=Ticket.Priority.URGENT,
        created_by=owner,
    )
    Ticket.objects.create(
        title="Erro no login fechado",
        description="Não deve aparecer por causa do status.",
        customer_name="Cliente Alpha",
        status=Ticket.Status.CLOSED,
        priority=Ticket.Priority.URGENT,
        created_by=owner,
    )
    Ticket.objects.create(
        title="Erro no login normal",
        description="Não deve aparecer por causa da prioridade.",
        customer_name="Cliente Alpha",
        status=Ticket.Status.OPEN,
        priority=Ticket.Priority.MEDIUM,
        created_by=owner,
    )
    Ticket.objects.create(
        title="Erro no login de outro usuário",
        description="Não deve aparecer por causa do isolamento.",
        customer_name="Cliente Alpha",
        status=Ticket.Status.OPEN,
        priority=Ticket.Priority.URGENT,
        created_by=other_user,
    )

    now = timezone.now()
    set_ticket_created_at(oldest_matching_ticket, now - timedelta(days=1))
    set_ticket_created_at(newest_matching_ticket, now)

    client = authenticated_client(owner)

    response = client.get(
        "/api/tickets/?search=login&status=open&priority=urgent&ordering=created_at&page=1"
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 2
    assert [ticket["id"] for ticket in response.json()["results"]] == [
        oldest_matching_ticket.id,
        newest_matching_ticket.id,
    ]


def test_list_tickets_endpoint_returns_standard_error_for_invalid_page():
    owner = create_user(email="owner@example.com")
    client = authenticated_client(owner)

    response = client.get("/api/tickets/?page=999")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        "error": {
            "code": "not_found",
            "message": "Recurso não encontrado.",
            "details": {},
        },
    }