import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { TextField } from '../../shared/components/TextField'
import { requestPasswordReset } from './api'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateForgotPasswordForm(email: string) {
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    return 'Informe seu e-mail.'
  }

  if (!isValidEmail(trimmedEmail)) {
    return 'Informe um e-mail válido.'
  }

  return undefined
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationError = validateForgotPasswordForm(email)

    setEmailError(validationError)
    setFormError('')
    setSuccessMessage('')

    if (validationError) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await requestPasswordReset({ email: email.trim() })

      setSuccessMessage(response.message)
    } catch {
      setFormError(
        'Não foi possível solicitar a redefinição agora. Tente novamente em instantes.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Recuperação de acesso</p>
        <p className="app-description">
          Informe seu e-mail para receber as instruções de redefinição de senha.
        </p>

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <TextField
            autoComplete="email"
            error={emailError}
            id="forgot-password-email"
            label="E-mail"
            onChange={setEmail}
            type="email"
            value={email}
          />

          <button className="app-link auth-submit" type="submit">
            {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
          </button>
        </form>

        {successMessage ? (
          <p className="form-success" role="status">
            {successMessage}
          </p>
        ) : null}

        {formError ? (
          <p className="form-error auth-feedback" role="alert">
            {formError}
          </p>
        ) : null}

        <p className="auth-helper">
          Lembrou a senha? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  )
}
