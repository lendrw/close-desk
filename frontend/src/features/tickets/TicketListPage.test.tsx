import { render, screen, within } from '@testing-library/react'
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
})
