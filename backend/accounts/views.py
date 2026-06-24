from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.serializers import UserRegistrationSerializer


@extend_schema(
    request=UserRegistrationSerializer,
    responses={status.HTTP_201_CREATED: UserRegistrationSerializer},
    summary="Cadastrar usuário",
    tags=["Authentication"],
)
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    return Response(
        UserRegistrationSerializer(user).data,
        status=status.HTTP_201_CREATED,
    )
