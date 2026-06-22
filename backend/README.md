# Backend

API do CloseDesk construída com Python, Django e Django REST Framework.

## Requisitos

- Python 3.12
- PostgreSQL 16

## Ambiente local

A partir da raiz do repositório:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
python -m pip install -r backend/requirements.txt
```

Copie o modelo de variáveis:

```bash
cp backend/.env.example backend/.env
```

Preencha o arquivo local. Valores sensíveis devem ficar entre aspas simples:

```dotenv
DJANGO_SECRET_KEY='chave-local'
POSTGRES_PASSWORD='senha-local'
```

O arquivo `.env` é ignorado pelo Git.

Configurações de execução:

- `DJANGO_DEBUG` aceita `true`, `false`, `1`, `0`, `yes` ou `no`.
- `DJANGO_ALLOWED_HOSTS` recebe hosts separados por vírgula.
- Em produção, `DJANGO_DEBUG` deve ser `False`.
- Variáveis obrigatórias ausentes interrompem a inicialização com uma mensagem clara.

Carregue as variáveis:

```bash
set -a
source backend/.env
set +a
```

Prepare o banco:

```bash
python backend/manage.py migrate
python backend/manage.py check --database default
```

## Estado atual

O projeto possui:

- App `accounts` com usuário customizado e autenticação por e-mail.
- App `tickets` preparado para o domínio de chamados.
- Django REST Framework configurado com autenticação obrigatória por padrão.

Ainda não possui endpoints da API ou modelo de chamados.
