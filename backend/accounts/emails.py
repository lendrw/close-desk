import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from accounts.tokens import email_verification_token_generator

logger = logging.getLogger(__name__)


def build_frontend_url(path):
    return f"{settings.FRONTEND_BASE_URL.rstrip('/')}/{path.lstrip('/')}"


def get_recipient_domain(email):
    if "@" not in email:
        return "unknown"

    return email.rsplit("@", 1)[1].lower()


def send_account_email(*, flow, subject, message, recipient):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
    except Exception:
        logger.exception(
            "Falha ao enviar e-mail de conta. flow=%s recipient_domain=%s",
            flow,
            get_recipient_domain(recipient),
        )
        raise


def send_email_verification(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token_generator.make_token(user)
    verification_url = build_frontend_url(f"verify-email/{uid}/{token}")

    send_account_email(
        flow="email_verification",
        subject="Verificação de e-mail do CloseDesk",
        message=(
            "Obrigado por criar sua conta no CloseDesk.\n\n"
            f"Confirme seu e-mail acessando o link abaixo:\n{verification_url}\n\n"
            "Se você não criou essa conta, ignore este e-mail."
        ),
        recipient=user.email,
    )
