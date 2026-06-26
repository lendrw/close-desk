from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    MethodNotAllowed,
    NotAuthenticated,
    NotFound,
    PermissionDenied,
    ValidationError,
)
from rest_framework.response import Response
from rest_framework.views import exception_handler

ERROR_MESSAGES = {
    "validation_error": "Os dados enviados são inválidos.",
    "authentication_error": "Autenticação necessária.",
    "permission_denied": "Acesso negado.",
    "not_found": "Recurso não encontrado.",
    "method_not_allowed": "Método não permitido.",
    "internal_error": "Erro interno do servidor.",
}


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return build_error_response(
            code="internal_error",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    code = get_error_code(exc, response.status_code)
    status_code = get_status_code(exc, response.status_code)
    details = get_error_details(code, response.data)
    headers = {key: value for key, value in response.items()}

    return build_error_response(
        code=code,
        status_code=status_code,
        details=details,
        headers=headers,
    )


def build_error_response(code, status_code, details=None, headers=None):
    return Response(
        {
            "error": {
                "code": code,
                "message": ERROR_MESSAGES[code],
                "details": details or {},
            }
        },
        status=status_code,
        headers=headers,
    )


def get_status_code(exc, default_status_code):
    if isinstance(exc, AuthenticationFailed | NotAuthenticated):
        return status.HTTP_401_UNAUTHORIZED

    return default_status_code


def get_error_code(exc, status_code):
    if isinstance(exc, ValidationError):
        return "validation_error"

    if isinstance(exc, AuthenticationFailed | NotAuthenticated):
        return "authentication_error"

    if isinstance(exc, PermissionDenied):
        return "permission_denied"

    if isinstance(exc, NotFound):
        return "not_found"

    if isinstance(exc, MethodNotAllowed):
        return "method_not_allowed"

    return {
        status.HTTP_400_BAD_REQUEST: "validation_error",
        status.HTTP_401_UNAUTHORIZED: "authentication_error",
        status.HTTP_403_FORBIDDEN: "permission_denied",
        status.HTTP_404_NOT_FOUND: "not_found",
        status.HTTP_405_METHOD_NOT_ALLOWED: "method_not_allowed",
    }.get(status_code, "internal_error")


def get_error_details(code, data):
    if code != "validation_error":
        return {}

    normalized_data = normalize_error_details(data)

    if isinstance(normalized_data, dict):
        return normalized_data

    return {"non_field_errors": normalized_data}


def normalize_error_details(data):
    if isinstance(data, dict):
        return {key: normalize_error_details(value) for key, value in data.items()}

    if isinstance(data, list):
        return [normalize_error_details(item) for item in data]

    return str(data)
