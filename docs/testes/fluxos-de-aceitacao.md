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

- [ ] Acessar a aplicação sem sessão ativa.
- [ ] Confirmar redirecionamento para login ao acessar área protegida.
- [ ] Criar uma nova conta com nome, e-mail e senha válidos.
- [ ] Confirmar que a senha não aparece em respostas ou telas.
- [ ] Entrar com a conta criada.
- [ ] Confirmar acesso ao dashboard autenticado.
- [ ] Confirmar exibição do nome da pessoa usuária autenticada.

Resultado:

- [ ] Aprovado
- [ ] Reprovado

Observações:

-

## 2. Gestão completa de chamado

Objetivo: validar criação, consulta, edição, alteração de status e exclusão de chamado.

Checklist:

- [ ] Criar um chamado com título, descrição, cliente, prioridade e prazo.
- [ ] Confirmar redirecionamento para a lista de chamados.
- [ ] Confirmar que o chamado aparece na lista.
- [ ] Abrir os detalhes do chamado.
- [ ] Editar os dados do chamado.
- [ ] Confirmar que os detalhes refletem os dados editados.
- [ ] Alterar o status do chamado.
- [ ] Confirmar que o novo status aparece nos detalhes.
- [ ] Excluir o chamado.
- [ ] Confirmar a exclusão.
- [ ] Confirmar retorno para a lista.
- [ ] Confirmar que o chamado excluído não aparece mais.

Resultado:

- [ ] Aprovado
- [ ] Reprovado

Observações:

-

## 3. Consulta avançada

Objetivo: validar busca, filtros, ordenação e paginação em conjunto.

Checklist:

- [ ] Criar chamados suficientes para haver paginação.
- [ ] Buscar por termo presente no título.
- [ ] Buscar por termo presente no nome do cliente.
- [ ] Filtrar por status.
- [ ] Filtrar por prioridade.
- [ ] Ordenar por data de criação crescente.
- [ ] Ordenar por data de criação decrescente.
- [ ] Navegar para a próxima página mantendo busca, filtros e ordenação.
- [ ] Voltar para a página anterior mantendo busca, filtros e ordenação.
- [ ] Confirmar estado vazio quando nenhum chamado corresponde aos critérios.

Resultado:

- [ ] Aprovado
- [ ] Reprovado

Observações:

-

## 4. Isolamento entre usuários

Objetivo: validar que uma pessoa usuária não acessa dados de outra.

Checklist:

- [ ] Criar usuário A.
- [ ] Criar usuário B.
- [ ] Entrar como usuário A.
- [ ] Criar chamado do usuário A.
- [ ] Sair.
- [ ] Entrar como usuário B.
- [ ] Confirmar que o chamado do usuário A não aparece na lista do usuário B.
- [ ] Tentar acessar diretamente a URL do chamado do usuário A.
- [ ] Confirmar resposta de recurso não encontrado ou acesso negado.
- [ ] Confirmar que dashboard do usuário B não contabiliza chamados do usuário A.

Resultado:

- [ ] Aprovado
- [ ] Reprovado

Observações:

-

## 5. Sessão e segurança

Objetivo: validar comportamento de autenticação, sessão e mensagens seguras.

Checklist:

- [ ] Entrar com credenciais válidas.
- [ ] Confirmar armazenamento da sessão no frontend.
- [ ] Sair da aplicação.
- [ ] Confirmar remoção da sessão local.
- [ ] Tentar acessar rota protegida sem sessão.
- [ ] Confirmar redirecionamento para login.
- [ ] Entrar com credenciais inválidas.
- [ ] Confirmar mensagem genérica sem enumeração de usuário.
- [ ] Confirmar que tokens não aparecem na interface.
- [ ] Confirmar que respostas de erro seguem o padrão documentado.

Resultado:

- [ ] Aprovado
- [ ] Reprovado

Observações:

-

## Evidências

Registre aqui comandos, prints, URLs locais, observações ou problemas encontrados durante a validação.

-