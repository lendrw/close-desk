import pytest
from accounts.serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model

pytestmark = pytest.mark.django_db


@pytest.mark.django_db
def test_user_registration_serializer_creates_user_with_hashed_password():
    serializer = UserRegistrationSerializer(
        data={
            "name": "Ada Lovelace",
            "email": "ADA@Example.COM",
            "password": "securepass123",
        }
    )

    assert serializer.is_valid(), serializer.errors

    user = serializer.save()

    assert user.name == "Ada Lovelace"
    assert user.email == "ada@example.com"
    assert user.check_password("securepass123")
    assert user.password != "securepass123"

    assert get_user_model().objects.count() == 1


def test_user_registration_serializer_requires_name():
    serializer = UserRegistrationSerializer(
        data={
            "email": "ada@example.com",
            "password": "securepass123",
        }
    )

    assert not serializer.is_valid()
    assert "name" in serializer.errors


def test_user_registration_serializer_rejects_short_name():
    serializer = UserRegistrationSerializer(
        data={
            "name": "A",
            "email": "ada@example.com",
            "password": "securepass123",
        }
    )

    assert not serializer.is_valid()
    assert "name" in serializer.errors


def test_user_registration_serializer_rejects_long_name():
    serializer = UserRegistrationSerializer(
        data={
            "name": "A" * 101,
            "email": "ada@example.com",
            "password": "securepass123",
        }
    )

    assert not serializer.is_valid()
    assert "name" in serializer.errors


def test_user_registration_serializer_rejects_invalid_email():
    serializer = UserRegistrationSerializer(
        data={
            "name": "Ada Lovelace",
            "email": "invalid-email",
            "password": "securepass123",
        }
    )

    assert not serializer.is_valid()
    assert "email" in serializer.errors


def test_user_registration_serializer_rejects_short_password():
    serializer = UserRegistrationSerializer(
        data={
            "name": "Ada Lovelace",
            "email": "ada@example.com",
            "password": "short",
        }
    )

    assert not serializer.is_valid()
    assert "password" in serializer.errors


@pytest.mark.django_db
def test_user_registration_serializer_rejects_duplicate_email_case_insensitive():
    get_user_model().objects.create_user(
        name="Ada Lovelace",
        email="ada@example.com",
        password="securepass123",
    )

    serializer = UserRegistrationSerializer(
        data={
            "name": "Grace Hopper",
            "email": "ADA@EXAMPLE.COM",
            "password": "anotherpass123",
        }
    )

    assert not serializer.is_valid()
    assert serializer.errors == {
        "email": ["Já existe um usuário cadastrado com este e-mail."]
    }
