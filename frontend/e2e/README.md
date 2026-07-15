# Testes E2E

Esta pasta contém testes de ponta a ponta com Playwright.

Os testes assumem que backend e frontend estão em execução localmente:

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:5173`

Execute a partir da pasta `frontend`:

```bash
npm run e2e
```

Para acompanhar o navegador durante a execução:

```bash
npm run e2e:headed
```

Para abrir a interface interativa do Playwright:

```bash
npm run e2e:ui
```
