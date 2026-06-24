import pytest
from accounts.serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model


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
