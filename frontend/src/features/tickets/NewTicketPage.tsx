import { useState } from 'react'
import { useNavigate } from 'react-router'

import { createTicket, type TicketFormData } from './api'
import { TicketForm } from './TicketForm'

export function NewTicketPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: TicketFormData) {
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await createTicket(data)
      navigate('/tickets')
    } catch {
      setErrorMessage('Não foi possível criar o chamado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="content-card">
      <p className="app-eyebrow">Novo chamado</p>
      <h1 className="content-title">Criar chamado</h1>
      <p className="app-description">
        Preencha os dados principais para registrar um novo atendimento.
      </p>

      {errorMessage ? (
        <p className="auth-feedback form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <TicketForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Criar chamado"
      />
    </section>
  )
}
