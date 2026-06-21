# ADR 001 — Autenticação por e-mail

**Status:** aceita
**Data:** 21 de junho de 2026

## Contexto

O Django utiliza nome de usuário como identificador por padrão. No CloseDesk, os requisitos definem cadastro e login por e-mail, e cada e-mail deve ser único sem diferenciar letras maiúsculas de minúsculas.

Alterar o modelo de usuário depois das primeiras migrações aumenta significativamente a complexidade do projeto.

## Decisão

O backend utilizará um modelo de usuário customizado desde o início.

- O e-mail será o identificador utilizado no login.
- O e-mail será obrigatório e único.
- Comparações de unicidade não diferenciarão letras maiúsculas de minúsculas.
- O modelo será configurado antes da primeira migração.
- Senhas serão armazenadas exclusivamente pelos mecanismos seguros do Django.

## Consequências

### Positivas

- O modelo corresponde aos requisitos do produto.
- O login fica mais simples para o usuário.
- Evita uma migração complexa no futuro.
- Permite controlar explicitamente os campos da conta.

### Negativas

- Exige configuração adicional no início.
- O manager e os formulários administrativos precisarão conhecer o modelo customizado.
- A unicidade sem diferenciar maiúsculas exige cuidado no banco e na validação.

## Requisitos relacionados

- RF-AUT-01 — Cadastrar usuário.
- RF-AUT-02 — Realizar login.
- RNF-01 — Segurança.
