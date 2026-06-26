from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from tickets.models import Ticket


@extend_schema(
    responses={status.HTTP_200_OK: dict},
    summary="Resumo do dashboard",
    tags=["Dashboard"],
)
@api_view(["GET"])
def dashboard_summary(request):
    tickets = Ticket.objects.filter(created_by=request.user)

    return Response(
        {
            "total": tickets.count(),
            "by_status": {
                Ticket.Status.OPEN: tickets.filter(status=Ticket.Status.OPEN).count(),
                Ticket.Status.IN_PROGRESS: tickets.filter(
                    status=Ticket.Status.IN_PROGRESS
                ).count(),
                Ticket.Status.RESOLVED: tickets.filter(
                    status=Ticket.Status.RESOLVED
                ).count(),
                Ticket.Status.CLOSED: tickets.filter(
                    status=Ticket.Status.CLOSED
                ).count(),
            },
            "urgent": tickets.filter(priority=Ticket.Priority.URGENT).count(),
        }
    )
