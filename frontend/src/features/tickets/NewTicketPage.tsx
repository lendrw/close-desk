import { useState } from 'react'

import { createTicket, type TicketFormData } from './api'
import { TicketForm } from './TicketForm'

export function NewTicketPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(data: TicketFormData) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await createTicket(data)
      setSuccessMessage('Chamado criado com sucesso.')
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

      {successMessage ? (
        <p className="form-success" role="status">
          {successMessage}
        </p>
      ) : null}

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
