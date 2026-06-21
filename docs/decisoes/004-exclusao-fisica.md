# ADR 004 — Exclusão física de chamados

**Status:** aceita
**Data:** 21 de junho de 2026

## Contexto

O usuário precisa excluir chamados próprios. Existem duas abordagens comuns:

- Exclusão física: o registro é removido do banco.
- Exclusão lógica: o registro permanece armazenado e recebe uma marca de exclusão.

A exclusão lógica exige regras adicionais para consultas, indicadores, restauração e auditoria. Esses comportamentos não fazem parte do MVP.

## Decisão

O MVP utilizará exclusão física de chamados.

- O registro será removido permanentemente do banco.
- A interface solicitará confirmação antes da exclusão.
- Cancelar a confirmação não fará requisição de exclusão.
- Somente o proprietário poderá excluir o chamado.
- Após a exclusão, listas e indicadores não considerarão o registro removido.

## Consequências

### Positivas

- Implementação e consultas mais simples.
- Não exige filtros globais para esconder registros excluídos.
- Mantém o escopo compatível com o MVP.
- Facilita compreender o comportamento do endpoint `DELETE`.

### Negativas

- O chamado não poderá ser restaurado.
- Não haverá auditoria do registro excluído.
- Uma exclusão acidental dependerá apenas da confirmação da interface.
- Uma futura exclusão lógica exigirá alterações no modelo e nas consultas.

## Evolução futura

Quando houver requisitos de auditoria, histórico ou restauração, a decisão deverá ser revisada. Uma evolução poderá adicionar exclusão lógica e registro de eventos.

## Requisitos relacionados

- RF-TIC-05 — Excluir chamado.
- RN-06 — Exclusão.
- RN-07 — Isolamento.
