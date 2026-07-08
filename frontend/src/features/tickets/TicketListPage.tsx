import { useEffect, useState } from 'react'

import type { PaginatedResponse, Ticket } from '../../shared/types/api'
import { listTickets } from './api'

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

export function TicketListPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [ticketsResponse, setTicketsResponse] =
    useState<PaginatedResponse<Ticket> | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadTickets() {
      try {
        const response = await listTickets()

        if (isActive) {
          setTicketsResponse(response)
          setErrorMessage('')
        }
      } catch {
        if (isActive) {
          setErrorMessage('Não foi possível carregar os chamados.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadTickets()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <section className="content-card">
      <p className="app-eyebrow">Chamados</p>
      <h1 className="content-title">Lista de chamados</h1>
      <p className="app-description">
        Consulte os chamados cadastrados, acompanhe status e priorize o
        atendimento aos clientes.
      </p>

      {isLoading ? (
        <p className="ticket-list-feedback" role="status">
          Carregando chamados...
        </p>
      ) : null}

      {errorMessage ? (
        <p className="ticket-list-feedback form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !errorMessage && ticketsResponse ? (
        <div className="ticket-list-wrapper">
          <p className="ticket-list-count">
            {ticketsResponse.count} chamado
            {ticketsResponse.count === 1 ? '' : 's'} encontrado
            {ticketsResponse.count === 1 ? '' : 's'}.
          </p>

          {ticketsResponse.results.length === 0 ? (
            <p className="ticket-list-empty">
              Nenhum chamado encontrado com os critérios atuais.
            </p>
          ) : (
            <ul className="ticket-list" aria-label="Lista de chamados">
              {ticketsResponse.results.map((ticket) => (
                <li className="ticket-card" key={ticket.id}>
                  <div>
                    <h2 className="ticket-card-title">{ticket.title}</h2>
                    <p className="ticket-card-description">
                      {ticket.description}
                    </p>
                  </div>

                  <dl className="ticket-card-meta">
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
                      <dt>Criado em</dt>
                      <dd>{formatDate(ticket.created_at)}</dd>
                    </div>
                    <div>
                      <dt>Atualizado em</dt>
                      <dd>{formatDate(ticket.updated_at)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  )
}
