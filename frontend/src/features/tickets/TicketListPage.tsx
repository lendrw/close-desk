import { type FormEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import type {
  PaginatedResponse,
  Ticket,
  TicketPriority,
  TicketStatus,
} from '../../shared/types/api'
import { listTickets, type TicketOrdering } from './api'

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

const statusFilterOptions: Array<{ label: string; value: TicketStatus }> = [
  { label: 'Aberto', value: 'open' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Resolvido', value: 'resolved' },
  { label: 'Fechado', value: 'closed' },
]

const priorityFilterOptions: Array<{ label: string; value: TicketPriority }> = [
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
]

const orderingOptions: Array<{ label: string; value: TicketOrdering }> = [
  { label: 'Mais recentes primeiro', value: '-created_at' },
  { label: 'Mais antigos primeiro', value: 'created_at' },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function TicketListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search')?.trim() ?? ''
  const status = searchParams.get('status') as TicketStatus | null
  const priority = searchParams.get('priority') as TicketPriority | null
  const ordering =
    (searchParams.get('ordering') as TicketOrdering | null) ?? '-created_at'
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [ticketsResponse, setTicketsResponse] =
    useState<PaginatedResponse<Ticket> | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadTickets() {
      setErrorMessage('')
      setIsLoading(true)

      try {
        const response = await listTickets({
          ordering,
          priority: priority || undefined,
          search: search || undefined,
          status: status || undefined,
        })

        if (isActive) {
          setTicketsResponse(response)
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
  }, [ordering, priority, search, status])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const nextSearch = String(formData.get('search') ?? '').trim()
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextSearch) {
      nextSearchParams.set('search', nextSearch)
    } else {
      nextSearchParams.delete('search')
    }

    nextSearchParams.delete('page')
    setSearchParams(nextSearchParams)
  }

  function handleFilterChange(
    name: 'status' | 'priority' | 'ordering',
    value: string,
  ) {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (value && !(name === 'ordering' && value === '-created_at')) {
      nextSearchParams.set(name, value)
    } else {
      nextSearchParams.delete(name)
    }

    nextSearchParams.delete('page')
    setSearchParams(nextSearchParams)
  }

  return (
    <section className="content-card">
      <p className="app-eyebrow">Chamados</p>
      <h1 className="content-title">Lista de chamados</h1>
      <p className="app-description">
        Consulte os chamados cadastrados, acompanhe status e priorize o
        atendimento aos clientes.
      </p>

      <form
        className="ticket-list-toolbar"
        onSubmit={handleSearchSubmit}
        role="search"
      >
        <label className="form-label" htmlFor="ticket-search">
          Buscar chamados
        </label>
        <div className="ticket-search-row">
          <input
            className="form-input"
            defaultValue={search}
            id="ticket-search"
            key={search}
            name="search"
            placeholder="Busque por título ou cliente"
            type="search"
          />
          <button
            className="app-link auth-submit ticket-search-submit"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="ticket-filter-row" aria-label="Filtros de chamados">
        <label className="form-field">
          <span className="form-label">Status</span>
          <select
            className="form-input"
            onChange={(event) => {
              handleFilterChange('status', event.target.value)
            }}
            value={status ?? ''}
          >
            <option value="">Todos</option>
            {statusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Prioridade</span>
          <select
            className="form-input"
            onChange={(event) => {
              handleFilterChange('priority', event.target.value)
            }}
            value={priority ?? ''}
          >
            <option value="">Todas</option>
            {priorityFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Ordenação</span>
          <select
            className="form-input"
            onChange={(event) => {
              handleFilterChange('ordering', event.target.value)
            }}
            value={ordering}
          >
            {orderingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

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
