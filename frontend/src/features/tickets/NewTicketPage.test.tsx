import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../tests/msw/server'
import { NewTicketPage } from './NewTicketPage'

async function fillValidTicketForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Título'), 'Problema no login')
  await user.type(
    screen.getByLabelText('Descrição'),
    'Cliente não consegue acessar o sistema.',
  )
  await user.type(screen.getByLabelText('Cliente'), 'Cliente Exemplo')
  await user.selectOptions(screen.getByLabelText('Prioridade'), 'urgent')
  await user.type(screen.getByLabelText('Prazo'), '2026-07-20')
}

describe('NewTicketPage', () => {
  it('creates a ticket successfully', async () => {
    const user = userEvent.setup()
    let requestBody: Record<string, unknown> | null = null

    server.use(
      http.post('http://localhost:8000/api/tickets/', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>

        requestBody = body

        return HttpResponse.json(
          {
            ...body,
            created_at: '2026-07-01T10:00:00Z',
            created_by: 1,
            id: 1,
            updated_at: '2026-07-01T10:00:00Z',
          },
          { status: 201 },
        )
      }),
    )

    render(<NewTicketPage />)

    await fillValidTicketForm(user)
    await user.click(screen.getByRole('button', { name: 'Criar chamado' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Chamado criado com sucesso.',
    )
    expect(requestBody).toEqual({
      customer_name: 'Cliente Exemplo',
      description: 'Cliente não consegue acessar o sistema.',
      due_date: '2026-07-20',
      priority: 'urgent',
      status: 'open',
      title: 'Problema no login',
    })
  })

  it('shows an error when ticket creation fails without clearing values', async () => {
    const user = userEvent.setup()

    server.use(
      http.post('http://localhost:8000/api/tickets/', () => {
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

    render(<NewTicketPage />)

    await fillValidTicketForm(user)
    await user.click(screen.getByRole('button', { name: 'Criar chamado' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível criar o chamado.',
    )
    expect(screen.getByLabelText('Título')).toHaveValue('Problema no login')
    expect(screen.getByLabelText('Cliente')).toHaveValue('Cliente Exemplo')
  })
})
