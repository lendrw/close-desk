import json

from rest_framework.test import APIClient


def test_openapi_schema_is_public():
    response = APIClient().get(
        "/api/schema/",
        HTTP_ACCEPT="application/json",
    )

    assert response.status_code == 200

    schema = json.loads(response.content)
    assert schema["info"]["title"] == "CloseDesk API"
    assert schema["info"]["version"] == "0.1.0"
    assert "/api/health/" in schema["paths"]
    assert "/api/auth/register/" in schema["paths"]
    assert "/api/auth/token/" in schema["paths"]
    assert "/api/auth/token/refresh/" in schema["paths"]
    assert "/api/auth/me/" in schema["paths"]


def test_swagger_ui_is_public():
    response = APIClient().get("/api/docs/")

    assert response.status_code == 200
    assert response.headers["Content-Type"].startswith("text/html")
