import { Link, NavLink, Outlet, useNavigate } from 'react-router'

import { getCurrentUser, logout } from '../features/auth/session'

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Chamados', to: '/tickets' },
  { label: 'Novo chamado', to: '/tickets/new' },
]

export function AuthenticatedLayout() {
  const currentUser = getCurrentUser()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
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
            </section>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  )
}
