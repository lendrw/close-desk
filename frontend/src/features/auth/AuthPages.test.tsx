import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import App from '../../App'
import { server } from '../../tests/msw/server'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Auth pages', () => {
  it('renders the login form', () => {
    renderRoute('/login')

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('shows login validation errors associated with fields', async () => {
    const user = userEvent.setup()
    renderRoute('/login')

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(
      'Informe seu e-mail.',
    )
    expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription(
      'Informe sua senha.',
    )
  })

  it('submits valid login credentials', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('http://localhost:8000/api/auth/token/', () => {
        return HttpResponse.json({
          access: 'access-token',
          refresh: 'refresh-token',
        })
      }),
    )

    renderRoute('/login')

    await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'securepass123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Login realizado com sucesso.',
    )
  })

  it('shows an error when login fails', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('http://localhost:8000/api/auth/token/', () => {
        return HttpResponse.json(
          {
            error: {
              code: 'authentication_error',
              details: {},
              message: 'Credenciais inválidas.',
            },
          },
          { status: 401 },
        )
      }),
    )

    renderRoute('/login')

    await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'wrongpass123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível entrar com essas credenciais.',
    )
  })

  it('renders the register form', () => {
    renderRoute('/register')

    expect(
      screen.getByRole('heading', { name: 'Criar conta' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('shows register validation errors associated with fields', async () => {
    const user = userEvent.setup()
    renderRoute('/register')

    await user.type(screen.getByLabelText('E-mail'), 'email-invalido')
    await user.type(screen.getByLabelText('Senha'), '123')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription(
      'Informe seu nome.',
    )
    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(
      'Informe um e-mail válido.',
    )
    expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription(
      'A senha deve ter no mínimo 8 caracteres.',
    )
  })

  it('submits valid register data', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('http://localhost:8000/api/auth/register/', () => {
        return HttpResponse.json(
          {
            email: 'ada@example.com',
            id: 1,
            name: 'Ada Lovelace',
          },
          { status: 201 },
        )
      }),
    )

    renderRoute('/register')

    await user.type(screen.getByLabelText('Nome'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'securepass123')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Cadastro realizado com sucesso.',
    )
  })

  it('shows an error when register fails', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('http://localhost:8000/api/auth/register/', () => {
        return HttpResponse.json(
          {
            error: {
              code: 'validation_error',
              details: {
                email: ['Este e-mail já está em uso.'],
              },
              message: 'Os dados enviados são inválidos.',
            },
          },
          { status: 400 },
        )
      }),
    )

    renderRoute('/register')

    await user.type(screen.getByLabelText('Nome'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'securepass123')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível criar a conta.',
    )
  })
})
