import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { TextField } from '../../shared/components/TextField'
import { login } from './api'

type LoginErrors = {
  email?: string
  password?: string
}

function validateLoginForm(email: string, password: string) {
  const errors: LoginErrors = {}

  if (!email.trim()) {
    errors.email = 'Informe seu e-mail.'
  }

  if (!password) {
    errors.password = 'Informe sua senha.'
  }

  return errors
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validateLoginForm(email, password)

    setErrors(validationErrors)
    setFormError('')
    setSuccessMessage('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await login({
        email: email.trim(),
        password,
      })
      setSuccessMessage('Login realizado com sucesso.')
    } catch {
      setFormError('Não foi possível entrar com essas credenciais.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Autenticação</p>
        <h1 className="app-title">Entrar</h1>
        <p className="app-description">
          Acesse sua conta para gerenciar seus chamados.
        </p>

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <TextField
            autoComplete="email"
            error={errors.email}
            id="login-email"
            label="E-mail"
            onChange={setEmail}
            type="email"
            value={email}
          />
          <TextField
            autoComplete="current-password"
            error={errors.password}
            id="login-password"
            label="Senha"
            onChange={setPassword}
            type="password"
            value={password}
          />

          <button className="app-link auth-submit" type="submit">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
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
          Ainda não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  )
}
