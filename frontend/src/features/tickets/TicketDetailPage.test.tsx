import { render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'

import type { Ticket } from '../../shared/types/api'
import { server } from '../../tests/msw/server'
import { TicketDetailPage } from './TicketDetailPage'

const ticket: Ticket = {
  created_at: '2026-07-01T10:00:00Z',
  created_by: 1,
  customer_name: 'Cliente Exemplo',
  description: 'Cliente não consegue acessar o sistema.',
  due_date: '2026-07-20',
  id: 1,
  priority: 'urgent',
  status: 'open',
  title: 'Problema no login',
  updated_at: '2026-07-01T11:00:00Z',
}

function renderTicketDetailPage(route = '/tickets/1') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TicketDetailPage', () => {
  it('renders ticket details by identifier', async () => {
    server.use(
      http.get('http://localhost:8000/api/tickets/1/', () => {
        return HttpResponse.json(ticket)
      }),
    )

    renderTicketDetailPage()

    expect(
      await screen.findByRole('heading', { name: 'Problema no login' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Cliente não consegue acessar o sistema.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Cliente Exemplo')).toBeInTheDocument()
    expect(screen.getByText('Aberto')).toBeInTheDocument()
    expect(screen.getByText('Urgente')).toBeInTheDocument()
    expect(screen.getByText('2026-07-20')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para chamados' }),
    ).toHaveAttribute('href', '/tickets')
  })

  it('updates ticket status from the detail actions', async () => {
    const user = userEvent.setup()
    let requestBody: Record<string, unknown> | null = null

    server.use(
      http.get('http://localhost:8000/api/tickets/1/', () => {
        return HttpResponse.json(ticket)
      }),
      http.patch(
        'http://localhost:8000/api/tickets/1/',
        async ({ request }) => {
          requestBody = (await request.json()) as Record<string, unknown>

          return HttpResponse.json({
            ...ticket,
            ...requestBody,
            status: 'resolved',
            updated_at: '2026-07-01T12:00:00Z',
          })
        },
      ),
    )

    renderTicketDetailPage()

    expect(
      await screen.findByRole('heading', { name: 'Problema no login' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Marcar resolvido' }))

    await waitFor(() => {
      expect(requestBody).toEqual({
        title: 'Problema no login',
        description: 'Cliente não consegue acessar o sistema.',
        customer_name: 'Cliente Exemplo',
        due_date: '2026-07-20',
        priority: 'urgent',
        status: 'resolved',
      })
    })

    expect(
      within(screen.getByLabelText('Dados do chamado')).getByText('Resolvido'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Marcar resolvido' }),
    ).not.toBeInTheDocument()
  })

  it('shows loading state while fetching ticket details', async () => {
    server.use(
      http.get('http://localhost:8000/api/tickets/1/', () => {
        return HttpResponse.json(ticket)
      }),
    )

    renderTicketDetailPage()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando chamado...',
    )
    expect(
      await screen.findByRole('heading', { name: 'Problema no login' }),
    ).toBeInTheDocument()
  })

  it('shows not found feedback when the ticket identifier is invalid', async () => {
    renderTicketDetailPage('/tickets/invalido')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Chamado não encontrado.',
    )
  })

  it('shows an error when ticket details fail to load', async () => {
    server.use(
      http.get('http://localhost:8000/api/tickets/1/', () => {
        return HttpResponse.json(
          {
            error: {
              code: 'not_found',
              details: {},
              message: 'Recurso não encontrado.',
            },
          },
          { status: 404 },
        )
      }),
    )

    renderTicketDetailPage()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar o chamado.',
    )
  })
})
