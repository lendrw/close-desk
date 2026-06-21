# ADR 003 — Isolamento dos chamados por usuário

**Status:** aceita
**Data:** 21 de junho de 2026

## Contexto

No MVP, cada usuário gerencia exclusivamente os próprios chamados. O sistema não possui organizações, equipes ou compartilhamento de chamados.

Filtrar dados somente no frontend não oferece segurança, pois requisições podem ser feitas diretamente à API.

## Decisão

O isolamento será aplicado no backend em todas as operações.

- Todo chamado terá um proprietário obrigatório em `created_by`.
- O proprietário será definido pelo usuário autenticado durante a criação.
- O cliente não poderá escolher ou alterar `created_by`.
- Listagens começarão por um conjunto filtrado pelo usuário autenticado.
- Detalhes, edição e exclusão utilizarão o mesmo conjunto filtrado.
- Busca, filtros, paginação, ordenação e dashboard respeitarão esse isolamento.
- Um chamado inexistente e um chamado de outro usuário terão resposta equivalente para não revelar sua existência.

## Consequências

### Positivas

- Evita acesso e alteração de dados entre usuários.
- Centraliza a autorização no backend.
- Reduz o risco de uma rota esquecer a regra de isolamento.
- Facilita testar a segurança com dois usuários.

### Negativas

- Toda nova consulta relacionada a chamados deve aplicar o filtro de proprietário.
- Testes de permissão serão obrigatórios para novos endpoints.
- O modelo precisará evoluir quando organizações e equipes forem adicionadas.

## Alternativa rejeitada

Permitir que o frontend envie o identificador do proprietário foi rejeitado porque possibilitaria associar chamados a outros usuários.

## Requisitos relacionados

- RF-TIC-01 a RF-TIC-10.
- RF-DAS-01 — Exibir indicadores.
- RN-01 — Propriedade dos dados.
- RN-07 — Isolamento.
- RNF-01 — Segurança.
