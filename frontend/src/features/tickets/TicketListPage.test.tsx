import { render, screen } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
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

describe('TicketListPage', () => {
  it('renders tickets returned by the API', async () => {
    mockTicketsResponse()

    render(<TicketListPage />)

    expect(
      screen.getByRole('heading', { name: 'Lista de chamados' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('list', { name: 'Lista de chamados' }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 chamado encontrado.')).toBeInTheDocument()
    expect(screen.getByText('Problema no login')).toBeInTheDocument()
    expect(
      screen.getByText('Cliente não consegue acessar o sistema.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Cliente Exemplo')).toBeInTheDocument()
    expect(screen.getByText('Aberto')).toBeInTheDocument()
    expect(screen.getByText('Urgente')).toBeInTheDocument()
    expect(screen.getByText('Criado em')).toBeInTheDocument()
    expect(screen.getByText('Atualizado em')).toBeInTheDocument()
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

    render(<TicketListPage />)

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

    render(<TicketListPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os chamados.',
    )
  })

  it('shows an empty state when no tickets are returned', async () => {
    mockTicketsResponse([])

    render(<TicketListPage />)

    expect(
      await screen.findByText('0 chamados encontrados.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Nenhum chamado encontrado com os critérios atuais.'),
    ).toBeInTheDocument()
  })
})
