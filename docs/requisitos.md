# CloseDesk — Especificação de Requisitos

**Versão:** 1.0  
**Status:** final — aprovado para planejamento  
**Data:** 21 de junho de 2026  
**Objetivo do documento:** ser a fonte de verdade para produto, testes e roadmap.  
**Roadmap relacionado:** [Roadmap final do MVP](./roadmap.md)

## 1. Visão do produto

O CloseDesk será uma aplicação web full stack para que uma pessoa registre e acompanhe chamados de seus clientes. O sistema terá autenticação, isolamento dos dados por usuário, dashboard, CRUD de chamados, busca, filtros, ordenação e paginação.

No MVP, cada usuário gerencia somente os próprios chamados. Organizações, equipes, papéis de acesso e atribuição de chamados não fazem parte desta versão.

> Por precisão de escopo, o MVP deve ser apresentado como uma aplicação web de gestão de chamados. A evolução para um SaaS multiempresa está descrita na seção “Evoluções futuras”.

## 2. Objetivos

- Centralizar os chamados registrados por um usuário.
- Permitir acompanhar prioridade, status e prazo de cada chamado.
- Proteger os dados para que um usuário nunca acesse chamados de outro.
- Oferecer uma visão resumida por meio de indicadores.
- Demonstrar, no portfólio, domínio de requisitos, API REST, autenticação, segurança, testes, estados de interface e documentação.

## 3. Escopo do MVP

### Incluído

- Cadastro, login, renovação de sessão, consulta do usuário atual e logout.
- Rotas autenticadas.
- Criação, consulta, edição e exclusão de chamados.
- Alteração de status e prioridade.
- Busca, filtros, ordenação e paginação.
- Dashboard com indicadores.
- Estados de carregamento, erro e ausência de dados.
- Interface responsiva e requisitos básicos de acessibilidade.
- Documentação da API e endpoint de verificação de saúde.

### Fora do escopo

- Organizações ou múltiplas empresas.
- Perfis de administrador, atendente ou cliente.
- Atribuição de chamados a outros usuários.
- Cadastro separado de clientes.
- Comentários, anexos, notificações e histórico de alterações.
- Recuperação ou troca de senha.
- Login social.
- Cobrança ou assinatura.
- Aplicativo mobile nativo.

## 4. Ator

### Usuário autenticado

Pessoa que se cadastrou no sistema e pode gerenciar exclusivamente os próprios chamados.

Não haverá usuário administrador funcional no MVP.

## 5. Prioridades

- **MUST:** obrigatório para concluir o MVP.
- **SHOULD:** importante para a qualidade do portfólio, mas não bloqueia a primeira entrega utilizável.
- **COULD:** evolução opcional, somente após a conclusão do MVP.

## 6. Requisitos funcionais

### 6.1 Autenticação

#### RF-AUT-01 — Cadastrar usuário — MUST

O visitante deve poder criar uma conta informando nome, e-mail e senha.

Critérios de aceitação:

- Nome, e-mail e senha são obrigatórios.
- O nome deve ter de 2 a 100 caracteres.
- O e-mail deve possuir formato válido.
- O e-mail deve ser único, sem diferenciar letras maiúsculas de minúsculas.
- A senha deve ter no mínimo 8 caracteres.
- A senha nunca deve ser devolvida pela API.
- Dados inválidos devem produzir mensagens compreensíveis associadas aos campos correspondentes.

#### RF-AUT-02 — Realizar login — MUST

O usuário deve poder iniciar uma sessão com e-mail e senha válidos.

Critérios de aceitação:

- Credenciais válidas iniciam uma sessão autenticada.
- A API fornece credenciais JWT de acesso e renovação.
- E-mail inexistente e senha incorreta retornam uma mensagem genérica de credenciais inválidas.
- A resposta não deve revelar se determinado e-mail está cadastrado.

#### RF-AUT-03 — Renovar sessão — MUST

O sistema deve permitir a renovação do token de acesso enquanto o token de renovação for válido.

Critérios de aceitação:

- Um token de renovação válido gera um novo token de acesso.
- Quando o acesso expirar e a renovação ainda for válida, a aplicação deve conseguir continuar a sessão sem exigir novo login.
- Token ausente, expirado ou inválido não renova a sessão.
- Se a renovação falhar, a sessão local deve ser encerrada e o usuário deve voltar ao login.

#### RF-AUT-04 — Consultar usuário atual — MUST

O usuário autenticado deve poder consultar seu identificador, nome e e-mail.

Critérios de aceitação:

- A consulta exige autenticação.
- A resposta nunca contém senha ou credenciais de sessão.

#### RF-AUT-05 — Encerrar sessão — MUST

O usuário deve poder sair da aplicação.

Critérios de aceitação:

- As credenciais mantidas pelo frontend são removidas.
- Após o logout, páginas protegidas não podem ser acessadas sem novo login.
- No MVP, não é obrigatória a revogação do token no servidor.

#### RF-AUT-06 — Proteger rotas — MUST

Páginas e endpoints privados devem exigir uma sessão válida.

Critérios de aceitação:

- Visitantes não acessam dashboard, chamados ou dados do usuário atual.
- Ao tentar abrir uma página privada sem sessão, o visitante é direcionado ao login.

### 6.2 Chamados

#### RF-TIC-01 — Criar chamado — MUST

O usuário autenticado deve poder criar um chamado.

Dados do chamado:

| Campo | Obrigatório | Regra |
|---|---:|---|
| `title` | sim | de 3 a 120 caracteres |
| `description` | sim | de 10 a 2.000 caracteres |
| `customer_name` | sim | de 2 a 120 caracteres |
| `status` | não | padrão `open` |
| `priority` | não | padrão `medium` |
| `due_date` | não | data igual ou posterior à data de criação |
| `created_by` | automático | usuário autenticado |
| `created_at` | automático | data e hora da criação |
| `updated_at` | automático | data e hora da última alteração |

Critérios de aceitação:

- O usuário não pode escolher ou alterar `created_by`.
- O sistema rejeita campos obrigatórios ausentes ou inválidos.
- Campos automáticos não podem ser definidos pelo cliente.

#### RF-TIC-02 — Listar chamados — MUST

O usuário autenticado deve visualizar uma lista paginada somente com os próprios chamados.

Critérios de aceitação:

- A ordenação padrão exibe os chamados mais recentes primeiro.
- A resposta informa total de registros, página atual e disponibilidade de páginas anterior e seguinte.
- A interface apresenta um estado vazio quando o usuário ainda não possui chamados.

#### RF-TIC-03 — Consultar chamado — MUST

O usuário autenticado deve poder visualizar todos os dados de um chamado próprio.

Critérios de aceitação:

- Um chamado de outro usuário não pode ser consultado.
- Um identificador inexistente ou não pertencente ao usuário deve ter resposta que não exponha a existência do recurso.

#### RF-TIC-04 — Editar chamado — MUST

O usuário autenticado deve poder editar título, descrição, cliente, prioridade, status e prazo de um chamado próprio.

Critérios de aceitação:

- As validações de formato e tamanho da criação também valem para a edição.
- Um prazo já vencido pode ser mantido ao editar outro campo; se o prazo for substituído, a nova data não pode estar no passado.
- `created_by` e `created_at` não podem ser alterados.
- `updated_at` é atualizado automaticamente.
- Um chamado de outro usuário não pode ser editado.

#### RF-TIC-05 — Excluir chamado — MUST

O usuário autenticado deve poder excluir permanentemente um chamado próprio.

Critérios de aceitação:

- A interface solicita confirmação antes da exclusão.
- Cancelar a confirmação não altera os dados.
- Um chamado de outro usuário não pode ser excluído.
- Após a exclusão, o chamado deixa de aparecer na lista e no dashboard.

#### RF-TIC-06 — Alterar status — MUST

O usuário autenticado deve poder alterar o status de um chamado próprio para um dos valores permitidos.

Critérios de aceitação:

- Valores fora da lista permitida são rejeitados.
- No MVP, qualquer status permitido pode ser alterado para outro status permitido.

#### RF-TIC-07 — Filtrar chamados — MUST

O usuário deve poder filtrar seus chamados por status e prioridade.

Critérios de aceitação:

- Os filtros podem ser utilizados separadamente ou em conjunto.
- Somente os chamados do usuário autenticado entram no resultado.

#### RF-TIC-08 — Buscar chamados — MUST

O usuário deve poder buscar chamados pelo título ou nome do cliente.

Critérios de aceitação:

- A busca não diferencia letras maiúsculas de minúsculas.
- A busca pode ser combinada com filtros, ordenação e paginação.
- Uma busca sem resultados apresenta estado vazio, sem ser tratada como erro.

#### RF-TIC-09 — Ordenar chamados — MUST

O usuário deve poder ordenar chamados pela data de criação.

Critérios de aceitação:

- Deve existir ordenação crescente e decrescente.
- Na ausência de parâmetro, prevalece a ordem do mais recente para o mais antigo.

#### RF-TIC-10 — Paginar chamados — MUST

A listagem deve dividir os resultados em páginas.

Critérios de aceitação:

- A página padrão contém até 10 chamados.
- Busca, filtros e ordenação são preservados durante a troca de página.
- Uma página inválida deve produzir uma resposta controlada.

### 6.3 Dashboard

#### RF-DAS-01 — Exibir indicadores — MUST

O dashboard deve apresentar indicadores calculados exclusivamente a partir dos chamados do usuário autenticado.

Indicadores:

- Total de chamados.
- Chamados abertos.
- Chamados em andamento.
- Chamados resolvidos.
- Chamados fechados.
- Chamados urgentes.

Critérios de aceitação:

- Cada indicador corresponde aos valores atuais dos chamados.
- “Urgentes” conta chamados com prioridade `urgent`, independentemente do status.
- Criar, editar ou excluir um chamado deve refletir nos indicadores após a atualização dos dados.
- Dados de outros usuários nunca entram nos cálculos.

### 6.4 Experiência da interface

#### RF-UX-01 — Comunicar estados assíncronos — MUST

Telas que consultam ou alteram dados devem comunicar carregamento, sucesso e erro.

#### RF-UX-02 — Exibir estados vazios — MUST

Listas e buscas sem resultados devem apresentar orientação clara ao usuário.

#### RF-UX-03 — Validar formulários — MUST

Formulários devem indicar campos obrigatórios e erros antes ou depois do envio, sem apagar os dados válidos já preenchidos.

#### RF-UX-04 — Navegar pela aplicação — MUST

O layout autenticado deve oferecer acesso ao dashboard, à lista de chamados, à criação de chamado e ao logout, além de identificar o usuário atual.

### 6.5 Operação

#### RF-OPE-01 — Verificar saúde da API — MUST

Deve existir uma rota pública de health check que informe se a API está disponível sem expor informações sensíveis.

#### RF-OPE-02 — Consultar documentação da API — MUST

Deve existir documentação OpenAPI navegável contendo endpoints, parâmetros, exemplos de resposta e requisitos de autenticação.

## 7. Regras de negócio

### RN-01 — Propriedade dos dados

Todo chamado pertence exatamente a um usuário. Somente seu proprietário pode listar, consultar, alterar ou excluir o chamado.

### RN-02 — Status permitidos

- `open`
- `in_progress`
- `resolved`
- `closed`

### RN-03 — Prioridades permitidas

- `low`
- `medium`
- `high`
- `urgent`

### RN-04 — Valores padrão

- O status inicial é `open`.
- A prioridade inicial é `medium`.

### RN-05 — Prazo

O prazo é opcional. Na criação, quando informado, não pode ser anterior à data atual. Um chamado já salvo pode permanecer com prazo vencido.

### RN-06 — Exclusão

A exclusão é física e permanente no MVP.

### RN-07 — Isolamento

Consultas, filtros, buscas, ordenações, paginação e indicadores sempre devem partir do conjunto de chamados do usuário autenticado.

## 8. Requisitos não funcionais

### RNF-01 — Segurança — MUST

- Senhas devem ser armazenadas somente por meio do mecanismo seguro do framework.
- Senhas, tokens e segredos não podem aparecer em logs ou respostas indevidas.
- Endpoints privados devem exigir autenticação.
- O sistema deve evitar enumeração de usuários no login.
- Configurações sensíveis devem vir de variáveis de ambiente.

### RNF-02 — Consistência de erros — MUST

A API deve adotar uma estrutura de erro previsível para validação, autenticação, autorização, recurso não encontrado e falha interna.

### RNF-03 — Testabilidade — MUST

- Regras de negócio e permissões devem possuir testes automatizados.
- Os fluxos críticos de autenticação e CRUD devem possuir testes de integração.
- O frontend deve testar comportamentos visíveis, chamadas à API e rotas protegidas.
- Serviços externos ou a API devem ser simulados nos testes de interface quando apropriado.

### RNF-04 — Tipagem e qualidade estática — MUST

O frontend não deve depender de `any` sem justificativa. O projeto deve passar pelas verificações configuradas de tipagem, lint e formatação.

### RNF-05 — Responsividade — MUST

As páginas devem permanecer utilizáveis em telas móveis a partir de 360 px e em telas desktop.

### RNF-06 — Acessibilidade básica — MUST

- Campos possuem rótulos associados.
- A navegação principal e os formulários são operáveis por teclado.
- O foco visível é preservado.
- Mensagens não dependem apenas de cor.
- Elementos interativos utilizam semântica adequada.

### RNF-07 — Desempenho percebido — SHOULD

Listagens e dashboard devem apresentar resposta visual de carregamento imediatamente e concluir operações comuns em tempo aceitável sob condições normais de demonstração.

### RNF-08 — Compatibilidade — SHOULD

A interface deve funcionar nas versões estáveis atuais de Chrome, Firefox e Edge.

### RNF-09 — Observabilidade — SHOULD

- A aplicação deve possuir health check.
- Erros relevantes devem gerar logs úteis sem dados sensíveis.
- Falhas inesperadas devem retornar resposta controlada.

### RNF-10 — Documentação — MUST

O repositório deve documentar objetivo, escopo, arquitetura, instalação, variáveis de ambiente, execução de testes, endpoints e decisões relevantes.

## 9. Stack e arquitetura definidas

### Stack principal obrigatória

- **Frontend:** React.
- **Backend:** Python com Django.
- **API:** Django REST Framework.
- **Banco de dados:** PostgreSQL.

### Ferramentas de apoio

- TypeScript para tipagem do frontend.
- Tailwind CSS para estilos.
- React Router para navegação.
- Axios para comunicação HTTP.
- JWT com access token e refresh token para autenticação.
- OpenAPI/Swagger para documentação da API.
- MSW para simular a API em testes de interface.
- Testes automatizados no backend e no frontend.

### Organização arquitetural

- O frontend será uma aplicação React independente que consumirá uma API REST.
- A API será implementada em Python com Django e Django REST Framework.
- O backend concentrará regras de negócio, validações, autenticação, autorização e acesso ao banco.
- O frontend concentrará apresentação, navegação, estado da interface e interação com a API.
- O repositório será organizado em diretórios separados para `backend` e `frontend`.
- O desenvolvimento seguirá TDD nos comportamentos críticos e testes orientados ao comportamento nas interfaces.

### Decisão de sessão para o MVP

- O access token será mantido em memória pelo frontend.
- O refresh token será mantido em `sessionStorage`.
- Ao recarregar a aplicação, um refresh token válido poderá restaurar a sessão.
- O logout removerá os tokens mantidos pelo frontend.
- Tokens não serão armazenados em `localStorage`.
- O risco residual de XSS associado ao armazenamento no navegador deverá ser registrado como decisão técnica e mitigado com boas práticas de segurança.

## 10. Contrato inicial da API

Os caminhos abaixo são o contrato previsto para o MVP:

| Método | Caminho | Finalidade | Autenticação |
|---|---|---|---:|
| `GET` | `/api/health/` | verificar disponibilidade | não |
| `POST` | `/api/auth/register/` | cadastrar usuário | não |
| `POST` | `/api/auth/login/` | iniciar sessão | não |
| `POST` | `/api/auth/refresh/` | renovar acesso | não |
| `GET` | `/api/auth/me/` | consultar usuário atual | sim |
| `GET` | `/api/tickets/` | listar, buscar, filtrar e ordenar | sim |
| `POST` | `/api/tickets/` | criar chamado | sim |
| `GET` | `/api/tickets/{id}/` | consultar chamado | sim |
| `PATCH` | `/api/tickets/{id}/` | editar chamado | sim |
| `DELETE` | `/api/tickets/{id}/` | excluir chamado | sim |
| `GET` | `/api/dashboard/` | consultar indicadores | sim |

Parâmetros previstos para a listagem:

- `status`
- `priority`
- `search`
- `ordering=created_at`
- `ordering=-created_at`
- `page`

Filtros e busca devem poder ser combinados.

## 11. Páginas previstas

| Caminho | Finalidade | Acesso |
|---|---|---|
| `/login` | autenticação | público |
| `/register` | cadastro | público |
| `/dashboard` | indicadores | privado |
| `/tickets` | listagem, busca e filtros | privado |
| `/tickets/new` | criação | privado |
| `/tickets/:id` | detalhes | privado |
| `/tickets/:id/edit` | edição | privado |

Uma página `/profile` não faz parte do MVP, pois não há requisito de edição de perfil. Os dados do usuário atual serão exibidos no layout autenticado.

## 12. Fluxos de aceitação do MVP

### Fluxo 1 — Primeiro acesso

1. Visitante cria uma conta válida.
2. Usuário realiza login.
3. Usuário é direcionado ao dashboard.
4. Dashboard apresenta indicadores zerados.

### Fluxo 2 — Gestão de chamado

1. Usuário cria um chamado.
2. Chamado aparece na lista e altera os indicadores.
3. Usuário consulta os detalhes.
4. Usuário edita prioridade, status ou demais campos permitidos.
5. Lista e dashboard refletem a alteração.
6. Usuário exclui o chamado após confirmação.

### Fluxo 3 — Consulta

1. Usuário possui chamados com dados variados.
2. Usuário busca por título ou cliente.
3. Usuário combina busca e filtros.
4. Usuário alterna a ordenação.
5. Usuário navega entre páginas sem perder os critérios.

### Fluxo 4 — Segurança entre usuários

1. Dois usuários possuem chamados diferentes.
2. Cada usuário visualiza somente os próprios dados.
3. Tentativas de consultar, editar ou excluir o chamado alheio são bloqueadas sem expor sua existência.
4. O dashboard de cada usuário considera somente seus chamados.

### Fluxo 5 — Sessão

1. Usuário autenticado acessa páginas privadas.
2. Usuário encerra a sessão.
3. A aplicação remove as credenciais locais e retorna ao login.
4. Uma nova tentativa de abrir página privada exige autenticação.

## 13. Definição de pronto para um requisito

Um requisito somente é considerado concluído quando:

- Seus critérios de aceitação foram atendidos.
- Os testes relevantes estão passando.
- Estados de sucesso, carregamento, erro e vazio foram tratados quando aplicáveis.
- Permissões e isolamento por usuário foram verificados.
- A documentação afetada foi atualizada.
- Não existem erros de tipagem ou lint relacionados à entrega.

## 14. Evoluções futuras

Itens deliberadamente fora do MVP, em ordem sugerida:

1. Histórico de alterações de status.
2. Comentários em chamados.
3. Cadastro próprio de clientes.
4. Organizações e isolamento multiempresa.
5. Papéis de acesso e atribuição de atendentes.
6. Anexos.
7. Notificações.
8. Métricas de SLA.
9. Revogação de refresh token no servidor.

Para o portfólio, a recomendação é concluir e publicar o MVP antes de iniciar esta lista.

## 15. Controle de escopo

- Este documento é a fonte de verdade funcional do MVP.
- O roadmap deve referenciar os identificadores definidos aqui.
- Uma alteração em requisito MUST deve atualizar este documento antes da implementação correspondente.
- Itens da seção “Evoluções futuras” não devem entrar no primeiro ciclo.
- O MVP estará funcionalmente concluído somente quando todos os requisitos MUST e os cinco fluxos de aceitação estiverem atendidos.
