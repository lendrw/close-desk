# Fluxos de aceitação

Este documento registra a validação manual dos fluxos principais do CloseDesk como sistema integrado.

## Ambiente de validação

- Backend: <https://close-desk.onrender.com>
- Frontend: <https://close-deskk.vercel.app>
- Banco de dados: Render PostgreSQL
- Navegador: Brave
- Data: 23 e 24 de julho de 2026
- Responsável: Leandro

## 1. Primeiro acesso

Objetivo: validar que uma pessoa usuária consegue iniciar o uso do sistema sem dados prévios.

Checklist:

- [x] Acessar a aplicação sem sessão ativa.
- [x] Confirmar redirecionamento para login ao acessar área protegida.
- [x] Criar uma nova conta com nome, e-mail e senha válidos.
- [x] Confirmar que a senha não aparece em respostas ou telas.
- [x] Entrar com a conta criada.
- [x] Confirmar acesso ao dashboard autenticado.
- [x] Confirmar exibição do nome da pessoa usuária autenticada.

Resultado:

- [x] Aprovado
- [ ] Reprovado

Observações:

- Fluxo validado localmente com backend Django em `127.0.0.1:8000` e frontend Vite em `localhost:5173`.
- Criado `frontend/.env` local com `VITE_API_BASE_URL=http://localhost:8000/api` para integração com a API.
- Durante a validação, foi corrigido o redirecionamento após login bem-sucedido.
- Fluxo revalidado com sucesso no ambiente publicado.

## 2. Gestão completa de chamado

Objetivo: validar criação, consulta, edição, alteração de status e exclusão de chamado.

Checklist:

- [x] Criar um chamado com título, descrição, cliente, prioridade e prazo.
- [x] Confirmar redirecionamento para a lista de chamados.
- [x] Confirmar que o chamado aparece na lista.
- [x] Abrir os detalhes do chamado.
- [x] Editar os dados do chamado.
- [x] Confirmar que os detalhes refletem os dados editados.
- [x] Alterar o status do chamado.
- [x] Confirmar que o novo status aparece nos detalhes.
- [x] Excluir o chamado.
- [x] Confirmar a exclusão.
- [x] Confirmar retorno para a lista.
- [x] Confirmar que o chamado excluído não aparece mais.

Resultado:

- [x] Aprovado
- [ ] Reprovado

Observações:

- Fluxo validado com sucesso no ambiente publicado.

## 3. Consulta avançada

Objetivo: validar busca, filtros, ordenação e paginação em conjunto.

Checklist:

- [x] Criar chamados suficientes para haver paginação.
- [x] Buscar por termo presente no título.
- [x] Buscar por termo presente no nome do cliente.
- [x] Filtrar por status.
- [x] Filtrar por prioridade.
- [x] Ordenar por data de criação crescente.
- [x] Ordenar por data de criação decrescente.
- [x] Navegar para a próxima página mantendo busca, filtros e ordenação.
- [x] Voltar para a página anterior mantendo busca, filtros e ordenação.
- [x] Confirmar estado vazio quando nenhum chamado corresponde aos critérios.

Resultado:

- [x] Aprovado
- [ ] Reprovado

Observações:

- Fluxo validado localmente com massa de chamados suficiente para paginação.
- Busca, filtros, ordenação, paginação e estado vazio funcionaram conforme esperado.
- Fluxo revalidado com sucesso no ambiente publicado.

## 4. Isolamento entre usuários

Objetivo: validar que uma pessoa usuária não acessa dados de outra.

Checklist:

- [x] Criar usuário A.
- [x] Criar usuário B.
- [x] Entrar como usuário A.
- [x] Criar chamado do usuário A.
- [x] Sair.
- [x] Entrar como usuário B.
- [x] Confirmar que o chamado do usuário A não aparece na lista do usuário B.
- [x] Tentar acessar diretamente a URL do chamado do usuário A.
- [x] Confirmar resposta de recurso não encontrado ou acesso negado.
- [x] Confirmar que dashboard do usuário B não contabiliza chamados do usuário A.

Resultado:

- [x] Aprovado
- [ ] Reprovado

Observações:

- Fluxo validado com sucesso no ambiente publicado.

## 5. Sessão e segurança

Objetivo: validar comportamento de autenticação, sessão e mensagens seguras.

Checklist:

- [x] Entrar com credenciais válidas.
- [x] Confirmar armazenamento da sessão no frontend.
- [x] Sair da aplicação.
- [x] Confirmar remoção da sessão local.
- [x] Tentar acessar rota protegida sem sessão.
- [x] Confirmar redirecionamento para login.
- [x] Entrar com credenciais inválidas.
- [x] Confirmar mensagem genérica sem enumeração de usuário.
- [x] Confirmar que tokens não aparecem na interface.
- [x] Confirmar que respostas de erro seguem o padrão documentado.

Resultado:

- [x] Aprovado
- [ ] Reprovado

Observações:

- Encerramento de sessão validado localmente pela interface.
- Restauração de sessão validada após recarregar rota protegida.
- Falha de renovação/expiração coberta pela suíte automatizada de sessão.
- Mensagens de erro validadas localmente em login inválido, cadastro duplicado, chamado inválido e recurso indisponível.
- Cadastro duplicado exibe mensagem específica associada ao campo de e-mail.
- Estrutura padronizada de erros da API coberta pela suíte automatizada do backend.
- Tokens não foram exibidos na interface, em mensagens de erro ou no console.
- `accessToken` não foi persistido em `sessionStorage` ou `localStorage`.
- Apenas o `refreshToken` foi encontrado em `sessionStorage`, conforme estratégia atual de sessão.
- Fluxo revalidado com sucesso no ambiente publicado.

## 6. Recuperação de senha e verificação de e-mail

Objetivo: validar que a pessoa usuária consegue recuperar acesso e confirmar
posse do e-mail sem exposição de tokens, senhas ou segredos.

Checklist:

- [x] Criar uma conta nova.
- [x] Confirmar que o cadastro envia instrução de verificação de e-mail.
- [x] Confirmar que o usuário entra após cadastro mesmo com e-mail pendente.
- [x] Confirmar que a interface exibe o estado de e-mail pendente.
- [x] Solicitar reenvio de verificação para uma conta com e-mail pendente.
- [x] Acessar o link de verificação recebido por e-mail.
- [x] Confirmar que o e-mail passa a aparecer como verificado na interface.
- [x] Solicitar recuperação de senha por e-mail.
- [x] Confirmar que a solicitação retorna mensagem genérica.
- [x] Acessar o link de redefinição recebido por e-mail.
- [x] Definir nova senha válida.
- [x] Entrar com a nova senha.
- [x] Confirmar que a senha antiga não autentica mais.
- [x] Confirmar que tokens de verificação e recuperação não aparecem na interface.

Resultado:

- [x] Aprovado
- [ ] Reprovado

Observações:

- Fluxo validado no ambiente publicado em 24 de julho de 2026.
- Recuperação de senha testada com envio real de e-mail, redefinição de senha e
  login com a nova senha.
- Reenvio de verificação testado em conta existente com e-mail pendente.
- Após confirmação pelo link de verificação, a interface passou a exibir o
  estado de e-mail verificado.
- Em ambiente local, usar `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`
  para copiar os links exibidos no terminal do backend.

## Evidências

Registre aqui comandos, prints, URLs locais, observações ou problemas encontrados durante a validação.

- Validação manual em produção executada com sucesso em 23 de julho de 2026:
  - Frontend: <https://close-deskk.vercel.app>
  - Backend: <https://close-desk.onrender.com>
  - Health check: <https://close-desk.onrender.com/api/health/>
  - Documentação da API: <https://close-desk.onrender.com/api/docs/>
  - Fluxos 1 a 5 aprovados no ambiente publicado.

- Validação manual em produção executada com sucesso em 24 de julho de 2026:
  - Fluxo 6 aprovado no ambiente publicado.
  - Recuperação de senha validada com envio real de e-mail e nova senha.
  - Verificação de e-mail validada com reenvio para conta pendente.
  - Estado de e-mail verificado confirmado na interface após uso do link.

- Validação automatizada local executada com sucesso:
  - Backend: `python -m ruff check .`
  - Backend: `python -m ruff format --check .`
  - Backend: `python manage.py check --settings=config.settings_test`
  - Backend: `python -m pytest -q`
  - Frontend: `npm run build`
  - Frontend: `npm run lint`
  - Frontend: `npm run test`
  - Frontend: `npm run format:check`

- Fluxo crítico automatizado com Playwright:
  - `npm run e2e`
  - Smoke test da home.
  - Fluxo de primeiro acesso com cadastro, login e acesso ao dashboard.

- Revisão de configuração local executada:
  - `DJANGO_ALLOWED_HOSTS` configurado por variável de ambiente.
  - `CORS_ALLOWED_ORIGINS` configurado por variável de ambiente.
  - CORS restrito às rotas `/api/`.
  - Variáveis obrigatórias do backend falham explicitamente quando ausentes.
  - `VITE_API_BASE_URL` documentado em `frontend/.env.example`.

- Responsividade revisada manualmente a partir de 360 px:
  - Home, autenticação, dashboard, lista, criação, detalhes, edição e exclusão permaneceram utilizáveis.
  - Não foi identificado scroll horizontal indevido.
  - Formulários, filtros, paginação e ações principais permaneceram acessíveis.

- Navegação por teclado e semântica revisadas manualmente:
  - Foco visível e ordem de navegação lógica nas telas principais.
  - Campos de formulário mantêm rótulos associados.
  - Mensagens de validação ficam associadas aos respectivos campos.
  - Links, botões, filtros, paginação e confirmação de exclusão funcionam por teclado.

- Revisão de código morto e logs de depuração executada:
  - Não foram encontrados `console.log`, `debugger`, `print`, `TODO`, `FIXME`, `breakpoint` ou `pdb.set_trace` no código versionado revisado.

- OpenAPI revisado com `python manage.py spectacular --settings=config.settings_test --file /tmp/closedesk-schema.yml --validate`.
- READMEs da raiz, backend e frontend atualizados para refletir o estado integrado do projeto.
- Decisões técnicas revisadas sem necessidade de novo ADR nesta etapa.
