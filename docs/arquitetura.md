# Arquitetura do CloseDesk

## Visão geral

O CloseDesk utiliza uma arquitetura cliente-servidor. O frontend React é responsável pela interface, enquanto a API Django concentra autenticação, regras de negócio, permissões e persistência.

```mermaid
flowchart LR
    U[Usuário no navegador]

    subgraph F[Frontend]
        R[React + TypeScript]
        H[Cliente HTTP]
        S[Estado da sessão]
    end

    subgraph B[Backend]
        A[API Django REST Framework]
        J[Autenticação JWT]
        N[Regras de negócio e permissões]
    end

    D[(PostgreSQL)]

    U --> R
    R --> H
    R --> S
    H -->|HTTPS + JSON| A
    A --> J
    A --> N
    J --> D
    N --> D
```

## Responsabilidades

### Frontend

- Renderizar páginas e componentes.
- Validar formulários para melhorar a experiência.
- Manter o estado da interface e da sessão.
- Consumir a API e apresentar carregamento, sucesso e erro.
- Proteger a navegação de usuários sem sessão.

O frontend não decide se um usuário pode acessar determinado chamado. Essa autorização pertence ao backend.

### Backend

- Cadastrar e autenticar usuários.
- Emitir e validar tokens JWT.
- Validar todos os dados recebidos.
- Aplicar regras de negócio.
- Garantir o isolamento dos chamados por usuário.
- Consultar e persistir dados no PostgreSQL.
- Produzir respostas e erros consistentes.
- Publicar a documentação OpenAPI.

### Banco de dados

- Armazenar usuários e chamados.
- Preservar relacionamentos e restrições.
- Apoiar consultas, filtros, ordenação e indicadores.

O banco de dados não será acessado diretamente pelo frontend.

## Fluxo de uma requisição autenticada

```mermaid
sequenceDiagram
    actor U as Usuário
    participant F as React
    participant A as API Django
    participant D as PostgreSQL

    U->>F: Solicita a lista de chamados
    F->>A: GET /api/tickets/ com access token
    A->>A: Valida token e identifica o usuário
    A->>D: Consulta somente os chamados do usuário
    D-->>A: Retorna os dados
    A-->>F: Responde com JSON paginado
    F-->>U: Exibe a lista
```

## Princípios

- A API é a fonte de verdade das regras de negócio.
- Toda autorização é aplicada no backend.
- Cada usuário acessa somente os próprios chamados.
- O frontend e o backend se comunicam por JSON.
- Segredos permanecem no backend e fora do Git.
- As camadas podem ser testadas separadamente.
