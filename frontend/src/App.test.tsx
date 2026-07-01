import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'
import {
  getAccessToken,
  getCurrentUser,
  getRefreshToken,
  saveAuthTokens,
  setCurrentUser,
} from './features/auth/session'

describe('App', () => {
  afterEach(() => {
    setCurrentUser(null)
  })

  it('renders the home page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'CloseDesk' }),
    ).toBeInTheDocument()
  })

  it('redirects visitors from dashboard to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('renders dashboard for authenticated users', () => {
    setCurrentUser({
      email: 'ada@example.com',
      id: 1,
      name: 'Ada Lovelace',
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/dashboard',
    )
    expect(screen.getByRole('link', { name: 'Chamados' })).toHaveAttribute(
      'href',
      '/tickets',
    )
    expect(screen.getByRole('link', { name: 'Novo chamado' })).toHaveAttribute(
      'href',
      '/tickets/new',
    )
  })

  it('logs out and redirects to login', async () => {
    const user = userEvent.setup()
    setCurrentUser({
      email: 'ada@example.com',
      id: 1,
      name: 'Ada Lovelace',
    })
    saveAuthTokens({
      access: 'access-token',
      refresh: 'refresh-token',
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Sair' }))

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(getAccessToken()).toBeNull()
    expect(getCurrentUser()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })
})
