# Deploy do CloseDesk

Este documento registra o plano de publicação do MVP.

## Serviços escolhidos

Para a primeira demonstração pública, a escolha recomendada é:

| Camada | Serviço | Motivo |
| --- | --- | --- |
| Frontend | Vercel | Suporte direto a aplicações React/Vite, deploy contínuo via GitHub e configuração simples de variáveis `VITE_*`. |
| Backend | Render Web Service | Suporte a aplicações Django, variáveis de ambiente, health check e execução de comandos de build/start. |
| Banco de dados | Render PostgreSQL | PostgreSQL gerenciado e conexão interna com serviços Render na mesma região. |

Essa divisão mantém o frontend estático separado da API e preserva a arquitetura
atual do projeto: React consumindo uma API Django autenticada com JWT.

Referências oficiais:

- [Vercel — Vite](https://vercel.com/docs/frameworks/frontend/vite)
- [Render — Deploy a Django App](https://render.com/docs/deploy-django)
- [Render — Create and Connect to Render Postgres](https://render.com/docs/postgresql-creating-connecting)

## Variáveis de produção previstas

### Backend

```env
DJANGO_SECRET_KEY=<valor-seguro>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=<dominio-do-backend>

POSTGRES_DB=<database>
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_HOST=<host-interno-do-postgres>
POSTGRES_PORT=5432

CORS_ALLOWED_ORIGINS=<url-publica-do-frontend>
```

### Frontend

```env
VITE_API_BASE_URL=<url-publica-do-backend>/api
```

## Checklist de publicação

1. Criar o banco PostgreSQL gerenciado.
2. Criar o serviço web do backend.
3. Configurar as variáveis de ambiente do backend.
4. Configurar o backend com:

   ```bash
   Build Command: ./build.sh
   Start Command: python -m gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
   ```

5. Rodar migrações no ambiente de produção.
6. Validar `GET /api/health/`.
7. Configurar o frontend na Vercel com:

   ```bash
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

8. Configurar `VITE_API_BASE_URL` com a URL pública da API.
9. Publicar o frontend apontando para a API de produção.
10. Atualizar `CORS_ALLOWED_ORIGINS` com a URL pública do frontend.
11. Atualizar `DJANGO_ALLOWED_HOSTS` com o host público do backend.
12. Validar a documentação da API em produção.
13. Executar os fluxos de aceitação no ambiente publicado.

## Cuidados

- Não versionar arquivos `.env` reais.
- Não expor tokens, senhas ou segredos em prints, logs ou dados de demonstração.
- Manter `DJANGO_DEBUG=False` em produção.
- Usar somente URLs HTTPS na demonstração pública.
- Criar dados de demonstração próprios, sem credenciais reais.
