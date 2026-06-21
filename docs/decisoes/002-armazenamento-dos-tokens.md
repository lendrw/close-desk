# ADR 002 — Armazenamento dos tokens

**Status:** aceita
**Data:** 21 de junho de 2026

## Contexto

O frontend React utilizará tokens JWT para acessar a API. É necessário definir onde guardar o access token e o refresh token.

Armazenar tokens persistentemente no navegador aumenta sua exposição em caso de ataque XSS.

## Decisão

No MVP:

- O access token será mantido apenas em memória.
- O refresh token será armazenado em `sessionStorage`.
- A sessão poderá ser restaurada enquanto a aba permanecer aberta.
- Tokens não serão armazenados em `localStorage`.
- O logout removerá os tokens do frontend.
- Uma falha na renovação encerrará a sessão.
- A aplicação utilizará HTTPS em produção.

## Consequências

### Positivas

- O access token não permanece salvo após fechar a aplicação.
- O refresh token é removido ao encerrar a sessão do navegador.
- A solução é simples para o escopo do MVP.
- Evita a persistência prolongada do `localStorage`.

### Negativas

- O `sessionStorage` ainda pode ser acessado por código executado em um ataque XSS.
- A sessão não permanece após o navegador ser fechado.
- O frontend precisa implementar restauração e renovação da sessão.
- O logout não revoga o refresh token no servidor durante o MVP.

## Evolução futura

Uma versão futura poderá utilizar cookies `HttpOnly`, `Secure` e `SameSite`, além da revogação de refresh tokens no servidor.

## Requisitos relacionados

- RF-AUT-03 — Renovar sessão.
- RF-AUT-05 — Encerrar sessão.
- RF-AUT-06 — Proteger rotas.
- RNF-01 — Segurança.
