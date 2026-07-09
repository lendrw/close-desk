import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import type { PaginatedResponse, Ticket } from '../../shared/types/api'
import { server } from '../../tests/msw/server'
import { TicketListPage } from './TicketListPage'

const tickets: Ticket[] = [
  {
    created_at: '2026-07-01T10:00:00Z',
    created_by: 1,
    customer_name: 'Cliente Exemplo',
    description: 'Cliente não consegue acessar o sistema.',
    due_date: null,
    id: 1,
    priority: 'urgent',
    status: 'open',
    title: 'Problema no login',
    updated_at: '2026-07-01T11:00:00Z',
  },
]

function mockTicketsResponse(results: Ticket[] = tickets) {
  const response: PaginatedResponse<Ticket> = {
    count: results.length,
    next: null,
    previous: null,
    results,
  }

  server.use(
    http.get('http://localhost:8000/api/tickets/', () => {
      return HttpResponse.json(response)
    }),
  )
}

function renderTicketListPage(route = '/tickets') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <TicketListPage />
    </MemoryRouter>,
  )
}

describe('TicketListPage', () => {
  it('renders tickets returned by the API', async () => {
    mockTicketsResponse()

    renderTicketListPage()

    expect(
      screen.getByRole('heading', { name: 'Lista de chamados' }),
    ).toBeInTheDocument()

    const ticketList = await screen.findByRole('list', {
      name: 'Lista de chamados',
    })
    const ticketCard = within(ticketList).getByRole('listitem')

    expect(ticketList).toBeInTheDocument()
    expect(screen.getByText('1 chamado encontrado.')).toBeInTheDocument()
    expect(
      within(ticketCard).getByText('Problema no login'),
    ).toBeInTheDocument()
    expect(
      within(ticketCard).getByText('Cliente não consegue acessar o sistema.'),
    ).toBeInTheDocument()
    expect(within(ticketCard).getByText('Cliente Exemplo')).toBeInTheDocument()
    expect(within(ticketCard).getByText('Aberto')).toBeInTheDocument()
    expect(within(ticketCard).getByText('Urgente')).toBeInTheDocument()
    expect(within(ticketCard).getByText('Criado em')).toBeInTheDocument()
    expect(within(ticketCard).getByText('Atualizado em')).toBeInTheDocument()
  })

  it('searches tickets using the search query parameter', async () => {
    const user = userEvent.setup()
    const requestedSearches: Array<string | null> = []

    server.use(
      http.get('http://localhost:8000/api/tickets/', ({ request }) => {
        const url = new URL(request.url)
        const search = url.searchParams.get('search')

        requestedSearches.push(search)

        if (search === 'login') {
          return HttpResponse.json({
            count: tickets.length,
            next: null,
            previous: null,
            results: tickets,
          })
        }

        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        })
      }),
    )

    renderTicketListPage()

    expect(
      await screen.findByText('0 chamados encontrados.'),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('Buscar chamados'), 'login')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(await screen.findByText('Problema no login')).toBeInTheDocument()
    expect(requestedSearches).toContain('login')
  })

  it('filters tickets by status and priority query parameters', async () => {
    const user = userEvent.setup()
    const requestedFilters: Array<{
      priority: string | null
      status: string | null
    }> = []

    server.use(
      http.get('http://localhost:8000/api/tickets/', ({ request }) => {
        const url = new URL(request.url)
        const status = url.searchParams.get('status')
        const priority = url.searchParams.get('priority')

        requestedFilters.push({ priority, status })

        if (status === 'open' && priority === 'urgent') {
          return HttpResponse.json({
            count: tickets.length,
            next: null,
            previous: null,
            results: tickets,
          })
        }

        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        })
      }),
    )

    renderTicketListPage()

    expect(
      await screen.findByText('0 chamados encontrados.'),
    ).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Status'), 'open')
    await user.selectOptions(screen.getByLabelText('Prioridade'), 'urgent')

    expect(await screen.findByText('Problema no login')).toBeInTheDocument()
    expect(requestedFilters).toContainEqual({
      priority: 'urgent',
      status: 'open',
    })
  })

  it('shows a loading state while fetching tickets', async () => {
    server.use(
      http.get('http://localhost:8000/api/tickets/', async () => {
        await delay(50)

        return HttpResponse.json({
          count: tickets.length,
          next: null,
          previous: null,
          results: tickets,
        })
      }),
    )

    renderTicketListPage()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando chamados...',
    )
    expect(
      await screen.findByRole('list', { name: 'Lista de chamados' }),
    ).toBeInTheDocument()
  })

  it('shows an error when tickets fail to load', async () => {
    server.use(
      http.get('http://localhost:8000/api/tickets/', () => {
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

    renderTicketListPage()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os chamados.',
    )
  })

  it('shows an empty state when no tickets are returned', async () => {
    mockTicketsResponse([])

    renderTicketListPage()

    expect(
      await screen.findByText('0 chamados encontrados.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Nenhum chamado encontrado com os critérios atuais.'),
    ).toBeInTheDocument()
  })

  it('orders tickets by creation date query parameter', async () => {
    const user = userEvent.setup()
    const requestedOrderings: Array<string | null> = []

    server.use(
      http.get('http://localhost:8000/api/tickets/', ({ request }) => {
        const url = new URL(request.url)
        const ordering = url.searchParams.get('ordering')

        requestedOrderings.push(ordering)

        return HttpResponse.json({
          count: tickets.length,
          next: null,
          previous: null,
          results: tickets,
        })
      }),
    )

    renderTicketListPage()

    expect(await screen.findByText('Problema no login')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Ordenação'), 'created_at')

    await waitFor(() => {
      expect(requestedOrderings).toContain('created_at')
    })
  })

  it('paginates tickets preserving current query parameters', async () => {
    const user = userEvent.setup()
    const requestedQueries: Array<{
      ordering: string | null
      page: string | null
      priority: string | null
      search: string | null
      status: string | null
    }> = []

    server.use(
      http.get('http://localhost:8000/api/tickets/', ({ request }) => {
        const url = new URL(request.url)

        requestedQueries.push({
          ordering: url.searchParams.get('ordering'),
          page: url.searchParams.get('page'),
          priority: url.searchParams.get('priority'),
          search: url.searchParams.get('search'),
          status: url.searchParams.get('status'),
        })

        return HttpResponse.json({
          count: 12,
          next: 'http://localhost:8000/api/tickets/?search=login&status=open&priority=urgent&ordering=created_at&page=2',
          previous: null,
          results: tickets,
        })
      }),
    )

    renderTicketListPage(
      '/tickets?search=login&status=open&priority=urgent&ordering=created_at',
    )

    expect(await screen.findByText('Problema no login')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Próxima' }))

    await waitFor(() => {
      expect(requestedQueries).toContainEqual({
        ordering: 'created_at',
        page: '2',
        priority: 'urgent',
        search: 'login',
        status: 'open',
      })
    })
  })

  it('supports keyboard search submission', async () => {
    const user = userEvent.setup()
    const requestedSearches: Array<string | null> = []

    server.use(
      http.get('http://localhost:8000/api/tickets/', ({ request }) => {
        const url = new URL(request.url)
        const search = url.searchParams.get('search')

        requestedSearches.push(search)

        if (search === 'login') {
          return HttpResponse.json({
            count: tickets.length,
            next: null,
            previous: null,
            results: tickets,
          })
        }

        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        })
      }),
    )

    renderTicketListPage()

    expect(
      await screen.findByText('0 chamados encontrados.'),
    ).toBeInTheDocument()

    await user.tab()
    expect(screen.getByLabelText('Buscar chamados')).toHaveFocus()

    await user.keyboard('login')
    await user.keyboard('{Enter}')

    expect(await screen.findByText('Problema no login')).toBeInTheDocument()
    expect(requestedSearches).toContain('login')
  })
})
