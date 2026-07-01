# CloseDesk — Roadmap Final do MVP

**Versão:** 1.0  
**Status:** final — aprovado para execução futura  
**Data:** 21 de junho de 2026  
**Documento de referência:** [Especificação de requisitos](./requisitos.md)

## 1. Objetivo

Este roadmap transforma os requisitos aprovados em uma sequência de entregas verificáveis. Ele descreve o trabalho futuro, mas não inicia a implementação.

O projeto será desenvolvido como uma aplicação full stack com:

- React no frontend.
- Python, Django e Django REST Framework no backend.
- PostgreSQL como banco de dados.
- API REST autenticada com JWT.

O MVP será uma aplicação individual de gestão de chamados com isolamento de dados por usuário. Organizações, equipes e funcionalidades listadas como evoluções futuras não fazem parte deste roadmap.

## 2. Forma de trabalho

### Ordem recomendada

1. Preparar documentação e estrutura.
2. Construir e validar a API.
3. Construir o frontend sobre o contrato validado.
4. Integrar os dois lados.
5. Revisar qualidade, publicar e preparar o portfólio.

Essa ordem reduz retrabalho no frontend e facilita demonstrar cada incremento.

### Ciclo de desenvolvimento

Para cada comportamento crítico:

1. Escolher um requisito e um critério de aceitação.
2. Escrever um teste que falha pelo motivo esperado.
3. Implementar o mínimo necessário para o teste passar.
4. Refatorar sem alterar o comportamento.
5. Executar a suíte relacionada.
6. Atualizar a documentação afetada.
7. Criar um commit pequeno e descritivo.

### Convenção de progresso

- `[ ]` não iniciado.
- `[~]` em andamento.
- `[x]` concluído e validado.

Uma fase só deve ser marcada como concluída quando seu critério de saída tiver sido atendido.

## 3. Decisões técnicas

### Stack principal

| Camada | Tecnologia |
|---|---|
| Frontend | React com TypeScript |
| Backend | Python com Django |
| API | Django REST Framework |
| Banco de dados | PostgreSQL |
| Autenticação | JWT com access token e refresh token |

### Ferramentas previstas

| Finalidade | Escolha |
|---|---|
| Inicialização do frontend | Vite |
| Estilos | Tailwind CSS |
| Navegação | React Router |
| Cliente HTTP | Axios |
| Testes do backend | pytest e pytest-django |
| Testes do frontend | Vitest e Testing Library |
| Simulação da API | MSW |
| Filtros da API | django-filter |
| JWT | Simple JWT |
| Documentação da API | OpenAPI/Swagger |
| Qualidade Python | Ruff |
| Qualidade frontend | ESLint e Prettier |
| Integração contínua | GitHub Actions |

As versões serão fixadas no início da implementação e registradas no README. Alterações de ferramenta não podem modificar os requisitos do produto.

## 4. Fase 0 — Fundação do projeto

**Objetivo:** preparar uma base clara antes do primeiro código funcional.

Requisitos relacionados: RNF-03, RNF-10.

### Tarefas

- [x] Confirmar a especificação e este roadmap como documentos de referência.
- [x] Criar o README inicial com problema, público, escopo e stack.
- [x] Criar os diretórios `backend` e `frontend`.
- [x] Definir convenções de branches, commits e pull requests.
- [x] Criar `.gitignore` e modelos de variáveis de ambiente.
- [x] Definir a estrutura inicial de testes.
- [x] Criar um diagrama simples da arquitetura.
- [x] Registrar decisões arquiteturais curtas para:
  - autenticação por e-mail;
  - armazenamento dos tokens;
  - isolamento dos chamados por usuário;
  - exclusão física no MVP.
- [x] Relacionar os requisitos aos futuros testes por seus identificadores.

### Critério de saída

O repositório possui documentação inicial, estrutura definida e nenhuma credencial real versionada.

## 5. Fase 1 — Base do backend

**Objetivo:** disponibilizar uma API Django testável e configurável.

Requisitos relacionados: RF-OPE-01, RF-OPE-02, RNF-01 a RNF-03, RNF-09 e RNF-10.

### Tarefas

- [x] Criar o projeto Python e Django.
- [x] Criar os apps necessários, incluindo `accounts` e `tickets`.
- [x] Configurar Django REST Framework.
- [x] Configurar PostgreSQL.
- [x] Separar configurações de desenvolvimento, teste e produção quando necessário.
- [x] Carregar segredos e configurações por variáveis de ambiente.
- [x] Configurar CORS apenas para origens permitidas.
- [x] Criar um modelo de usuário customizado com e-mail como identificador de login.
- [x] Definir o modelo de usuário antes da primeira migração.
- [x] Configurar o ambiente de testes com pytest.
- [x] Criar teste de sanidade da API.
- [x] Escrever e implementar o health check.
- [x] Configurar a documentação OpenAPI/Swagger.
- [x] Definir uma estrutura consistente para erros da API.
- [x] Configurar lint e formatação do código Python.

### Testes mínimos

- [x] A aplicação Django inicia no ambiente de teste.
- [x] O health check responde com sucesso e não expõe informações sensíveis.
- [x] A documentação da API pode ser carregada.
- [x] Configurações obrigatórias ausentes falham de forma compreensível.

### Critério de saída

A API inicia com PostgreSQL, passa nos testes iniciais e oferece health check e documentação.

## 6. Fase 2 — Autenticação da API

**Objetivo:** entregar cadastro e sessão JWT com regras de segurança verificadas.

Requisitos relacionados: RF-AUT-01 a RF-AUT-06 e RNF-01 a RNF-03.

### Tarefas

- [x] Testar e implementar cadastro com nome, e-mail e senha.
- [x] Validar nome entre 2 e 100 caracteres.
- [x] Validar formato do e-mail.
- [x] Garantir unicidade de e-mail sem diferenciar maiúsculas de minúsculas.
- [x] Validar senha com no mínimo 8 caracteres.
- [x] Garantir que a senha seja armazenada pelo mecanismo seguro do Django.
- [x] Garantir que a senha nunca apareça nas respostas.
- [x] Testar e implementar login por e-mail e senha.
- [x] Retornar mensagem genérica para credenciais inválidas.
- [x] Configurar emissão de access token e refresh token.
- [x] Testar e implementar renovação do access token.
- [x] Testar e implementar o endpoint do usuário atual.
- [x] Proteger o endpoint do usuário atual.
- [x] Documentar os endpoints e exemplos de erro.

### Testes mínimos

- [x] Cadastro válido.
- [x] Campos obrigatórios ausentes.
- [x] Nome fora dos limites.
- [x] E-mail inválido.
- [x] E-mail duplicado com variação de maiúsculas.
- [x] Senha curta.
- [x] Ausência da senha na resposta.
- [x] Login válido.
- [x] Login inválido sem enumeração de usuário.
- [x] Renovação válida e inválida.
- [x] Consulta do usuário atual com e sem token.

### Critério de saída

Todos os endpoints de autenticação previstos no contrato estão testados, documentados e protegidos corretamente.

## 7. Fase 3 — Domínio de chamados

**Objetivo:** modelar as regras centrais antes de expor o CRUD.

Requisitos relacionados: RF-TIC-01, RN-01 a RN-07.

### Tarefas

- [x] Escrever os testes do modelo de chamado.
- [x] Criar o modelo `Ticket`.
- [x] Implementar título, descrição e nome do cliente.
- [x] Implementar escolhas de status.
- [x] Implementar escolhas de prioridade.
- [x] Definir status padrão como `open`.
- [x] Definir prioridade padrão como `medium`.
- [x] Implementar prazo opcional.
- [x] Implementar relacionamento obrigatório com o usuário proprietário.
- [x] Implementar datas automáticas de criação e atualização.
- [x] Validar tamanhos mínimos e máximos.
- [x] Validar prazo na criação e na alteração.
- [x] Criar e revisar a migração.

### Testes mínimos

- [x] Campos obrigatórios e opcionais.
- [x] Valores padrão.
- [x] Status e prioridades permitidos.
- [x] Rejeição de escolhas inválidas.
- [x] Relacionamento com o proprietário.
- [x] Datas automáticas.
- [x] Prazo atual, futuro, passado e prazo já vencido não alterado.

### Critério de saída

O modelo representa todas as regras documentadas e sua migração pode ser aplicada em um banco limpo.

## 8. Fase 4 — CRUD e isolamento da API

**Objetivo:** permitir que cada usuário gerencie somente os próprios chamados.

Requisitos relacionados: RF-TIC-01 a RF-TIC-06, RN-01, RN-06, RN-07 e RNF-01 a RNF-03.

### Tarefas

- [x] Testar e implementar criação de chamado.
- [x] Preencher `created_by` pelo usuário autenticado.
- [x] Impedir definição de campos automáticos pelo cliente.
- [x] Testar e implementar listagem.
- [x] Testar e implementar detalhes.
- [x] Testar e implementar edição parcial.
- [x] Testar explicitamente a alteração de status.
- [x] Testar e implementar exclusão física.
- [x] Exigir autenticação em todas as rotas de chamados.
- [x] Filtrar o conjunto base pelo usuário autenticado.
- [x] Retornar resposta equivalente para recurso inexistente ou pertencente a outro usuário.
- [x] Aplicar a estrutura padronizada de erros.
- [x] Documentar exemplos de requisição e resposta.

### Testes mínimos

- [x] CRUD completo do próprio chamado.
- [x] Rejeição de usuário não autenticado.
- [x] Rejeição de campos inválidos.
- [x] Imutabilidade de `created_by` e `created_at`.
- [x] Atualização automática de `updated_at`.
- [x] Bloqueio de leitura, edição e exclusão entre dois usuários.
- [x] Ausência de exposição da existência do chamado alheio.

### Critério de saída

Dois usuários podem usar o CRUD sem qualquer vazamento ou alteração cruzada de dados.

## 9. Fase 5 — Consulta avançada de chamados

**Objetivo:** tornar a listagem útil sem quebrar o isolamento.

Requisitos relacionados: RF-TIC-02 e RF-TIC-07 a RF-TIC-10.

### Tarefas

- [x] Configurar paginação com 10 itens por página.
- [x] Retornar metadados suficientes para navegação.
- [x] Configurar ordenação padrão pelos chamados mais recentes.
- [x] Implementar ordenação crescente e decrescente por criação.
- [x] Implementar filtro por status.
- [x] Implementar filtro por prioridade.
- [x] Implementar busca por título ou cliente sem diferenciar maiúsculas.
- [x] Permitir combinação entre busca, filtros, ordenação e página.
- [x] Tratar página inválida de forma controlada.
- [x] Documentar todos os parâmetros.

### Testes mínimos

- [x] Paginação e metadados.
- [x] Ordenação padrão, crescente e decrescente.
- [x] Cada filtro isolado.
- [x] Busca por título e cliente.
- [x] Combinações de parâmetros.
- [x] Resultados vazios.
- [x] Isolamento preservado em todas as consultas.

### Critério de saída

A listagem aceita todos os parâmetros previstos, permite combinações e sempre considera somente os chamados do usuário atual.

## 10. Fase 6 — Dashboard da API

**Objetivo:** entregar os indicadores consolidados do usuário.

Requisitos relacionados: RF-DAS-01 e RN-07.

### Tarefas

- [x] Testar e implementar total de chamados.
- [x] Testar e implementar total por cada status.
- [x] Testar e implementar total de urgentes independentemente do status.
- [x] Garantir o isolamento pelo usuário autenticado.
- [x] Documentar a resposta do endpoint.

### Testes mínimos

- [x] Indicadores zerados.
- [x] Contagem total.
- [x] Abertos, em andamento, resolvidos e fechados.
- [x] Urgentes em diferentes status.
- [x] Atualização após criação, edição e exclusão.
- [x] Isolamento entre dois usuários.

### Critério de saída

O endpoint do dashboard retorna números corretos e isolados para diferentes combinações de chamados.

## 11. Fase 7 — Base do frontend

**Objetivo:** preparar a aplicação React, seus testes e a comunicação com a API.

Requisitos relacionados: RNF-03 a RNF-06 e RNF-10.

### Tarefas

- [x] Criar o projeto React com Vite e TypeScript.
- [x] Configurar Tailwind CSS.
- [x] Configurar React Router.
- [ ] Configurar Axios com URL da API por variável de ambiente.
- [ ] Configurar Vitest e Testing Library.
- [ ] Configurar MSW.
- [ ] Configurar ESLint e Prettier.
- [ ] Criar uma estrutura inicial por funcionalidades.
- [ ] Definir tipos para usuário, chamado, paginação, dashboard e erros.
- [ ] Criar componentes básicos somente quando houver uso real.
- [ ] Criar teste de renderização inicial.
- [ ] Definir estilos globais, foco visível e comportamento responsivo base.

### Critério de saída

O frontend inicia, passa nas verificações de tipagem e teste e consegue usar uma API simulada.

## 12. Fase 8 — Autenticação no frontend

**Objetivo:** integrar cadastro, login, restauração de sessão, proteção de rotas e logout.

Requisitos relacionados: RF-AUT-01 a RF-AUT-06 e RF-UX-01 a RF-UX-04.

### Tarefas

- [ ] Criar a página de cadastro.
- [ ] Criar a página de login.
- [ ] Validar campos e apresentar erros associados.
- [ ] Integrar cadastro e login à API.
- [ ] Manter o access token em memória.
- [ ] Manter o refresh token em `sessionStorage`.
- [ ] Restaurar a sessão por meio do refresh token.
- [ ] Renovar o acesso quando necessário.
- [ ] Evitar ciclos infinitos de renovação.
- [ ] Encerrar a sessão quando a renovação falhar.
- [ ] Consultar e manter os dados do usuário atual.
- [ ] Criar rotas protegidas.
- [ ] Implementar logout e limpeza das credenciais.
- [ ] Implementar estados de envio, sucesso e erro.

### Testes mínimos

- [ ] Renderização e validação dos dois formulários.
- [ ] Cadastro válido e inválido.
- [ ] Login válido e inválido.
- [ ] Armazenamento somente do refresh token no `sessionStorage`.
- [ ] Restauração de sessão.
- [ ] Falha de renovação.
- [ ] Redirecionamento de visitante.
- [ ] Acesso do usuário autenticado.
- [ ] Logout.

### Critério de saída

O usuário percorre todo o ciclo de sessão e nenhuma rota privada permanece acessível após o logout ou falha de renovação.

## 13. Fase 9 — Layout e dashboard no frontend

**Objetivo:** criar a estrutura visual autenticada e a primeira tela integrada.

Requisitos relacionados: RF-AUT-04, RF-DAS-01 e RF-UX-01 a RF-UX-04.

### Tarefas

- [ ] Criar layout autenticado.
- [ ] Criar header e navegação lateral ou equivalente responsivo.
- [ ] Exibir o usuário atual.
- [ ] Disponibilizar links para dashboard, chamados, novo chamado e logout.
- [ ] Criar o serviço do dashboard.
- [ ] Criar os cards de indicadores.
- [ ] Tratar carregamento, erro e indicadores zerados.
- [ ] Adaptar a navegação para telas a partir de 360 px.

### Critério de saída

O usuário autenticado navega pelo layout e visualiza os seis indicadores corretos em desktop e mobile.

## 14. Fase 10 — Listagem de chamados no frontend

**Objetivo:** disponibilizar consulta completa e preservação dos parâmetros de navegação.

Requisitos relacionados: RF-TIC-02, RF-TIC-07 a RF-TIC-10 e RF-UX-01 a RF-UX-04.

### Tarefas

- [ ] Criar o serviço de chamados.
- [ ] Criar a página de listagem.
- [ ] Exibir status, prioridade, cliente e datas de forma compreensível.
- [ ] Implementar busca.
- [ ] Implementar filtros de status e prioridade.
- [ ] Implementar ordenação por criação.
- [ ] Implementar paginação.
- [ ] Preservar busca, filtros e ordenação ao trocar de página.
- [ ] Preferir a URL como fonte dos parâmetros de consulta.
- [ ] Tratar carregamento, erro e lista vazia.
- [ ] Garantir uso por teclado e comportamento responsivo.

### Testes mínimos

- [ ] Renderização da lista.
- [ ] Carregamento, erro e estado vazio.
- [ ] Busca e filtros isolados.
- [ ] Combinação de parâmetros.
- [ ] Ordenação.
- [ ] Paginação com preservação dos critérios.

### Critério de saída

A página permite consultar o conjunto de chamados com os mesmos recursos oferecidos pela API e mantém o estado na URL.

## 15. Fase 11 — Criação, detalhes, edição e exclusão no frontend

**Objetivo:** concluir o gerenciamento de chamados pela interface.

Requisitos relacionados: RF-TIC-01 e RF-TIC-03 a RF-TIC-06, RF-UX-01 a RF-UX-04.

### Tarefas

- [ ] Criar um formulário reutilizável de chamado.
- [ ] Criar a página de novo chamado.
- [ ] Validar título, descrição, cliente, status, prioridade e prazo.
- [ ] Apresentar erros sem apagar dados válidos.
- [ ] Redirecionar após criação bem-sucedida.
- [ ] Criar a página de detalhes.
- [ ] Criar a página de edição com dados atuais.
- [ ] Salvar alterações e refletir o novo estado.
- [ ] Implementar alteração de status.
- [ ] Criar confirmação acessível de exclusão.
- [ ] Tratar confirmação e cancelamento.
- [ ] Atualizar lista e dashboard após mutações.
- [ ] Tratar recurso ausente e falhas da API.

### Testes mínimos

- [ ] Renderização e validação do formulário.
- [ ] Criação válida e inválida.
- [ ] Detalhes por identificador.
- [ ] Carregamento dos dados na edição.
- [ ] Atualização válida e inválida.
- [ ] Alteração de status.
- [ ] Confirmação, cancelamento e conclusão da exclusão.
- [ ] Tratamento de recurso não encontrado.

### Critério de saída

O fluxo completo de criação, consulta, edição, alteração de status e exclusão funciona pela interface.

## 16. Fase 12 — Integração, segurança e qualidade

**Objetivo:** validar o produto como um sistema completo, não apenas como partes isoladas.

Requisitos relacionados: todos os requisitos MUST e os fluxos de aceitação 1 a 5.

### Tarefas

- [ ] Executar o fluxo de primeiro acesso.
- [ ] Executar o fluxo completo de gestão de chamado.
- [ ] Executar busca, filtros, ordenação e paginação combinados.
- [ ] Criar dois usuários e comprovar isolamento completo.
- [ ] Tentar acessar diretamente um chamado alheio.
- [ ] Validar renovação, expiração e encerramento da sessão.
- [ ] Validar mensagens e estrutura de erros.
- [ ] Revisar ausência de senhas, tokens e segredos em respostas e logs.
- [ ] Revisar CORS, hosts permitidos e variáveis de ambiente.
- [ ] Revisar tipagem, lint e formatação.
- [ ] Revisar responsividade a partir de 360 px.
- [ ] Revisar navegação por teclado, foco, rótulos e semântica.
- [ ] Executar todas as suítes automatizadas.
- [ ] Configurar integração contínua para backend e frontend.
- [ ] Remover código morto e logs de depuração.
- [ ] Atualizar OpenAPI, README e decisões técnicas.

### Entrega SHOULD

- [ ] Automatizar ao menos um fluxo crítico de ponta a ponta no navegador.

### Critério de saída

Todos os requisitos MUST e fluxos de aceitação estão aprovados, e o pipeline executa testes e verificações de qualidade sem falhas.

## 17. Fase 13 — Deploy e apresentação de portfólio

**Objetivo:** publicar uma demonstração confiável e explicar o conhecimento aplicado.

Requisitos relacionados: RNF-07 a RNF-10.

### Tarefas

- [ ] Escolher serviços de hospedagem compatíveis com React, Django e PostgreSQL.
- [ ] Configurar variáveis e segredos de produção.
- [ ] Configurar banco e migrações de produção.
- [ ] Configurar origens, hosts e transporte seguro.
- [ ] Publicar backend e frontend.
- [ ] Validar health check e documentação da API em produção.
- [ ] Executar os cinco fluxos de aceitação no ambiente publicado.
- [ ] Preparar dados de demonstração sem expor credenciais reais.
- [ ] Finalizar o README com:
  - problema e solução;
  - funcionalidades;
  - stack;
  - arquitetura;
  - decisões e trade-offs;
  - instalação local;
  - variáveis de ambiente;
  - testes;
  - endpoints;
  - screenshots;
  - limitações e evoluções futuras.
- [ ] Adicionar diagrama da arquitetura.
- [ ] Adicionar screenshots e uma demonstração curta em vídeo ou GIF.
- [ ] Escrever um roteiro de apresentação de dois a quatro minutos.
- [ ] Preparar descrição para currículo, LinkedIn e portfólio.

### Critério de saída

O projeto está acessível, documentado e pode ser demonstrado do cadastro ao logout sem intervenção manual no banco.

## 18. Matriz de rastreabilidade

| Grupo de requisitos | Fases principais |
|---|---|
| RF-AUT-01 a RF-AUT-06 | 2 e 8 |
| RF-TIC-01 | 3, 4 e 11 |
| RF-TIC-02 | 4, 5 e 10 |
| RF-TIC-03 a RF-TIC-06 | 4 e 11 |
| RF-TIC-07 a RF-TIC-10 | 5 e 10 |
| RF-DAS-01 | 6 e 9 |
| RF-UX-01 a RF-UX-04 | 8 a 11 |
| RF-OPE-01 e RF-OPE-02 | 1 e 13 |
| RN-01 a RN-07 | 3 a 6 |
| RNF-01 a RNF-03 | 1 a 8 e 12 |
| RNF-04 a RNF-06 | 7 a 12 |
| RNF-07 a RNF-10 | 12 e 13 |
| Fluxos de aceitação 1 a 5 | 12 e 13 |

## 19. Marcos do projeto

### Marco A — API confiável

Fases 0 a 6 concluídas. A API está testada, documentada e demonstra autenticação, CRUD, isolamento, consultas e dashboard.

### Marco B — Aplicação utilizável

Fases 7 a 11 concluídas. O usuário executa todos os fluxos do MVP pela interface React.

### Marco C — Projeto publicável

Fases 12 e 13 concluídas. Qualidade, integração, deploy e material de apresentação estão prontos.

## 20. Regra para evoluções

Nenhuma funcionalidade futura deve ser iniciada antes do Marco C.

Depois da publicação do MVP, a primeira evolução recomendada é o histórico de alterações de status. Organizações e múltiplos papéis devem permanecer para uma etapa posterior, pois mudam profundamente o modelo de autorização e o isolamento de dados.

## 21. Descrição recomendada para o portfólio

> CloseDesk é uma aplicação full stack de gestão individual de chamados, construída com React, Python, Django, Django REST Framework e PostgreSQL. O projeto possui autenticação JWT, isolamento de dados por usuário, API REST documentada, dashboard, busca, filtros, paginação, testes automatizados e pipeline de qualidade.
