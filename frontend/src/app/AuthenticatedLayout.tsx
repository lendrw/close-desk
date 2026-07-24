import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'

import { requestEmailVerification } from '../features/auth/api'
import { getCurrentUser, logout } from '../features/auth/session'

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Chamados', to: '/tickets' },
  { label: 'Novo chamado', to: '/tickets/new' },
]

export function AuthenticatedLayout() {
  const currentUser = getCurrentUser()
  const navigate = useNavigate()
  const [emailVerificationMessage, setEmailVerificationMessage] = useState('')
  const [emailVerificationError, setEmailVerificationError] = useState('')
  const [isRequestingEmailVerification, setIsRequestingEmailVerification] =
    useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  async function handleRequestEmailVerification() {
    setEmailVerificationMessage('')
    setEmailVerificationError('')
    setIsRequestingEmailVerification(true)

    try {
      const response = await requestEmailVerification()
      setEmailVerificationMessage(response.message)
    } catch {
      setEmailVerificationError(
        'Não foi possível reenviar a verificação agora. Tente novamente em instantes.',
      )
    } finally {
      setIsRequestingEmailVerification(false)
    }
  }

  return (
    <div className="authenticated-layout">
      <header className="authenticated-header">
        <Link className="brand-link" to="/dashboard">
          CloseDesk
        </Link>

        <div className="authenticated-user">
          <span className="authenticated-user-label">Usuário</span>
          <strong>{currentUser?.name}</strong>
          <span
            className={
              currentUser?.is_email_verified
                ? 'email-verification-badge email-verification-badge-verified'
                : 'email-verification-badge email-verification-badge-pending'
            }
          >
            {currentUser?.is_email_verified
              ? 'E-mail verificado'
              : 'E-mail pendente'}
          </span>
        </div>

        <button
          className="app-link app-link-secondary authenticated-logout-button"
          onClick={handleLogout}
          type="button"
        >
          Sair
        </button>
      </header>

      <div className="authenticated-body">
        <nav aria-label="Navegação principal" className="authenticated-nav">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="authenticated-content">
          {currentUser?.is_email_verified ? null : (
            <section
              aria-label="Verificação de e-mail pendente"
              className="email-verification-notice"
            >
              <p>
                Confirme seu e-mail para aumentar a segurança da conta. Enviamos
                um link de verificação para {currentUser?.email}.
              </p>

              <button
                className="app-link email-verification-action"
                disabled={isRequestingEmailVerification}
                onClick={handleRequestEmailVerification}
                type="button"
              >
                {isRequestingEmailVerification
                  ? 'Reenviando...'
                  : 'Reenviar verificação'}
              </button>

              {emailVerificationMessage ? (
                <p
                  className="form-success email-verification-feedback"
                  role="status"
                >
                  {emailVerificationMessage}
                </p>
              ) : null}

              {emailVerificationError ? (
                <p
                  className="form-error email-verification-feedback"
                  role="alert"
                >
                  {emailVerificationError}
                </p>
              ) : null}
            </section>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  )
}
