# CloseDesk

Aplicação full stack para gestão individual de chamados de clientes.

## Status atual

- Backend concluído com API REST, autenticação JWT, CRUD de chamados, dashboard, documentação OpenAPI e testes automatizados.
- Frontend integrado com React, TypeScript, Vite, autenticação, dashboard e gestão completa de chamados.
- Fluxos críticos validados manualmente e com cobertura automatizada, incluindo testes E2E com Playwright.
- Integração contínua configurada para verificações de backend, frontend e E2E.

## Problema

Organizar chamados, prioridades e prazos pode se tornar difícil quando as informações ficam espalhadas. O CloseDesk centraliza esse acompanhamento em uma única aplicação.

## Público-alvo

Profissionais autônomos e pequenos prestadores de serviço que precisam gerenciar seus próprios chamados.

## Escopo do MVP

- Autenticação de usuários
- Gestão de chamados
- Busca, filtros e paginação
- Dashboard com indicadores
- Isolamento dos dados por usuário

## Stack

- React e TypeScript
- Python, Django e Django REST Framework
- PostgreSQL
- JWT

## Documentação

- [Requisitos](docs/requisitos.md)
- [Roadmap](docs/roadmap.md)
- [Backend](backend/README.md)
- [Frontend](frontend/README.md)
- [Fluxos de aceitação](docs/testes/fluxos-de-aceitacao.md)
