import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { TextField } from '../../shared/components/TextField'
import { registerUser } from './api'

type RegisterErrors = {
  email?: string
  name?: string
  password?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateRegisterForm(name: string, email: string, password: string) {
  const errors: RegisterErrors = {}
  const trimmedName = name.trim()
  const trimmedEmail = email.trim()

  if (!trimmedName) {
    errors.name = 'Informe seu nome.'
  } else if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.name = 'O nome deve ter entre 2 e 100 caracteres.'
  }

  if (!trimmedEmail) {
    errors.email = 'Informe seu e-mail.'
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!password) {
    errors.password = 'Informe sua senha.'
  } else if (password.length < 8) {
    errors.password = 'A senha deve ter no mínimo 8 caracteres.'
  }

  return errors
}

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validateRegisterForm(name, email, password)

    setErrors(validationErrors)
    setFormError('')
    setSuccessMessage('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({
        email: email.trim(),
        name: name.trim(),
        password,
      })
      setSuccessMessage('Cadastro realizado com sucesso.')
    } catch {
      setFormError('Não foi possível criar a conta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Nova conta</p>
        <h1 className="app-title">Criar conta</h1>
        <p className="app-description">
          Cadastre-se para começar a organizar seus chamados.
        </p>

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <TextField
            autoComplete="name"
            error={errors.name}
            id="register-name"
            label="Nome"
            onChange={setName}
            value={name}
          />
          <TextField
            autoComplete="email"
            error={errors.email}
            id="register-email"
            label="E-mail"
            onChange={setEmail}
            type="email"
            value={email}
          />
          <TextField
            autoComplete="new-password"
            error={errors.password}
            id="register-password"
            label="Senha"
            onChange={setPassword}
            type="password"
            value={password}
          />

          <button className="app-link auth-submit" type="submit">
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
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
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  )
}
