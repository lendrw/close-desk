import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import { confirmEmailVerification } from './api'
import { getAccessToken, loadCurrentUser } from './session'

type VerificationStatus = 'loading' | 'success' | 'error'

export function VerifyEmailPage() {
  const { token = '', uid = '' } = useParams()
  const [message, setMessage] = useState('Confirmando seu e-mail...')
  const [status, setStatus] = useState<VerificationStatus>('loading')

  useEffect(() => {
    let ignore = false

    async function verifyEmail() {
      if (!uid || !token) {
        setMessage('Link de verificação inválido ou expirado.')
        setStatus('error')
        return
      }

      try {
        const response = await confirmEmailVerification({ token, uid })

        if (!ignore) {
          if (getAccessToken()) {
            await loadCurrentUser()
          }

          setMessage(response.message)
          setStatus('success')
        }
      } catch {
        if (!ignore) {
          setMessage(
            'Não foi possível verificar o e-mail. Solicite um novo link.',
          )
          setStatus('error')
        }
      }
    }

    verifyEmail()

    return () => {
      ignore = true
    }
  }, [token, uid])

  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Verificação de e-mail</p>
        <h1 className="app-title">Confirmar e-mail</h1>
        <p className="app-description">
          Estamos conferindo o link de confirmação enviado para sua caixa de
          entrada.
        </p>

        {status === 'loading' ? (
          <p className="auth-feedback" role="status">
            {message}
          </p>
        ) : null}

        {status === 'success' ? (
          <p className="form-success" role="status">
            {message}
          </p>
        ) : null}

        {status === 'error' ? (
          <p className="form-error auth-feedback" role="alert">
            {message}
          </p>
        ) : null}

        <p className="auth-helper">
          {status === 'success' ? (
            <Link to={getAccessToken() ? '/dashboard' : '/login'}>
              {getAccessToken() ? 'Ir para o dashboard' : 'Entrar'}
            </Link>
          ) : (
            <Link to="/dashboard">Voltar ao dashboard</Link>
          )}
        </p>
      </section>
    </main>
  )
}
