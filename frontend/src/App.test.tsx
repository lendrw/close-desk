import { render, screen, within } from '@testing-library/react'
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
import type {
  DashboardSummary,
  PaginatedResponse,
  Ticket,
} from './shared/types/api'
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

const createdTicket: Ticket = {
  created_at: '2026-07-01T10:00:00Z',
  created_by: 1,
  customer_name: 'Cliente Exemplo',
  description: 'Cliente não consegue acessar o sistema.',
  due_date: '2026-07-20',
  id: 1,
  priority: 'urgent',
  status: 'open',
  title: 'Problema no login',
  updated_at: '2026-07-01T10:00:00Z',
}

const ticketListAfterCreation: PaginatedResponse<Ticket> = {
  count: 1,
  next: null,
  previous: null,
  results: [createdTicket],
}

const dashboardAfterCreation: DashboardSummary = {
  by_status: {
    closed: 0,
    in_progress: 0,
    open: 1,
    resolved: 0,
  },
  total: 1,
  urgent: 1,
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

async function fillTicketCreationForm(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByLabelText('Título'), 'Problema no login')
  await user.type(
    screen.getByLabelText('Descrição'),
    'Cliente não consegue acessar o sistema.',
  )
  await user.type(screen.getByLabelText('Cliente'), 'Cliente Exemplo')
  await user.selectOptions(screen.getByLabelText('Prioridade'), 'urgent')
  await user.type(screen.getByLabelText('Prazo'), '2026-07-20')
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

  it('redirects visitors from dashboard to login', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Restaurando sessão...',
    )
    expect(
      await screen.findByRole('heading', { name: 'Entrar' }),
    ).toBeInTheDocument()
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

    const header = screen.getByRole('banner')
    const navigation = screen.getByRole('navigation', {
      name: 'Navegação principal',
    })

    expect(
      within(header).getByRole('button', { name: 'Sair' }),
    ).toBeInTheDocument()
    expect(
      within(navigation).queryByRole('button', { name: 'Sair' }),
    ).not.toBeInTheDocument()
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

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação principal',
    })
    const header = screen.getByRole('banner')

    expect(
      within(navigation).getByRole('link', { name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(
      within(navigation).getByRole('link', { name: 'Chamados' }),
    ).toBeInTheDocument()
    expect(
      within(navigation).getByRole('link', { name: 'Novo chamado' }),
    ).toBeInTheDocument()
    expect(
      within(navigation).queryByRole('button', { name: 'Sair' }),
    ).not.toBeInTheDocument()
    expect(
      within(header).getByRole('button', { name: 'Sair' }),
    ).toBeInTheDocument()

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

  it('refreshes ticket list and dashboard after creating a ticket', async () => {
    const user = userEvent.setup()
    let listRequests = 0
    let dashboardRequests = 0

    authenticateUser()

    server.use(
      http.post('http://localhost:8000/api/tickets/', () => {
        return HttpResponse.json(createdTicket, { status: 201 })
      }),
      http.get('http://localhost:8000/api/tickets/', () => {
        listRequests += 1

        return HttpResponse.json(ticketListAfterCreation)
      }),
      http.get('http://localhost:8000/api/dashboard/summary/', () => {
        dashboardRequests += 1

        return HttpResponse.json(dashboardAfterCreation)
      }),
    )

    render(
      <MemoryRouter initialEntries={['/tickets/new']}>
        <App />
      </MemoryRouter>,
    )

    await fillTicketCreationForm(user)
    await user.click(screen.getByRole('button', { name: 'Criar chamado' }))

    expect(await screen.findByText('Problema no login')).toBeInTheDocument()
    expect(screen.getByText('1 chamado encontrado.')).toBeInTheDocument()
    expect(listRequests).toBeGreaterThan(0)

    await user.click(screen.getByRole('link', { name: 'Dashboard' }))

    expect(await screen.findByLabelText('Total de chamados')).toHaveTextContent(
      '1',
    )
    expect(screen.getByLabelText('Chamados abertos')).toHaveTextContent('1')
    expect(screen.getByLabelText('Chamados urgentes')).toHaveTextContent('1')
    expect(dashboardRequests).toBeGreaterThan(0)
  })
})
