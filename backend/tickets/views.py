from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from tickets.models import Ticket
from tickets.serializers import TicketSerializer


@extend_schema(
    request=TicketSerializer,
    responses={
        status.HTTP_200_OK: TicketSerializer(many=True),
        status.HTTP_201_CREATED: TicketSerializer,
    },
    summary="Listar ou criar chamados",
    tags=["Tickets"],
)
@api_view(["GET", "POST"])
def ticket_list(request):
    if request.method == "GET":
        tickets = Ticket.objects.filter(created_by=request.user)
        return Response(TicketSerializer(tickets, many=True).data)

    serializer = TicketSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    ticket = serializer.save(created_by=request.user)

    return Response(
        TicketSerializer(ticket).data,
        status=status.HTTP_201_CREATED,
    )


@extend_schema(
    responses={status.HTTP_200_OK: TicketSerializer},
    summary="Consultar chamado",
    tags=["Tickets"],
)
@api_view(["GET"])
def ticket_detail(request, ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id, created_by=request.user)
    except Ticket.DoesNotExist as error:
        raise NotFound("Recurso não encontrado.") from error

    return Response(TicketSerializer(ticket).data)
