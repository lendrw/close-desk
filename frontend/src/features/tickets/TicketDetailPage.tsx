import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import type { Ticket } from '../../shared/types/api'
import { getTicket } from './api'

const statusLabels: Record<Ticket['status'], string> = {
  closed: 'Fechado',
  in_progress: 'Em andamento',
  open: 'Aberto',
  resolved: 'Resolvido',
}

const priorityLabels: Record<Ticket['priority'], string> = {
  high: 'Alta',
  low: 'Baixa',
  medium: 'Média',
  urgent: 'Urgente',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function TicketDetailPage() {
  const { ticketId } = useParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
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

  return (
    <section className="content-card">
      <p className="app-eyebrow">Chamado</p>

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

      {!isLoading && !errorMessage && ticket ? (
        <>
          <h1 className="content-title">{ticket.title}</h1>
          <p className="app-description">{ticket.description}</p>

          <dl className="ticket-detail-meta">
            <div>
              <dt>Cliente</dt>
              <dd>{ticket.customer_name}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{statusLabels[ticket.status]}</dd>
            </div>
            <div>
              <dt>Prioridade</dt>
              <dd>{priorityLabels[ticket.priority]}</dd>
            </div>
            <div>
              <dt>Prazo</dt>
              <dd>{ticket.due_date ?? 'Sem prazo'}</dd>
            </div>
            <div>
              <dt>Criado em</dt>
              <dd>{formatDate(ticket.created_at)}</dd>
            </div>
            <div>
              <dt>Atualizado em</dt>
              <dd>{formatDate(ticket.updated_at)}</dd>
            </div>
          </dl>

          <div className="app-actions">
            <Link className="app-link app-link-secondary" to="/tickets">
              Voltar para chamados
            </Link>
          </div>
        </>
      ) : null}
    </section>
  )
}
