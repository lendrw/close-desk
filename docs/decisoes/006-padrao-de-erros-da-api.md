# ADR 006 — Padrão de erros da API

**Status:** aceita

**Data:** 24 de junho de 2026

## Contexto

O frontend precisa tratar erros de validação, autenticação, autorização, recurso ausente e falha interna sem depender dos diferentes formatos produzidos pelo Django REST Framework.

Um contrato previsível também facilita testes automatizados, documentação OpenAPI e evolução da API.

## Decisão

Toda resposta de erro da API seguirá esta estrutura:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Os dados enviados são inválidos.",
    "details": {
      "email": ["Informe um endereço de e-mail válido."]
    }
  }
}
```

### Campos

- `code`: identificador estável para tratamento pelo frontend.
- `message`: explicação legível para o usuário.
- `details`: objeto com informações adicionais; será vazio quando não houver detalhes.

### Códigos iniciais

| Situação | HTTP | Código |
|---|---:|---|
| Dados inválidos | 400 | `validation_error` |
| Falha de autenticação | 401 | `authentication_error` |
| Acesso negado | 403 | `permission_denied` |
| Recurso não encontrado | 404 | `not_found` |
| Método não permitido | 405 | `method_not_allowed` |
| Falha inesperada | 500 | `internal_error` |

Erros associados a campos usarão listas de mensagens dentro de `details`. Erros gerais de validação usarão a chave `non_field_errors`.

Respostas de erro não devem expor stack traces, credenciais, tokens ou detalhes internos.

## Consequências

### Positivas

- O frontend pode tratar erros por códigos estáveis.
- Mensagens e detalhes possuem posições previsíveis.
- Os testes podem verificar um único contrato.
- Falhas internas não expõem informações sensíveis.

### Negativas

- As exceções do framework precisam ser normalizadas.
- Novos tipos de erro podem exigir novos códigos documentados.
- Mensagens originais do framework podem precisar ser adaptadas.

## Critério de revisão

Esta decisão deverá ser revisada se a API precisar representar erros em lote, múltiplos idiomas ou identificadores de rastreamento.

## Requisitos relacionados

- RNF-01 — Segurança.
- RNF-02 — Consistência de erros.
- RNF-03 — Testabilidade.
- RNF-09 — Observabilidade.
- RNF-10 — Documentação.
