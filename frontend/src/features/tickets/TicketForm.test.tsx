import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TicketForm } from './TicketForm'

describe('TicketForm', () => {
  it('renders ticket fields with default values', () => {
    render(<TicketForm onSubmit={vi.fn()} submitLabel="Salvar chamado" />)

    expect(screen.getByLabelText('Título')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
    expect(screen.getByLabelText('Cliente')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toHaveValue('open')
    expect(screen.getByLabelText('Prioridade')).toHaveValue('medium')
    expect(screen.getByLabelText('Prazo')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Salvar chamado' }),
    ).toBeInTheDocument()
  })

  it('shows validation errors and keeps typed values', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    render(<TicketForm onSubmit={handleSubmit} submitLabel="Salvar chamado" />)

    await user.type(screen.getByLabelText('Título'), 'AB')
    await user.type(screen.getByLabelText('Descrição'), 'Curta')
    await user.type(screen.getByLabelText('Cliente'), 'A')
    await user.click(screen.getByRole('button', { name: 'Salvar chamado' }))

    expect(handleSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Título')).toHaveValue('AB')
    expect(screen.getByLabelText('Descrição')).toHaveValue('Curta')
    expect(screen.getByLabelText('Cliente')).toHaveValue('A')
    expect(
      screen.getByText('Informe um título com pelo menos 3 caracteres.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Informe uma descrição com pelo menos 10 caracteres.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Informe o nome do cliente.')).toBeInTheDocument()
  })

  it('submits valid ticket data', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    render(<TicketForm onSubmit={handleSubmit} submitLabel="Salvar chamado" />)

    await user.type(screen.getByLabelText('Título'), 'Problema no login')
    await user.type(
      screen.getByLabelText('Descrição'),
      'Cliente não consegue acessar o sistema.',
    )
    await user.type(screen.getByLabelText('Cliente'), 'Cliente Exemplo')
    await user.selectOptions(screen.getByLabelText('Prioridade'), 'urgent')
    await user.type(screen.getByLabelText('Prazo'), '2026-07-20')
    await user.click(screen.getByRole('button', { name: 'Salvar chamado' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      customer_name: 'Cliente Exemplo',
      description: 'Cliente não consegue acessar o sistema.',
      due_date: '2026-07-20',
      priority: 'urgent',
      status: 'open',
      title: 'Problema no login',
    })
  })

  it('renders custom default values and submitting state', () => {
    render(
      <TicketForm
        defaultValues={{
          customer_name: 'Cliente Atual',
          description: 'Descrição atual do chamado.',
          due_date: '2026-07-20',
          priority: 'high',
          status: 'in_progress',
          title: 'Chamado atual',
        }}
        isSubmitting
        onSubmit={vi.fn()}
        submitLabel="Atualizar chamado"
      />,
    )

    expect(screen.getByLabelText('Título')).toHaveValue('Chamado atual')
    expect(screen.getByLabelText('Descrição')).toHaveValue(
      'Descrição atual do chamado.',
    )
    expect(screen.getByLabelText('Cliente')).toHaveValue('Cliente Atual')
    expect(screen.getByLabelText('Status')).toHaveValue('in_progress')
    expect(screen.getByLabelText('Prioridade')).toHaveValue('high')
    expect(screen.getByLabelText('Prazo')).toHaveValue('2026-07-20')
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled()
  })
})
