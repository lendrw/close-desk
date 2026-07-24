# Feedback pós-publicação

Este documento registra problemas identificados após a publicação do CloseDesk e
organiza as decisões de correção. O objetivo é manter rastreabilidade entre
feedback real de uso, priorização, implementação e validação.

## Contexto

- Data do feedback: 24 de julho de 2026.
- Ambiente: aplicação publicada após divulgação do projeto.
- Origem: pessoa externa testando o fluxo público da aplicação.
- Escopo: experiência de criação de conta, acesso e confiança no fluxo de
  autenticação.

## Problemas identificados

### P01 — Cadastro não iniciava sessão automaticamente

Ao criar uma conta, a pessoa usuária precisava ir manualmente para o login e
entrar com as credenciais recém-criadas.

Impacto:

- Aumentava atrito no primeiro acesso.
- Quebrava a expectativa comum de entrar direto após criar conta.
- Tornava o fluxo inicial menos fluido para demonstração.

Decisão:

- Após cadastro válido, autenticar automaticamente com o e-mail e senha
  informados.
- Salvar os tokens de sessão conforme a estratégia já adotada.
- Carregar o usuário atual e redirecionar para o dashboard.

Status:

- Corrigido no código.
- Pendente de deploy e revalidação no ambiente publicado.

Evidências esperadas:

- Teste automatizado do formulário de cadastro validando redirecionamento para
  o dashboard.
- Validação manual do primeiro acesso em produção após deploy.

### P02 — Não havia recuperação de senha

Ao esquecer a senha ou não salvar a senha sugerida pelo navegador, a pessoa
usuária não tinha um caminho de recuperação de acesso.

Impacto:

- Usuário podia perder acesso à conta.
- Reduzia a confiança no uso real da aplicação.
- Tornava o cadastro com senha gerada pelo navegador mais arriscado.

Decisão proposta:

- Implementar fluxo de recuperação de senha por e-mail.
- A solicitação deve retornar mensagem genérica, sem revelar se o e-mail existe.
- O link de redefinição deve usar token temporário e seguro.
- A nova senha deve passar pelas mesmas validações do cadastro.
- Tokens, senhas e dados sensíveis não devem aparecer na interface, nos logs ou
  nas respostas.

Status:

- Planejado.

Evidências esperadas:

- Testes de API para solicitação e confirmação de redefinição de senha.
- Testes de frontend para formulário de solicitação e formulário de nova senha.
- Validação manual do fluxo em ambiente local e publicado.

### P03 — Não havia verificação de e-mail

O sistema permitia cadastro com e-mail informado, mas não confirmava que a pessoa
usuária tinha acesso ao endereço utilizado.

Impacto:

- Reduzia a confiabilidade do cadastro.
- Permitiria contas com e-mails digitados incorretamente.
- Dificultaria fluxos futuros dependentes de e-mail, como recuperação de senha e
  notificações.

Decisão proposta:

- Implementar verificação de e-mail não bloqueante no primeiro acesso.
- A pessoa usuária deve conseguir entrar após o cadastro.
- A interface deve indicar quando o e-mail ainda não foi verificado.
- O link de verificação deve usar token temporário e seguro.
- Confirmar o e-mail deve atualizar o estado da conta.

Status:

- Planejado.

Evidências esperadas:

- Testes de API para envio e confirmação da verificação.
- Testes de frontend para indicação de e-mail pendente/verificado.
- Validação manual do fluxo em ambiente local e publicado.

## Priorização

| Prioridade | Problema | Motivo |
|---|---|---|
| Alta | P01 — Cadastro não iniciava sessão automaticamente | Afeta diretamente o primeiro acesso e a demonstração do produto. |
| Alta | P02 — Não havia recuperação de senha | Pode impedir o usuário de voltar a acessar a própria conta. |
| Média | P03 — Não havia verificação de e-mail | Aumenta confiança e prepara fluxos futuros, mas não deve bloquear o uso inicial. |

## Plano de execução

1. Corrigir o redirecionamento/autenticação após cadastro.
2. Implementar recuperação de senha por e-mail.
3. Implementar verificação de e-mail não bloqueante.
4. Atualizar documentação da API, README, roadmap e fluxos de aceitação.
5. Revalidar os fluxos em ambiente publicado.

## Critérios gerais de qualidade

- Respostas relacionadas a recuperação de senha não devem permitir enumeração de
  usuários.
- Tokens de recuperação e verificação não devem ser persistidos no frontend.
- Senhas e tokens não devem aparecer em mensagens, logs ou respostas públicas.
- Fluxos devem ter testes automatizados no backend e no frontend.
- Documentação deve explicar claramente variáveis de ambiente necessárias para
  envio de e-mail.
