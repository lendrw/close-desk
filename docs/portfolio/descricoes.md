# Descrições para portfólio, currículo e LinkedIn

## Descrição curta

CloseDesk é uma aplicação web full stack para gestão individual de chamados,
com autenticação JWT, CRUD completo, busca, filtros, paginação, dashboard,
isolamento de dados por usuário, testes automatizados, CI e deploy em produção.

## Currículo

**CloseDesk — Aplicação full stack de gestão de chamados**

- Desenvolvi uma aplicação web full stack com React, TypeScript, Django REST
  Framework e PostgreSQL para gestão individual de chamados.
- Implementei autenticação JWT, rotas protegidas, CRUD completo, busca,
  filtros, ordenação, paginação e dashboard com indicadores.
- Modelei isolamento de dados por usuário no backend, garantindo que uma pessoa
  autenticada acesse somente os próprios chamados.
- Estruturei testes de backend, frontend e E2E com pytest, Vitest, Testing
  Library, MSW e Playwright.
- Configurei documentação OpenAPI/Swagger, integração contínua com GitHub
  Actions e deploy em produção com Render, Render PostgreSQL e Vercel.

## LinkedIn

Concluí e publiquei o CloseDesk, uma aplicação full stack para gestão
individual de chamados de clientes.

O projeto foi desenvolvido de ponta a ponta, desde requisitos e roadmap até API,
frontend, testes, CI, documentação e deploy em produção.

Principais pontos técnicos:

- React, TypeScript e Vite no frontend.
- Django, Django REST Framework e PostgreSQL no backend.
- Autenticação JWT com access token e refresh token.
- CRUD completo de chamados com isolamento de dados por usuário.
- Busca, filtros, ordenação, paginação e dashboard.
- Testes automatizados com pytest, Vitest, Testing Library, MSW e Playwright.
- CI com GitHub Actions.
- Deploy com Render, Render PostgreSQL e Vercel.

Também validei os principais fluxos em produção: primeiro acesso, gestão de
chamados, consulta avançada, isolamento entre usuários e sessão/segurança.

Demo: https://close-deskk.vercel.app  
Repositório: https://github.com/lendrw/close-desk

## Portfólio

CloseDesk é um MVP full stack para gestão individual de chamados. A aplicação
permite que uma pessoa usuária cadastre uma conta, faça login, crie chamados,
acompanhe status, prioridades e prazos, consulte indicadores no dashboard e use
busca, filtros, ordenação e paginação.

O foco técnico do projeto foi construir uma aplicação completa, testável e
publicada em produção. O backend concentra autenticação, autorização,
validações, regras de negócio e persistência. O frontend consome a API REST,
gerencia estados de interface e protege rotas autenticadas.

Um dos principais cuidados foi o isolamento de dados: cada usuário acessa
somente os próprios chamados, e tentativas de consultar, editar ou excluir
chamados de outra pessoa não expõem a existência do recurso.

O projeto conta com documentação de requisitos, roadmap, ADRs, OpenAPI,
testes automatizados, testes E2E, integração contínua e deploy em produção.

## Pontos para entrevista

- Por que autenticação por e-mail foi escolhida no MVP.
- Como o isolamento por usuário foi aplicado no backend.
- Por que o access token fica em memória e o refresh token em `sessionStorage`.
- Como a estrutura padronizada de erros melhora a integração com o frontend.
- Como os testes cobrem regras de negócio, interface e fluxo E2E.
- Quais decisões foram deixadas como evolução futura para manter o escopo do
  MVP controlado.
