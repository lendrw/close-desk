import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'
import { setCurrentUser } from './features/auth/session'

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
  })
})
