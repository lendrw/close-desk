import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import App from '../../App'
import { server } from '../../tests/msw/server'
import {
  clearAuthTokens,
  getAccessToken,
  getCurrentUser,
  getRefreshToken,
  saveAuthTokens,
} from './session'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Auth pages', () => {
  afterEach(() => {
    clearAuthTokens()
  })

  it('renders the login form', () => {
    renderRoute('/login')

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Recuperar acesso' }),
    ).toHaveAttribute('href', '/forgot-password')
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
      http.get('http://localhost:8000/api/auth/me/', () => {
        return HttpResponse.json({
          email: 'ada@example.com',
          id: 1,
          is_email_verified: false,
          name: 'Ada Lovelace',
        })
      }),
      http.get('http://localhost:8000/api/dashboard/summary/', () => {
        return HttpResponse.json({
          by_status: {
            closed: 0,
            in_progress: 0,
            open: 0,
            resolved: 0,
          },
          total: 0,
          urgent: 0,
        })
      }),
    )

    renderRoute('/login')

    await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'securepass123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(getAccessToken()).toBe('access-token')
    expect(getRefreshToken()).toBe('refresh-token')
    expect(sessionStorage.getItem('closedesk.accessToken')).toBeNull()
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

  it('renders the forgot password form', () => {
    renderRoute('/forgot-password')

    expect(
      screen.getByRole('heading', { name: 'Esqueci minha senha' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Enviar instruções' }),
    ).toBeInTheDocument()
  })

  it('shows forgot password validation errors associated with fields', async () => {
    const user = userEvent.setup()
    renderRoute('/forgot-password')

    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }))

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(
      'Informe seu e-mail.',
    )
  })

  it('requests password reset instructions', async () => {
    const user = userEvent.setup()
    let requestBody: Record<string, unknown> | null = null

    server.use(
      http.post(
        'http://localhost:8000/api/auth/password-reset/',
        async ({ request }) => {
          requestBody = (await request.json()) as Record<string, unknown>

          return HttpResponse.json({
            message:
              'Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.',
          })
        },
      ),
    )

    renderRoute('/forgot-password')

    await user.type(screen.getByLabelText('E-mail'), 'ADA@Example.COM')
    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }))

    expect(requestBody).toEqual({ email: 'ADA@Example.COM' })
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.',
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows an error when password reset request fails', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('http://localhost:8000/api/auth/password-reset/', () => {
        return HttpResponse.json(
          {
            error: {
              code: 'internal_error',
              details: {},
              message: 'Erro interno do servidor.',
            },
          },
          { status: 500 },
        )
      }),
    )

    renderRoute('/forgot-password')

    await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível solicitar a redefinição agora. Tente novamente em instantes.',
    )
  })

  it('renders the reset password form without exposing token values', () => {
    renderRoute('/reset-password/user-uid/reset-token')

    expect(
      screen.getByRole('heading', { name: 'Criar nova senha' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nova senha')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Salvar nova senha' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('user-uid')).not.toBeInTheDocument()
    expect(screen.queryByText('reset-token')).not.toBeInTheDocument()
  })

  it('shows reset password validation errors associated with fields', async () => {
    const user = userEvent.setup()
    renderRoute('/reset-password/user-uid/reset-token')

    await user.type(screen.getByLabelText('Nova senha'), 'short')
    await user.click(screen.getByRole('button', { name: 'Salvar nova senha' }))

    expect(screen.getByLabelText('Nova senha')).toHaveAccessibleDescription(
      'A senha deve ter no mínimo 8 caracteres.',
    )
  })

  it('confirms password reset with token values from the route', async () => {
    const user = userEvent.setup()
    let requestBody: Record<string, unknown> | null = null

    server.use(
      http.post(
        'http://localhost:8000/api/auth/password-reset/confirm/',
        async ({ request }) => {
          requestBody = (await request.json()) as Record<string, unknown>

          return HttpResponse.json({
            message: 'Senha redefinida com sucesso.',
          })
        },
      ),
    )

    renderRoute('/reset-password/user-uid/reset-token')

    await user.type(screen.getByLabelText('Nova senha'), 'newpass123')
    await user.click(screen.getByRole('button', { name: 'Salvar nova senha' }))

    expect(requestBody).toEqual({
      password: 'newpass123',
      token: 'reset-token',
      uid: 'user-uid',
    })
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Senha redefinida com sucesso.',
    )
    expect(screen.queryByLabelText('Nova senha')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('shows an error when password reset confirmation fails', async () => {
    const user = userEvent.setup()

    server.use(
      http.post(
        'http://localhost:8000/api/auth/password-reset/confirm/',
        () => {
          return HttpResponse.json(
            {
              error: {
                code: 'validation_error',
                details: {
                  token: ['Link de redefinição inválido ou expirado.'],
                },
                message: 'Os dados enviados são inválidos.',
              },
            },
            { status: 400 },
          )
        },
      ),
    )

    renderRoute('/reset-password/user-uid/invalid-token')

    await user.type(screen.getByLabelText('Nova senha'), 'newpass123')
    await user.click(screen.getByRole('button', { name: 'Salvar nova senha' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível redefinir a senha. Solicite um novo link e tente novamente.',
    )
    expect(screen.getByLabelText('Nova senha')).toHaveValue('newpass123')
  })

  it('confirms email verification with token values from the route', async () => {
    let requestBody: Record<string, unknown> | null = null

    server.use(
      http.post(
        'http://localhost:8000/api/auth/email-verification/confirm/',
        async ({ request }) => {
          requestBody = (await request.json()) as Record<string, unknown>

          return HttpResponse.json({
            message: 'E-mail verificado com sucesso.',
          })
        },
      ),
    )

    renderRoute('/verify-email/user-uid/verification-token')

    expect(
      await screen.findByText('E-mail verificado com sucesso.'),
    ).toHaveAttribute('role', 'status')
    expect(requestBody).toEqual({
      token: 'verification-token',
      uid: 'user-uid',
    })
    expect(screen.queryByText('verification-token')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('refreshes the current user when confirming email verification while authenticated', async () => {
    saveAuthTokens({
      access: 'access-token',
      refresh: 'refresh-token',
    })

    server.use(
      http.post(
        'http://localhost:8000/api/auth/email-verification/confirm/',
        () => {
          return HttpResponse.json({
            message: 'E-mail verificado com sucesso.',
          })
        },
      ),
      http.get('http://localhost:8000/api/auth/me/', () => {
        return HttpResponse.json({
          email: 'ada@example.com',
          id: 1,
          is_email_verified: true,
          name: 'Ada Lovelace',
        })
      }),
    )

    renderRoute('/verify-email/user-uid/verification-token')

    expect(
      await screen.findByText('E-mail verificado com sucesso.'),
    ).toHaveAttribute('role', 'status')
    expect(getCurrentUser()?.is_email_verified).toBe(true)
    expect(
      screen.getByRole('link', { name: 'Ir para o dashboard' }),
    ).toHaveAttribute('href', '/dashboard')
  })

  it('shows an error when email verification fails', async () => {
    server.use(
      http.post(
        'http://localhost:8000/api/auth/email-verification/confirm/',
        () => {
          return HttpResponse.json(
            {
              error: {
                code: 'validation_error',
                details: {
                  token: ['Link de verificação inválido ou expirado.'],
                },
                message: 'Os dados enviados são inválidos.',
              },
            },
            { status: 400 },
          )
        },
      ),
    )

    renderRoute('/verify-email/user-uid/invalid-token')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível verificar o e-mail. Solicite um novo link.',
    )
    expect(screen.queryByText('invalid-token')).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar ao dashboard' }),
    ).toHaveAttribute('href', '/dashboard')
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
            is_email_verified: false,
            name: 'Ada Lovelace',
          },
          { status: 201 },
        )
      }),
      http.post(
        'http://localhost:8000/api/auth/token/',
        async ({ request }) => {
          expect(await request.json()).toEqual({
            email: 'ada@example.com',
            password: 'securepass123',
          })

          return HttpResponse.json({
            access: 'access-token',
            refresh: 'refresh-token',
          })
        },
      ),
      http.get('http://localhost:8000/api/auth/me/', () => {
        return HttpResponse.json({
          email: 'ada@example.com',
          id: 1,
          is_email_verified: false,
          name: 'Ada Lovelace',
        })
      }),
      http.get('http://localhost:8000/api/dashboard/summary/', () => {
        return HttpResponse.json({
          by_status: {
            closed: 0,
            in_progress: 0,
            open: 0,
            resolved: 0,
          },
          total: 0,
          urgent: 0,
        })
      }),
    )

    renderRoute('/register')

    await user.type(screen.getByLabelText('Nome'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('E-mail'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'securepass123')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      await screen.findByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(getAccessToken()).toBe('access-token')
    expect(getRefreshToken()).toBe('refresh-token')
    expect(sessionStorage.getItem('closedesk.accessToken')).toBeNull()
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

    expect(await screen.findByLabelText('E-mail')).toHaveAccessibleDescription(
      'Este e-mail já está em uso.',
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Este e-mail já está em uso.',
    )
  })
})
