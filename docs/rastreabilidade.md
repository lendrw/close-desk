# Matriz de rastreabilidade

## Objetivo

Relacionar cada requisito do MVP às evidências que deverão comprovar seu funcionamento.

Os caminhos representam testes futuros e podem ser refinados durante a implementação.

## Requisitos funcionais

| Requisito | Evidência planejada |
|---|---|
| RF-AUT-01 | Testes de API e formulário de cadastro |
| RF-AUT-02 | Testes de API e página de login |
| RF-AUT-03 | Testes de renovação e restauração da sessão |
| RF-AUT-04 | Testes do endpoint e exibição do usuário atual |
| RF-AUT-05 | Testes de logout e remoção dos tokens |
| RF-AUT-06 | Testes de endpoints e rotas protegidas |
| RF-TIC-01 | Testes de criação, validação e formulário |
| RF-TIC-02 | Testes de listagem e estado vazio |
| RF-TIC-03 | Testes de detalhes e propriedade do chamado |
| RF-TIC-04 | Testes de edição e campos imutáveis |
| RF-TIC-05 | Testes de confirmação, cancelamento e exclusão |
| RF-TIC-06 | Testes de alteração e validação de status |
| RF-TIC-07 | Testes isolados e combinados dos filtros |
| RF-TIC-08 | Testes de busca por título e cliente |
| RF-TIC-09 | Testes de ordenação crescente e decrescente |
| RF-TIC-10 | Testes de paginação e preservação dos critérios |
| RF-DAS-01 | Testes dos indicadores e isolamento por usuário |
| RF-UX-01 | Testes dos estados de carregamento, sucesso e erro |
| RF-UX-02 | Testes de listas e buscas sem resultados |
| RF-UX-03 | Testes de validação e preservação dos formulários |
| RF-UX-04 | Testes de navegação e layout autenticado |
| RF-OPE-01 | Teste do endpoint de health check |
| RF-OPE-02 | Verificação da documentação OpenAPI |

## Regras de negócio

| Regra | Evidência planejada |
|---|---|
| RN-01 | Testes de propriedade com dois usuários |
| RN-02 | Testes dos status permitidos e inválidos |
| RN-03 | Testes das prioridades permitidas e inválidas |
| RN-04 | Testes dos valores padrão |
| RN-05 | Testes de prazo atual, futuro e vencido |
| RN-06 | Testes de exclusão permanente |
| RN-07 | Testes de isolamento em CRUD, consultas e dashboard |

## Requisitos não funcionais

| Requisito | Evidência planejada |
|---|---|
| RNF-01 | Testes de autenticação, autorização e revisão de segredos |
| RNF-02 | Testes da estrutura de erros da API |
| RNF-03 | Suítes automatizadas de backend e frontend |
| RNF-04 | Verificações de tipagem, lint e formatação |
| RNF-05 | Revisão responsiva a partir de 360 px |
| RNF-06 | Testes e revisão básica de acessibilidade |
| RNF-07 | Revisão do carregamento e desempenho percebido |
| RNF-08 | Testes manuais nos navegadores suportados |
| RNF-09 | Testes de health check e revisão dos logs |
| RNF-10 | Revisão do README, OpenAPI e documentos técnicos |

## Convenção futura

Quando os testes forem criados:

- O nome ou comentário do grupo de testes deverá mencionar o requisito relacionado quando isso melhorar a rastreabilidade.
- Pull requests deverão informar os requisitos atendidos.
- Um requisito só poderá ser concluído quando suas evidências estiverem aprovadas.
- A matriz deverá ser atualizada caso a estratégia de verificação mude.
