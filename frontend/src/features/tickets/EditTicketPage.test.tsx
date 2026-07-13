import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'

import type { Ticket } from '../../shared/types/api'
import { server } from '../../tests/msw/server'
import { EditTicketPage } from './EditTicketPage'

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

function renderEditTicketPage(route = '/tickets/1/edit') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/tickets/:ticketId/edit" element={<EditTicketPage />} />
        <Route
          path="/tickets/:ticketId"
          element={<h1>Detalhes do chamado</h1>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

function mockTicketLoad(response: Ticket = ticket) {
  server.use(
    http.get('http://localhost:8000/api/tickets/1/', () => {
      return HttpResponse.json(response)
    }),
  )
}

describe('EditTicketPage', () => {
  it('loads ticket data into the edit form', async () => {
    mockTicketLoad()

    renderEditTicketPage()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando chamado...',
    )
    expect(await screen.findByLabelText('Título')).toHaveValue(
      'Problema no login',
    )
    expect(screen.getByLabelText('Descrição')).toHaveValue(
      'Cliente não consegue acessar o sistema.',
    )
    expect(screen.getByLabelText('Cliente')).toHaveValue('Cliente Exemplo')
    expect(screen.getByLabelText('Status')).toHaveValue('open')
    expect(screen.getByLabelText('Prioridade')).toHaveValue('urgent')
    expect(screen.getByLabelText('Prazo')).toHaveValue('2026-07-20')
  })

  it('updates ticket data and redirects to details', async () => {
    const user = userEvent.setup()
    let requestBody: Record<string, unknown> | null = null

    mockTicketLoad()

    server.use(
      http.patch(
        'http://localhost:8000/api/tickets/1/',
        async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>

          requestBody = body

          return HttpResponse.json({
            ...ticket,
            ...body,
            updated_at: '2026-07-02T10:00:00Z',
          })
        },
      ),
    )

    renderEditTicketPage()

    const titleInput = await screen.findByLabelText('Título')

    await user.clear(titleInput)
    await user.type(titleInput, 'Problema no acesso')
    await user.click(screen.getByRole('button', { name: 'Atualizar chamado' }))

    expect(
      await screen.findByRole('heading', { name: 'Detalhes do chamado' }),
    ).toBeInTheDocument()
    expect(requestBody).toEqual({
      customer_name: 'Cliente Exemplo',
      description: 'Cliente não consegue acessar o sistema.',
      due_date: '2026-07-20',
      priority: 'urgent',
      status: 'open',
      title: 'Problema no acesso',
    })
  })

  it('shows an error when ticket update fails without clearing values', async () => {
    const user = userEvent.setup()

    mockTicketLoad()

    server.use(
      http.patch('http://localhost:8000/api/tickets/1/', () => {
        return HttpResponse.json(
          {
            error: {
              code: 'validation_error',
              details: {},
              message: 'Os dados enviados são inválidos.',
            },
          },
          { status: 400 },
        )
      }),
    )

    renderEditTicketPage()

    const titleInput = await screen.findByLabelText('Título')

    await user.clear(titleInput)
    await user.type(titleInput, 'Problema no acesso')
    await user.click(screen.getByRole('button', { name: 'Atualizar chamado' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível atualizar o chamado.',
    )
    expect(screen.getByLabelText('Título')).toHaveValue('Problema no acesso')
  })
})
