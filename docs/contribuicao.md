# Guia de Contribuição

## Fluxo de trabalho

- A branch `main` deve permanecer estável.
- Cada mudança deve tratar de um único objetivo.
- Mudanças devem ser feitas em branches curtas.
- Testes e verificações relacionadas devem passar antes do merge.
- A branch deve ser removida após o merge.

## Nomes de branches

Formato:

```text
tipo/descricao-curta
```

Tipos permitidos:

- `feature`: nova funcionalidade
- `fix`: correção
- `docs`: documentação
- `test`: testes
- `chore`: configuração ou manutenção
- `refactor`: alteração interna sem mudar comportamento

Exemplos:

```text
docs/add-contribution-guide
feature/user-registration
test/ticket-permissions
```

## Commits

Formato:

```text
tipo: descrição curta no imperativo
```

Exemplos:

```text
docs: add contribution guide
test: cover duplicate email registration
feature: implement user registration
```

Cada commit deve:

- Representar uma única mudança lógica.
- Permanecer pequeno e compreensível.
- Evitar alterações não relacionadas.
- Manter o projeto em estado válido.

## Pull requests

Mesmo sendo um projeto individual, funcionalidades devem preferencialmente passar por pull request para registrar contexto e decisões.

Cada pull request deve informar:

- O que foi alterado.
- Por que a mudança foi necessária.
- Como ela foi verificada.
- Qual requisito está relacionado, quando aplicável.