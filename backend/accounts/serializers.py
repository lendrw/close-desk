from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)
