import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { TextField } from '../../shared/components/TextField'

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
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors(validateLoginForm(email, password))
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
            Entrar
          </button>
        </form>

        <p className="auth-helper">
          Ainda não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  )
}
