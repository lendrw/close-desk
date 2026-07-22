# Frontend

Interface web do CloseDesk construída com React, TypeScript e Vite.

## Requisitos

- Node.js 24
- npm 11

## Ambiente local

A partir da pasta `frontend`:

```bash
npm install
```

Crie o arquivo local de ambiente:

```bash
cp .env.example .env
```

Configure a URL da API:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
```

## Execução

Com o backend em execução em `http://127.0.0.1:8000`, rode:

```bash
npm run dev
```

A aplicação fica disponível em:

```text
http://localhost:5173
```

## Scripts

```bash
npm run build
npm run lint
npm run test
npm run format:check
npm run e2e
```

## Produção

O frontend está preparado para deploy como aplicação estática Vite.

Configuração recomendada na Vercel:

| Campo            | Valor           |
| ---------------- | --------------- |
| Framework Preset | Vite            |
| Root Directory   | `frontend`      |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |

Configure a variável de ambiente:

```dotenv
VITE_API_BASE_URL=https://<dominio-do-backend>/api
```

O arquivo `vercel.json` mantém as rotas do React Router funcionando em
acessos diretos, como `/dashboard` e `/tickets/1`.

## Testes E2E

Os testes de ponta a ponta usam Playwright e ficam em `e2e/`.

Para executar:

```bash
npm run e2e
```

Os testes E2E assumem backend e frontend em execução localmente.

## Estado atual

O frontend possui:

- Rotas públicas de login e cadastro.
- Rotas protegidas com restauração de sessão.
- Layout autenticado com navegação principal.
- Dashboard com indicadores.
- Listagem de chamados com busca, filtros, ordenação e paginação.
- Criação, detalhes, edição, alteração de status e exclusão de chamados.
- Tratamento de carregamento, estado vazio e erros.
- Testes com Vitest, Testing Library, MSW e Playwright.
