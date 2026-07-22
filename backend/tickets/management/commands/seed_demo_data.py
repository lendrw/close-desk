import os
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from tickets.models import Ticket

DEMO_PASSWORD_ENV = "CLOSEDESK_DEMO_PASSWORD"
DEMO_USER_EMAIL = "demo@closedesk.local"
DEMO_USER_NAME = "Usuário Demonstração"


class Command(BaseCommand):
    help = "Cria dados fictícios para demonstração do CloseDesk."

    def handle(self, *args, **options):
        password = os.environ.get(DEMO_PASSWORD_ENV)

        if not password:
            raise CommandError(
                f"Defina a variável {DEMO_PASSWORD_ENV} antes de criar a demo."
            )

        user = self.create_demo_user(password)
        created_count, updated_count = self.create_demo_tickets(user)

        self.stdout.write(
            self.style.SUCCESS(
                "Dados de demonstração preparados: "
                f"{created_count} chamados criados, "
                f"{updated_count} chamados atualizados."
            )
        )

    def create_demo_user(self, password):
        user_model = get_user_model()
        user, _ = user_model.objects.get_or_create(
            email=DEMO_USER_EMAIL,
            defaults={"name": DEMO_USER_NAME},
        )
        user.name = DEMO_USER_NAME
        user.set_password(password)
        user.full_clean()
        user.save()

        return user

    def create_demo_tickets(self, user):
        created_count = 0
        updated_count = 0

        for ticket_data in get_demo_tickets():
            ticket = Ticket.objects.filter(
                created_by=user,
                title=ticket_data["title"],
            ).first()

            if ticket:
                for field, value in ticket_data.items():
                    setattr(ticket, field, value)

                ticket.full_clean()
                ticket.save()
                updated_count += 1
            else:
                Ticket.objects.create(created_by=user, **ticket_data)
                created_count += 1

        return created_count, updated_count


def get_demo_tickets():
    today = timezone.localdate()

    return [
        {
            "title": "Configurar acesso inicial",
            "description": (
                "Cliente precisa receber orientação para concluir o primeiro "
                "acesso ao sistema."
            ),
            "customer_name": "Cliente Alpha",
            "status": Ticket.Status.OPEN,
            "priority": Ticket.Priority.URGENT,
            "due_date": today + timedelta(days=1),
        },
        {
            "title": "Investigar erro no login",
            "description": (
                "Usuário relata falha intermitente ao autenticar com e-mail e senha."
            ),
            "customer_name": "Cliente Beta",
            "status": Ticket.Status.IN_PROGRESS,
            "priority": Ticket.Priority.HIGH,
            "due_date": today + timedelta(days=3),
        },
        {
            "title": "Atualizar dados cadastrais",
            "description": (
                "Cliente solicitou revisão de informações de contato e "
                "preferências de atendimento."
            ),
            "customer_name": "Cliente Gamma",
            "status": Ticket.Status.OPEN,
            "priority": Ticket.Priority.MEDIUM,
            "due_date": today + timedelta(days=7),
        },
        {
            "title": "Confirmar resolução de chamado",
            "description": (
                "A solução foi aplicada e aguarda confirmação final do cliente."
            ),
            "customer_name": "Cliente Delta",
            "status": Ticket.Status.RESOLVED,
            "priority": Ticket.Priority.LOW,
            "due_date": None,
        },
        {
            "title": "Encerrar solicitação concluída",
            "description": (
                "Atendimento finalizado com sucesso e chamado mantido para "
                "histórico da demonstração."
            ),
            "customer_name": "Cliente Epsilon",
            "status": Ticket.Status.CLOSED,
            "priority": Ticket.Priority.MEDIUM,
            "due_date": None,
        },
    ]
