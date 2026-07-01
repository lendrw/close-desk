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
        </div>
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

          <button className="nav-link nav-link-button" onClick={handleLogout}>
            Sair
          </button>
        </nav>

        <main className="authenticated-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
