import { useEffect, useState } from 'react'

import type { DashboardSummary } from '../../shared/types/api'
import { fetchDashboardSummary } from './api'

const emptySummary: DashboardSummary = {
  by_status: {
    closed: 0,
    in_progress: 0,
    open: 0,
    resolved: 0,
  },
  total: 0,
  urgent: 0,
}

function getIndicatorCards(summary: DashboardSummary) {
  return [
    {
      ariaLabel: 'Total de chamados',
      label: 'Total',
      value: summary.total,
    },
    {
      ariaLabel: 'Chamados abertos',
      label: 'Abertos',
      value: summary.by_status.open,
    },
    {
      ariaLabel: 'Chamados em andamento',
      label: 'Em andamento',
      value: summary.by_status.in_progress,
    },
    {
      ariaLabel: 'Chamados resolvidos',
      label: 'Resolvidos',
      value: summary.by_status.resolved,
    },
    {
      ariaLabel: 'Chamados fechados',
      label: 'Fechados',
      value: summary.by_status.closed,
    },
    {
      ariaLabel: 'Chamados urgentes',
      label: 'Urgentes',
      value: summary.urgent,
    },
  ]
}

export function DashboardPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadDashboardSummary() {
      try {
        const dashboardSummary = await fetchDashboardSummary()

        if (isActive) {
          setSummary(dashboardSummary)
          setErrorMessage('')
        }
      } catch {
        if (isActive) {
          setErrorMessage('Não foi possível carregar os indicadores.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadDashboardSummary()

    return () => {
      isActive = false
    }
  }, [])

  const indicatorCards = getIndicatorCards(summary ?? emptySummary)

  return (
    <section className="content-card">
      <p className="app-eyebrow">Indicadores</p>
      <h1 className="content-title">Dashboard</h1>
      <p className="app-description">
        Acompanhe o volume de chamados e os principais estados da operação.
      </p>

      {isLoading ? (
        <p className="dashboard-feedback" role="status">
          Carregando indicadores...
        </p>
      ) : null}

      {errorMessage ? (
        <p className="dashboard-feedback form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !errorMessage ? (
        <div className="dashboard-grid">
          {indicatorCards.map((card) => (
            <article
              aria-label={card.ariaLabel}
              className="indicator-card"
              key={card.ariaLabel}
            >
              <span className="indicator-label">{card.label}</span>
              <strong className="indicator-value">{card.value}</strong>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
