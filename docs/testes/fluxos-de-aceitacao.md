# Fluxos de aceitação

Este documento registra a validação manual dos fluxos principais do CloseDesk como sistema integrado.

## Ambiente de validação

- Backend:
- Frontend:
- Banco de dados:
- Navegador:
- Data:
- Responsável:

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

-

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

-

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
- [ ] Confirmar que tokens não aparecem na interface.
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

## Evidências

Registre aqui comandos, prints, URLs locais, observações ou problemas encontrados durante a validação.

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
