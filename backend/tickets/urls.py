from django.urls import path

from tickets.views import ticket_detail, ticket_list

urlpatterns = [
    path("", ticket_list, name="ticket-list"),
    path("<int:ticket_id>/", ticket_detail, name="ticket-detail"),
]
