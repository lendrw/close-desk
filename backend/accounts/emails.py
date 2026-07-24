from django.conf import settings
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from accounts.tokens import email_verification_token_generator


def build_frontend_url(path):
    return f"{settings.FRONTEND_BASE_URL.rstrip('/')}/{path.lstrip('/')}"


def send_email_verification(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token_generator.make_token(user)
    verification_url = build_frontend_url(f"verify-email/{uid}/{token}")

    send_mail(
        subject="Verificação de e-mail do CloseDesk",
        message=(
            "Obrigado por criar sua conta no CloseDesk.\n\n"
            f"Confirme seu e-mail acessando o link abaixo:\n{verification_url}\n\n"
            "Se você não criou essa conta, ignore este e-mail."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
