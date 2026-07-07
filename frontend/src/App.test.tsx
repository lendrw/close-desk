import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse, delay } from 'msw'
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
import type { DashboardSummary } from './shared/types/api'
import { server } from './tests/msw/server'

const dashboardSummary: DashboardSummary = {
  by_status: {
    closed: 2,
    in_progress: 2,
    open: 1,
    resolved: 1,
  },
  total: 6,
  urgent: 3,
}

const emptyDashboardSummary: DashboardSummary = {
  by_status: {
    closed: 0,
    in_progress: 0,
    open: 0,
    resolved: 0,
  },
  total: 0,
  urgent: 0,
}

function mockDashboardSummary(summary: DashboardSummary = dashboardSummary) {
  server.use(
    http.get('http://localhost:8000/api/dashboard/summary/', () => {
      return HttpResponse.json(summary)
    }),
  )
}

function authenticateUser() {
  setCurrentUser({
    email: 'ada@example.com',
    id: 1,
    name: 'Ada Lovelace',
  })
}

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <App />
    </MemoryRouter>,
  )
}

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
    mockDashboardSummary()
    authenticateUser()

    renderDashboard()

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

  it('renders dashboard indicators from the API', async () => {
    mockDashboardSummary()
    authenticateUser()

    renderDashboard()

    expect(await screen.findByLabelText('Total de chamados')).toHaveTextContent(
      '6',
    )
    expect(screen.getByLabelText('Chamados abertos')).toHaveTextContent('1')
    expect(screen.getByLabelText('Chamados em andamento')).toHaveTextContent(
      '2',
    )
    expect(screen.getByLabelText('Chamados resolvidos')).toHaveTextContent('1')
    expect(screen.getByLabelText('Chamados fechados')).toHaveTextContent('2')
    expect(screen.getByLabelText('Chamados urgentes')).toHaveTextContent('3')
  })

  it('shows a dashboard loading state', async () => {
    server.use(
      http.get('http://localhost:8000/api/dashboard/summary/', async () => {
        await delay(50)

        return HttpResponse.json(dashboardSummary)
      }),
    )
    authenticateUser()

    renderDashboard()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando indicadores...',
    )
    expect(await screen.findByLabelText('Total de chamados')).toHaveTextContent(
      '6',
    )
  })

  it('shows dashboard indicators when all values are zero', async () => {
    mockDashboardSummary(emptyDashboardSummary)
    authenticateUser()

    renderDashboard()

    expect(await screen.findByLabelText('Total de chamados')).toHaveTextContent(
      '0',
    )
    expect(screen.getByLabelText('Chamados abertos')).toHaveTextContent('0')
    expect(screen.getByLabelText('Chamados em andamento')).toHaveTextContent(
      '0',
    )
    expect(screen.getByLabelText('Chamados resolvidos')).toHaveTextContent('0')
    expect(screen.getByLabelText('Chamados fechados')).toHaveTextContent('0')
    expect(screen.getByLabelText('Chamados urgentes')).toHaveTextContent('0')
  })

  it('shows an error when dashboard indicators fail to load', async () => {
    server.use(
      http.get('http://localhost:8000/api/dashboard/summary/', () => {
        return HttpResponse.json(
          {
            error: {
              code: 'server_error',
              details: {},
              message: 'Erro interno.',
            },
          },
          { status: 500 },
        )
      }),
    )
    authenticateUser()

    renderDashboard()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os indicadores.',
    )
  })

  it('logs out and redirects to login', async () => {
    const user = userEvent.setup()
    mockDashboardSummary()
    authenticateUser()
    saveAuthTokens({
      access: 'access-token',
      refresh: 'refresh-token',
    })

    renderDashboard()

    await user.click(screen.getByRole('button', { name: 'Sair' }))

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(getAccessToken()).toBeNull()
    expect(getCurrentUser()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })
})
