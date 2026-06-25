from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from tickets.serializers import TicketSerializer


@api_view(["POST"])
def ticket_list(request):
    serializer = TicketSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    ticket = serializer.save(created_by=request.user)

    return Response(
        TicketSerializer(ticket).data,
        status=status.HTTP_201_CREATED,
    )
