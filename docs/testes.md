# Estratégia de Testes

## Objetivo

Usar testes para validar comportamentos importantes, prevenir regressões e apoiar mudanças seguras no projeto.

Os testes devem verificar resultados observáveis, evitando dependência excessiva dos detalhes internos da implementação.

## Backend

Ferramentas previstas:

- pytest
- pytest-django

Tipos de teste:

### Unidade e domínio

Validam regras isoladas, como:

- Valores padrão dos chamados.
- Status e prioridades permitidos.
- Validação de prazos.
- Limites dos campos.

### API e integração

Validam o comportamento dos endpoints com o banco de testes:

- Cadastro e autenticação.
- CRUD de chamados.
- Busca, filtros e paginação.
- Dashboard.
- Formato das respostas e erros.

### Permissões e segurança

Validam especialmente:

- Acesso sem autenticação.
- Isolamento entre usuários.
- Proteção dos campos automáticos.
- Ausência de dados sensíveis nas respostas.

Estrutura prevista:

```text
backend/
└── tests/
    ├── accounts/
    ├── tickets/
    └── test_health.py
```

## Frontend

Ferramentas previstas:

- Vitest
- Testing Library
- MSW

Tipos de teste:

### Componentes e páginas

Validam:

- Renderização e formulários.
- Mensagens de validação.
- Estados de carregamento, erro e vazio.
- Navegação e rotas protegidas.

### Integração com a API

O MSW simulará respostas para validar autenticação, chamados e tratamento de erros.

Estrutura prevista:

```text
frontend/
└── src/
    ├── test/
    │   ├── handlers/
    │   └── server.ts
    └── features/
        └── nome-da-feature/
            └── __tests__/
```

## Ponta a ponta

Após a integração, um fluxo crítico poderá ser automatizado:

1. Cadastrar usuário.
2. Fazer login.
3. Criar, consultar e editar um chamado.
4. Excluir o chamado.
5. Fazer logout.

Esse nível é desejável, mas não bloqueia a primeira versão funcional.

## Convenções

- Cada teste deve descrever um comportamento.
- Testes não devem depender da ordem de execução.
- Cada teste deve preparar os próprios dados.
- Correções de bugs devem incluir um teste que reproduza o problema.
- Nomes devem explicar o cenário e o resultado esperado.

## Relação com os requisitos

Quando aplicável, os testes devem mencionar o requisito relacionado, como `RF-AUT-01` ou `RN-07`.

A cobertura será um indicador auxiliar. A prioridade será cobrir regras de negócio, permissões e fluxos críticos.
