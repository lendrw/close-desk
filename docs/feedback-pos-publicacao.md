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

### P04 — A abertura dos detalhes do chamado não era intuitiva

Na lista de chamados, a pessoa usuária demorou a perceber que precisava clicar
no título do chamado para abrir a tela de detalhes.

Impacto:

- A ação principal da lista ficava pouco evidente.
- Usuários novos podiam achar que o card era apenas informativo.
- A navegação para detalhes dependia de descoberta por tentativa.

Decisão proposta:

- Tornar a ação de abrir detalhes explícita no card do chamado.
- Avaliar uma das opções:
  - adicionar botão ou link "Ver detalhes";
  - tornar o card inteiro clicável com indicação visual clara;
  - combinar título clicável com affordance visual, como ícone ou sublinhado.
- Manter acessibilidade por teclado e rótulos claros para leitores de tela.

Status:

- Corrigido no código.
- Pendente de deploy e revalidação no ambiente publicado.

Evidências esperadas:

- Teste de frontend cobrindo a ação visível de abrir detalhes.
- Validação manual da lista em desktop e telas menores.
- Confirmação de navegação por teclado.

### P05 — Chamados poderiam ter categorias

Foi sugerida a inclusão de categorias para classificar os chamados além de status
e prioridade.

Impacto:

- Ajudaria a organizar chamados por tipo de problema, área, serviço ou contexto.
- Permitiria análises e filtros mais específicos no futuro.
- Poderia melhorar a leitura da lista quando houver muitos chamados.

Decisão proposta:

- Tratar como evolução funcional do domínio de chamados.
- Avaliar se as categorias serão:
  - livres por usuário;
  - pré-definidas pelo sistema;
  - ou tags múltiplas por chamado.
- Definir impacto em modelo, API, filtros, dashboard, frontend e dados de
  demonstração antes de implementar.

Status:

- Registrado.
- Pendente de refinamento de escopo.

Evidências esperadas:

- Requisito funcional documentado.
- Testes de modelo, API e frontend cobrindo criação, edição, listagem e filtro
  por categoria.
- Validação manual com massa de chamados categorizados.

### P06 — Card inicial não se adapta bem a viewports pequenas

Em telas pequenas ou viewports estreitas do navegador, o card da tela inicial
fica alto demais e não parece centralizado em relação à área visível.

Impacto:

- A primeira impressão em mobile fica menos polida.
- O conteúdo principal não aproveita bem a altura disponível da viewport.
- A interface parece se adaptar ao tamanho físico do dispositivo, e não à área
  visível do navegador.

Decisão proposta:

- Revisar o layout da tela inicial usando unidades compatíveis com a viewport
  visível, como `dvh`, e espaçamentos responsivos.
- Centralizar o card em viewports pequenas sem criar altura excessiva.
- Garantir que o conteúdo continue acessível quando o navegador exibir barras,
  DevTools ou áreas reduzidas.

Status:

- Registrado.
- Pendente de implementação.

Evidências esperadas:

- Validação manual em viewport estreita.
- Revisão responsiva a partir de 360 px ou menor quando aplicável.
- Teste visual/manual garantindo ausência de corte e centralização adequada.

### P07 — Itens da navegação aumentam de altura durante loading ou erro

Em telas pequenas, durante estados de loading ou erro nas telas de chamados,
dashboard e novo chamado, o item ativo da navegação pode aumentar verticalmente,
ocupando uma área muito maior que o esperado.

Impacto:

- A navegação fica visualmente quebrada em mobile.
- O conteúdo principal é empurrado para baixo.
- O usuário pode interpretar o item ativo como um card ou área de conteúdo.

Decisão proposta:

- Revisar estilos do layout autenticado e da navegação em telas pequenas.
- Garantir altura fixa ou previsível para os links de navegação,
  independentemente do estado da página.
- Validar loading, erro e conteúdo carregado nas telas afetadas.

Status:

- Registrado.
- Pendente de implementação.

Evidências esperadas:

- Teste ou validação manual de dashboard, lista de chamados e novo chamado em
  mobile.
- Confirmação de que a navegação mantém altura consistente em loading, erro e
  sucesso.
- Revisão visual em navegador mobile real ou viewport equivalente.

### P08 — Erros em formulário podem ficar pouco visíveis no mobile

Ao ocorrer erro na criação de chamado, a mensagem aparece no fluxo da página. Em
telas pequenas, a pessoa usuária pode precisar rolar a tela para cima para
perceber a mensagem em vermelho.

Impacto:

- O usuário pode não entender que a ação falhou.
- A mensagem de erro fica distante do ponto onde a ação foi executada.
- Em mobile, o feedback visual perde eficácia por depender de rolagem manual.

Decisão proposta:

- Exibir notificações globais para erros de ação, especialmente em mobile.
- Avaliar uso de toast, snackbar ou alerta fixo temporário.
- Manter mensagens associadas aos campos quando o erro for de validação.
- Garantir acessibilidade com `role="alert"` ou região `aria-live`.

Status:

- Registrado.
- Pendente de implementação.

Evidências esperadas:

- Teste de frontend cobrindo erro ao criar chamado.
- Validação manual em mobile confirmando que o erro é visível sem rolagem.
- Revisão de acessibilidade da notificação.

### P09 — Botão de sair deveria ficar no cabeçalho no mobile

No mobile, a ação de sair fica junto da navegação horizontal. Foi sugerido que o
botão fique no canto superior direito do cabeçalho autenticado.

Impacto:

- Logout fica misturado com navegação principal.
- A ação de sessão não fica no local esperado em interfaces mobile.
- Pode ocupar espaço da navegação entre dashboard, chamados e novo chamado.

Decisão proposta:

- Posicionar a ação de sair no canto superior direito do cabeçalho em telas
  pequenas.
- Manter a navegação horizontal apenas para as seções principais.
- Garantir que o botão continue acessível por teclado e com rótulo claro.

Status:

- Registrado.
- Pendente de implementação.

Evidências esperadas:

- Validação manual do layout autenticado em mobile.
- Teste de logout garantindo que a ação continua funcional.
- Revisão visual confirmando separação entre ações de navegação e sessão.

## Priorização

| Prioridade | Problema | Motivo |
|---|---|---|
| Alta | P01 — Cadastro não iniciava sessão automaticamente | Afeta diretamente o primeiro acesso e a demonstração do produto. |
| Alta | P02 — Não havia recuperação de senha | Pode impedir o usuário de voltar a acessar a própria conta. |
| Alta | P04 — A abertura dos detalhes do chamado não era intuitiva | Afeta a descoberta da ação principal na lista de chamados. |
| Média | P03 — Não havia verificação de e-mail | Aumenta confiança e prepara fluxos futuros, mas não deve bloquear o uso inicial. |
| Média | P05 — Chamados poderiam ter categorias | Melhora organização e filtros, mas muda o domínio e precisa de refinamento. |
| Média | P06 — Card inicial não se adapta bem a viewports pequenas | Afeta a primeira impressão em mobile e viewports reduzidas. |
| Média | P07 — Itens da navegação aumentam de altura durante loading ou erro | Afeta navegação e leitura em mobile nos estados transitórios. |
| Média | P08 — Erros em formulário podem ficar pouco visíveis no mobile | Afeta percepção de falha e recuperação da ação em telas pequenas. |
| Média | P09 — Botão de sair deveria ficar no cabeçalho no mobile | Melhora organização das ações de sessão e libera espaço da navegação principal. |

## Plano de execução

1. Corrigir o redirecionamento/autenticação após cadastro.
2. Tornar explícita a abertura dos detalhes na lista de chamados.
3. Implementar recuperação de senha por e-mail.
4. Implementar verificação de e-mail não bloqueante.
5. Atualizar documentação da API, README, roadmap e fluxos de aceitação.
6. Revalidar os fluxos em ambiente publicado.

## Critérios gerais de qualidade

- Respostas relacionadas a recuperação de senha não devem permitir enumeração de
  usuários.
- Tokens de recuperação e verificação não devem ser persistidos no frontend.
- Senhas e tokens não devem aparecer em mensagens, logs ou respostas públicas.
- Fluxos devem ter testes automatizados no backend e no frontend.
- Documentação deve explicar claramente variáveis de ambiente necessárias para
  envio de e-mail.
