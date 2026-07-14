import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import type { Ticket, TicketStatus } from '../../shared/types/api'
import { deleteTicket, getTicket, updateTicket } from './api'

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

const statusActions: Array<{ label: string; value: TicketStatus }> = [
  { label: 'Reabrir chamado', value: 'open' },
  { label: 'Marcar em andamento', value: 'in_progress' },
  { label: 'Marcar resolvido', value: 'resolved' },
  { label: 'Fechar chamado', value: 'closed' },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function TicketDetailPage() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusErrorMessage, setStatusErrorMessage] = useState('')
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('')

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
      setStatusErrorMessage('')
      setIsLoading(true)
      setDeleteErrorMessage('')
      setIsDeleteConfirmationOpen(false)

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

  async function handleStatusChange(nextStatus: TicketStatus) {
    if (!ticket || ticket.status === nextStatus) {
      return
    }

    setStatusErrorMessage('')
    setIsUpdatingStatus(true)

    try {
      const updatedTicket = await updateTicket(ticket.id, {
        title: ticket.title,
        description: ticket.description,
        customer_name: ticket.customer_name,
        due_date: ticket.due_date,
        priority: ticket.priority,
        status: nextStatus,
      })

      setTicket(updatedTicket)
    } catch {
      setStatusErrorMessage('Não foi possível atualizar o status do chamado.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  async function handleDeleteTicket() {
    if (!ticket) {
      return
    }

    setDeleteErrorMessage('')
    setIsDeleting(true)

    try {
      await deleteTicket(ticket.id)
      navigate('/tickets')
    } catch {
      setDeleteErrorMessage('Não foi possível excluir o chamado.')
    } finally {
      setIsDeleting(false)
    }
  }

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

          <dl aria-label="Dados do chamado" className="ticket-detail-meta">
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

          {statusErrorMessage ? (
            <p className="ticket-list-feedback form-error" role="alert">
              {statusErrorMessage}
            </p>
          ) : null}

          {deleteErrorMessage ? (
            <p className="ticket-list-feedback form-error" role="alert">
              {deleteErrorMessage}
            </p>
          ) : null}

          {isDeleteConfirmationOpen ? (
            <section
              aria-labelledby="delete-ticket-title"
              className="ticket-delete-confirmation"
              role="alertdialog"
            >
              <h2 id="delete-ticket-title">Excluir chamado?</h2>
              <p>
                Esta ação remove o chamado permanentemente e não poderá ser
                desfeita.
              </p>

              <div className="app-actions">
                <button
                  className="app-link ticket-danger-button"
                  disabled={isDeleting}
                  onClick={() => void handleDeleteTicket()}
                  type="button"
                >
                  {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
                </button>
                <button
                  className="app-link app-link-secondary ticket-status-button"
                  disabled={isDeleting}
                  onClick={() => {
                    setDeleteErrorMessage('')
                    setIsDeleteConfirmationOpen(false)
                  }}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </section>
          ) : null}

          <div className="app-actions ticket-detail-actions">
            <Link className="app-link" to={`/tickets/${ticket.id}/edit`}>
              Editar chamado
            </Link>

            {statusActions
              .filter((statusAction) => statusAction.value !== ticket.status)
              .map((statusAction) => (
                <button
                  className="app-link ticket-status-button"
                  disabled={isUpdatingStatus}
                  key={statusAction.value}
                  onClick={() => void handleStatusChange(statusAction.value)}
                  type="button"
                >
                  {isUpdatingStatus ? 'Atualizando...' : statusAction.label}
                </button>
              ))}

            <button
              className="app-link app-link-secondary ticket-danger-link"
              disabled={isDeleting}
              onClick={() => {
                setDeleteErrorMessage('')
                setIsDeleteConfirmationOpen(true)
              }}
              type="button"
            >
              Excluir chamado
            </button>

            <Link className="app-link app-link-secondary" to="/tickets">
              Voltar para chamados
            </Link>
          </div>
        </>
      ) : null}
    </section>
  )
}
