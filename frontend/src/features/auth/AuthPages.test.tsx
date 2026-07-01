import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import App from '../../App'

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
})
