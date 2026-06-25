from django.urls import path

from tickets.views import ticket_list

urlpatterns = [
    path("", ticket_list, name="ticket-list"),
]
