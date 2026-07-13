import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import type { Ticket } from '../../shared/types/api'
import { getTicket, type TicketFormData, updateTicket } from './api'
import { TicketForm } from './TicketForm'

function getTicketFormData(ticket: Ticket): TicketFormData {
  return {
    customer_name: ticket.customer_name,
    description: ticket.description,
    due_date: ticket.due_date,
    priority: ticket.priority,
    status: ticket.status,
    title: ticket.title,
  }
}

export function EditTicketPage() {
  const navigate = useNavigate()
  const { ticketId } = useParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticket, setTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    let isActive = true
    const parsedTicketId = Number(ticketId)

    async function loadTicket() {
      if (!ticketId || Number.isNaN(parsedTicketId)) {
        setErrorMessage('Chamado não encontrado.')
        setIsLoading(false)
        return
      }

      setErrorMessage('')
      setIsLoading(true)

      try {
        const response = await getTicket(parsedTicketId)

        if (isActive) {
          setTicket(response)
        }
      } catch {
        if (isActive) {
          setErrorMessage('Não foi possível carregar o chamado.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadTicket()

    return () => {
      isActive = false
    }
  }, [ticketId])

  async function handleSubmit(data: TicketFormData) {
    if (!ticket) {
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const updatedTicket = await updateTicket(ticket.id, data)

      navigate(`/tickets/${updatedTicket.id}`)
    } catch {
      setErrorMessage('Não foi possível atualizar o chamado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="content-card">
      <p className="app-eyebrow">Editar chamado</p>
      <h1 className="content-title">Editar chamado</h1>
      <p className="app-description">
        Atualize as informações do atendimento mantendo o histórico organizado.
      </p>

      {isLoading ? (
        <p className="ticket-list-feedback" role="status">
          Carregando chamado...
        </p>
      ) : null}

      {errorMessage ? (
        <p className="ticket-list-feedback form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && ticket ? (
        <TicketForm
          defaultValues={getTicketFormData(ticket)}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Atualizar chamado"
        />
      ) : null}
    </section>
  )
}
