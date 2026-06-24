import pytest
from config.settings import get_required_env


def test_required_environment_variable_returns_value(monkeypatch):
    monkeypatch.setenv("CLOSEDESK_TEST_REQUIRED_ENV", "expected-value")

    assert get_required_env("CLOSEDESK_TEST_REQUIRED_ENV") == "expected-value"


def test_required_environment_variable_rejects_missing_value(monkeypatch):
    monkeypatch.delenv("CLOSEDESK_TEST_REQUIRED_ENV", raising=False)

    with pytest.raises(ValueError) as error:
        get_required_env("CLOSEDESK_TEST_REQUIRED_ENV")

    assert str(error.value) == (
        "CLOSEDESK_TEST_REQUIRED_ENV é uma variável de ambiente obrigatória."
    )


def test_required_environment_variable_rejects_blank_value(monkeypatch):
    monkeypatch.setenv("CLOSEDESK_TEST_REQUIRED_ENV", "   ")

    with pytest.raises(ValueError) as error:
        get_required_env("CLOSEDESK_TEST_REQUIRED_ENV")

    assert str(error.value) == (
        "CLOSEDESK_TEST_REQUIRED_ENV é uma variável de ambiente obrigatória."
    )
