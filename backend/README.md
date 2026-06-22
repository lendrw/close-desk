# Backend

API do CloseDesk construída com Python, Django e Django REST Framework.

## Requisitos

- Python 3.12
- PostgreSQL — será configurado em uma etapa futura

## Ambiente local

A partir da raiz do repositório:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
python -m pip install -r backend/requirements.txt
```

Para verificar o projeto atual:

```bash
DJANGO_SECRET_KEY=development-only-key python backend/manage.py check
```

As variáveis previstas estão documentadas em `.env.example`.

## Estado atual

O projeto possui:

- App `accounts` com usuário customizado e autenticação por e-mail.
- App `tickets` preparado para o domínio de chamados.
- Django REST Framework configurado com autenticação obrigatória por padrão.

Ainda não possui endpoints da API, modelo de chamados ou configuração do PostgreSQL.
