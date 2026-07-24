import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router'

import { TextField } from '../../shared/components/TextField'
import { confirmPasswordReset } from './api'

type ResetPasswordErrors = {
  password?: string
}

function validateResetPasswordForm(password: string) {
  const errors: ResetPasswordErrors = {}

  if (!password) {
    errors.password = 'Informe a nova senha.'
  } else if (password.length < 8) {
    errors.password = 'A senha deve ter no mínimo 8 caracteres.'
  }

  return errors
}

export function ResetPasswordPage() {
  const { token = '', uid = '' } = useParams()
  const [errors, setErrors] = useState<ResetPasswordErrors>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validateResetPasswordForm(password)

    setErrors(validationErrors)
    setFormError('')
    setSuccessMessage('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    if (!uid || !token) {
      setFormError('Link de redefinição inválido ou expirado.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await confirmPasswordReset({
        password,
        token,
        uid,
      })

      setPassword('')
      setSuccessMessage(response.message)
    } catch {
      setFormError(
        'Não foi possível redefinir a senha. Solicite um novo link e tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Recuperação de acesso</p>
        <h1 className="app-title">Criar nova senha</h1>
        <p className="app-description">
          Defina uma nova senha para voltar a acessar sua conta.
        </p>

        {successMessage ? (
          <p className="form-success" role="status">
            {successMessage}
          </p>
        ) : (
          <form className="auth-form" noValidate onSubmit={handleSubmit}>
            <TextField
              autoComplete="new-password"
              error={errors.password}
              id="reset-password-password"
              label="Nova senha"
              onChange={setPassword}
              type="password"
              value={password}
            />

            <button className="app-link auth-submit" type="submit">
              {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}

        {formError ? (
          <p className="form-error auth-feedback" role="alert">
            {formError}
          </p>
        ) : null}

        <p className="auth-helper">
          {successMessage ? (
            <Link to="/login">Entrar</Link>
          ) : (
            <Link to="/forgot-password">Solicitar novo link</Link>
          )}
        </p>
      </section>
    </main>
  )
}
