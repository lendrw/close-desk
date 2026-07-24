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
python -m pip install -r backend/requirements-dev.txt
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
- `CORS_ALLOWED_ORIGINS` recebe origens completas separadas por vírgula.
- Os cabeçalhos CORS são adicionados somente às rotas iniciadas por `/api/`.
- Origens não listadas não recebem permissão de acesso pelo navegador.
- `FRONTEND_BASE_URL` define a origem usada em links enviados por e-mail.
- Em desenvolvimento, o backend usa e-mail no console por padrão.
- Em produção, configure `EMAIL_BACKEND`, SMTP e `DEFAULT_FROM_EMAIL`.

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

## Documentação da API

Com o servidor em execução:

- Swagger UI: `http://localhost:8000/api/docs/`
- Schema OpenAPI: `http://localhost:8000/api/schema/`

A documentação e o schema são públicos.

## E-mail

O fluxo de recuperação de senha envia instruções por e-mail quando a conta
existe, mas sempre retorna a mesma mensagem pública para evitar enumeração de
usuários.

Em ambiente local, use o backend de console:

```dotenv
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
FRONTEND_BASE_URL=http://localhost:5173
```

Em produção, configure as variáveis SMTP:

```dotenv
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=<host-smtp>
EMAIL_PORT=587
EMAIL_HOST_USER=<usuario-smtp>
EMAIL_HOST_PASSWORD=<senha-smtp>
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL='CloseDesk <no-reply@seudominio.com>'
```

## Testes

Execute a partir da pasta `backend`:

```bash
cd backend
python -m pytest
```

## Qualidade de código

Execute a partir da pasta `backend`:

```bash
python -m ruff check .
python -m ruff format --check .
```

Para aplicar formatação automática:

```bash
python -m ruff format .
```

A suíte usa SQLite em memória e não depende do PostgreSQL local.

## Produção

O backend está preparado para rodar como serviço WSGI com Gunicorn e servir
arquivos estáticos via WhiteNoise.

Em um serviço com raiz configurada para `backend`, use:

```bash
./build.sh
```

Como comando de inicialização:

```bash
python -m gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Antes de publicar, configure as variáveis obrigatórias e mantenha
`DJANGO_DEBUG=False`.

### Dados de demonstração

Para criar dados fictícios de demonstração sem versionar credenciais reais,
defina uma senha temporária em variável de ambiente e execute:

```bash
CLOSEDESK_DEMO_PASSWORD='senha-temporaria-segura' \
python manage.py seed_demo_data
```

O comando cria ou atualiza o usuário `demo@closedesk.local` e cinco chamados
fictícios. Use somente senhas temporárias e troque/remova os dados quando a
demonstração não for mais necessária.

### Listagem de chamados

O endpoint `GET /api/tickets/` aceita os seguintes parâmetros de consulta:

| Parâmetro | Exemplo | Descrição |
| --- | --- | --- |
| `page` | `?page=2` | Seleciona a página da listagem paginada. |
| `ordering` | `?ordering=created_at` | Ordena por criação em ordem crescente. Use `-created_at` para ordem decrescente. |
| `status` | `?status=open` | Filtra por status do chamado. |
| `priority` | `?priority=urgent` | Filtra por prioridade do chamado. |
| `search` | `?search=login` | Busca por título ou nome do cliente, sem diferenciar maiúsculas. |

Os parâmetros podem ser combinados, por exemplo:

```text
/api/tickets/?search=login&status=open&priority=urgent&ordering=-created_at&page=1
```

### Dashboard

O endpoint `GET /api/dashboard/summary/` retorna os indicadores consolidados do usuário autenticado.

Exemplo de resposta:

```json
{
  "total": 4,
  "by_status": {
    "open": 1,
    "in_progress": 1,
    "resolved": 1,
    "closed": 1
  },
  "urgent": 2
}
```

A resposta considera somente os chamados do usuário autenticado.

## Estado atual

O projeto possui:

- App `accounts` com usuário customizado e autenticação por e-mail.
- App `tickets` com modelo, CRUD, consultas avançadas e dashboard.
- Django REST Framework configurado com autenticação obrigatória por padrão.
- Health check público em `GET /api/health/`.
- Ambiente de testes com pytest.
- Documentação interativa com OpenAPI e Swagger UI.
- Endpoints de autenticação com JWT.
- CRUD de chamados com isolamento por usuário.
- Endpoint de dashboard com indicadores consolidados por usuário.

O backend está integrado ao frontend React localizado em `frontend/`.
