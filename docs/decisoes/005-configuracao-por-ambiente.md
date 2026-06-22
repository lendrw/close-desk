# ADR 005 — Configuração por ambiente

**Status:** aceita
**Data:** 22 de junho de 2026

## Contexto

O backend precisa variar segredos, modo de depuração, hosts e conexão com o banco entre ambientes.

Uma opção seria criar imediatamente módulos separados para desenvolvimento, testes e produção. Neste estágio, esses arquivos teriam grande duplicação e ainda não existem necessidades específicas suficientes para justificá-los.

## Decisão

O projeto manterá um único módulo `config.settings`, configurado por variáveis de ambiente.

- Segredos e credenciais são obrigatórios.
- `DEBUG` é convertido explicitamente para booleano.
- Hosts permitidos são fornecidos como lista separada por vírgulas.
- Valores obrigatórios ausentes produzem mensagens claras.
- O `.env` local permanece fora do Git.
- O ambiente de produção fornecerá as variáveis pela plataforma de hospedagem.
- Os testes utilizam `config.settings_test`, que herda a configuração base e substitui somente o necessário.

## Consequências

### Positivas

- Evita duplicação prematura.
- Mantém desenvolvimento e produção próximos.
- Facilita deploy por variáveis de ambiente.
- Falhas de configuração aparecem cedo.

### Negativas

- O processo que inicia a aplicação precisa fornecer as variáveis.
- Diferenças futuras entre ambientes podem exigir módulos separados.
- O `.env` precisa ser carregado pelo terminal no desenvolvimento atual.

## Critério de revisão

Esta decisão deverá ser revisada quando a produção exigir configurações que não possam ser expressas claramente apenas por variáveis de ambiente.

## Requisitos relacionados

- RNF-01 — Segurança.
- RNF-09 — Observabilidade.
- RNF-10 — Documentação.
