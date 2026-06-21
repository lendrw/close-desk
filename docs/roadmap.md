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
- [ ] Relacionar os requisitos aos futuros testes por seus identificadores.

### Critério de saída

O repositório possui documentação inicial, estrutura definida e nenhuma credencial real versionada.

## 5. Fase 1 — Base do backend

**Objetivo:** disponibilizar uma API Django testável e configurável.

Requisitos relacionados: RF-OPE-01, RF-OPE-02, RNF-01 a RNF-03, RNF-09 e RNF-10.

### Tarefas

- [ ] Criar o projeto Python e Django.
- [ ] Criar os apps necessários, incluindo `accounts` e `tickets`.
- [ ] Configurar Django REST Framework.
- [ ] Configurar PostgreSQL.
- [ ] Separar configurações de desenvolvimento, teste e produção quando necessário.
- [ ] Carregar segredos e configurações por variáveis de ambiente.
- [ ] Configurar CORS apenas para origens permitidas.
- [ ] Criar um modelo de usuário customizado com e-mail como identificador de login.
- [ ] Definir o modelo de usuário antes da primeira migração.
- [ ] Configurar o ambiente de testes com pytest.
- [ ] Criar teste de sanidade da API.
- [ ] Escrever e implementar o health check.
- [ ] Configurar a documentação OpenAPI/Swagger.
- [ ] Definir uma estrutura consistente para erros da API.
- [ ] Configurar lint e formatação do código Python.

### Testes mínimos

- [ ] A aplicação Django inicia no ambiente de teste.
- [ ] O health check responde com sucesso e não expõe informações sensíveis.
- [ ] A documentação da API pode ser carregada.
- [ ] Configurações obrigatórias ausentes falham de forma compreensível.

### Critério de saída

A API inicia com PostgreSQL, passa nos testes iniciais e oferece health check e documentação.

## 6. Fase 2 — Autenticação da API

**Objetivo:** entregar cadastro e sessão JWT com regras de segurança verificadas.

Requisitos relacionados: RF-AUT-01 a RF-AUT-06 e RNF-01 a RNF-03.

### Tarefas

- [ ] Testar e implementar cadastro com nome, e-mail e senha.
- [ ] Validar nome entre 2 e 100 caracteres.
- [ ] Validar formato do e-mail.
- [ ] Garantir unicidade de e-mail sem diferenciar maiúsculas de minúsculas.
- [ ] Validar senha com no mínimo 8 caracteres.
- [ ] Garantir que a senha seja armazenada pelo mecanismo seguro do Django.
- [ ] Garantir que a senha nunca apareça nas respostas.
- [ ] Testar e implementar login por e-mail e senha.
- [ ] Retornar mensagem genérica para credenciais inválidas.
- [ ] Configurar emissão de access token e refresh token.
- [ ] Testar e implementar renovação do access token.
- [ ] Testar e implementar o endpoint do usuário atual.
- [ ] Proteger o endpoint do usuário atual.
- [ ] Documentar os endpoints e exemplos de erro.

### Testes mínimos

- [ ] Cadastro válido.
- [ ] Campos obrigatórios ausentes.
- [ ] Nome fora dos limites.
- [ ] E-mail inválido.
- [ ] E-mail duplicado com variação de maiúsculas.
- [ ] Senha curta.
- [ ] Ausência da senha na resposta.
- [ ] Login válido.
- [ ] Login inválido sem enumeração de usuário.
- [ ] Renovação válida e inválida.
- [ ] Consulta do usuário atual com e sem token.

### Critério de saída

Todos os endpoints de autenticação previstos no contrato estão testados, documentados e protegidos corretamente.

## 7. Fase 3 — Domínio de chamados

**Objetivo:** modelar as regras centrais antes de expor o CRUD.

Requisitos relacionados: RF-TIC-01, RN-01 a RN-07.

### Tarefas

- [ ] Escrever os testes do modelo de chamado.
- [ ] Criar o modelo `Ticket`.
- [ ] Implementar título, descrição e nome do cliente.
- [ ] Implementar escolhas de status.
- [ ] Implementar escolhas de prioridade.
- [ ] Definir status padrão como `open`.
- [ ] Definir prioridade padrão como `medium`.
- [ ] Implementar prazo opcional.
- [ ] Implementar relacionamento obrigatório com o usuário proprietário.
- [ ] Implementar datas automáticas de criação e atualização.
- [ ] Validar tamanhos mínimos e máximos.
- [ ] Validar prazo na criação e na alteração.
- [ ] Criar e revisar a migração.

### Testes mínimos

- [ ] Campos obrigatórios e opcionais.
- [ ] Valores padrão.
- [ ] Status e prioridades permitidos.
- [ ] Rejeição de escolhas inválidas.
- [ ] Relacionamento com o proprietário.
- [ ] Datas automáticas.
- [ ] Prazo atual, futuro, passado e prazo já vencido não alterado.

### Critério de saída

O modelo representa todas as regras documentadas e sua migração pode ser aplicada em um banco limpo.

## 8. Fase 4 — CRUD e isolamento da API

**Objetivo:** permitir que cada usuário gerencie somente os próprios chamados.

Requisitos relacionados: RF-TIC-01 a RF-TIC-06, RN-01, RN-06, RN-07 e RNF-01 a RNF-03.

### Tarefas

- [ ] Testar e implementar criação de chamado.
- [ ] Preencher `created_by` pelo usuário autenticado.
- [ ] Impedir definição de campos automáticos pelo cliente.
- [ ] Testar e implementar listagem.
- [ ] Testar e implementar detalhes.
- [ ] Testar e implementar edição parcial.
- [ ] Testar explicitamente a alteração de status.
- [ ] Testar e implementar exclusão física.
- [ ] Exigir autenticação em todas as rotas de chamados.
- [ ] Filtrar o conjunto base pelo usuário autenticado.
- [ ] Retornar resposta equivalente para recurso inexistente ou pertencente a outro usuário.
- [ ] Aplicar a estrutura padronizada de erros.
- [ ] Documentar exemplos de requisição e resposta.

### Testes mínimos

- [ ] CRUD completo do próprio chamado.
- [ ] Rejeição de usuário não autenticado.
- [ ] Rejeição de campos inválidos.
- [ ] Imutabilidade de `created_by` e `created_at`.
- [ ] Atualização automática de `updated_at`.
- [ ] Bloqueio de leitura, edição e exclusão entre dois usuários.
- [ ] Ausência de exposição da existência do chamado alheio.

### Critério de saída

Dois usuários podem usar o CRUD sem qualquer vazamento ou alteração cruzada de dados.

## 9. Fase 5 — Consulta avançada de chamados

**Objetivo:** tornar a listagem útil sem quebrar o isolamento.

Requisitos relacionados: RF-TIC-02 e RF-TIC-07 a RF-TIC-10.

### Tarefas

- [ ] Configurar paginação com 10 itens por página.
- [ ] Retornar metadados suficientes para navegação.
- [ ] Configurar ordenação padrão pelos chamados mais recentes.
- [ ] Implementar ordenação crescente e decrescente por criação.
- [ ] Implementar filtro por status.
- [ ] Implementar filtro por prioridade.
- [ ] Implementar busca por título ou cliente sem diferenciar maiúsculas.
- [ ] Permitir combinação entre busca, filtros, ordenação e página.
- [ ] Tratar página inválida de forma controlada.
- [ ] Documentar todos os parâmetros.

### Testes mínimos

- [ ] Paginação e metadados.
- [ ] Ordenação padrão, crescente e decrescente.
- [ ] Cada filtro isolado.
- [ ] Busca por título e cliente.
- [ ] Combinações de parâmetros.
- [ ] Resultados vazios.
- [ ] Isolamento preservado em todas as consultas.

### Critério de saída

A listagem aceita todos os parâmetros previstos, permite combinações e sempre considera somente os chamados do usuário atual.

## 10. Fase 6 — Dashboard da API

**Objetivo:** entregar os indicadores consolidados do usuário.

Requisitos relacionados: RF-DAS-01 e RN-07.

### Tarefas

- [ ] Testar e implementar total de chamados.
- [ ] Testar e implementar total por cada status.
- [ ] Testar e implementar total de urgentes independentemente do status.
- [ ] Garantir o isolamento pelo usuário autenticado.
- [ ] Documentar a resposta do endpoint.

### Testes mínimos

- [ ] Indicadores zerados.
- [ ] Contagem total.
- [ ] Abertos, em andamento, resolvidos e fechados.
- [ ] Urgentes em diferentes status.
- [ ] Atualização após criação, edição e exclusão.
- [ ] Isolamento entre dois usuários.

### Critério de saída

O endpoint do dashboard retorna números corretos e isolados para diferentes combinações de chamados.

## 11. Fase 7 — Base do frontend

**Objetivo:** preparar a aplicação React, seus testes e a comunicação com a API.

Requisitos relacionados: RNF-03 a RNF-06 e RNF-10.

### Tarefas

- [ ] Criar o projeto React com Vite e TypeScript.
- [ ] Configurar Tailwind CSS.
- [ ] Configurar React Router.
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
